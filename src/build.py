"""Builds app/index.html from the fragments listed in src/manifest.json.

Usage: python3 src/build.py [--check | --emit-script]
  --check        Build in memory and compare with the committed app/index.html. Exit 1 on a difference.
  --emit-script  Print the joined app script to stdout. The tests load the app logic this way.
"""
import importlib.util
import json
import re
import sys
from pathlib import Path

SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC / "components" / "lib"))


def read(path):
    with open(path, encoding="utf-8", newline="") as handle:
        return handle.read()


_components = {}


def component(name):
    """Loads src/components/**/<name>.py. Each module exposes render(**args) and returns markup.
    The markup may contain directives for other components. Shared helper modules live in
    src/components/lib/ and import by plain name."""
    if name not in _components:
        found = list((SRC / "components").glob("**/%s.py" % name))
        if len(found) != 1:
            raise SystemExit("component %r: expected one file, found %d" % (name, len(found)))
        spec = importlib.util.spec_from_file_location("component_" + name.replace("-", "_"), found[0])
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        _components[name] = lambda **args: directives(module.render(**args))
    return _components[name]


DIRECTIVE = re.compile(r"<!--@([a-z0-9-]+)(?: (\{.*?\}))?-->")


def directives(text):
    """Replaces <!--@name {"arg": "value"}--> with the output of component `name`."""
    return DIRECTIVE.sub(lambda m: component(m.group(1))(**json.loads(m.group(2) or "{}")), text)


def fragment(rel):
    path = SRC / rel
    if path.suffix == ".py":
        spec = importlib.util.spec_from_file_location(path.stem, path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return module.render()
    return directives(read(path))


def expand(entries):
    """A manifest entry is one of:
    - a fragment path (relative to src/);
    - {"open": text, "items": [...], "close": text}, which wraps nested entries in literal text;
    - {"component": name, "args": {...}, "items": [...]}, which renders a component and passes the
      expanded items as its `body` argument.
    """
    out = []
    for entry in entries:
        if isinstance(entry, str):
            out.append(fragment(entry))
        elif "component" in entry:
            args = dict(entry.get("args", {}))
            if "items" in entry:
                args["body"] = expand(entry["items"])
            out.append(component(entry["component"])(**args))
        else:
            out.append(directives(entry.get("open", "")) + expand(entry["items"]) + directives(entry.get("close", "")))
    return "".join(out)


def build(manifest):
    template = expand(manifest["template"])
    script = expand(manifest["script"])
    props = json.dumps(manifest["props"], separators=(",", ":"), ensure_ascii=False)
    return (template
            + "<script type=\"text/x-dc\" data-dc-script data-props='" + props + "'>\n"
            + script + "</script>\n</body>\n</html>\n")


def main():
    manifest = json.loads((SRC / "manifest.json").read_text(encoding="utf-8"))
    if "--emit-script" in sys.argv:
        sys.stdout.reconfigure(encoding="utf-8", newline="\n")
        sys.stdout.write(expand(manifest["script"]))
        return
    out = build(manifest)
    target = (SRC / manifest["output"]).resolve()
    if "--check" in sys.argv:
        current = read(target) if target.exists() else ""
        if current != out:
            print("DIFF: %s does not match the build output" % target)
            sys.exit(1)
        print("OK: %s matches the build output" % target)
        return
    target.write_text(out, encoding="utf-8", newline="\n")
    print("Built %s (%d bytes)" % (target, len(out.encode("utf-8"))))


if __name__ == "__main__":
    main()
