# V2 Handoff

This handoff records the state of the **V2 improvement work** after completing
**Phase 1 — Structural interaction** and **Phase 2 — Knowledge Graph** of
`docs/V2_IMPROVEMENT_SPEC.md`.

---

## 1. Summary of work completed

### Phase 1 — Structural interaction (complete)

| Spec section | Work completed |
| :--- | :--- |
| §2 Assignment pop-ups | Assignment cards open an in-context `<dialog>` modal by default. The modal is hosted by the Base layout and driven by `src/scripts/assignment-modal.ts`. It fetches the existing static `/work/[id]/` route and injects the same `<main>` content (+ its scoped assets), so the pop-up is the existing assignment page placed above the current page. Existing `/work/[id]/` routes remain valid for no-JS/direct linking. ESC, explicit close, focus restore, background scroll lock, and independent modal scrolling are implemented. |
| §3 Two-column evidence layout | `DetailPanel.astro` renders assignment content in a left column and the evidence panel in a right column on desktop; it collapses to one column at `<=900px`. `EvidencePanel.astro` provides the dedicated evidence area for every assignment. |
| §4 Lazy evidence loading | `ArtifactPreview.astro` shows a preview thumbnail, artifact type/title/description, evidence status, and a `Show evidence` control. The heavy viewer (lazy `<iframe>` for PDF/live, `<video>` for video) is created only after the visitor clicks the control. No iframe/video/object exists in the initial HTML of any page. |
| §5 Card typography normalization | A single canonical V2 assignment-card typography token set was added to `src/styles/global.css`. `AssignmentCard.astro` and `ArtifactPreview.astro` use these tokens; tier weighting is expressed with contrast/opacity/border, never per-card font size overrides. |
| Tests & verification | Added `tests/v2-phase1.spec.ts` covering the Phase 1 modal/evidence/typography acceptance criteria. |

### Phase 2 — Knowledge Graph (complete)

| Spec section | Work completed |
| :--- | :--- |
| §7 Node descriptors | Every assignment node now renders a short, human-readable descriptor (e.g. `Ship the Paper`, `Validate the Claim`, `Survive the Crit`) instead of a bare code. A required `descriptor` field was added to the `Assignment` model and populated for all 35 assignments; the map adapter uses it as the node label. |
| §8 Hover information | Hovering a node shows a tooltip with the full canonical title + short description (the canonical `task` copy). The tooltip is clamped to the region, flips near the top edge, re-anchors on pan/zoom, and hides on mouse-out. |
| §9 Interaction instructions | A compact legend under the controls explains the real controls: "Scroll/pinch to zoom · Drag to pan · Click a node to open · Esc to close". |
| §10.1 Arrowheads | Directional edges (`builds-on`, `connects-to`, `cross-track`) render clearly visible triangle arrowheads; connective concept/artifact edges stay undirected (membership, not flow). |
| §10.2 Concept relationships | The adapter now emits `assignment → concept` connective edges for all 58 canonical concept mappings, so no concept node floats without an intentional relationship in any assignment-bearing view. |
| §11 Default artifact visibility | Artifacts are visible by default: the default view shows all 11 artifacts linked to the anchor assignments plus their `assignment → artifact` connective edges. The `Concepts` filter still hides them. |
| §13 Expandable homepage graph | An "Expand map / Collapse map" control collapses the adjacent context panel, giving the graph the full container width and a taller stage; the map re-fits automatically. |
| Tests & verification | Added `tests/v2-phase2.spec.ts`; updated `tests/adapter.spec.ts` and `tests/map.spec.ts` for the new default graph state. |

---

## 2. How correctness was verified

### Automated checks executed in this repository

| Check | Result |
| :--- | :--- |
| `npm run validate` | **Passed** — data census 35 assignments / 10 concepts / 11 artifacts / 34 public edges; no validation violations. |
| `npm run check` (`astro check`) | **Passed** — 47 files, **0 errors, 0 warnings, 0 hints**. |
| `npm run build` | **Passed** — static production build, **53 pages built**. |
| `npm run test:adapter` | **Passed** — **10/10** adapter unit tests (updated for the new default/browse-all edge counts). |

### Static/manual checks against the built `dist/`

- The built homepage contains the expand control (`data-map-expand`), the
  legend (`data-map-legend`), and the hover tooltip (`data-map-tooltip`), with
  `Expand map` / `Explore the map` copy present.
- The bundled map client contains the tooltip positioning
  (`renderedPosition`), the expand toggle (`Collapse map`), and the arrowhead
  styles (`target-arrow-shape`).
- The built homepage still ships **zero `<iframe>`** in initial HTML (lazy
  evidence loading regression guard intact).

### Adapter-level assertions (deterministic, no browser)

Default view: 19 assignments / 10 concepts / 11 artifacts / 80 edges
(18 assignment + 39 concept + 23 artifact). Browse-all view: 35 assignments /
10 concepts / 11 artifacts / 131 edges (34 + 58 + 39). Every concept node has
at least one connective edge in every assignment-bearing view (no orphans).

### Test suite status / environment limitation

The full Playwright **browser** suite (`tests/map.spec.ts`,
`tests/phase3.spec.ts`, `tests/axe.spec.ts`, `tests/v2-phase1.spec.ts`,
`tests/v2-phase2.spec.ts`) **could not be executed in this sandbox** because
the Chromium binary download is blocked by the sandbox network
(`Client network socket disconnected before secure TLS connection was
established`).

The suites are written and included. On any machine with
`npx playwright install chromium` available, run:

```bash
npx playwright install chromium
npm run test
```

The Phase 2 suite can also be run in isolation with:

```bash
npx playwright test tests/v2-phase2.spec.ts
```

---

## 3. What is fully complete

- **Phase 1 of V2** is fully implemented end to end (modal, two-column layout,
  evidence panel, lazy evidence, card typography).
- **Phase 2 of V2** is fully implemented end to end (node descriptors, hover
  tooltip, interaction legend, visible arrowheads, concept relationships,
  default artifact visibility, expandable homepage graph).
- The project still passes data validation, Astro type-checking, static build,
  and the existing Node adapter tests (10/10).
- `docs/CHANGELOG_V2.md` documents every V2 Phase 1 and Phase 2 step, files
  changed, and assumptions.

---

## 4. What is intentionally incomplete or requires real artifacts/inputs

**Not yet implemented (remaining V2 phases):**

- Phase 3 — Navigation: section/tab hierarchy (§1), laptop navigation sizing
  (§6), moving the `Explore the Map` CTA (§12).
- Phase 4 — QA: ARIA filter fix (§14), contrast fixes (§15), `/reflection/`
  mobile overflow (§16), full regression and final visual review.

**Requires real author inputs:**

- Real artifact URLs (portfolio, ML paper, agent, repos, README, demo video,
  workflow, build-in-public post, hours log, retrospective).
- Real preview screenshots for artifacts/notebooks.
- Final retrospective wording (currently the existing editable 500–800 word
  draft).
- A real Netlify/deployment target for launch.
- Owner verification of the authored Playwright browser tests on a machine
  with a browser installed.

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

All changes are committed to the session branch
`arena/01a057d7-flyrank-learning-archive`. The committed working set includes
Phase 1 and Phase 2 code, the new/updated tests, `docs/CHANGELOG_V2.md`, and
this handoff.
