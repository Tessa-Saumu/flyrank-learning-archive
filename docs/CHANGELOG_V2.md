# V2 Changelog

All V2 implementation work in one place, tracked against
`docs/V2_IMPROVEMENT_SPEC.md`. Entries are ordered newest-first. Each entry
records what was implemented, files changed, the Phase + task reference, and any
assumptions made.

---

## V2 Phase 3 — Navigation

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
