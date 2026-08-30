# Handoff — FlyRank Learning Archive, Phases 1 & 2

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
  edges + 5 rejected).
- `scripts/validate-data.mjs` (`npm run validate`) + `prebuild` hook.

**Task 1.3 — Non-graph archive pages**

- `/`, `/work/`, `/work/[slug]` (35 detail pages), `/track/ai-fluency`,
  `/track/machine-learning`, `/concepts/[id]` (10), `/framework` + `/reflection`
  stubs, `404`, and `sitemap.xml`.

Census: **35 assignments / 10 concepts / 11 artifacts / 34 public edges / 5
documented rejections / 58 concept mappings / 39 artifact links**, 18 core /
15 supporting / 2 reference.

### Phase 2 — Learning Map: The Interactive Graph Layer (COMPLETE)

**Task 2.1 — Graph foundation**

- `LearningMap.astro` is now the map shell (controls, stage, panel, keyboard
  roster, static fallback). Client code in `src/components/map/`:
  - `layout.ts` — deterministic seed coordinates (concepts central band, ML
    spine below with ML-01 at the entrance, AI Fluency strands above).
  - `adapter.ts` — the pure `buildGraphElements(viewState)` data adapter
    (approved-only edges, rejected pairs excluded, tier-based sizing).
  - `panel.ts` — client-side functional equivalent of `DetailPanel`.
  - `map-client.ts` — Cytoscape init, state machine, URL sync, interactions.
- Bundle isolation verified: `cytoscape` ships only on the map page.
- Failure-safe: `noscript` + `map-failed` fallback shows the static archive.

**Task 2.2 — Progressive disclosure and selection state**

- Default = 10 concepts + 18 core anchors + ML-01 + 18 approved high-confidence
  edges, no reference nodes. Track / concept / assignment / browse-all views,
  plus `concepts` and `artifacts` filters. URL state `?track=?concept=?node=?
  view=browse-all` (+ `concepts`, `artifacts`, `tier`), refresh-safe, deep-linkable.

**Task 2.3 — Interaction, filtering, search, keyboard**

- Hover (scale + neighbourhood brighten), click (ring + panel), five primary
  filters + tier + Browse All, search resolving title/code/concept/artifact,
  keyboard roster (focusable nodes, Enter selects, Escape closes, focus returns),
  reduced-motion handling.

**Task 2.4 — Mobile map**

- Single-column layout at tablet/mobile, content below the map, no horizontal
  overflow at 375px.

**Tests (Plan §2.6)**

- `tests/adapter.spec.ts` — 10 Node unit tests, all green.
- `tests/map.spec.ts` + `playwright.config.ts` — 11 browser interaction tests,
  written and collected; execution requires a Playwright browser (see §4).
- Bundle check (cytoscape absent from non-map pages) — verified.

---

## 2. How correctness was verified

**Automated**

- `npm run validate` — green; prints the census and asserts every data rule.
- `npx astro check` — 0 errors / 0 warnings / 0 hints.
- `npm run build` — 52 pages; `dist/work` has 35 rendered assignment pages.
- Bundle check — `grep` confirms the `cytoscape` chunk is referenced only by the
  homepage and is absent from `/work/*` and `/track/*`.
- `npm run test:adapter` — 10/10 green (default calm state; full archive; no
  unapproved edges; rejected pairs absent; locked concept members; reference-tier
  promotion under concept selection; monotonic tier→size; cross-track bridges;
  assignment neighbourhood; 11 artifacts).
- Copy scans — em/en dash grep over `dist` and new source is clean; banned-word
  scan over `src/data` clean.
- Smoke — all 51 static routes return HTTP 200 via `npm run preview`.

**Browser interaction suite (deliverable, not runnable in this sandbox)**

