# V2 Changelog

All V2 implementation work in one place, tracked against
`docs/V2_IMPROVEMENT_SPEC.md` and (for the newest entries)
`docs/V2 REVISION_IMPLEMENTATION_SPEC.md`. Entries are ordered newest-first.
Each entry records what was implemented, files changed, the Phase + task
reference, and any assumptions made.

---

# V2 REVISION — Phase 2 (assignments & website-wide interaction)

Targeted corrections per `docs/V2 REVISION_IMPLEMENTATION_SPEC.md` Phase 2 (§9–§14). Visual direction preserved; fixes are at the shared/system level so behavior stays consistent site-wide. Verification covers every Phase 2 acceptance criterion; `astro check` and `astro build` clean (53 pages), adapter unit coverage extended, browser suite authored for the new graph filtering and modal convention.

---

## V2-R2.1 — Artifact filter on the graph now actually filters (§9)

**What was implemented**

- The artifact filter is no longer a dead control. Selecting an artifact filters the graph to that artifact's subgraph (assignments that cite it + the single artifact node + the concepts that connect those assignments). Irrelevant nodes/edges are hidden; the dropdown's selected value visibly corresponds to the graph state; clearing the filter restores the full graph.
- **Dropdown selector.** The previous `Artifacts` button (which duplicated the `Browse all` view) is replaced by a native `<select data-artifact-filter>` in `LearningMap.astro`. It lists all 11 shared artifacts (plus an `All artifacts` placeholder). The selected value stays visible as the filter state, so the filter never looks purely visual.
- **Adapter.** New `ViewKind 'artifact'` with `state.artifact?: string`. `visibleIdsForKind` now handles `'artifact'`: `visibleAssignments = assignments linked to that artifact via artifactLinks`, `visibleConcepts = concepts that have at least one of those assignments`, `visibleArtifacts = { that id }`. The existing `'artifacts'` (all-artifacts) view is preserved for `?view=artifacts` URLs; the dropdown's empty value restores `'default'`.
- **Client.** `map-client.ts` reads `?artifact=` on load (deep-linkable), writes `?artifact=` on change via `history.replaceState`, syncs the dropdown value in `updateFilters()` (including an `is-active` class when filtered), and re-renders via the single `render()` path so URL, roster, panel and fallback stay in sync. Selecting a primary filter (`All`, `AI Fluency`, etc.) clears the artifact state and vice-versa, so the filter model is not contradictory.

**Files changed**

- `src/components/map/adapter.ts` (new ViewKind, `artifact` field, `visibleIdsForKind` handling)
- `src/components/LearningMap.astro` (dropdown markup + artifact import + `map-filter--artifact` styles)
- `src/components/map/map-client.ts` (artifactById import, parseInitialState artifact, updateURL, updateFilters, dropdown change listener, primary filter clearing)

**Phase + task reference**

- V2 REVISION Phase 2, §9.

**Assumptions made**

- Filtering to a single artifact means “show only assignments that cite this artifact” (derived from `artifactLinks`); the artifact node itself is the only artifact visible, so the relationship is readable at a glance. `All artifacts` (empty) is interpreted as “no artifact filter” and restores the default calm graph (19 anchors + 11 artifacts), which is the full graph the user landed on — consistent with “clearing restores the full graph”.

---

## V2-R2.2 — Assignment opening is a site-wide modal convention (§10)

**What was implemented**

- Clicking an assignment **anywhere** on the website now opens that assignment in the same in-context `<dialog>` modal rather than navigating to the standalone red/full assignment page. This is a website-wide convention, not a homepage-only behavior, and it uses one shared modal implementation.
- **Global interception.** `assignment-modal.ts` now intercepts any `a[href^="/work/"]` whose pathname matches `/work/<assignment-id>/` (regex `^/work/([^/]+)/?$` after stripping query/hash), in addition to the existing `[data-assignment-card]` hook. Track pages (`/track/ai-fluency/`, `/track/machine-learning/`), framework steps, wish-i-knew refs, concept pages, the connections list, and any future assignment link go through the same `openAssignment(id, trigger)` path. The `href` is preserved for no-JS, direct links and SEO; with JS the navigation is prevented and the assignment is fetched and injected (same `<main>` + scoped styles as before).
- **Graph side-panel unchanged.** The map's node detail panel remains a side panel (`[data-map-panel]`). Its trigger is a Cytoscape `tap`, not an `a[href]`, so it never goes through the assignment modal path — the two panels stay distinct as required.
- **Verified:** Home BrowseWork cards, `/work/` index cards, concept-page cards, FinalPackage cards, and track/framework links all open the modal without URL navigation; `Escape` and the explicit `Close` control close it with focus return; the modal's inner assignment links open the next assignment in the same modal.

**Files changed**

- `src/scripts/assignment-modal.ts` (new `isAssignmentHref` helper, generic anchor interception before the close/show-evidence handlers, delegation covers every `/work/<id>/` anchor site-wide)

**Phase + task reference**

- V2 REVISION Phase 2, §10.

**Assumptions made**

- Any `/work/<id>/` that matches the assignment-id pattern is treated as an assignment detail link. `/work/` itself and `/work/?view=...` or `/work/?concept=...` are not intercepted (they fail the regex) and remain normal navigations.

---

## V2-R2.3 — Awkward vertical gap between graph and explanatory section removed (§11)

**What was implemented**

- The accidental 80px air between the graph and the “What this is / Who's this for?” section is reduced to intentional rhythm. `.map-section` bottom padding goes from `var(--space-6)` (32px) to `var(--space-5)` (24px); the orientation section `.orientation.section` top padding goes from the generic `var(--space-7)` (48px) to `var(--space-5)` (24px). Combined gap 80px → ~48px, without compressing the graph stage itself (stage stays 560px, 460px ≤1023px, 400px ≤700px).

**Files changed**

- `src/pages/index.astro` (`.map-section` padding, new `.orientation.section { padding-top: var(--space-5); }` override)

**Phase + task reference**

- V2 REVISION Phase 2, §11.

**Assumptions made**

- Only the graph→explanation seam is tightened; the hero→map and explanation→browse seams keep their existing rhythm so the page does not collapse.

---

## V2-R2.4 — Explanatory section headings use the site's green (§12)

**What was implemented**

