# V2 Handoff

This handoff records the state of the **V2 improvement work** after completing
**Phase 1 — Structural interaction** of `docs/V2_IMPROVEMENT_SPEC.md`.

---

## 1. Summary of work completed

### Phase 1 — Structural interaction (complete)

| Spec section | Work completed |
| :--- | :--- |
| §2 Assignment pop-ups | Assignment cards now open an in-context `<dialog>` modal by default. The modal is hosted by the Base layout and driven by `src/scripts/assignment-modal.ts`. It fetches the existing static `/work/[id]/` route and injects the same `<main>` content (+ its scoped assets), so the pop-up is the existing assignment page placed above the current page. Existing `/work/[id]/` routes remain valid for no-JS/direct linking. ESC, explicit close, focus restore, background scroll lock, and independent modal scrolling are implemented. |
| §3 Two-column evidence layout | `DetailPanel.astro` now renders assignment content in a left column and the evidence panel in a right column on desktop; it collapses to one column at `<=900px`. `EvidencePanel.astro` provides the dedicated evidence area for every assignment. |
| §4 Lazy evidence loading | `ArtifactPreview.astro` now shows a preview thumbnail, artifact type/title/description, evidence status, and a `Show evidence` control. The heavy viewer (lazy `<iframe>` for PDF/live, `<video>` for video) is created only after the visitor clicks the control. No iframe/video/object exists in the initial HTML of any page. |
| §5 Card typography normalization | A single canonical V2 assignment-card typography token set was added to `src/styles/global.css` (`--fs-card-label`, `--fs-card-title`, `--fs-card-description`, `--fs-card-metadata`, `--fs-card-status`, `--fs-card-action`). `AssignmentCard.astro` and `ArtifactPreview.astro` use these tokens; tier weighting is expressed with contrast/opacity/border, never per-card font size overrides. |
| Tests & verification | Added `tests/v2-phase1.spec.ts` covering the Phase 1 modal/evidence/typography acceptance criteria. Added `docs/CHANGELOG_V2.md` tracking each implementation step. |

---

## 2. How correctness was verified

### Automated checks executed in this repository

| Check | Result |
| :--- | :--- |
| `npm run validate` | **Passed** — data census 35 assignments / 10 concepts / 11 artifacts / 34 public edges; no validation violations. |
| `npm run check` (`astro check`) | **Passed** — 47 files, **0 errors, 0 warnings, 0 hints**. |
| `npm run build` | **Passed** — static production build, **53 pages built**. |
| `npm run test:adapter` | **Passed** — **10/10** adapter unit tests. |

### Static/manual checks against the built `dist/`

- The built homepage contains the modal host (`data-assignment-modal`) and the
  global interaction script (modal open/close + `Show evidence` handler).
- Every assignment card retains its real `href="/work/[id]/"` for no-JS/direct
  linking and carries `data-assignment-card`.
- Static detail pages render `detail__grid`, `EvidencePanel` (`evidence__label`),
  and preview thumbnails.
- Built pages contain **zero `<iframe>`** in the initial HTML:
  `/`, `/work/ml-11-ship-paper/`, `/work/pf-04-personal-website/`,
  `/work/fl-09-documentation-demo/`.
- `Show evidence` controls are present on evidence cards in the built detail
  pages.

### Test suite status / environment limitation

The full Playwright browser suite (including the new
`tests/v2-phase1.spec.ts`) **could not be executed in this sandbox** because the
Chromium binary download was blocked by the sandbox network
(`Client network socket disconnected before secure TLS connection was
established`), and package sources (`deb.debian.org`) were also unreachable.

The suite is written and included. On any machine with
`npx playwright install chromium` available, it should be run as:

```bash
npx playwright install chromium
npm run test
```

The new Phase 1 Playwright tests are in `tests/v2-phase1.spec.ts` and can also
be run in isolation with:

```bash
npx playwright test tests/v2-phase1.spec.ts
```

---

## 3. What is fully complete

- **Phase 1 of V2** is fully implemented end to end:
  - assignment cards open modals by default;
  - existing assignment routes are retained;
  - two-column desktop assignment layout;
  - evidence panel for every assignment;
  - lazy evidence loading with `Show evidence`;
  - canonical assignment-card typography tokens;
  - V2 Phase 1 Playwright coverage is authored and included in the repo.
- The project still passes data validation, Astro type-checking, static build,
  and the existing Node adapter tests.
- `docs/CHANGELOG_V2.md` documents every V2 Phase 1 step, files changed, and
  assumptions.

---

## 4. What is intentionally incomplete or requires real artifacts/inputs

**Not in Phase 1 scope (intentionally not implemented yet):**

- Phase 2 — Knowledge Graph: node descriptors, hover information, interaction
  instructions, arrowheads, concept relationship audit, default artifact
  visibility, expandable homepage graph.
- Phase 3 — Navigation: section/tab hierarchy, laptop navigation sizing, moving
  `Explore the Map` CTA.
- Phase 4 — QA: ARIA filter fix, contrast fixes, `/reflection/` mobile overflow,
  final full regression and visual review.
- Phase 1 non-goals remain respected: no redesign, no new palette colours, no
  new UI framework, no extra libraries, no decorative cards/gradients.

**Requires real author inputs:**

- Real artifact URLs (portfolio, ML paper, agent, repos, README, demo video,
  workflow, build-in-public post, hours log, retrospective).
- Real preview screenshots for artifacts/notebooks.
- Final retrospective wording must be replaced by the author (currently the
  existing editable 500–800 word draft).
- A real Netlify/deployment target for launch (outside Phase 1).
- Owner verification of the authored Playwright tests on a machine with a
  browser installed.

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
| `artifact-learning-archive` URL | `src/data/artifacts.ts` | This archive’s canonical public URL. |
| Notebook charts / metrics / code | `src/data/notebooks.ts` | Real ML notebook evidence, if supplied. |
| Final retrospective wording | `src/data/reflection.ts` | Replace with the author’s own 500–800 word version. |
| Deployment target | Netlify / hosting | Confirm actual deployment site/CI. |

---

## 6. Commit / branch

All changes are committed to the session branch
`arena/01a057ca-flyrank-learning-archive`. The committed working set includes
Phase 1 code, the new tests, `docs/CHANGELOG_V2.md`, and this handoff.
