# Codebase Reference — FlyRank Learning Archive

**Purpose:** Quick-reference for navigating the codebase. Not an action list, not a verification report. This is the map of where things live.

---

## Architecture at a glance

```
src/
  data/           # The product. Typed data modules are the single source of truth.
  pages/          # Static routes. Each file = one URL.
  components/     # Astro components (server-rendered) + map/ (client JS).
  layouts/        # Base.astro — the HTML shell.
  styles/         # global.css — Systems Atlas token system.
  lib/            # Lookup helpers and canonical orderings.
  config.ts       # site.url (placeholder).
scripts/          # validate-data.mjs — the data gatekeeper.
tests/            # Playwright specs (adapter, map, phase3, axe).
public/           # Static assets (favicon, og.png).
```

---

## Data layer (the product)

| File | What it holds | Count |
|---|---|---|
| `src/data/types.ts` | TypeScript interfaces for everything | — |
| `src/data/assignments.ts` | Canonical assignment records | 35 |
| `src/data/concepts.ts` | Concept definitions + locked mappings | 10 concepts, 58 mappings |
| `src/data/artifacts.ts` | Shared artifacts + per-assignment artifact links | 11 artifacts, 39 links |
| `src/data/graph.ts` | Approved edges + rejected edges | 34 public, 5 rejected |
| `src/data/notebooks.ts` | ML notebook preview records | 8 |
| `src/data/framework.ts` | Framework step definitions | 7 steps |
| `src/data/wish-i-knew.ts` | "What I Wish I Knew" statements | 6 statements |
| `src/data/reflection.ts` | Retrospective (editable draft) | 566 words |

**Rule:** Content lives in data files. Components are dumb renderers. Never put a content string in a component.

---

## Pages (routes)

| Route | File | What it renders |
|---|---|---|
| `/` | `src/pages/index.astro` | Hero + Learning Map + browse index |
| `/work/` | `src/pages/work/index.astro` | Full work index with filters |
| `/work/[slug]/` | `src/pages/work/[slug].astro` | 35 assignment detail pages |
| `/track/ai-fluency/` | `src/pages/track/ai-fluency.astro` | AI Fluency strand structure |
| `/track/machine-learning/` | `src/pages/track/machine-learning.astro` | ML spine with ML-01 at entrance |
| `/concepts/[id]/` | `src/pages/concepts/[id].astro` | 10 concept pages |
| `/framework/` | `src/pages/framework.astro` | Working framework (7 steps) |
| `/framework/wish-i-knew/` | `src/pages/framework/wish-i-knew.astro` | 6 traceable statements |
| `/reflection/` | `src/pages/reflection.astro` | Long-form retrospective |
| `/sitemap.xml` | `src/pages/sitemap.xml.ts` | Generated sitemap |
| `/robots.txt` | `src/pages/robots.txt.ts` | Generated robots |
| `/404` | `src/pages/404.astro` | Not-found page |

---

## Components

| Component | Used by | Purpose |
|---|---|---|
| `Base.astro` | All pages | HTML shell, head, skip link, header, footer |
| `Header.astro` | Base.astro | Nav bar (MAP/WORK/FRAMEWORK/REFLECTION + track links) |
| `Hero.astro` | index.astro | Eyebrow, headline, CTAs |
| `AssignmentCard.astro` | BrowseWork, work index | Tier-weighted card for assignment lists |
| `ArtifactCard.astro` | (unused, kept for compat) | Superseded by ArtifactPreview |
| `ArtifactPreview.astro` | DetailPanel, map panel | Three display modes: embed/preview/link |
| `ConceptCard.astro` | Concept pages | Rectangular "atlas label" |
| `FilterBar.astro` | Work index, map | Track + tier filters |
| `DetailPanel.astro` | [slug].astro | Server-rendered assignment detail |
| `BrowseWork.astro` | index.astro | Grid + client-side search |
| `NotebookPreview.astro` | (standalone) | ML notebook viewport (not an iframe) |
| `FinalPackage.astro` | reflection, fl-10 | Master index + completion links |
| `LearningMap.astro` | index.astro | Map shell + panel CSS |

---

## Map client code (`src/components/map/`)

| File | Purpose |
|---|---|
| `layout.ts` | Deterministic seed coordinates for all nodes |
| `adapter.ts` | Pure function: `buildGraphElements(state) -> {nodes, edges}` |
| `panel.ts` | Client-side detail panel renderer |
| `map-client.ts` | Cytoscape init, state machine, URL sync, interactions |

**Key invariant:** `adapter.ts` is the only place data meets the renderer. It is pure, testable without a browser, and enforces approved-only edges.

---

## Validation

```bash
npm run validate    # data integrity (runs automatically before build)
npm run build       # static build (53 pages)
npm run check       # astro check (TypeScript)
npm run test:adapter  # 10 adapter unit tests
```

The validator (`scripts/validate-data.mjs`) checks:
- Record counts and ID uniqueness
- Referential integrity (all IDs resolve)
- Copy integrity (exact match against approved strings)
- Banned patterns (em/en dash, blocked sentences, banned words)
- officialCode mapping (no invented codes)
- evidenceStatus consistency
- Framework/wish-i-knew/retrospective structure

---

## Common tasks

**Add a new assignment:**
1. Add record to `src/data/assignments.ts`
2. Add artifact link to `src/data/artifacts.ts` if applicable
3. Add edges to `src/data/graph.ts` if applicable
4. Add concept mapping to `src/data/concepts.ts` if applicable
5. Run `npm run validate` — it will assert the new ID is in the expected set

**Update evidence status:**
1. Set `url` on the artifact in `src/data/artifacts.ts`
2. Flip `evidenceStatus` to `"available"`
3. No code changes needed — UI renders both states

**Change a design token:**
1. Edit `src/styles/global.css` (CSS custom properties at the top)
2. Run `npm run build` to verify

**Update the retrospective:**
1. Edit `src/data/reflection.ts`
2. Keep word count between 500-800
3. Keep the four required headings
4. `npm run validate` checks this automatically
