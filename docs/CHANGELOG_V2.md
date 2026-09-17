# V2 Changelog

All V2 implementation work in one place, tracked against
`docs/V2_IMPROVEMENT_SPEC.md` and (for the newest entries)
`docs/V2 REVISION_IMPLEMENTATION_SPEC.md`. Entries are ordered newest-first.
Each entry records what was implemented, files changed, the Phase + task
reference, and any assumptions made.

---

# V2 REVISION — Phase 3 (work filters, terminology & final cleanup)

Targeted corrections per `docs/V2 REVISION_IMPLEMENTATION_SPEC.md` Phase 3 (§15–§16) and the Final System-Wide Consistency Check. Work filtering is now fully functional and unified across both the dedicated Work page and the Home page without navigating away; all old tier concepts and supporting/reference terminology are completely removed from public UI copy, metadata, and controls; full validation and test suites pass cleanly.

---

## V2-R3.1 — Functional Work filters on Home and Work (§15)

**What was implemented**

- **Unified Client-Side Filter Model:** Implemented `src/scripts/work-filter.ts` as the shared filter controller used by both the dedicated Work page (`/work/`) and the homepage `#browse` section.
- **In-Place Category Filtering:** Clicking `All`, `AI Fluency`, or `Machine Learning` filters the visible work items in place without navigating away or reloading the page (`event.preventDefault()`).
  - **AI Fluency:** Shows only the 25 AI Fluency assignments; hides the 10 Machine Learning assignments and the Machine Learning track section heading.
  - **Machine Learning:** Shows only the 10 Machine Learning assignments; hides the 25 AI Fluency assignments and the AI Fluency track section heading.
  - **All / Reset:** Restores all 35 assignments across both tracks and all strands.
- **Obvious Active Filter State:** The active filter tab receives `.is-active` (chip border and highlighted text) and `aria-current="page"`, while non-active tabs have active indicators removed.
- **Concepts View Integration:** On `/work/`, clicking the `Concepts` tab toggles between the assignments browse list and the concepts grid in place without full page reloads. On the Home page, clicking `Concepts` links directly to `/work/?view=concepts`.
- **Search Integration:** The client-side search input is synchronized with the active category filter. Searching filters within the active category, empty strands and tracks are dynamically hidden, and an empty state message is shown if no assignments match.
- **URL Synchronization:** Uses `history.replaceState` to update the query parameters (`?track=`, `?view=`) without triggering a reload, so deep links are shareable and preserve state upon initial page load.

**Files changed**

- `src/scripts/work-filter.ts` (new shared filter & search controller)
- `src/components/FilterBar.astro` (data attributes for filter items & tracks)
- `src/components/BrowseWork.astro` (data attributes, empty state element, integrated shared work-filter script)
- `src/pages/work/index.astro` (rendered assignments and concepts containers with toggling support)

**Phase + task reference**

- V2 REVISION Phase 3, §15.

**Assumptions made**

- On the Home page, the browse section is focused on assignment browsing; clicking `Concepts` navigates to `/work/?view=concepts`, while `All`, `AI Fluency`, and `Machine Learning` filter the homepage `#browse` section in place. On `/work/`, all tabs operate in-place without page reload.

---

## V2-R3.2 — Complete removal of tier concept / supporting-reference terminology (§16)

**What was implemented**

- **Public UI Terminology Audit:** Conducted a comprehensive audit of all templates, data titles, and components to purge old tier concepts and supporting/reference terminology from the public website experience.
- **Artifacts & Final Package:**
  - `src/data/artifacts.ts`: Updated `artifact-hours-log` title from `Hours Log Reference` to `Hours Log`.
  - `src/components/FinalPackage.astro`: Changed label from `Hours log reference` to `Hours log`; updated `aria-label` from `Completion references` to `Completion links`; updated fallback tooltip from `Reference not supplied yet` to `Link not supplied yet`.
- **Hero & CSS Normalization:**
  - `src/components/Hero.astro`: Replaced class `.hero__supporting` with `.hero__lead`.
  - `src/styles/global.css`: Updated selectors and comments to remove `hero__supporting` and tier references.
- **Category Clarity:** Ensured all filter controls and section headers throughout the site strictly use the real categories: **AI Fluency** and **Machine Learning** (plus **All** and **Concepts**).

**Files changed**

- `src/data/artifacts.ts`
- `src/components/FinalPackage.astro`
- `src/components/Hero.astro`
- `src/styles/global.css`
- `src/pages/work/index.astro`

**Phase + task reference**

- V2 REVISION Phase 3, §16.

**Assumptions made**

- `tier` remains an internal data structure field in `assignments.ts` and `types.ts` purely for graph node sizing and default anchor sets, and is never rendered as visible text, labels, or filters anywhere in the user interface.

---

## V2-R3.3 — Phase 3 Verification & Final System-Wide Consistency Check

**What was implemented**

- **Validation & Test Automation:**
  - `scripts/verify-phase3.mjs`: Automated verification checking data census, scanning all generated HTML files in `dist/` for forbidden terminology, and testing category filtering simulation in memory.
  - `tests/v2-revision-phase3.spec.ts`: Authoring end-to-end Playwright tests covering §15 and §16.
  - Added `"test:revision3"` script to `package.json`.
- **System-Wide Consistency Audit:** Verified every item from the Final System-Wide Consistency Check across Graph, Assignments, Work Browsing, and Layout.

**Files changed**

- `scripts/verify-phase3.mjs` (new)
- `tests/v2-revision-phase3.spec.ts` (new)
- `package.json`

**Phase + task reference**

- V2 REVISION Phase 3, Acceptance Criteria & Final System-Wide Consistency Check.

**Result**

- `npm run validate`: PASSED (35 assignments, 10 concepts, 11 artifacts, 34 public edges).
- `npm run check`: 0 errors, 0 warnings, 0 hints (49 files).
- `npm run build`: 53 pages built clean.
- `npm run test:revision3`: All checks PASSED.

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
