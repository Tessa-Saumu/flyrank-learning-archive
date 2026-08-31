# V2 Changelog

All V2 implementation work in one place, tracked against
`docs/V2_IMPROVEMENT_SPEC.md`. Entries are ordered newest-first. Each entry
records what was implemented, files changed, the Phase + task reference, and any
assumptions made.

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
