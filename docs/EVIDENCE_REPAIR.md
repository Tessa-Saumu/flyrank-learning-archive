# Evidence rendering repair

## Scope

This repair keeps the archive's visual design, canonical assignments, notebook metrics, graph layout/edges, and existing routes. Certifications remains a separate planned addition. Deployment is left to the owner.

## Changes

- `prepare:evidence` generates same-origin assets from the existing `assignment-artifacts/` originals before `npm run dev` and `npm run build`. Each copy is SHA-256 checked. Generated copies are ignored; edit the originals, never the generated directory.
- PDF/video embed paths and the image preview now use `/evidence/assignments/`. GitHub source URLs remain in the artifact registry. Browser-facing open/download actions use the original file bytes served by the site.
- Evidence capability determines whether a reveal control is appropriate. Link-only records have useful links, missing evidence stays honest, images remain previews, and ML notebook evidence renders once without a redundant generic card.
- Runtime-created iframe/video elements match narrowly contained CSS rules and fill the evidence column at a bounded height.
- Open/download fallbacks remain visible. Viewer activation handles loading, errors, retry, and repeated activation. PDF delivery is checked with HEAD before opening the browser viewer. Closing or changing a popup cancels pending checks and releases media.
- A whole-site regression run exposed a pre-existing production omission: the browse filter script was not emitted, so home filters navigated away and search/Concepts did not work. The shared layout controller now explicitly initializes the existing filter module. Client view transitions also clear the static `hidden` class. No filter styling or categories were changed.
- One existing graph assertion now accepts the uppercase text produced by the existing CSS; the UI was unchanged.

## Local verification

Use Node compatible with the locked dependencies, then:

```sh
npm ci
npm run check
npm run build
npm run test:install
npm test
```

The test suite serves the built site with Astro preview. `tests/evidence.spec.ts` covers asset hashes/MIME types and video range responses; direct/popup PDF reveal and dimensions at desktop/phone widths; downloads; notebook/image/link/missing states; failed requests and retry; video playback/cleanup; no-JavaScript evidence links; every generated HTML route and internal link; and browser page errors.

Existing suites cover the graph adapter/layout, selection/search/filtering, keyboard focus, mobile map behavior, popup navigation/scroll preservation, work filtering, no-JavaScript browsing, reduced motion, and axe accessibility checks.

Visual QA uses Chrome's actual PDF load success and rendered document pages, plus actual demo-video playback. Baseline/repaired home and work screenshots were compared at 1280 px and 390 px. The source census remains 35 assignments, 33 artifact records, 43 artifact links, and 34 public edges.

## Browser and release limits

Native PDF support varies by browser. The permanent open/download links are required, even when a desktop embed works. Cross-origin live-site iframe load events cannot prove readable contents, so those viewers always retain an external fallback. Browser-specific test runner limitations and final test counts are recorded in the accompanying verification report.

Nothing was deployed. When deploying, publish the generated `dist/` from `npm run build` and check the actual host's `application/pdf`, `video/mp4`, and byte-range responses. No broad Netlify security-header changes or dependency upgrades are part of this repair.
