# V2 Handoff

This handoff records the state of the **V2 improvement work** after completing
**Phase 1 — Structural interaction**, **Phase 2 — Knowledge Graph**, and
**Phase 3 — Navigation** of `docs/V2_IMPROVEMENT_SPEC.md`.

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

---

## 2. How correctness was verified

### Automated checks executed in this repository (this session)

| Check | Result |
| :--- | :--- |
| `npm run validate` | **Passed** — 35 assignments / 10 concepts / 11 artifacts / 34 public edges, no violations. |
| `npm run check` (`astro check`) | **Passed** — 0 errors, 0 warnings, 0 hints. |
| `npm run build` | **Passed** — 53 pages built. |
| Full Playwright suite (55 tests) | **49 passed / 6 failed — all 6 are documented V2 Phase 4 scope** (see below). |

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
| `tests/phase3.spec.ts` (V1 QA) | **6/7** | Only failure: `/reflection/` 375 px overflow — V2 §16, Phase 4 scope. |
| `tests/v2-phase1.spec.ts` | **7/7** | Modal / evidence / typography. |
| `tests/v2-phase2.spec.ts` | **7/7** | Includes the new rendered-label guard. |
| `tests/v2-phase3.spec.ts` | **8/8** | New this session. |
| `tests/axe.spec.ts` | **0/5** | Failures are exactly V2 §14 (`aria-allowed-attr` from `aria-pressed` on tier `<a>`s) and §15 (contrast pairs `#3c6956/#101312`, `#7f807b/#151817`, `#b9664e/#151817`) — Phase 4 scope, signatures identical before and after Phase 3 (no new violations introduced). |

### Manual/visual checks

- Laptop (1366×768) screenshots of the homepage, work index, end-of-section
  CTA, and the expanded graph were reviewed: header hierarchy reads at a
  glance, tier clusters read as subordinate, CTA closes the work section, and
  the expanded graph fills the container with labels and arrowheads visible.
- Mobile 375 px: header wraps as before; homepage and `/work/` show no
  horizontal overflow (`/reflection/` remains the known §16 item).
- No-JS: browse route intact, CTA anchors to `#map`, map fallback unchanged.

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
- Data validation, Astro type-checking, and the static build all pass.
- `docs/CHANGELOG_V2.md` documents every V2 step, files changed, phase/task
  references, and assumptions.

---

## 4. What is intentionally incomplete or requires real artifacts/inputs

**Not yet implemented (remaining V2 phase, per the spec's §18 order):**

- **Phase 4 — QA:**
  - §14 ARIA fix (tier filter `aria-pressed` on `<a>` → real `<button>`s or
    proper semantics). Deliberately untouched in Phase 3 even while editing
    `FilterBar.astro`, to keep the phase boundary clean.
  - §15 contrast fixes (`#3c6956/#101312` 2.97:1, `#7f807b/#151817` 4.49:1,
    `#b9664e/#151817` 4.31:1; re-evaluate `#4D8A70` at small sizes).
  - §16 `/reflection/` mobile overflow at 375 px.
  - §17 full regression to the 33/33-equivalent target + final visual review.
  - The 6 currently failing tests (5 axe + 1 mobile overflow) are the exact
    executable acceptance criteria for that phase.

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

All Phase 3 changes are committed to the session branch
`arena/01a057ea-flyrank-learning-archive` (this Arena session is fixed to that
branch; it fast-forwards from `feat/v2-phase2` and is the intended source for
a `feat/v2-phase3` branch/PR if desired). The committed working set includes
the Phase 3 code, `tests/v2-phase3.spec.ts`, the Phase 2 regression fixes,
`docs/CHANGELOG_V2.md`, and this handoff.
