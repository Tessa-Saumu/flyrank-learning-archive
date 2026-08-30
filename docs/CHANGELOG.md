# Changelog

All notable implementation work on the FlyRank Learning Archive, tracked
against `docs/IMPLEMENTATION_PLAN.md`.

Entries are ordered newest-first. Each entry records what was implemented,
files changed, the phase + task reference, and any assumptions made.

---

## Phase 2 — Learning Map: The Interactive Graph Layer

### 2.1–2.4 — Learning Map (complete)

**What was implemented**

- **Graph foundation (Task 2.1).** `LearningMap.astro` is now the presentational
  shell (controls, map stage, detail panel, keyboard roster, static fallback).
  The heavy client code lives in `src/components/map/`:
  - `layout.ts` — a single deterministic seed coordinate space (concepts as a
    central band, ML spine below with ML-01 at the entrance, AI Fluency strands
    above), so every state is identical on every load.
  - `adapter.ts` — the pure, unit-tested data adapter `buildGraphElements(viewState)`
    that is the only place data meets the renderer. It enforces approved-only
    edges, keeps rejected edges out, and drives tier-based node sizing.
  - `panel.ts` — client-side renderer functionally equivalent to the Phase 1
    `DetailPanel` (code/meta/title, three beats, PROOF, Connections), because the
    map is a client island and must update without a reload.
  - `map-client.ts` — Cytoscape initialisation, state machine, URL sync,
    interactions, filters, search, keyboard, and failure-safe fallback.
- **Isolation (Task 2.1.1).** Cytoscape is bundled only on the homepage; verified
  `cytoscape` is absent from `/work/*` and `/track/*` output (bundle check). A
  `noscript` + `map-failed` fallback shows the static browseable archive when JS
  is disabled or Cytoscape fails to initialise (DESIGN_SPEC §58).
- **Progressive disclosure (Task 2.2).** View-state machine
  `default → track → concept → assignment → browse-all`, plus `concepts` and
  `artifacts` filters. Default = 10 concepts + 18 core anchors + ML-01 +
  18 approved high-confidence edges, no reference-tier nodes. Track selection
  reveals the track spine and keeps cross-track bridges visible (dimmed so the
  chosen track stays dominant). Concept selection promotes reference-tier
  members (e.g. `fl-curate-images` under Human Judgment). Assignment selection
  opens the panel beside the map with an outer selection ring. Escape returns to
  the default state preserving zoom/position.
- **URL state (Task 2.2.7).** `?track=`, `?concept=`, `?node=`, `?view=browse-all`
  (also `concepts`, `artifacts`, `tier`) sync to the address bar and reproduce on
  refresh; deep links open the panel.
- **Interactions, filters, search, keyboard (Task 2.3).** Hover (subtle scale +
  neighbourhood brighten), click (ring + panel), the five primary filters + tier
  secondary + Browse All, search that resolves title/code/concept/artifact names,
  a keyboard roster (nodes are focusable buttons, Enter selects, Escape closes,
  focus returns), and reduced-motion handling.
- **Mobile (Task 2.4).** CSS breakpoints collapse to a single column, content
  moves below the map, and the panel no longer crowds the graph. No horizontal
  overflow at 375px.
- **Homepage (§03 composition).** `index.astro` now places the intro (Hero) in a
  left column beside the Learning Map; the orientation and browse sections remain
  below as the guaranteed non-graph route. Header `MAP` and Hero `EXPLORE THE MAP`
  now target `#map`.

**Files changed**

- `src/components/LearningMap.astro` (replaced placeholder)
- `src/components/map/layout.ts`, `adapter.ts`, `panel.ts`, `map-client.ts` (new)
- `src/pages/index.astro`, `src/components/Hero.astro`, `src/components/Header.astro`
- `package.json` (scripts: `test`, `test:adapter`, `test:map`, `test:install`),
  `playwright.config.ts` (new), `.gitignore` (test output), `tsconfig.json`
  (excludes test files from `astro check`)
- `tests/adapter.spec.ts` (new, 10 tests), `tests/map.spec.ts` (new, 11 tests)

**Assumptions**

- The default view is interpreted as exactly 10 concepts + all core-tier
  assignments + ML-01 (the 18 core anchors) with only high-confidence approved
  edges (18 in total). Track/browse-all views show all 34 approved edges.
- The map detail panel is a client-side functional equivalent of the Phase 1
  server `DetailPanel` (Task 2.3.5) rather than a re-imported server component,
  because the map is a client island and cannot reload on every selection.
- "Fade unrelated nodes" is achieved by the view removing unrelated nodes from
  the graph (a calm spotlight) rather than dimming them in place; other-track
  bridges in track view are dimmed in place so the chosen track is dominant.
- Browser Playwright tests were written and collected but could **not be executed
  in this sandbox**: the Playwright browser CDN is unreachable here and the
  system lacks the native libs a downloaded chromium needs. The adapter unit
  tests run green under the Playwright node runner. Run the browser suite with
  `npm run test:install && npm run test:map`.

**Verification**

