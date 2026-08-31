# V2 Handoff

This handoff records the state of the **V2 improvement work** after completing
**all four phases** of `docs/V2_IMPROVEMENT_SPEC.md`: Phase 1 — Structural
interaction, Phase 2 — Knowledge Graph, Phase 3 — Navigation, and
Phase 4 — QA.

---

## 1. Summary of work completed (by phase)

### Phase 1 — Structural interaction (complete)

| Spec section | Work completed |
| :--- | :--- |
| §2 Assignment pop-ups | Assignment cards open an in-context `<dialog>` modal by default. The modal is hosted by the Base layout and driven by `src/scripts/assignment-modal.ts`. It fetches the existing static `/work/[id]/` route and injects the same `<main>` content (+ its scoped assets), so the pop-up is the existing assignment page placed above the current page. Existing `/work/[id]/` routes remain valid for no-JS/direct linking. ESC, explicit close, focus restore, background scroll lock, and independent modal scrolling are implemented. |
| §3 Two-column evidence layout | `DetailPanel.astro` renders assignment content in a left column and the evidence panel in a right column on desktop; it collapses to one column at `<=900px`. `EvidencePanel.astro` provides the dedicated evidence area for every assignment. |
| §4 Lazy evidence loading | `ArtifactPreview.astro` shows a preview thumbnail, artifact type/title/description, evidence status, and a `Show evidence` control. The heavy viewer (lazy `<iframe>` for PDF/live, `<video>` for video) is created only after the visitor clicks the control. No iframe/video/object exists in the initial HTML of any page. |
| §5 Card typography normalization | A single canonical V2 assignment-card typography token set in `src/styles/global.css`. `AssignmentCard.astro` and `ArtifactPreview.astro` use these tokens; tier weighting is expressed with contrast/opacity/border, never per-card font size overrides. |
| Tests | `tests/v2-phase1.spec.ts` (7 tests). |

### Phase 2 — Knowledge Graph (complete)