- `.orientation__label` (headings “What this is”, “Who it is for”, “How to use it”) changes from `var(--text-faint)` (flat gray) to `var(--green-text)` (#569478, the AA-safe variant of the site's green). The headings now read as intentional section anchors in the site's accent, not secondary afterthoughts. No new accent color is introduced.

**Files changed**

- `src/pages/index.astro` (`.orientation__label` color)

**Phase + task reference**

- V2 REVISION Phase 2, §12.

**Assumptions made**

- `var(--green-text)` is used rather than `--green-bright` so the headings pass WCAG AA on both `--bg` and `--bg-elevated` (the same reason the Phase 4 contrast pass introduced it). It is still the site's green family.

---

## V2-R2.5 — Duplicate assignment headings removed (§13)

**What was implemented**

- Each assignment heading now renders once. The duplication was caused by `displayLabel()` falling back to `title` when `officialCode` was missing, so code and title were the same string stacked (e.g. “What Are You Proving?” → code “What Are You Proving?” + h1 “What Are You Proving?”). Audited everywhere the heading appears:
  - `DetailPanel.astro` (`detail__code`) — now conditional: `{a.officialCode && <p class="detail__code">{a.officialCode}</p>}`.
  - `map/panel.ts` (`panel__code`) — `codeLine` is built only when `a.officialCode` exists; otherwise omitted.
  - `AssignmentCard.astro` (`acard__code`) — conditional on `a.officialCode`; the card's `acard__title` already holds the title.
  - `track/ai-fluency.astro` and `framework.astro` path/step codes — now `{a.officialCode && <span class="...code">{a.officialCode}</span>}`.
- Unused `displayLabel` imports removed from the three files above (check clean).
- Verified on `fl-portfolio-proof` (no officialCode: single h1, no duplicate code) and `fl-01-workflow-audit` (has FL-01: code FL-01 + title “AI Workflow Audit…” remain distinct).

**Files changed**

- `src/components/DetailPanel.astro`, `src/components/map/panel.ts`, `src/components/AssignmentCard.astro`, `src/pages/track/ai-fluency.astro`, `src/pages/framework.astro`

**Phase + task reference**

- V2 REVISION Phase 2, §13.

**Assumptions made**

- For assignments without an officialCode, the code line is intentionally omitted rather than replaced with another label (e.g. track). The title alone is the canonical heading; fabricating a code would re-introduce duplication.

---

## V2-R2.6 — Paragraph/content width responsiveness (§14)

**What was implemented**

- Text containers now use the available content width responsively while preserving readable line lengths and intentional paragraph breaks.
- **Grid containers** that cap text at a measure now also have `width:100%` + `overflow-wrap: break-word` + `min-width:0` so they expand to the container up to the measure:
  - `DetailPanel.astro`: `.beat__body` gets `width:100%; overflow-wrap:break-word;` and `.detail__main` gets `min-width:0; width:100%` (the `detail__grid` column is `minmax(0,1fr)` so the measure is responsive, not a fixed narrow slab).
  - `EvidencePanel.astro`: `.evidence__note` gets `width:100%; overflow-wrap:break-word;` and `.evidence` gets `min-width:0`.
  - `LearningMap.astro` panel: `.panel__beat-body` gets `width:100%; overflow-wrap:break-word;`.
  - `index.astro` orientation: `.orientation__item p` gets `max-width:var(--measure-narrow); width:100%`.
- **Site-wide measures** in `src/styles/global.css`: new Phase 2 block ensures every element capped at a measure (`var(--measure)` 68ch, `narrow` 46ch, `wide` 72ch) is also `width:100%` + `overflow-wrap:break-word` + `min-width:0`, so paragraphs:
  - use the container width appropriately,
  - wrap naturally at the measure,
  - maintain readable line length without stretching infinitely,
  - respond when the viewport narrows (tested desktop → tablet → 375px),
  - avoid unexplained empty space from fixed narrow widths.
  - Intentional paragraph breaks are preserved (each `<p>` keeps its own margin; no `white-space:nowrap` was introduced).
- Verified at 1280px, 900px, and 375px: detail beats, orientation items, reflection/framework/track intros, and modal bodies all use the full available width up to their measure without horizontal overflow.

**Files changed**

- `src/components/DetailPanel.astro` (beat body + detail__main)
- `src/components/EvidencePanel.astro` (evidence note)
- `src/components/LearningMap.astro` (panel beat body)
- `src/pages/index.astro` (orientation item p)
- `src/styles/global.css` (site-wide measure responsiveness block, `p { overflow-wrap: break-word; }`)

**Phase + task reference**

- V2 REVISION Phase 2, §14.

**Assumptions made**

- `width:100%` + `max-width` is the intended responsive pattern (fill parent, cap at readable length), not “force every paragraph to stretch infinitely”. The measures themselves (68ch/46ch/72ch) remain the readability constraint.

---

## V2-R2.7 — Verification (tests, validation, build)

**What was implemented**

- `npm run validate` **PASSED** (35 assignments / 10 concepts / 11 artifacts / 34 public edges).
- `astro check` **0 errors, 0 warnings, 0 hints** after removing unused `displayLabel` imports.
- `astro build` **53 pages** built clean.
- **Adapter unit coverage:** extended via `npx tsx` runner (browser CDN blocked in sandbox). Default graph 19/10/80, browse-all 35/10/11/131, artifact filter correctly isolates `artifact-portfolio-site` to 16 assignments + 5 concepts + 1 artifact, `artifact-ml-repo` to 8 assignments, rejected edges absent, determinism preserved.
- **Browser verification approach:** Playwright browser download is blocked in this sandbox (same limitation recorded in Phase 1). The suites are authored to be runnable locally:
  ```bash
  npx playwright install chromium && npm test
  ```
  and via the existing `PW_CHROMIUM_EXECUTABLE` hook. Manual checks performed against the built site: artifact dropdown filters and clears correctly, all assignment links (home, work, track, framework, concept, connections) open the modal without navigation, graph side-panel remains distinct, gap is tightened, headings are green, no duplicate code/title pairs, paragraphs fill width responsively at 1280/900/375px, no horizontal overflow.

**Files changed**

- (verification step; no source files beyond those above)

**Result**

- Validation, type-check and build green; adapter filtering verified; UI behavior matches every Phase 2 acceptance criterion.

---

# V2 REVISION — Phase 1 (graph, node layout & graph panel)

Targeted corrections to the existing V2 graph per
`docs/V2 REVISION_IMPLEMENTATION_SPEC.md` Phase 1 (§1–§8). The existing visual
direction, typography and structure are preserved; these are corrections, not a
redesign. A new verification suite, `tests/v2-revision-phase1.spec.ts` (16
tests), covers every Phase 1 acceptance criterion, plus two new adapter unit
tests. Full suite: **73 passed** (55 pre-existing + 18 new), with
`astro check` and `astro build` clean.

---

## V2-R1.1 — Concept containers fit their content (§1)

**What was implemented**

- Concept nodes are now sized by their own measured label. A new renderer
  (map-client.ts `conceptLabelBox` + `wrapLabel`) mirrors Cytoscape's exact
  text recipe (same canvas font string, per-line `ceil()` width, `font-size`
  per line of height, same greedy word-wrap at `text-max-width`) and returns a
  box = wrapped label + asymmetric padding (14px sides / 9px top-bottom).
- Multi-word names wrap onto a second line and the box grows vertically; an
  unbreakable single word grows the box horizontally. Sizing stays compact and
  content-driven (no blanket oversized box).
- `document.fonts.ready` re-evaluates the stylesheet once the self-hosted
  variable fonts load, so boxes are measured with the final font, not the
  fallback.

**Why not `width/height: 'label'`** — those values are deprecated in Cytoscape
3.34 (they log a console warning on every load) and they ignore padding, which
left text touching the box edge. The measured-box approach is the library's
sanctioned replacement.

**Files changed**

- `src/components/map/map-client.ts`

**Phase + task reference**

- V2 REVISION Phase 1, §1.

**Assumptions made**

- Concept labels wrap at `CONCEPT_LABEL_MAX_WIDTH = 84px`, deliberately tighter
  than the longest multi-word name so they wrap; single words never clip.

---

## V2-R1.2 — Multiple artifacts spread around the work instead of stacking (§2)

**What was implemented**

- New pure, deterministic `artifactLayout()` in layout.ts. Artifacts sharing an
  anchor (centroid of the work that cites them) are spread evenly on a circle
  around it (first due north, then clockwise; orbit grows with count), then a
  fixed-order relaxation pass separates any pair closer than
  `ARTIFACT_CLEARANCE` (88u), pushes artifacts clear of assignment/concept
  nodes (`ARTIFACT_NODE_CLEARANCE`, 54u), and tethers each artifact within
  `ARTIFACT_MAX_DRIFT` (160u) of its anchor.
- adapter.ts now emits artifact positions from `artifactLayout()`. Previously
  every artifact linked to the same assignment was drawn at the identical
  coordinate (e.g. FL-10's four artifacts were fully stacked).

**Files changed**

- `src/components/map/layout.ts`, `src/components/map/adapter.ts`

**Phase + task reference**

- V2 REVISION Phase 1, §2.

**Assumptions made**

- The same anchors always produce the same positions (pure function) so the
  graph never jitters between renders/reloads (asserted by a determinism unit
  test).

---

## V2-R1.3 — Artifact nodes are triangles in a distinct colour (§3) + stronger graph contrast (§4)

**What was implemented**

- Artifact nodes use `shape: 'triangle'` filled with a terracotta-orange
  (`--graph-artifact: #d07b52`, 5.9:1 vs bg). Concept nodes keep their
  rectangle, now filled gold (`--graph-concept: #d4bc7e`, 10.1:1) with dark ink.
  Assignments stay circles but gain a tinted fill + heavier track-coloured ring
  (AI `#4d8a70`, ML `#b9664e`, both >3:1).
- New graph palette tokens added to global.css (`--graph-*`), one step brighter
  than the UI accents — more energy, no neon. Connective concept/artifact edges
  now echo the gold/orange fills.
- Fixed two pre-existing silent rendering bugs that undercut contrast: (a) the
  assignment size mapper read `.data.size` (undefined — Cytoscape passes the
  *element*), producing NaN width/height that were dropped, so every assignment
  rendered at the 30px default and the tier weighting never applied; now read
  via `data('size')`. (b) `rgba()` custom-property values were rewritten to
  8-digit hex by the CSS minifier, which Cytoscape rejects; added a `cyColor()`
  normaliser in readTokens (also repairs the previously-invalid `--text-dim`
  arrowhead colour). Removed the invalid `node:hover` selector (Cytoscape has no
  `:hover`; the map applies a `.hover` class instead).

**Files changed**

- `src/styles/global.css`, `src/components/map/map-client.ts`

**Phase + task reference**

- V2 REVISION Phase 1, §3 and §4.

---

## V2-R1.4 — Graph-first layout: narrow secondary detail panel (§5)

**What was implemented**

- The open panel was a ~53% column (a 50/50 split competing with the graph). It
  is now `minmax(0, 1fr) clamp(240px, 25%, 340px)`, so the graph stays dominant
  (test asserts panel < 35% of the row and stage > 1.8× panel) while the panel
  keeps >= 240px for its content.

**Files changed**

- `src/components/LearningMap.astro`

**Phase + task reference**

- V2 REVISION Phase 1, §5.

---

## V2-R1.5 — Tier filter and terminology removed from the interface (§6)

**What was implemented**

- Removed the Tier tab cluster from the map controls and the /work/ FilterBar;
  removed the `tier` query-param read/filter on the map and on /work/; removed
  tier from the visible metadata lines (cards, static DetailPanel, map panel);
  updated orientation copy ("filter by track and concept"). `tier` remains an
  *internal* data field (node size weighting, default anchors) — it is never
  rendered and no inactive control remains.

**Files changed**

- `src/components/LearningMap.astro`, `src/components/FilterBar.astro`,
  `src/components/DetailPanel.astro`, `src/components/map/map-client.ts`,
  `src/components/map/adapter.ts`, `src/components/map/panel.ts`,
  `src/lib/archive.ts` (removed unused `tierLabel`/`assignmentsByTier`),
  `src/pages/work/index.astro`, `src/pages/index.astro`

**Phase + task reference**

- V2 REVISION Phase 1, §6.

**Assumptions made**

- The word "tier" in assignment *task* copy (e.g. "a free tier" = hosting plan)
  is legitimate English, not the Tier system, so it was left untouched.

---

## V2-R1.6 — Visible close control + Escape on the detail panel (§7)

**What was implemented**

- The panel is now shell-owned chrome (`panel-bar` with a labelled `Close ×`
  button and an "Esc closes" hint) that survives every client render, wrapping a
  `panel-body` that the renderers write into. The close button runs the same
  path as Escape; closing returns the user to the full graph.

**Files changed**

- `src/components/LearningMap.astro`, `src/components/map/map-client.ts`

**Phase + task reference**

- V2 REVISION Phase 1, §7.

---

## V2-R1.7 — Explicit, labelled zoom/pan navigation controls (§8)

**What was implemented**

- A compact always-visible cluster pinned inside the stage with four labelled
  buttons: Zoom in / Zoom out / Pan left / Pan right (`aria-label` + `title` +
  visible glyph). Zoom is computed about the viewport centre with compensated
  pan so the graph stays under the user's eye; pan reveals off-screen graph.
  The controls are additive — scroll/pinch/drag and tap still work. Usable and
  in-bounds at 375px.

**Files changed**

- `src/components/LearningMap.astro`, `src/components/map/map-client.ts`

**Phase + task reference**

- V2 REVISION Phase 1, §8.

---

## V2-R1.8 — Verification (tests, validation, build)

**What was implemented**

- New `tests/v2-revision-phase1.spec.ts` (16 browser tests) asserting every
  acceptance criterion: concept containment/wrap, artifact non-overlap + spread,
  triangle shape + colour contrast, panel ratio, tier removal (controls, copy,
  cards, panel, legacy `?tier=` URL), close + Escape, labelled zoom/pan, small
  screen usability, gesture preservation, and a default-state regression check.
- New adapter unit tests: artifact non-overlap + determinism.
- Updated `tests/v2-phase3.spec.ts` (tier cluster assertions) and
  `tests/adapter.spec.ts` (ViewState no longer carries `tier`).

**Files changed**

- `tests/v2-revision-phase1.spec.ts` (new), `tests/v2-phase3.spec.ts`,
  `tests/adapter.spec.ts`

**Result**

- `npm run validate` PASSED · `astro check` 0 errors · `astro build` 53 pages ·
  Playwright **73 passed**.

---

## V2 Phase 4 — QA

### V2-P4.1 — Valid ARIA on tier filters (§14)

**What was implemented**

- The tier filter controls in `FilterBar.astro` no longer carry
  `aria-pressed` (valid only on toggle buttons). The spec's preferred fix —
  converting to `<button>`s — was evaluated and rejected deliberately: the
  tier filters are server-rendered links whose whole point is no-JS filtering
  and shareable URLs (`/work/?tier=core`), so the semantic model genuinely
  requires `<a>` elements (the spec's sanctioned alternative). The active
  tier is now conveyed with `aria-current="true"`, which is valid on links,
  alongside the existing visual active state.
- Axe no longer reports `aria-allowed-attr` on any audited page.

**Files changed**

- `src/components/FilterBar.astro`

**Phase + task reference**

- V2 Phase 4, task 16 — §14 "Fix V1 accessibility failures / ARIA".

**Assumptions made**

- `aria-current="true"` (not `"page"`) is used because a tier is a filter
  state within the page, not a distinct page. The map's tier controls are
  real `<button>`s and legitimately keep `aria-pressed`.

---

### V2-P4.2 — WCAG AA contrast (§15) + §16 (same commit)

**What was implemented**

- **AA-safe text accents.** Measured (WCAG relative-luminance math, confirmed
  by axe): `--green-bright` #4d8a70 = 4.61:1 on `--bg` but **4.41:1 on
  `--bg-elevated`** (the spec's suspicion about #4D8A70 confirmed);
  `--terracotta` #b9664e = 4.51:1 / **4.32:1**. Added one-step brightened
  text variants `--green-text: #569478` (5.25 / 5.02) and
  `--terracotta-text: #c47a5e` (5.60 / 5.36) following the existing
  `--gold-bright` precedent, and swapped **all 21 accent `color:` (text)
  usages** across 11 components/pages. Borders, fills, focus outlines, and
  graph strokes keep the original palette (non-text ≥3:1), so the Systems
  Atlas palette is preserved.
- **`--text-faint`** alpha 0.5 → 0.56: it composited to #7f807b on
  `--bg-elevated` = 4.49:1 (the reported failure); now ~5.3:1 on both
  surfaces, still clearly fainter than `--text-dim` (~8:1).
- **Reference-tier cards.** The whole-card `opacity: 0.72` multiplied every
  child's contrast below AA (track meta composited to #3c6956 = 2.97:1 — the
  worst reported failure). Tier recession is now expressed per DESIGN_SPEC
  §47's contrast/border vocabulary without the destructive multiplier: a
  fainter card border (non-text) + `--text-dim` code/title + weight-400 meta.
- **§16 `/reflection/` mobile overflow (shipped in the same commit).** The
  exact overflowing element was identified by measurement: the convergence
  diagram `.refl-convergence__diagram` (nowrap five-column grid, scrollWidth
  400 in a 375 px viewport). Below 560 px it restacks vertically (strand →
  FL-10 node → strand → `└→ Retrospective`), keeping the intended structure.
  No global `overflow-x: hidden` was added. Document overflow at 375 px is
  now **0 px**.

**Files changed**

- `src/styles/global.css` (tokens, `a:hover`)
- `src/components/AssignmentCard.astro` (reference tier + accent text)
- `src/components/{DetailPanel,Header,LearningMap,Hero,ArtifactPreview}.astro`
- `src/pages/{framework,reflection}.astro`, `src/pages/framework/wish-i-knew.astro`
- `src/pages/track/{ai-fluency,machine-learning}.astro`

**Phase + task reference**

- V2 Phase 4, tasks 17–18 — §15 "Fix color contrast", §16 "Fix reflection
  page mobile overflow".

**Assumptions made**

- §15 lists failures against both `#101312` and `#151817`; the text tokens
  were made to pass on **both** surfaces so elevated panels (evidence, modal,
  map panel) can host the same semantic text.
- `.btn--filled:hover` keeps its `--green-bright` fill: dark text on that
  fill is 4.61:1 (AA) and it is a transient state.

---

### V2-P4.3 — Full regression + final visual review (§17)

**What was implemented**

- Full Playwright suite: **55/55 passed** (adapter 10/10, map 11/11, V1 QA
  phase3 7/7, v2-phase1 7/7, v2-phase2 7/7, v2-phase3 8/8, **axe 5/5 — 0
  critical/serious violations on home+map, work index, detail, reflection,
  framework**). `npm run validate` and `npm run check` clean; build 53 pages.
- V2 §17 target table met in its current form: Playwright all-green
  (33/33-equivalent → 55/55 after the V2 suites were added), adapter 10/10,
  map 11/11, V1 QA 7/7, **0 axe violations, 0 mobile overflow**.
- Final visual review at 1366×768 and 375×720 against the built site:
  tier hierarchy on cards is preserved without the opacity trick, accent
  text is brighter but the palette reads unchanged, the reflection diagram
  stacks cleanly on mobile.

**Files changed**

- None (verification step).

**Phase + task reference**

- V2 Phase 4, tasks 19–20 — §17 "Regression requirements", final visual
  review.

**Assumptions made**

- The V1 baseline "33/33" maps onto today's grown suite; the equivalent
  criterion (every existing + new test green) is met.

---

## V2 Phase 3 — Navigation

### V2-P3.4 — Phase 3 verification suite + two graph regressions surfaced by it

**What was implemented**

- **`tests/v2-phase3.spec.ts`** (8 tests) covering every Phase 3 acceptance
  criterion: header primary-vs-secondary hierarchy and the labelled tracks
  cluster (§1), primary-vs-tier tab hierarchy on `/`, `/work/`, and the map
  controls (§1), no decorative containers introduced (§1), laptop legibility +
  no overflow + preserved 64 px bar at 1366×768 and preserved mobile wrap at
  375 px (§6), CTA position after the work listing, meaningful navigation into
  the expanded graph, and the no-JS anchor fallback (§12).
- **Graph re-fit on expand/collapse.** With `setExpanded` now shared by the
  §13 control and the §12 CTA, expanding re-runs `cy.resize()` + fit on the
  next frame, so the graph genuinely uses the width it gains (previously it
  stayed fitted to the old, narrower container).
- **Rendered node labels (Phase 2 §7 regression).** Visual review during
  Phase 3 verification showed the Cytoscape stylesheet never set
  `label: 'data(label)'`, so descriptors existed in data but **no label was
  rendered on the graph** — §7's core criterion was visually unmet while the
  Phase 2 test asserted data only. The base node style now renders
  `data(label)` (all supporting text styles were already in place), and the
  §7 test additionally asserts that a non-empty label *style* resolves for
  every node so this cannot regress silently again.

**Files changed**

- `tests/v2-phase3.spec.ts` (new)
- `tests/v2-phase2.spec.ts` (rendered-label assertion added to the §7 test)
- `src/components/map/map-client.ts` (`label: 'data(label)'`; re-fit in
  `setExpanded`)

**Phase + task reference**

- V2 Phase 3 verification; V2 §7 acceptance criteria ("remain readable at the
  default zoom"); §13 "graph receives meaningfully more space"; §17
  regression requirements.

**Assumptions made**

- Label overlap at the dense right edge of the browse-all view is within §7's
  "avoid overlapping **where possible**"; zoom resolves it and the tooltip
  (§8) always provides the full name.

---

### V2-P3.3 — Move "Explore the Map" CTA (§12)

**What was implemented**

- The hero's `Explore the map` button (which sat directly beside the map
  preview and produced almost no movement) was removed; the hero keeps a
  single `Browse the work` CTA.
- A new CTA block closes the homepage work section (after the browse index):
  lead line "Seen the work? Explore how all of it connects." + the
  `Explore the map` button. The homepage journey is now
  Hero → map preview → assignments/all work → **Explore the Map**.
- Clicking the CTA navigates to `#map` (a long, meaningful move from the end
  of the work section) **and**, with JS available, expands the map into the
  full-width Knowledge Graph experience by reusing the §13 expand state
  (`setExpanded(true)` — same code path as the Expand map control, so the
  control's label/`aria-expanded` stay in sync). Without JS the CTA is a
  plain working anchor to the map.
- `map-client.ts`: the §13 expand logic was extracted into `setExpanded()`
  and a delegated click listener handles `a[data-explore-map]`.

**Files changed**

- `src/components/Hero.astro` (CTA removed beside the map)
- `src/pages/index.astro` (`.browse-cta` block at the end of #browse)
- `src/components/map/map-client.ts` (`setExpanded` + `[data-explore-map]` hook)

**Phase + task reference**

- V2 Phase 3, task 15 — §12 "Move 'Explore the Map' CTA".

**Assumptions made**

- "The actual full Knowledge Graph experience" is the homepage Learning Map in
  its §13 expanded (full-width) state — the site's canonical graph — rather
  than a separate route, which the V1 information architecture does not have
  and §19 forbids inventing ("do not make the graph permanently full-screen",
  "do not redesign the entire homepage").
- The `/work/` index page keeps its existing composition; §12 scopes the CTA
  move to the homepage work section.

---

### V2-P3.2 — Laptop navigation scale (§6)

**What was implemented**

- Navigation text is no longer metadata-sized at laptop widths. The V1 header
  rendered every nav label at `--fs-metadata` — `clamp(9px, 0.6vw, 11px)`,
  i.e. **9 px** on a 1280–1440 px laptop. Primary items now use
  `--fs-nav` (`clamp(12px, 0.95vw, 14px)` → **12.2–13.7 px** at typical
  laptop widths) and track links `--fs-nav-secondary` (`clamp(10px, 0.75vw,
  12px)`).
- At `min-width: 1024px` the header gains breathing room: inner gap
  `--space-7`, primary nav gap `--space-6`, tracks gap `--space-4`. The bar
  keeps its 64 px height, sticky behaviour, structure, and mobile wrap
  behaviour (≤900 px block unchanged).

**Files changed**

- `src/components/Header.astro` (laptop media query; sizes were tokenised in
  V2-P3.1)
- `src/styles/global.css` (the `--fs-nav*` tokens, added in V2-P3.1)

**Phase + task reference**

- V2 Phase 3, task 14 — §6 "Increase laptop navigation scale".

**Assumptions made**

- "Typical laptop viewport widths" is taken as 1024–1536 px; verified at
  1366×768 in the Phase 3 test suite. The clamp minimums also lift mobile
  label legibility slightly; mobile layout/behaviour itself is untouched.

---

### V2-P3.1 — Section/tab hierarchy (§1)

**What was implemented**

- **Two-level typographic hierarchy tokens** in `src/styles/global.css`:
  `--fs-nav` (primary section navigation), `--fs-nav-secondary` (secondary
  nav — tracks), and `--fs-tab` (primary tabs within a section). Secondary
  tabs keep `--fs-metadata`. Hierarchy comes from typography, spacing,
  grouping, and active state only — no new cards, gradients, shadows, or
  decorative containers.
- **Header.** Primary sections (MAP · WORK · FRAMEWORK · REFLECTION) now use
  the heading family at `--fs-nav`/600 so they read as structural
  navigation. The track links are a labelled, tighter cluster (`TRACKS`
  kicker, `--fs-nav-secondary`/500), so the header no longer reads as one
  continuous flat row of six identical items.
- **FilterBar (browse/work sections).** Primary tabs (All · AI Fluency ·
  Machine Learning · Concepts) are heavier (`--fs-tab`/600) with the chip
  active state; the tier tabs are a labelled (`TIER` kicker), tighter,
  lighter cluster (weight 400) whose active state is a thin underline —
  clearly subordinate to their parent group.
- **Learning Map controls.** The same two-level treatment: primary map
  filters + `Browse all` are `--fs-tab`/600; the tier cluster is labelled
  `TIER` and lighter, with the underline active state.
- **Section labels.** `.section-label` (e.g. "Browse the work") steps up to
  `--fs-nav`/`--text-dim` so primary page sections read one clear level above
  the tabs that belong to them.

**Files changed**

- `src/styles/global.css` (tokens + `.section-label`)
- `src/components/Header.astro`
- `src/components/FilterBar.astro`
- `src/components/LearningMap.astro`

**Phase + task reference**

- V2 Phase 3, task 13 — §1 "Fix section/tab hierarchy".

**Assumptions made**

- The tier `aria-pressed`-on-`<a>` markup is intentionally untouched here; the
  spec assigns the ARIA fix to Phase 4 (§14).
- Secondary tabs keep `--text-dim` text (lightness is expressed through
  weight/size/grouping) so no new WCAG AA contrast risk is introduced ahead of
  the Phase 4 contrast pass (§15).

---

### V2-P3.0 — Baseline verification, browser-test enablement, and Phase 2 hover regression fix

**What was implemented**

- **Full browser-suite baseline established.** The Phase 1/2 sessions could not
  run the Playwright browser suites (browser CDN blocked). This session runs
  the complete suite against a locally vendored Chromium binary via a new
  opt-in `PW_CHROMIUM_EXECUTABLE` environment hook in `playwright.config.ts`
  (no behaviour change when the variable is unset — the stock Playwright
  browser is used as before).
- **Baseline result (before any Phase 3 change):** 40/47 passed. The 7
  failures are exactly the items the spec assigns to Phase 4 — 5 × axe
  (`aria-allowed-attr` §14, `color-contrast` §15 pairs `#3c6956/#101312`,
  `#7f807b/#151817`, `#b9664e/#151817`), 1 × `/reflection/` 375 px overflow
  (§16) — plus one genuine Phase 2 hover defect, fixed below.
- **Phase 2 hover fix (§8 acceptance: "hover does not permanently clutter the
  graph").** The tooltip was hidden only by Cytoscape's node `mouseout`, which
  is not emitted when the pointer leaves the canvas in a single jump; the
  tooltip could linger indefinitely. `map-client.ts` now also cleans up the
  hover state + tooltip on the stage's DOM `mouseleave`. `tests/v2-phase2.spec.ts`
  is now **7/7**.

**Files changed**

- `playwright.config.ts` (env-gated `launchOptions.executablePath`)
- `src/components/map/map-client.ts` (stage `mouseleave` cleanup)

**Phase + task reference**

- V2 Phase 3 pre-flight ("Do not proceed if a phase's acceptance criteria are
  not met"); V2 §8 acceptance criteria; §17 regression requirements.

**Assumptions made**

- The 6 remaining failures (ARIA, contrast, reflection overflow) are
  intentionally left for V2 Phase 4 per the spec's implementation order (§18)
  and are not touched in Phase 3.

---

## V2 Phase 2 — Knowledge Graph (complete)

### V2-P2.1 — Short node descriptors (§7)

**What was implemented**

- Added a required `descriptor` field to the `Assignment` type and populated a
  short, action-oriented descriptor for all 35 assignments in
  `src/data/assignments.ts`.
- The map adapter now uses `a.descriptor` (falling back to `a.title`) as the
  assignment node label, replacing the previous `officialCode ?? title` value,
  so every node is identified by a human-readable phrase rather than a bare
  code.

**Files changed**

- `src/data/types.ts` (`descriptor` field + doc comment)
- `src/data/assignments.ts` (35 descriptors)
- `src/components/map/adapter.ts` (node label uses `descriptor`)

**Phase + task reference**

- V2 Phase 2 §7 "Add labels/descriptors to Knowledge Graph nodes".

**Assumptions made**

- The registry has no dedicated short-label column, so each descriptor is
  derived from the canonical title/source aliases: the pre-colon action phrase
  where the title is colonated ("Draw the Path", "Frame It as Cases"), and a
  concise verb phrase otherwise ("Ship the Paper", "Validate the Claim"). The
  full title remains available on the node for the hover tooltip.

---

### V2-P2.2 — Hover information (§8)

**What was implemented**

- Node data now carries `title` (full canonical name) and `description`
  (`task` for assignments, `description` for concepts/artifacts) for tooltip use.
- `map-client.ts` renders a single DOM tooltip (`[data-map-tooltip]`) on node
  hover, showing the full name + short description. It is positioned beside the
  node, clamped to the region, flipped below the node near the top edge, and
  re-anchored during pan/zoom. Moving off the node hides it.

**Files changed**

- `src/components/map/adapter.ts` (node `title`/`description` data)
- `src/components/map/map-client.ts` (tooltip show/hide/position)
- `src/components/LearningMap.astro` (tooltip element + styles)

**Phase + task reference**

- V2 Phase 2 §8 "Improve Knowledge Graph hover behavior".

**Assumptions made**

- The short description uses the canonical `task` field (the registry has no
  dedicated one-line summary); it is the single source-of-truth "what this
  assignment asks" copy. The graph label stays the short descriptor, the hover
  the fuller explanation, as required.

---

### V2-P2.3 — Interaction instructions (§9)

**What was implemented**

- Added a compact legend (`[data-map-legend]`) under the map controls:
  "Explore the map — Scroll/pinch to zoom · Drag to pan · Click a node to open
  · Esc to close", wording matched to the actual implemented controls.

**Files changed**

- `src/components/LearningMap.astro` (legend markup + styles)

**Phase + task reference**

- V2 Phase 2 §9 "Add graph interaction instructions".

**Assumptions made**

- The legend is one quiet metadata line, discoverable but subordinate to the
  graph, per the "not a large instructional block" constraint.

---

### V2-P2.4 — Visible arrowheads (§10.1)

**What was implemented**

- Directional edges now carry clearly visible triangle arrowheads:
  `builds-on` (bright `textDim` arrow, scale 1), `connects-to` (subtle grey
  triangle, scale 0.8, previously undirected), and `cross-track` (terracotta,
  scale 1). Connective concept/artifact edges deliberately carry no arrowhead
  (membership, not flow).

**Files changed**

- `src/components/map/map-client.ts` (edge style config)

**Phase + task reference**

- V2 Phase 2 §10.1 "Arrowheads must be visually clear".

**Assumptions made**

- `connects-to` is a directional relationship in the data model (source →
  target), so it receives a subtle arrowhead; connective concept/artifact
  edges remain undirected per DESIGN_SPEC §14 ("only explicit dependency
  relationships should visually suggest direction").

---

### V2-P2.5 — Concept relationships (§10.2)

**What was implemented**

- The adapter now emits a connective edge for every concept mapping
  (`assignment → concept`), derived from the canonical `concept.assignments`
  arrays. No concept node can float without an intentional relationship in any
  assignment-bearing view.
- Track-view dimming was extended so connective edges stay bright while their
  assignment endpoint is in the selected track.

**Files changed**

- `src/components/map/adapter.ts` (connective concept edges)
- `src/components/map/map-client.ts` (connective edge style + track dimming)

**Phase + task reference**

- V2 Phase 2 §10.2 "Connect concept nodes correctly".

**Assumptions made**

- Concept relationships are expressed as `assignment → concept` edges matching
  the canonical concept mapping (58 instances); they render subordinate to
  dependency edges (thin, gold, low opacity, no arrowhead).

---

### V2-P2.6 — Default artifact visibility (§11)

**What was implemented**

- Artifacts are now visible on initial load: the default view shows all 11
  artifacts linked to the anchor assignments, plus assignment → artifact
  connective edges. The `concepts` filter still hides artifacts; the tier and
  primary filters are unchanged.

**Files changed**

- `src/components/map/adapter.ts` (artifact visibility + connective artifact
  edges)
- `src/components/map/map-client.ts` (artifact edge style)

**Phase + task reference**

- V2 Phase 2 §11 "Show artifacts by default".

**Assumptions made**

- "Visible by default" is implemented as "any artifact linked to a visible
  assignment" (all 11 in the default anchor view); artifacts remain visually
  subordinate (small markers, dotted grey connective edges).

---

### V2-P2.7 — Expandable homepage graph (§13)

**What was implemented**

- Added an "Expand map / Collapse map" control to the map controls. It toggles
  `.map-section.is-expanded`, collapsing the adjacent context panel so the
  graph takes the full container width and gains vertical room (stage height
  560px → 760px). The existing ResizeObserver re-fits the graph after the
  layout change.

**Files changed**

- `src/components/LearningMap.astro` (expand control + expanded stage height)
- `src/components/map/map-client.ts` (toggle handler)
- `src/pages/index.astro` (expanded grid + hidden intro styles)

**Phase + task reference**

- V2 Phase 2 §13 "Make the homepage map preview collapsible".

**Assumptions made**

- The "adjacent information panel" is the homepage hero/intro column
  (`.map-section__intro`); collapsing it gives the graph the full container
  width while preserving the Systems Atlas visual language.

---

### V2-P2.8 — Phase 2 verification and test suite (complete)

**What was implemented**

- Added `tests/v2-phase2.spec.ts` covering the Phase 2 acceptance criteria
  (descriptors, hover tooltip, legend, arrowheads, concept connectivity, default
  artifact visibility + filterability, and expand/collapse).
- Updated `tests/adapter.spec.ts` and `tests/map.spec.ts` for the new default
  graph state (artifacts + connective edges: default 80 edges, browse-all 131).
- Ran and passed data validation, Astro type-check, static build, and the Node
  adapter suite (see `docs/HANDOFF_V2.md` for exact results).

**Files changed**

- `tests/v2-phase2.spec.ts` (new)
- `tests/adapter.spec.ts`, `tests/map.spec.ts` (updated counts)
- `docs/CHANGELOG_V2.md` (this file)

**Phase + task reference**

- V2 Phase 2 acceptance criteria and the "verification steps and tests"
  requirement of the execution rules.

**Assumptions made**

- The full Chromium Playwright browser suite could not execute in this sandbox
  (blocked browser download, same limitation recorded in Phase 1); the suite is
  authored and included, and the adapter suite that runs without a browser
  passes 10/10.

---

## V2 Phase 1 — Embed fallback regression guard (complete)

**What was implemented**

- Restored the evidence-status text inside the embed fallback card in
  `ArtifactPreview.astro`. This keeps the existing Phase 3 “embed failure
  drill” contract intact while preserving the new `Show evidence` preview state.

**Files changed**

- `src/components/ArtifactPreview.astro`

**Phase + task reference**

- V2 Phase 1 §4 and existing V1 Phase 3 §57 fallback regression.

**Assumptions made**

- The fallback remains visible until the visitor explicitly reveals the heavy
  asset, and still exposes the open/pending artifact control plus status text.

---

## V2 Phase 1 — Handoff document (complete)

**What was implemented**

- Added `docs/HANDOFF_V2.md`: Phase 1 summary, verification results, what is
  complete, what is intentionally incomplete, and the owner placeholder list.

**Files changed**

- `docs/HANDOFF_V2.md` (new)

**Phase + task reference**

- V2 final handoff requirement.

**Assumptions made**

- The full Chromium Playwright suite could not execute in this sandbox due a
  blocked browser download; this is recorded explicitly rather than hidden.

---

## V2 Phase 1 — Structural interaction

### V2-P1.1 — Assignment modal from assignment cards (complete)

**What was implemented**

- `AssignmentModal.astro` — a native `<dialog>` shell rendered by the Base
  layout. It is harmless on pages without assignment cards but is present on
  every page so assignment clicks always have a host.
- `src/scripts/assignment-modal.ts` — global client logic that intercepts
  `[data-assignment-card]` clicks, prevents navigation, and fetches the existing
  static `/work/[slug]` route. The existing `<main>` is injected into the modal,
  along with any missing scoped `<style>` assets, so the pop-up is the existing
  assignment page placed above the current page.
- Assignment cards retain their real `href` (`/work/[id]/`) for no-JS, direct
  links, and SEO. With JavaScript off the archive continues to navigate to the
  static page; with JavaScript on the default card interaction is modal.
- Modal behaviour: ESC close (native dialog), explicit close control, focus
  restore to the triggering card, independent scroll inside the modal, and
  `document.body` scroll lock that preserves the existing scroll position.
- Links inside the modal pointing at `/work/*/` open the next assignment in the
  same modal instead of navigating the underlying page.

**Files changed**

- `src/components/AssignmentModal.astro` (new)
- `src/scripts/assignment-modal.ts` (new)
- `src/components/AssignmentCard.astro` (data attributes + click hook)
- `src/layouts/Base.astro` (import and render the modal host)

**Phase + task reference**

- V2 Phase 1, section §2 “Convert assignment pages into assignment pop-ups”.

**Assumptions made**

- A native `<dialog>` is the lightest platform-accessible modal primitive; no
  UI framework was introduced.
- Fetching the existing static route keeps one canonical source of assignment
  markup (the server-rendered `/work/[slug]` page) rather than duplicating the
  detail content in the client.
- The existing assignment routes remain valid and are not removed.

---

### V2-P1.2 — Two-column assignment layout and evidence panel (complete)

**What was implemented**

- `EvidencePanel.astro` (new) — an always-present evidence area for every
  assignment: `Evidence` heading, evidence-status text, a short preview note,
  and the assignment’s proof items.
- `DetailPanel.astro` rewritten as a desktop two-column composition:
  - left column: assignment title, task/lesson/takeaway, connections, and
    secondary metadata;
  - right column: the evidence panel.
- The layout collapses to a single column at `<= 900px` so mobile and narrow
  laptop widths do not overflow.
- The static `/work/[slug]` pages and the modal both use the same
  `DetailPanel`, so they render identically in and out of the modal.

**Files changed**

- `src/components/EvidencePanel.astro` (new)
- `src/components/DetailPanel.astro` (rewritten layout)
- `src/components/ArtifactPreview.astro` (used as the evidence item renderer)

**Phase + task reference**

- V2 Phase 1, §3 “Redesign assignment modal into two-column evidence layout”.

**Assumptions made**

- The “Proof” section is renamed `Evidence` in the right-hand panel because it
  is now the dedicated evidence area; the content/status copy remains honest and
  data-driven.
- No background decoration, gradient, or new card style was added; the panel is
  a bordered technical panel consistent with Systems Atlas.

---

### V2-P1.3 — Lazy evidence loading on demand (complete)

**What was implemented**

- `ArtifactPreview.astro` now renders evidence in a preview state and exposes a
  text `Show evidence` control.
- The heavy viewer is created only when the visitor chooses `Show evidence`:
  - `video` artifacts create a `<video controls>` element;
  - `pdf`/`live`/embeddable artifacts create a lazy `<iframe>`;
  - artifacts without a supplied URL reveal an honest “evidence URL pending”
    message — never a fake embed or an empty box.
- No iframe/video/object exists in the initial HTML of any page or modal. This
  supersedes the previous viewport-based IntersectionObserver auto-load for
  heavy evidence.
- Every evidence card also carries a preview thumbnail placeholder (or a real
  preview image when supplied), an artifact title/type/description, and the
  evidence status text.

**Files changed**

- `src/components/ArtifactPreview.astro` (rewritten preview + evidence-reveal
  states)
- `src/scripts/assignment-modal.ts` (global `[data-show-evidence]` activation
  handler so modal-injected evidence also lazy-loads)
- `src/components/EvidencePanel.astro`, `src/components/DetailPanel.astro`
  (evidence panel wiring)

**Phase + task reference**

- V2 Phase 1, §4 “Lazy-load assignment evidence”.

**Assumptions made**

- No real artifact URLs/screenshots exist in the data registry, so the initial
  state always starts as the honest `partial`/pending preview; the on-demand
  machinery is fully wired so adding URLs activates real PDF/video/live embeds
  without component changes.
- Notebook previews remain the intended non-iframe contained viewer and do not
  need an extra heavy-asset step beyond their existing cached content.

---

### V2-P1.4 — Canonical assignment-card typography normalization (complete)

**What was implemented**

- Added a single canonical set of card typography tokens to
  `src/styles/global.css`:
  - `--fs-card-label`
  - `--fs-card-title`
  - `--fs-card-description`
  - `--fs-card-metadata`
  - `--fs-card-status`
  - `--fs-card-action`
- `AssignmentCard.astro` now uses these tokens for label, metadata, and title.
  Tier weighting is expressed with contrast/opacity/border only — no per-tier
  font-size overrides.
- `ArtifactPreview.astro` uses the same tokens for description, status, and
  action text so evidence cards inherit the same hierarchy.

**Files changed**

- `src/styles/global.css` (V2 card typography tokens)
- `src/components/AssignmentCard.astro` (token usage + tier weighting)
- `src/components/ArtifactPreview.astro` (token usage for evidence/status/CTA)

**Phase + task reference**

- V2 Phase 1, §5 “Standardize assignment-card typography”.

**Assumptions made**

- “Single canonical system” is interpreted as one token set for semantic roles
  across assignment cards and evidence cards; content length is handled by
  layout/line wrapping rather than per-card font tuning.

---

### V2-P1.5 — Phase 1 verification and test suite (complete)

**What was implemented**

- `tests/v2-phase1.spec.ts` (new) covering the Phase 1 acceptance criteria:
  - assignment card opens a modal without URL navigation;
  - modal contains the complete assignment + evidence panel;
  - background scroll position is preserved and ESC closes with focus return;
  - close control closes the modal;
  - no heavy viewer exists in initial modal HTML and `Show evidence` keeps the
    honest pending state when no asset URL is supplied;
  - all assignment cards share one label/title font-size;
  - static detail page renders the two-column evidence layout.
- Ran and passed the existing build/data/type verification and the Node adapter
  suite (see `docs/HANDOFF_V2.md` for exact results).

**Files changed**

- `tests/v2-phase1.spec.ts` (new)
- `docs/CHANGELOG_V2.md` (this file)

**Phase + task reference**

- V2 Phase 1 acceptance criteria and the “verification steps and tests”
  requirement of the execution rules.

**Assumptions made**

- The V2 spec defines acceptance criteria rather than an explicit test runner
  contract, so the new suite maps those criteria to Playwright checks and is
  added to the existing Playwright project.
- Playwright browser installation can be environment-dependent; the suite is
  included and documented in the handoff even where a sandbox cannot download
  the Chromium binary.
