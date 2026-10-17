# Build-time components

`src/build.py` expands components while it builds `app/index.html`. Each component is a module
`src/components/**/<name>.py` with a `render(**args) -> str` function. Names are unique across
folders. Components run at build time only; the output is static markup with `{{hole}}` bindings.

## Calling a component

From `src/manifest.json`, as a template entry. The expanded `items` arrive as the `body` argument:

```json
{"component": "accordion", "args": {"key": "shape", "title": "Shape"}, "items": ["template/editor/stone-panel/shape.html"]}
```

From a template fragment, as an inline directive. The arguments are one line of JSON:

```html
<!--@choice-chips {"list": "edgeChips", "item": "zeed", "size": "large", "count": 2}-->
```

The build scans component output for directives, so a component can call another one by
returning a directive. `markup.directive(name, **args)` writes one.

## Argument convention

- Bindings take a bare hole path, and the component adds the braces: `"value": "baseHtLabel"`
  renders as `{{baseHtLabel}}`. Bindings are lists, handlers, state values and per-state styles
  such as `display`, `border` or `color`.
- Text arguments take literal text, which may contain holes: `label`, `title`, `note`,
  `placeholder`, `text`, `aria`, `glyph`, `icon` (an SVG path) and `lead` (markup).
- `item` is the `<sc-for>` alias. It must be unique across the whole template.
- `count` sets `hint-placeholder-count` on the loop. Leave it out to omit the attribute.
- `size` is `"compact"` (editor panels) or `"large"` (guided and intake screens). It is required
  wherever it appears.
- Click handlers are named `action`. Change handlers are named `on_change`.

## Layout

| Folder | Holds |
| --- | --- |
| `ui/` | Generic controls: accordion, chips, tiles, cards, steppers, headings, buttons, messages. |
| `editor/` | Editor-only markup. |
| `refine/` | Guided-refine compositions. |
| `intake/` | Intake form fields and the scene helpers shared by the intake and building screens. |
| `lib/` | Shared Python helpers. The build puts this folder on `sys.path`, so components import from it by plain name (`from markup import hole`). |

## Components

| Name | Arguments | Purpose |
| --- | --- | --- |
| `accordion` | `key`, `title`, `body`, `variant="panel"\|"inset"` | Collapsible editor section bound to `ac.<key>`. `inset` drops the side padding and puts the divider on top. |
| `auto-fit-button` | `action`, `icon`, `label` | Accent outline button with a leading icon. |
| `choice-chips` | `list`, `item`, `size`, `columns`, `count`, `radius` | Pressable text chips; a grid with `columns`, otherwise a wrapping row. `radius` overrides the size's corner radius. |
| `header-button` | `show`, `action`, `label`, `disabled`, `opacity` | Header toolbar button inside an `sc-if`. |
| `heading` | `text`, `size`, `margin="0"` | Uppercase section heading: `h2` when compact, `h3` when large. |
| `icon-chips` | `label`, `list`, `item`, `count` | Round animated icon chips in a labelled group. |
| `layout-cards` | `list`, `item`, `size`, `count` | Two-column layout previews. Compact cards show the description as a tooltip; large cards show it as text. |
| `shape-tiles` | `list`, `item`, `size`, `count` | Three-column stone shape tiles. |
| `size-message` | `size` | Live message bound to `sizeMsg` and `sizeMsgDisp`. |
| `slider` | `label`, `readout`, `value`, `on_change`, `min`, `max`, `step`, `aria_label` | Labelled range input with a readout. |
| `step-button` | `action`, `label`, `glyph`, `size` | Square stepper button. |
| `stepper` | `label`, `value`, `minus`, `minus_label`, `plus`, `plus_label`, `size`, `aria`, `display` | Labelled value with minus and plus step buttons. `aria` defaults to `label`; `display` defaults to `flex`. |
| `swatch-cards` | `list`, `item`, `size`, `count`, `swatch_height`, `title` | Three-column finish swatches. `title` names the item field to use as a tooltip. |
| `symbol-tiles` | `list`, `item`, `count` | Five-column symbol picker with a "None" tile. |
| `text-link` | `action`, `display`, `label`, `font_size`, `align_start` | Underlined accent text button. |
| `photo-filters` | `id`, `frequency`, `levels`, `sketch_blur`, `relief_blur`, `relief_scale`, `color`, `light` | SVG filter set for the photo looks (black and white, etched, sketched, relief). |
| `stone-size` | none | Guided stone-size block: heading, best-size button, message and width and height steppers. |
| `check-card` | `checked`, `on_change`, `title`, `note`, `display` | Large checkbox card. |
| `date-field` | `label`, `action`, `value`, `invalid`, `border`, `color` | Button that opens the date picker and shows the chosen date. |
| `feel-chips` | `list`, `item` | Pill chips with a leading icon for the style question. |
| `month-year-grid` | `show`, `list`, `item`, `font_size` | Month or year grid in the date picker. |
| `name-field` | `value`, `on_change`, `invalid`, `border`, `font_size`, `required` | "Full name" text input. |
| `pref-group` | `key`, `title`, `list`, `item`, `lead`, `first` | Collapsible preference group bound to `pg.<key>`, with a count badge and check-mark chips. `lead` is markup placed before each chip label. |
| `story-field` | `label`, `value`, `on_change`, `placeholder` | Large textarea. |
| `milky-way-glows` | `count` | Ellipse glows bound to `scn.mwG.<n>`. |
| `mote` | `left`, `bottom`, `size`, `duration`, `delay` | One floating gold mote. |
| `shimmer-layer` | `d`, `duration`, `delay` | Full-scene shimmer path. |
| `swaying-plants` | `list`, `item` | Animated plant silhouettes. |

The first 15 rows live in `ui/`, `photo-filters` in `editor/`, `stone-size` in `refine/`, and
the rest in `intake/`.

## Helpers in `lib/markup.py`

`hole`, `field`, `lines`, `directive`, `grid_style`, `loop_open`, `repeat` (a container around an
`sc-for` loop), `heading_style` (shared by `heading` and `accordion`) and `chevron` (shared by
`accordion` and `pref-group`).

## Checking a change

Run `python src/build.py --check`. It must print `OK`. Plain `python src/build.py` overwrites
`app/index.html`.