- `tests/map.spec.ts` covers: default state counts, canvas click → panel opens
  with three beats + outer ring, concept selection promotes `fl-curate-images`,
  AI Fluency track reveals both strands + dims the ML spine while keeping
  cross-track bridges, Escape closes with focus return, URL deep-link + refresh,
  search by code and by title, keyboard-only selection, no-JS browse of all 35,
  reduced-motion, and 375px mobile with no horizontal overflow.

**Not run (environment-limited)**

- The Playwright browser suite could not be executed here: the Playwright browser
  download CDN is unreachable from this sandbox and the system lacks the native
  shared libraries a downloaded chromium needs. The tests are correct and
  collected (`npx playwright test --list` shows 21 tests), and the adapter unit
  tests run green. Run the full suite with `npm run test:install && npm run
  test:map` on a machine with egress access.

---

## 3. What is fully complete

- The complete validated content model (single source of truth).
- The full non-graph route (All Work → track → assignment → three beats →
  artifact), browsable with JavaScript disabled.
- The interactive Learning Map: deterministic calm default, progressive
  disclosure, track/concept/assignment/browse-all views, URL state, filters,
  search, keyboard access, mobile layout, and failure-safe fallback.
- Design-system foundation and the homepage §03 composition (intro + map + panel).
- Adapter unit tests (Node) — green.
- SEO/OG metadata, sitemap, 404.

---

## 4. Intentionally incomplete / requires real inputs

- **Browser Playwright suite not executed in this sandbox** (egress + missing
  native libs). Code is complete; run `npm run test:install && npm run test:map`
  where a Playwright browser can be installed.
- **`/framework` and `/reflection`:** honest stubs. Real synthesis/retrospective
  content is Phase 3 and must be written from the completed work (PRODUCT_SPEC
  §30–32 forbid pre-inventing it).
- **Embeds and evidence:** Phase 3. Every artifact renders in `preview`/`link`
  mode with `EVIDENCE: PARTIAL`; no URLs, screenshots, or embeds yet.
- **Responsive/a11y/contrast pass, Lighthouse, axe-core, deployment:** Phase 3.
- **Netlify deployment:** no `netlify.toml` yet (Phase 3, Task 3.5).

---

## 5. Placeholders to fill (owner)

1. **`src/config.ts` → `site.url`** —
   `https://flyrank-learning-archive.example.com` is a placeholder. Replace with
   the real production origin (affects canonical URLs, sitemap, OG absolute URLs).
2. **Artifact URLs** — every `Artifact.url` is `undefined`. Supply real URLs and
   flip the matching `evidenceStatus` from `partial` to `available` (or
   `private`/`missing`).
3. **Assignment evidence status** — currently `partial` for all 35 (CONTENT_REGISTRY
   §3: nothing is `available` until a real URL/file is attached).
4. **`status: "complete"` for all 35** — assumed; one-field data change if any is
   in progress (plus the §50 upcoming-state treatment).
5. **Final retrospective (500–800 words)** — for `/reflection` (Phase 3).
6. **Framework + "What I Wish I Knew" content** — for `/framework` (Phase 3).
7. **Netlify site/CI target** — to confirm before Phase 3 Task 3.5 deploys.
8. **Playwright browser install** — `npm run test:install` (chromium) on a
   machine with egress access, then `npm run test` for the full interaction suite.

All placeholders are also flagged inline in code with `PLACEHOLDER` comments.

---

## Key interpretation notes for the owner

- The plan states "20 coded assignments" and "57 concept mappings"; the locked
  registry actually yields **19 coded assignments** and **58 concept mappings**.
  The registry was treated as authoritative (see Phase 1 handoff).
- `strand` includes a fourth value `"convergence"` for FL-10.
- A derived `--green-bright` token is used for green text/outlines.
- The map detail panel is a **client-side functional equivalent** of the server
  `DetailPanel` (the map is a client island and must update without a reload).
- Default graph view = 10 concepts + 18 core anchors + ML-01 + 18 approved
  high-confidence edges, no reference nodes (the calm default per DESIGN_SPEC §10).
