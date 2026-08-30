# Handoff — FlyRank Learning Archive, Phases 1, 2 & 3

This document summarises the completed work, how it was verified, what is fully
complete, what is intentionally incomplete, and the exact placeholders that must
be filled by the owner.

---

## 1. Summary of work completed (by phase)

### Phase 1 — Foundation: Data Layer and Non-Graph Archive (COMPLETE)

**Task 1.1 — Toolchain and design system foundation**

- Installed dependencies and check tooling; self-hosted variable Sora/Inter fonts.
- Built the Systems Atlas token system in `src/styles/global.css` (colour, rules,
  8px spacing, clamp type scale, radii, motion tokens, reset, focus-visible,
  skip link, reduced-motion guard).
- Built `src/layouts/Base.astro` (semantic shell + full SEO/OG head), the
  `Header.astro` (§08), and the `Hero.astro` (§09).

**Task 1.2 — Typed content data layer**

- `src/data/types.ts` with the full typed model.
- `assignments.ts` (35 canonical records), `concepts.ts` (10),
  `artifacts.ts` (11 shared + 39 artifact links), `graph.ts` (34 approved public
  edges + 5 rejected), and `scripts/validate-data.mjs` (`npm run validate`) +
  `prebuild` hook.

**Task 1.3 — Non-graph archive pages**

- `/`, `/work/`, `/work/[slug]` (35 detail pages), `/track/ai-fluency`,
  `/track/machine-learning`, `/concepts/[id]` (10), stubs, `404`, `sitemap.xml`.

Census: **35 assignments / 10 concepts / 11 artifacts / 34 public edges / 5
documented rejections / 58 concept mappings / 39 artifact links**, 18 core /
15 supporting / 2 reference.

### Phase 2 — Learning Map: The Interactive Graph Layer (COMPLETE)

- `LearningMap.astro` shell + `src/components/map/` client code: deterministic
  `layout.ts`, pure `adapter.ts` (`buildGraphElements`), client `panel.ts`,
  and `map-client.ts` (Cytoscape init, state machine, URL sync, interactions).
- Progressive disclosure (`default → track → concept → assignment →
  browse-all`), five primary filters + tier + Browse All, search, keyboard
  access, mobile layout, and failure-safe `noscript`/`map-failed` fallback.
- Bundle isolation verified (Cytoscape only on the map page).
- `tests/adapter.spec.ts` (10 Node unit tests, green); `tests/map.spec.ts`
  + `playwright.config.ts` (11 browser tests, written; see §4).

### Phase 3 — Evidence, Experience, and Production (COMPLETE)

**Task 3.1 — Embeds and the evidence layer**

- `ArtifactPreview.astro`: the single renderer with the three display modes
  (`embed` / `preview` / `link`). Embeds are **lazy-loaded** (no iframe in the
  initial HTML) and wrapped in a first-class fallback
  (`[artifact preview] · This artifact opens externally. [OPEN ARTIFACT]`).
- `NotebookPreview.astro`: contained ML notebook viewport (title bar, heading,
  charts / metric table / code region, OPEN NOTEBOOK + GITHUB) — **not** an
  iframe, per DESIGN_SPEC §22.
- `src/data/notebooks.ts`: 8 ML notebook preview records (filenames from
  CONTENT_REGISTRY §3.2).
- Map panel parity via `src/components/map/panel.ts` (`renderArtifactPanel`) and
  panel styles in `LearningMap.astro`.

**Task 3.2 — Framework, "What I Wish I Knew", Reflection, Final Package**

- `/framework`: earned synthesis of the seven candidate steps, each linked to
  the assignments that justify it (`src/data/framework.ts`).
- `/framework/wish-i-knew`: 6 numbered, traceable statements
  (`src/data/wish-i-knew.ts`).
- `/reflection`: long-form editorial page rendering the 500–800 word
  retrospective (`src/data/reflection.ts`), with the FL-10 convergence treatment.
- `FinalPackage.astro` (master index + completion links) on `/reflection/` and
  the FL-10 `/work/fl-10-final-package/` page.

**Task 3.3 — Responsive / accessibility pass**

- `--gold-bright` token for contrast safety; `.measure-wide`; full map-panel
  styling; header active-state fix for nested `/framework/wish-i-knew`.

**Task 3.4 — Performance / SEO hardening**

- `public/og.png` default social-preview image; `og:image`/`twitter:image` +
  width/height + `robots` meta in `Base.astro`; `robots.txt.ts`; extended
  sitemap. Fonts remain self-hosted variable with `font-display: swap`.

**Task 3.5 — Deployment, polish, tests**

- `netlify.toml`; `lighthouse.config.mjs`; `@axe-core/playwright` + `lighthouse`
  dev deps; Phase 3 validator checks (framework/wish-i-knew referential
  integrity, retrospective 500–800 words, banned-pattern scan); `tests/phase3.spec.ts`
  (7 tests) and `tests/axe.spec.ts` (5 tests).

---

## 2. How correctness was verified

**Automated (green in this sandbox)**

- `npm run validate` — green, prints the census and asserts every data rule
  (Phase 1 + Phase 3 checks).
- `npx astro check` — 0 errors / 0 warnings / 0 hints (44 files).
- `npm run build` — 53 pages (35 assignment detail pages in `dist/work`).
- Bundle check — `cytoscape` absent from `/work`, `/track`, `/framework`,
  `/reflection` output; present only on the map page.
- Copy scans — em/en dash grep over `dist` clean; banned-word scan over
  `src/data` clean.
- No `iframe` in the initial HTML of any page (lazy embeds create iframes on
  demand only).