- `npm run validate` green (census: 35 / 10 / 11 / 34 / 5 / 58).
- `npx astro check` 0 errors.
- `npm run build` 52 pages; bundle check confirms `cytoscape` only on the map
  page (absent from `/work` and `/track`).
- `npm run test:adapter` — 10/10 adapter unit tests pass (default state, full
  archive, approved-only edges, rejected pairs absent, locked concept members,
  tier promotion, monotonic tier size, cross-track bridges, assignment
  neighbourhood, artifacts view).
- Smoke: all 51 static routes return HTTP 200 via `npm run preview`.

---

## Phase 1 — Foundation: Data Layer and Non-Graph Archive

### 1.3.9 — Sitemap + 404 + verification pass (complete)

**What was implemented**

- `sitemap.xml` endpoint generated at build time from the assignment, concept,
  and track pages (uses the placeholder site URL from `src/config.ts`).
- `404.astro` quiet not-found page with routes back into the archive.
- Ran the full Phase 1 verification suite:
  - `npm run validate` green (census: 35 / 10 / 11 / 34 / 5 / 58).
  - `npx astro check` 0 errors.
  - `npm run build` 52 pages, `dist/work` contains 35 rendered assignment pages.
  - Em/en-dash scan over `dist` clean; banned-word scan over `src/data` clean.
  - Smoke test: all 53 routes return HTTP 200 via `npm run preview`.
  - Verified the three copy safeguards in rendered output (FL-04 edit present;
    ML-03 and FL Ship revised wording confirmed; blocked phrases absent).

**Files changed**

- `src/pages/sitemap.xml.ts` (new)
- `src/pages/404.astro` (new)

**Assumptions**

- The sitemap and canonical URLs use `site.url`, a clearly-marked placeholder
  (`https://flyrank-learning-archive.example.com`) to be replaced by the owner.

### 1.3.1–1.3.8 — Pages, components, filters, search, SEO

**What was implemented**

- Homepage `/`: hero + three-item orientation (what this is / who it is for /
  how to use it) + the browse index (all assignments grouped by track and
  strand, with filter controls and search).
- `/work/`: full Work Index with server-rendered filtering via query params
  (`?track=`, `?tier=`, `?concept=`, `?view=concepts`), shareable URLs.
- `/work/[slug]`: 35 static detail pages via `DetailPanel` (header, three
  beats, PROOF block, Connections, secondary metadata; full OG/canonical).
- `/track/ai-fluency` and `/track/machine-learning`: strand/spine ordered lists
  per PRODUCT_SPEC §11, with ML-01 at the ML entrance and FL-10 as the
  convergence node.
- `/concepts/[id]`: 10 concept pages listing exactly the locked mappings,
  grouped by track, with a concept-mediation note.
- `/framework` and `/reflection`: honest stubs (real content in Phase 3).
- Components filled: `AssignmentCard` (tier-weighted), `ArtifactCard`
  (preview/link), `ConceptCard` (atlas label), `FilterBar`, `DetailPanel`,
  `BrowseWork` (grid + client-side search), `LearningMap` (Phase 2 placeholder).
- Client-side search over title/code/concept/artifact, server-rendered full
  list so it degrades to the static list with JS off.

**Files changed**

- `src/pages/index.astro`, `src/pages/work/index.astro`,
  `src/pages/work/[slug].astro`, `src/pages/track/ai-fluency.astro`,
  `src/pages/track/machine-learning.astro`, `src/pages/concepts/[id].astro`,
  `src/pages/framework.astro`, `src/pages/reflection.astro`
- `src/components/AssignmentCard.astro`, `ArtifactCard.astro`,
  `ConceptCard.astro`, `FilterBar.astro`, `DetailPanel.astro`,
  `BrowseWork.astro`, `LearningMap.astro`
- `src/lib/archive.ts` (lookup helpers + canonical §11 strand orderings)

**Assumptions**