| Spec section | Work completed |
| :--- | :--- |
| §7 Node descriptors | Required `descriptor` field on `Assignment`, populated for all 35 assignments; the adapter maps it into the node `label`. **Phase 3 verification surfaced that the stylesheet never rendered the label** (`label: 'data(label)'` was missing) — fixed during Phase 3, with a rendered-label assertion added to the §7 test so it cannot silently regress. |
| §8 Hover information | DOM tooltip with full canonical title + short description; clamped to the region, flips near edges, re-anchors on pan/zoom. **Phase 3 pre-flight fixed a lingering-tooltip defect** (tooltip now also clears on the stage's DOM `mouseleave`). |
| §9 Interaction instructions | Compact legend: "Explore the map — Scroll/pinch to zoom · Drag to pan · Click a node to open · Esc to close". |
| §10.1 Arrowheads | Directional edges (`builds-on`, `connects-to`, `cross-track`) render visible triangle arrowheads; connective membership edges stay undirected. |
| §10.2 Concept relationships | The adapter emits `assignment → concept` connective edges for all 58 canonical concept mappings; no orphan concept nodes in any assignment-bearing view. |
| §11 Default artifact visibility | All 11 artifacts and their connective edges are visible in the default view; the `Concepts` filter still hides them. |
| §13 Expandable homepage graph | `Expand map / Collapse map` control collapses the context panel and gives the graph the full container width; since Phase 3, expanding also re-fits the graph so it genuinely uses the gained space. |
| Tests | `tests/v2-phase2.spec.ts` (7 tests, now including the rendered-label guard). |

### Phase 3 — Navigation (complete — this session)

| Spec section | Work completed |
| :--- | :--- |
| §1 Section/tab hierarchy | Two-level typographic hierarchy driven by tokens (`--fs-nav`, `--fs-nav-secondary`, `--fs-tab` in `global.css`), spacing, grouping, and active state only — no decorative containers, gradients, or shadows. Header: primary sections (MAP · WORK · FRAMEWORK · REFLECTION) use the heading family at `--fs-nav`/600; the track links are a labelled (`TRACKS` kicker), tighter, lighter cluster. Filter bars (`FilterBar.astro`, map controls): primary tabs are `--fs-tab`/600 with the chip active state; tier tabs are a labelled (`TIER` kicker), lighter (weight 400) cluster with a thin-underline active state. `.section-label` steps up to `--fs-nav`/`--text-dim` so page sections read one level above their tabs. |
| §6 Laptop navigation scale | V1 rendered all nav labels at 9 px on a 1280–1440 px laptop (`--fs-metadata`). Primary nav is now 12.2–13.7 px at laptop widths (`clamp(12px, 0.95vw, 14px)`), track links `clamp(10px, 0.75vw, 12px)`, with more inter-item air at `min-width: 1024px`. The 64 px bar, sticky behaviour, structure, and ≤900 px wrap behaviour are unchanged. |
| §12 Move `Explore the Map` CTA | The hero's `Explore the map` button (beside the map preview) was removed; the hero keeps a single `Browse the work` CTA. A new CTA block closes the homepage work section ("Seen the work? Explore how all of it connects." + `Explore the map`). The journey is now Hero → map preview → assignments → Explore the Map. Clicking navigates to `#map` and, with JS, expands the map into the full-width graph experience via the shared §13 `setExpanded` path; without JS it is a plain working anchor. |
| Tests | `tests/v2-phase3.spec.ts` (8 tests covering all §1/§6/§12 acceptance criteria, including the no-JS fallback). |

### Phase 4 — QA (complete — this session)

| Spec section | Work completed |
| :--- | :--- |
| §14 ARIA | `aria-pressed` removed from the tier filter `<a>`s. The links genuinely must stay links (server-rendered, no-JS filtering, shareable `/work/?tier=…` URLs — the spec's sanctioned alternative to buttons); the active tier is conveyed with `aria-current="true"`, which is valid on links. Axe `aria-allowed-attr`: clear. |
| §15 Contrast | AA-safe text accents `--green-text: #569478` and `--terracotta-text: #c47a5e` (≥5.0:1 on both `--bg` and `--bg-elevated`) replace the base accents in all 21 text usages; borders/fills/graph strokes keep the original palette. `--text-faint` 0.5 → 0.56 alpha (the #7f807b 4.49:1 failure → ~5.3:1). The reference-card whole-card `opacity: 0.72` (which composited track meta to #3c6956 = 2.97:1) was replaced with fainter border + dim text tokens. The spec's flag on `#4D8A70` was confirmed by measurement (4.41:1 on elevated at small sizes) and resolved via `--green-text`. Axe `color-contrast`: clear on every audited page. |
| §16 Reflection overflow | The exact overflowing element was identified by measurement — the convergence diagram (nowrap five-column grid, scrollWidth 400 at 375 px). It restacks vertically below 560 px; structure retained; **0 px** document overflow at 375 px; no global `overflow-x: hidden`. |
| §17 Regression | Full suite **55/55**; validate/check/build clean; final visual review at 1366×768 and 375×720 (see §2 below). |

---

## 2. How correctness was verified

### Automated checks executed in this repository (this session)

| Check | Result |
| :--- | :--- |
| `npm run validate` | **Passed** — 35 assignments / 10 concepts / 11 artifacts / 34 public edges, no violations. |
| `npm run check` (`astro check`) | **Passed** — 0 errors, 0 warnings, 0 hints. |
| `npm run build` | **Passed** — 53 pages built. |
| Full Playwright suite (55 tests) | **55 passed / 0 failed** after Phase 4. |

Unlike the Phase 1/2 sessions (browser CDN blocked), this session ran the
**complete browser suite** against a locally vendored Chromium via the new
opt-in `PW_CHROMIUM_EXECUTABLE` hook in `playwright.config.ts`:

```bash
PW_CHROMIUM_EXECUTABLE=/path/to/chromium npx playwright test
# or, on a normal machine:
npx playwright install chromium && npm test
```

### Suite-by-suite results

| Suite | Result | Notes |
| :--- | :--- | :--- |
| `tests/adapter.spec.ts` | **10/10** | Adapter unit tests. |
| `tests/map.spec.ts` | **11/11** | Map interaction. |
| `tests/phase3.spec.ts` (V1 QA) | **7/7** | Includes the 375 px overflow check — green after §16. |
| `tests/v2-phase1.spec.ts` | **7/7** | Modal / evidence / typography. |
| `tests/v2-phase2.spec.ts` | **7/7** | Includes the rendered-label guard. |
| `tests/v2-phase3.spec.ts` | **8/8** | Navigation phase. |
| `tests/axe.spec.ts` | **5/5** | **0 critical/serious axe violations** on home+map, work index, detail, reflection, framework after §14/§15. |

This meets the spec's §17 V2 target table: all Playwright suites green
(the V1 "33/33" baseline has since grown to 55 tests), adapter 10/10, map
11/11, V1 QA 7/7, **0 axe violations, 0 mobile overflow**, design review
passed (visual checks below).

### Manual/visual checks

- Laptop (1366×768) screenshots of the homepage, work index, end-of-section
  CTA, and the expanded graph were reviewed: header hierarchy reads at a
  glance, tier clusters read as subordinate, CTA closes the work section, and
  the expanded graph fills the container with labels and arrowheads visible.
- Phase 4 visual review: reference-tier cards still recede (fainter border,
  dim code/title) without the AA-breaking opacity; accent text is one step
  brighter but the palette reads unchanged; the reflection convergence
  diagram stacks cleanly at 375 px (measured 0 px document overflow).
- Mobile 375 px: no horizontal overflow on `/`, `/work/`, `/framework/`, or
  `/reflection/`.
- No-JS: browse route intact, CTA anchors to `#map`, map fallback unchanged,
  tier filter links still work (they are the reason §14 kept them as links).

### Regression fixes made during Phase 3 verification

1. Tooltip could linger when the pointer left the canvas in one jump (Phase 2
   §8 acceptance) — fixed via stage `mouseleave` cleanup.
2. Node descriptors were present in data but never rendered (Phase 2 §7
   acceptance) — fixed via `label: 'data(label)'` in the base node style and
   guarded by a new assertion in the §7 test.

---

## 3. What is fully complete

- **V2 Phase 1** (modal, two-column layout, evidence panel, lazy evidence,
  card typography) — implemented and 7/7 green in a real browser run.
- **V2 Phase 2** (descriptors, hover, legend, arrowheads, concept
  relationships, default artifacts, expandable graph) — implemented, two
  latent defects fixed, 7/7 green in a real browser run.
- **V2 Phase 3** (section/tab hierarchy, laptop navigation scale, moved
  `Explore the Map` CTA) — implemented and 8/8 green.
- **V2 Phase 4** (valid ARIA, WCAG AA contrast, reflection mobile overflow,
  full regression, final visual review) — implemented; the entire 55-test
  suite is green including 5/5 axe audits.
- Data validation, Astro type-checking, and the static build all pass.
- `docs/CHANGELOG_V2.md` documents every V2 step, files changed, phase/task
  references, and assumptions.

---

## 4. What is intentionally incomplete or requires real artifacts/inputs

**All four phases of `docs/V2_IMPROVEMENT_SPEC.md` are implemented.** Nothing
in the spec's scope remains open.

**Requires real author inputs:**

- Real artifact URLs (portfolio, ML paper, agent, repos, README, demo video,
  workflow, build-in-public post, hours log, retrospective).
- Real preview screenshots for artifacts/notebooks.
- Final retrospective wording (currently the editable 500–800 word draft).
- A real Netlify/deployment target for launch.

---

## 5. Exact list of placeholders that need to be filled by the owner

Source of truth: `src/data/artifacts.ts`, `src/data/notebooks.ts`, and
`src/data/reflection.ts`.

| Placeholder | File / location | Notes |
| :--- | :--- | :--- |
| `artifact-ml-repo` URL | `src/data/artifacts.ts` | Machine Learning GitHub repository. |
| `artifact-ml-paper` URL | `src/data/artifacts.ts` | Deployed ML research paper. |
| `artifact-portfolio-site` URL | `src/data/artifacts.ts` | Public portfolio site. |
| `artifact-personal-agent` URL | `src/data/artifacts.ts` | Runnable/demo URL for the personal agent. |
| `artifact-agent-readme` URL | `src/data/artifacts.ts` | Agent README URL. |
| `artifact-agent-demo-video` URL | `src/data/artifacts.ts` | Agent demo video URL. |
| `artifact-automation-workflow` URL | `src/data/artifacts.ts` | Automation workflow walkthrough URL. |
| `artifact-build-in-public-post` URL | `src/data/artifacts.ts` | Build-in-public post URL. |
| `artifact-hours-log` URL | `src/data/artifacts.ts` | Hours log reference URL (may stay private/pending). |
| `artifact-final-retrospective` URL | `src/data/artifacts.ts` | Final retrospective reference URL. |
| `artifact-learning-archive` URL | `src/data/artifacts.ts` | This archive's canonical public URL. |
| Node descriptors (V2 §7) | `src/data/assignments.ts` (`descriptor`) | Derived short labels; owner may refine wording. |
| Notebook charts / metrics / code | `src/data/notebooks.ts` | Real ML notebook evidence, if supplied. |
| Final retrospective wording | `src/data/reflection.ts` | Replace with the author's own 500–800 word version. |
| Deployment target | Netlify / hosting | Confirm actual deployment site/CI. |

---

## 6. Commit / branch

All Phase 3 and Phase 4 changes are committed to the session branch
`arena/01a057ea-flyrank-learning-archive` (this Arena session is fixed to
that branch; it fast-forwards from `feat/v2-phase2` and is the intended
source for `feat/v2-phase3` / `feat/v2-phase4` branches or a PR). The
committed working set includes the Phase 3 + Phase 4 code, the test suites,
`docs/CHANGELOG_V2.md`, and this handoff.
