# FlyRank Learning Archive

A static, visual archive of work across the FlyRank **AI Fluency** and
**Machine Learning** tracks: what each assignment asked for, what it taught, and
how the pieces connect. Built with Astro 7 + TypeScript + CSS + Cytoscape.js.
No backend, no additional UI framework. Visual direction is **Systems Atlas**
(locked in `docs/DESIGN_SPEC.md`).

It is also the FL-10 completion package: the `/framework`, `/reflection`, and
final-package sections make the synthesis explicit and link downward to the
assignments that justify it.

## Commands

All commands run from the repository root.

| Command                       | Action                                                      |
| :---------------------------- | :---------------------------------------------------------- |
| `npm install`                 | Install dependencies                                         |
| `npm run validate`            | Validate data (census, referential integrity, copy, Phase 3) |
| `npm run check` / `npx astro check` | Type-check the Astro app                               |
| `npm run build`               | Build the production site to `./dist/`                      |
| `npm run preview`             | Preview the build locally before deploying                  |
| `npm run dev`                 | Start the local dev server at `localhost:4321`               |
| `npm run test:install`        | Install the Playwright chromium browser                      |
| `npm run test:adapter`        | Run the Node data-adapter unit tests                        |
| `npm run test`                | Run the full Playwright suite (map + phase 3 + axe)          |
| `npm run lighthouse`          | Run Lighthouse against a running preview server              |

## Project structure

```text
src/
├── components/     # Cards, panels, map shell, artifact/notebook previews
│   └── map/        # Cytoscape client module (map only; lazy/isolated)
├── data/           # Typed source of truth: assignments, concepts, artifacts,
│                   # graph, framework, wish-i-knew, reflection, notebooks
├── layouts/        # Base shell (SEO/OG head, header, footer)
├── lib/            # Read-only lookup helpers
├── pages/          # Static routes: /, /work/*, /track/*, /concepts/*,
│                   # /framework*, /reflection, sitemap, robots, 404
├── styles/         # global.css (Systems Atlas design tokens)
```

## Data, copy, and evidence rules

- `docs/CONTENT_REGISTRY.md` is the data authority. Use its canonical IDs and
  copy **exactly**; do not invent IDs, task/lesson/takeaway, or graph edges.
- `scripts/validate-data.mjs` (`npm run validate`) fails the build on any
  violation and is wired into `prebuild`.
- Until real artifact URLs/screenshots are supplied, every artifact renders the
  honest `partial` evidence state. Embeds are lazy-loaded and always have a
  first-class fallback (never an empty iframe).

## Handoff

See `docs/HANDOFF.md` for the full completion summary, how each phase was
verified, what is intentionally incomplete, and the exact placeholders the owner
must fill.