- The homepage filter controls link to the equivalent filtered `/work` view
  (server-rendered filtering is `/work`'s job; the homepage also has search).
- "filter controls (Task 1.3.4)" in the plan reads as a cross-reference to the
  FilterBar/search tasks (1.3.7/1.3.8); implemented both.
- No assignment count, concept count, or mapping count is hard-coded in any UI
  string (verified by grep).

### 1.2.5 — Data validator + prebuild hook

**What was implemented**

- `scripts/validate-data.mjs` (`npm run validate`), dependency-free Node, fails
  the build on any violation and prints a data census.
- Checks: 35 assignments (registry ID set), 10 concepts, 11 artifacts, 34
  public edges, 5 rejected edges, 58 concept mappings; referential integrity in
  both directions; `approved: true` only; rejected edges absent from public
  edges; exact-match copy integrity against an `APPROVED_COPY` audit set;
  banned-pattern scan (em/en dashes, blocked sentences, banned voice words);
  `officialCode` mapping (no invented codes); evidence-status rule; workload
  omission for the three blank-workload assignments.
- `prebuild` hook wired so `npm run build` cannot succeed with invalid data.
- `check` script (`astro check`) and dev dependencies `@astrojs/check`,
  `typescript`.

**Files changed**

- `scripts/validate-data.mjs` (new)
- `package.json` (scripts: `validate`, `prebuild`, `check`)

**Assumptions**

- The plan states "20 coded assignments" and "57 concept mappings"; the locked
  CONTENT_REGISTRY actually yields **19 coded assignments** (ML-05 and ML-06
  do not exist as assignments) and **58 concept mappings** (the registry's
  Evaluation concept includes `fl-06-agent-design`, which the plan's count
  appears to have missed). The registry is the data authority, so the
  validator asserts the exact locked sets and reports 19/58. No invented
  codes; no invented mappings.

### 1.2.1–1.2.4 — Typed content data layer

**What was implemented**

- `src/data/types.ts`: `Assignment` (extended with `sourceAliases`, `strand`,
  `displayLabel`), `Concept`, `Artifact`, `ArtifactLink`, `GraphEdge`,
  `RejectedEdge`, plus supporting unions. `status`/`evidenceStatus` kept as
  separate unions.
- `assignments.ts`: 35 canonical records, IDs exactly as the registry writes
  them; `officialCode` only where the registry provides one; verbatim copy with
  the three safeguards applied (revised ML-03, revised FL Ship, FL-04
  source-safe edit). The two §1.2 non-assignment source records documented as
  a comment block, not nodes.
- `concepts.ts`: 10 concepts with locked descriptions and assignment mappings.
- `artifacts.ts`: 11 shared artifact records (`url` undefined) + 39
  `ArtifactLink` records encoding §3.2 role/display-mode decisions.
- `graph.ts`: 34 approved public edges (29 builds-on + 1 connects-to + 4
  cross-track) + 5 `rejectedEdges`.

**Files changed**

- `src/data/types.ts`, `src/data/assignments.ts`, `src/data/concepts.ts`,
  `src/data/artifacts.ts`, `src/data/graph.ts` (all new content; were empty)

**Assumptions**

- All 35 assignments are `complete`; every artifact/assignment is
  `evidenceStatus: "partial"` (no real URLs exist yet).
- `strand` union includes a fourth value `"convergence"` for FL-10 (the plan's
  listed union of three strands omits FL-10's registry strand "Convergence").
- ArtifactLink mapping: each assignment's §3.2 primary proof artifact is linked
  to the closest §3.3 shared "major artifact node" (e.g. all ML notebooks →
  `artifact-ml-repo`); roles preserved from §3.2. Flagged inline as PLACEHOLDER
  where a per-assignment document has no dedicated §3.3 record.
- `displayLabel` left `undefined` in data (derived at render time from
  `officialCode` or title), since the registry provides no separate short-label
  column and no copy may be invented.

### 1.1 — Toolchain and design system foundation

**What was implemented**

- `npm install`; verified `npm run build` and `npx astro check` pass on the
  starter; added `@astrojs/check` + `typescript` for `astro check`.
- Self-hosted variable fonts `@fontsource-variable/sora` and
  `@fontsource-variable/inter` (no external CDN; system-stack fallback).
- `src/styles/global.css` with the full Systems Atlas token system: exact
  colour tokens (§04), rules (§33), spacing scale (§32), clamp type scale
  (§07), radii (§34), motion tokens (§37), base reset, focus-visible, skip
  link, reduced-motion guard.
- `src/layouts/Base.astro`: semantic shell, head (title/description/canonical/
  OG), skip link, header, footer.
- `Header.astro` per §08 (FLYRANK / LEARNING ARCHIVE, centre nav MAP · WORK ·
  FRAMEWORK · REFLECTION, right track links, compact height, thin bottom rule,
  subtle active indicator, no pills).
- `Hero.astro` per §09 (eyebrow, deliberate line breaks, supporting +
  subordinate lines, filled primary + quiet secondary CTA).
- `src/config.ts` with `site.url` marked as a PLACEHOLDER.

**Files changed**

- `package.json`, `package-lock.json`
- `src/styles/global.css` (new), `src/layouts/Base.astro` (new),
  `src/components/Header.astro` (new), `src/components/Hero.astro` (new),
  `src/config.ts` (new)

**Assumptions**

- Added a derived text-safe `--green-bright (#4d8a70)` token: `--green
  (#315D4B)` is too dark for text on the near-black background (~2.5:1), so it
  is reserved as the identity accent and `--green-bright` is used for
  text/outlines where AA is required. Terracotta (~4.5:1) and gold
  (#B9A36A, ~7.6:1) pass AA on `#101312` as used. Full contrast audit is
  Phase 3.
- `--green` itself is not yet referenced by any Phase 1 text style (it exists
  for the Phase 2 graph identity); no colour is the sole signal anywhere.

---

## Notes for future phases

- Phase 2 (Learning Map) consumes the validated data modules and reuses
  `DetailPanel`; `LearningMap.astro` is a marked placeholder.
- Phase 3 replaces the `/framework` and `/reflection` stubs and flips
  `evidenceStatus`/`url` as real artifacts arrive (data-only changes).
