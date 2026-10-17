> Historical note from the prototype export. The `source/` pipeline described below was replaced by `src/`.
> For the current layout, build and test steps, see [AGENTS.md](../AGENTS.md).

# Headstone Design Lab: handoff for Claude Code

This folder is the KALON Headstone Design Lab prototype, exported from the Claude Design artifact
(Version 128) so it can live in a normal repo and run locally in Docker.

## The task

1. Bring this folder into the existing repo. Put it wherever the repo keeps apps or frontends
   (for example `apps/headstone-design-lab/`), following the repo's own conventions.
2. Run it locally in a Docker container. A starting point is in `docker/`. Adapt it to
   the repo: match an existing compose file, port scheme, base images or Makefile if there is one.
3. Confirm it works: the container starts, `http://localhost:8080` loads, "Demo: fill in a sample"
   then "Create their designs" shows three stone designs, and the browser makes no requests to outside sites.
4. Add short run instructions to the repo's README (or this app's own README).

Don't rewrite or "modernize" the app as part of this. It is a working prototype; the goal is to
host it, not to refactor it.

## What's in here

```
app/                  The runnable site. Static files only.
  index.html          The whole app (template + logic), built from source/
  support.js          Runtime: React 18 plus the design-canvas renderer. Minified; don't edit.
  fonts/              Self-hosted web fonts (SIL OFL, from @fontsource) + fonts.css
source/               The parts the app is built from, plus the build and check scripts
  build.sh            Rebuilds app/index.html (python3 only)
  harness.js          Layout check across stone types, layouts and shapes (node)
  gtest2.js           Checks the three generated demo tiers (node)
docker/
  Dockerfile          nginx:alpine serving app/
  nginx.conf          gzip, caching, SPA fallback
  docker-compose.yml  Maps port 8080 to 80
.dockerignore
```

## Running it

Docker, from this folder (the one containing `app/` and `docker/`):

```sh
docker compose -f docker/docker-compose.yml up --build
# then open http://localhost:8080
```

Without Docker, any static server works:

```sh
cd app && python3 -m http.server 8080
```

It's fully offline: fonts are self-hosted and React is bundled inside `support.js`. Opening
`index.html` straight from disk (`file://`) is not supported; serve it over HTTP.

## How the app works

- `index.html` holds an `<x-dc>` element with an HTML template, plus one
  `<script type="text/x-dc">` that defines a component class: `state`, methods, and `renderVals()`,
  which returns the values the template reads.
- `support.js` boots React, compiles the template and re-renders on `setState`.
- Template rules (the renderer is strict):
  - `{{hole}}` holes are plain dotted lookups only (`{{l.x}}`, never expressions).
  - `<sc-for list="{{items}}" as="x">` loops need a unique alias across the template.
  - `<sc-if value="{{flag}}">` handles conditionals.
  - Don't put whitespace inside text divs that use `white-space: pre`.
- The flow: intake wizard, then 3 generated designs, then focus, then a guided refine (7 steps),
  then the full editor, then a painted final scene.

## Rebuilding after a change

Edit the files in `source/`, then:

```sh
sh source/build.sh            # writes app/index.html
cd source && node harness.js  # last line should read: TOTAL red 124 yellow 365 edge 179
node gtest2.js                # every line should say red 0
```

The harness's red count is a known baseline: small stones with every element forced on. A change
that raises it is a regression. "MISSING" lines in the harness output for intake or building
views are expected, because those views don't compute editor values.

Which file holds what:
- **`partA.html`**: page head and CSS, the intake wizard, the design cards, the focus bar.
- **`partD.html`**: the guided refine steps (type, shape, granite, typeface, symbols & photo,
  layout, finish).
- **`editor_cur.html` + `vase_editor.html`**: the full-editor panel. `gen_editor.py` combines them
  into `editor_new.html`.
- **`v6-backup.dc.html`**: the base template the stone renderer comes from. `assemble_fin.py`
  patches it (photo filters, vases, drop zones, selection outlines).
- **`partJS.js`**: data and layout logic: types, shapes, materials, vases, `hsLayout`,
  `hsGenerate` for the three tiers.
- **`partJS2.js`**: the component: state, actions, drag and swap, `renderVals()`.
- **`paint.js`**: the painted final scenes (meadow, mountain, garden, churchyard).

`build.sh` swaps the Google Fonts link for `./fonts/fonts.css` so the built page stays offline.

## Known limits

- It's a front-end prototype only. There's no backend, persistence or accounts; uploaded photos
  stay in browser memory.
- The minimum layout size is 1320×820, scaled down to fit smaller windows.