- Embed fallback renders (`This artifact opens externally` + `OPEN ARTIFACT`)
  on the ML paper page.
- Smoke test — all 55 valid routes return HTTP 200 via `npm run preview`.
- `npm run test:adapter` — 10/10 green (Node, no browser).

**Browser interaction suites (deliverable, not runnable in this sandbox)**

- `tests/map.spec.ts` (11), `tests/phase3.spec.ts` (7), `tests/axe.spec.ts` (5):
  23 browser tests + 10 adapter = 33 tests collected
  (`npx playwright test --list` shows all 33).
- **Not run here:** the Playwright chromium CDN is unreachable (`ECONNRESET`),
  and the sandbox lacks the native libs a downloaded chromium needs. Run
  `npm run test:install && npm run test` on a machine with egress access.

**Manual QA performed**

- Reviewed rendered output of `/framework`, `/framework/wish-i-knew`,
  `/reflection`, `/work/fl-10-final-package/`, and the ml-11 embed fallback.
- Confirmed OG meta + sitemap + robots output; header active state on sub-pages.

---

## 3. What is fully complete

- The complete validated content model (single source of truth).
- The full non-graph route (All Work → track → assignment → three beats →
  artifact), browsable with JavaScript disabled.
- The interactive Learning Map: deterministic calm default, progressive
  disclosure, track/concept/assignment/browse-all views, URL state, filters,
  search, keyboard access, mobile layout, and failure-safe fallback.
- The full evidence layer: three display modes, lazy embeds, first-class
  fallbacks, and the contained notebook viewport.
- Framework, "What I Wish I Knew", Reflection (long-form retrospective), and the
  Final Package section — all live and internally consistent.
- Design-system foundation, homepage §03 composition, SEO/OG metadata, sitemap,
  robots, 404.
- `netlify.toml`, Lighthouse config, Phase 3 validator checks, and the
  Phase 3 Playwright/axe test files.
- Adapter unit tests (Node) — green.

---

## 4. Intentionally incomplete / requires real inputs

- **Browser suites not executed here** (egress + missing native libs). Code is
  complete; run `npm run test:install && npm run test` where a Playwright
  browser can be installed.
- **Real artifact URLs, screenshots, demo video, and the ML notebook evidence**
  (charts/metrics/code): content dependencies. Until supplied, every artifact
  renders the honest `partial` state and notebooks show an "evidence attaches
  here" region (flip `url`/`embedUrl` in `artifacts.ts` and set `hasEvidence`,
  `charts`, `metrics`, `code` in `notebooks.ts` to activate real embeds).
- **The 500–800 word retrospective** is currently a 566-word *editable draft* in
  `src/data/reflection.ts` (flagged `PLACEHOLDER / EDITABLE DRAFT`). Replace with
  the author's own wording (must stay 500–800 words).
- **`site.url`** is a placeholder
  (`https://flyrank-learning-archive.example.com`) affecting canonical, sitemap,
  OG absolute URLs, and the Final Package "live site" link.
- **Netlify target** not yet confirmed; `netlify.toml` is written but the exact
  site/CI location must be confirmed before Task 3.5 deploys.
- **Lighthouse gate** (`npm run lighthouse`) requires a Chromium binary + running
  preview server; not run in this sandbox.
- **OG image** is a generated default (`public/og.png`); the owner may replace it
  with a branded card.
- `ArtifactCard.astro` is retained but unused (superseded by `ArtifactPreview`).

---

## 5. Placeholders to fill (owner)

1. **`src/config.ts` → `site.url`** —
   `https://flyrank-learning-archive.example.com` is a placeholder. Replace with
   the real production origin (affects canonicals, sitemap, OG absolute URLs,
   and the Final Package live-site link).
2. **Artifact URLs** — every `Artifact.url`/`embedUrl` is `undefined`. Supply
   real URLs and flip the matching `evidenceStatus` from `partial` to
   `available` (or `private`/`missing`/`not-applicable`).
3. **ML notebook evidence** — in `src/data/notebooks.ts`, set `hasEvidence: true`
   and populate `charts` (exported static images), `metrics` (result table), and
   `code` (a short excerpt) once supplied.
4. **Assignment evidence status** — currently `partial` for all 35; flip as real
   URLs/files attach.
5. **Final retrospective (500–800 words)** — replace the draft in
   `src/data/reflection.ts` with the author's wording.
6. **`public/og.png`** — optional replacement with a branded social card.
7. **Netlify site/CI target** — confirm before Phase 3 Task 3.5 deploys.
8. **Playwright browser install** — `npm run test:install` (chromium) on a
   machine with egress access, then `npm run test`.

All placeholders are also flagged inline in code with `PLACEHOLDER` comments.

---

## Key interpretation notes for the owner

- The plan states "20 coded assignments" and "57 concept mappings"; the locked
  registry actually yields **19 coded assignments** and **58 concept mappings**
  (the registry was treated as authoritative).
- `strand` includes a fourth value `"convergence"` for FL-10.
- A derived `--green-bright` token is used for green text/outlines; `--gold-bright`
  was added in Phase 3 for small gold text contrast.
- The map detail panel is a **client-side functional equivalent** of the server
  `DetailPanel` (the map is a client island and must update without a reload).
- Default graph view = 10 concepts + 18 core anchors + ML-01 + 18 approved
  high-confidence edges, no reference nodes.
- The retrospective word count is validated against the **retrospective body
  only** (intro + four sections + three learnings = 566 words); the rendered page
  naturally carries additional UI text.
- Phase 3 ships with the honest `partial` evidence state everywhere, exactly as
  the plan requires when real artifacts/URLs are not yet supplied.
