/**
 * Learning Map client (IMPLEMENTATION_PLAN Phase 2).
 *
 * Initialises Cytoscape in the LearningMap.astro stage, drives the view-state
 * machine (default → track → concept → assignment → browse-all), syncs state to
 * the URL, and wires hover, tap, filters, search, keyboard access and the
 * detail panel. Cytoscape only ships on pages that embed the map (the homepage).
 *
 * Failure-safe: if Cytoscape fails to initialise, the component adds the
 * `map-failed` class so CSS reveals the static browse fallback (DESIGN_SPEC §58).
 */
import cytoscape from 'cytoscape';
import type { Core, NodeSingular } from 'cytoscape';
import { buildGraphElements, primaryAssignmentForArtifact, assignmentById, conceptById } from './adapter';
import type { ViewState } from './adapter';
import { renderAssignmentPanel, renderConceptPanel, renderEmptyPanel } from './panel';
import type { Track } from '../../data/types';

type FilterKind = 'all' | 'ai-fluency' | 'machine-learning' | 'concepts' | 'artifacts';

interface TokenColors {
  bg: string;
  text: string;
  textDim: string;
  greenBright: string;
  terracotta: string;
  gold: string;
  graphGrey: string;
  /** Knowledge-graph node palette (V2 REVISION Phase 1 §3, §4). */
  concept: string;
  conceptInk: string;
  artifact: string;
  assignmentAi: string;
  assignmentMl: string;
  assignmentFillAi: string;
  assignmentFillMl: string;
}

/**
 * Cytoscape's colour parser does not understand 8-digit hex, and the CSS
 * minifier rewrites `rgba()` custom-property values into exactly that
 * (`rgba(77,138,112,0.18)` → `#4d8a702e`), which Cytoscape silently rejects —
 * the property is dropped and the node falls back to black/default. Every
 * colour read from the design tokens is therefore normalised to a form
 * Cytoscape accepts. (This also repairs the pre-existing `--text-dim`
 * arrowhead colour, which had been silently invalid.)
 */
function cyColor(value: string, fallback: string): string {
  const v = (value || '').trim() || fallback;
  const hex8 = /^#([0-9a-f]{8})$/i.exec(v);
  if (!hex8) return v;
  const n = hex8[1];
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  const a = Math.round((parseInt(n.slice(6, 8), 16) / 255) * 1000) / 1000;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function readTokens(): TokenColors {
  const s = getComputedStyle(document.documentElement);
  const get = (name: string, fallback: string) => cyColor(s.getPropertyValue(name), fallback);
  return {
    bg: get('--bg', '#101312'),
    text: get('--text', '#e9e7df'),
    textDim: get('--text-dim', 'rgba(233,231,223,0.72)'),
    greenBright: get('--green-bright', '#4d8a70'),
    terracotta: get('--terracotta', '#b9664e'),
    gold: get('--gold', '#b9a36a'),
    graphGrey: get('--graph-grey', '#5b625d'),
    concept: get('--graph-concept', '#d4bc7e'),
    conceptInk: get('--graph-concept-ink', '#101312'),
    artifact: get('--graph-artifact', '#d07b52'),
    assignmentAi: get('--graph-assignment-ai', '#4d8a70'),
    assignmentMl: get('--graph-assignment-ml', '#b9664e'),
    assignmentFillAi: get('--graph-assignment-fill-ai', 'rgba(77,138,112,0.18)'),
    assignmentFillMl: get('--graph-assignment-fill-ml', 'rgba(185,102,78,0.2)'),
  };
}

/* ------------------------------------------------------------------ *
 * Content-sized node labels (V2 REVISION Phase 1 §1)
 * ------------------------------------------------------------------ */

const GRAPH_FONT_FAMILY = 'Inter Variable, Inter, system-ui, sans-serif';

/** Concept label typography — must match the concept style block exactly. */
const CONCEPT_FONT_SIZE = 10;
const CONCEPT_FONT_WEIGHT = '700';
/**
 * Concept labels wrap at this width. It is deliberately tighter than the
 * longest single-word concept name so multi-word names take a second line —
 * the box grows vertically instead of stretching into a wide slab (§1:
 * "longer concept names wrap naturally", sizing stays compact).
 */
const CONCEPT_LABEL_MAX_WIDTH = 84;
const CONCEPT_PAD_X = 14;
const CONCEPT_PAD_Y = 9;

interface LabelBox {
  width: number;
  height: number;
  lines: number;
}

let labelCtx: CanvasRenderingContext2D | null = null;
const labelBoxCache = new Map<string, LabelBox>();

/**
 * Wraps a label exactly the way Cytoscape's renderer does (same greedy
 * word-wrap over `[\s\u200b]+` at `text-max-width`), so the box computed here
 * always matches the text the renderer draws inside it.
 */
function wrapLabel(text: string, measure: (s: string) => number, maxWidth: number): string[] {
  const out: string[] = [];
  for (const raw of text.split('\n')) {
    if (measure(raw) <= maxWidth) {
      out.push(raw);
      continue;
    }
    let subline = '';
    let previousIndex = 0;
    for (const match of raw.matchAll(/[\s\u200b]+|$/g)) {
      const separator = match[0];
      const word = raw.substring(previousIndex, match.index);
      previousIndex = (match.index ?? 0) + separator.length;
      const testLine = subline.length === 0 ? word : subline + word + separator;
      if (measure(testLine) <= maxWidth) {
        subline += word + separator;
      } else {
        if (subline) out.push(subline);
        subline = word + separator;
      }
    }
    if (subline.trim() !== '') out.push(subline);
  }
  return out.length > 0 ? out : [text];
}

/**
 * Measures a concept label with the renderer's own recipe (canvas font string,
 * `ceil()` per line, `font-size` per line of height) and returns the node box
 * that fits it: wrapped text + padding on every side.
 *
 * Cytoscape's own `width: 'label'` / `height: 'label'` values would do the
 * fitting, but they are deprecated (they log a console warning on every load)
 * and they ignore padding, which leaves the text touching the box edge.
 */
function conceptLabelBox(label: string): LabelBox {
  const key = `${label}|${CONCEPT_FONT_SIZE}|${CONCEPT_FONT_WEIGHT}|${CONCEPT_LABEL_MAX_WIDTH}`;
  const cached = labelBoxCache.get(key);
  if (cached) return cached;

  if (!labelCtx) {
    labelCtx = document.createElement('canvas').getContext('2d');
  }
  let box: LabelBox;
  if (!labelCtx) {
    // No canvas available: fall back to a generous fixed box rather than
    // clipping (the text still fits, the box is just roomier).
    box = { width: CONCEPT_LABEL_MAX_WIDTH + CONCEPT_PAD_X * 2, height: CONCEPT_FONT_SIZE * 2 + CONCEPT_PAD_Y * 2, lines: 2 };
  } else {
    labelCtx.font = `normal ${CONCEPT_FONT_WEIGHT} ${CONCEPT_FONT_SIZE}px ${GRAPH_FONT_FAMILY}`;
    const measure = (s: string) => Math.ceil(labelCtx!.measureText(s).width);
    const lines = wrapLabel(label, measure, CONCEPT_LABEL_MAX_WIDTH);
    box = {
      width: Math.max(...lines.map(measure)) + CONCEPT_PAD_X * 2,
      height: lines.length * CONCEPT_FONT_SIZE + CONCEPT_PAD_Y * 2,
      lines: lines.length,
    };
  }
  labelBoxCache.set(key, box);
  return box;
}

/** Internal narrative weighting → node diameter multiplier (never a label). */
function assignmentScale(n: NodeSingular): number {
  const size = Number(n.data('size'));
  return Number.isFinite(size) && size > 0 ? size : 1;
}

// The style objects are loose (Cytoscape's style map accepts varied property
// types); typed as `any[]` to avoid fighting @types/cytoscape on string values.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildStyle(c: TokenColors): any[] {
  return [
    {
      selector: 'node',
      style: {
        // V2 §7: every node displays its shortest useful descriptor directly
        // beside the node (assignments use `descriptor`, concepts/artifacts
        // their names — mapped into `label` by the adapter).
        label: 'data(label)',
        'background-color': c.bg,
        'border-width': 1,
        'border-color': c.graphGrey,
        color: c.text,
        'font-family': GRAPH_FONT_FAMILY,
        'font-size': 10,
        'font-weight': 500,
        'text-valign': 'bottom',
        'text-halign': 'center',
        'text-margin-y': 6,
        'text-wrap': 'wrap',
        'text-max-width': 90,
        'transition-property': 'width, height, border-width, border-color, opacity, font-size',
        'transition-duration': '200ms',
        'transition-timing-function': 'cubic-bezier(0.25,0.1,0.25,1)',
      },
    },
    {
      // Assignments stay circles (the shape visitors already read as "a piece
      // of work"), now with a tinted fill and a heavier track-coloured ring so
      // they read as solid objects rather than hairline outlines (§4).
      selector: "node[nodeType = 'assignment']",
      style: {
        shape: 'ellipse',
        // Cytoscape passes the *element* to a function mapper, so the size has
        // to be read with `data('size')` — reading `.data.size` yields
        // `undefined`, which made every width/height resolve to NaN and be
        // dropped (all assignment nodes silently rendered at the 30px default
        // and the tier weighting never applied).
        width: (n: NodeSingular) => 40 * assignmentScale(n),
        height: (n: NodeSingular) => 40 * assignmentScale(n),
        'background-color': c.bg,
        'border-width': 2.5,
      },
    },
    {
      selector: "node[nodeType = 'assignment'][track = 'ai-fluency']",
      style: { 'border-color': c.assignmentAi, 'background-color': c.assignmentFillAi },
    },
    {
      selector: "node[nodeType = 'assignment'][track = 'machine-learning']",
      style: { 'border-color': c.assignmentMl, 'background-color': c.assignmentFillMl },
    },
    {
      // Internal narrative weighting only — expressed as size/ring weight.
      // No tier terminology is ever rendered (V2 REVISION Phase 1 §6), and
      // every label stays at full text contrast (§4).
      selector: "node[nodeType = 'assignment'][tier = 'core']",
      style: { 'font-size': 11, 'border-width': 3, color: c.text, 'text-max-width': 110 },
    },
    {
      selector: "node[nodeType = 'assignment'][tier = 'supporting']",
      style: { color: c.text, 'border-width': 2.5, 'text-max-width': 84 },
    },
    {
      selector: "node[nodeType = 'assignment'][tier = 'reference']",
      style: { color: c.text, 'border-width': 2, 'border-opacity': 0.8 },
    },
    {
      selector: "node[nodeType = 'concept']",
      style: {
        shape: 'rectangle',
        // V2 REVISION Phase 1 §1: the concept box is sized by its own content.
        // Width/height come from the measured, wrapped label plus padding, so
        // the text can never spill outside the container: longer names wrap
        // onto a second line and the box grows with them instead of clipping.
        // Sizing stays compact and content-driven — no blanket oversized box.
        width: (n: NodeSingular) => conceptLabelBox(String(n.data('label'))).width,
        height: (n: NodeSingular) => conceptLabelBox(String(n.data('label'))).height,
        'background-color': c.concept,
        'border-width': 0,
        'border-color': c.concept,
        color: c.conceptInk,
        'font-size': 10,
        'font-weight': 700,
        'text-valign': 'center',
        'text-halign': 'center',
        'text-margin-y': 0,
        'text-max-width': CONCEPT_LABEL_MAX_WIDTH,
        'text-wrap': 'wrap',
        'text-transform': 'uppercase',
      },
    },
    {
      // V2 REVISION Phase 1 §3: artifacts are triangles in a distinct
      // terracotta-orange, so concept and artifact nodes are separable by
      // shape *and* colour without reading a label.
      selector: "node[nodeType = 'artifact']",
      style: {
        shape: 'triangle',
        'background-color': c.artifact,
        'border-width': 0,
        'border-color': c.artifact,
        color: c.text,
        'font-size': 9,
        'font-weight': 600,
        width: 24,
        height: 22,
        'text-valign': 'bottom',
        'text-halign': 'center',
        'text-margin-y': 6,
        'text-max-width': 78,
      },
    },
    {
      // Cytoscape has no `:hover` pseudo-class (an invalid selector logs a
      // warning and never matches); the map applies the `.hover` class from
      // its own mouseover handler instead.
      selector: 'node.hover',
      style: { 'border-width': 3, 'font-size': 12, color: c.text },
    },
    {
      selector: 'node.bright',
      style: { opacity: 1 },
    },
    {
      selector: 'node.dimmed',
      style: { opacity: 0.18 },
    },
    {
      selector: 'node.selected',
      style: {
        'border-width': 3,
        'border-color': c.text,
        color: c.text,
        'font-size': 12,
        'overlay-color': c.text,
        'overlay-padding': 10,
        'overlay-opacity': 0.12,
        'z-index': 10,
      },
    },
    {
      selector: 'edge',
      style: {
        width: 1,
        'line-color': c.graphGrey,
        opacity: 0.55,
        'curve-style': 'bezier',
        'target-arrow-shape': 'none',
        'transition-property': 'opacity',
        'transition-duration': '200ms',
      },
    },
    {
      selector: "edge[relationship = 'builds-on']",
      // V2 §10.1: direction is unmistakable at normal zoom. A clearly visible
      // triangle arrowhead in a brighter tone than the hairline, without
      // dominating the line.
      style: {
        'line-style': 'solid',
        'target-arrow-shape': 'triangle',
        'target-arrow-color': c.textDim,
        'arrow-scale': 1,
      },
    },
    {
      selector: "edge[relationship = 'connects-to']",
      style: {
        'line-style': 'dotted',
        opacity: 0.45,
        'target-arrow-shape': 'triangle',
        'target-arrow-color': c.graphGrey,
        'arrow-scale': 0.8,
      },
    },
    {
      selector: "edge[relationship = 'cross-track']",
      style: { 'line-color': c.terracotta, 'line-style': 'dashed', width: 1.5, 'target-arrow-shape': 'triangle', 'target-arrow-color': c.terracotta, 'arrow-scale': 1 },
    },
    {
      // Connective concept edge (V2 §10.2): assignment → concept. Subordinate
      // and undirected, echoing the concept's gold accent.
      selector: "edge[relationship = 'concept']",
      style: { 'line-color': c.concept, 'line-style': 'solid', width: 1.25, opacity: 0.42, 'target-arrow-shape': 'none' },
    },
    {
      // Connective artifact edge (V2 §11): assignment → artifact. Subordinate
      // and undirected.
      selector: "edge[relationship = 'artifact']",
      style: { 'line-color': c.artifact, 'line-style': 'dotted', width: 1.25, opacity: 0.5, 'target-arrow-shape': 'none' },
    },
    {
      selector: 'edge.bright',
      style: { opacity: 1 },
    },
    {
      selector: 'edge.dimmed',
      style: { opacity: 0.1 },
    },
  ];
}

function parseInitialState(): ViewState {
  const sp = new URLSearchParams(location.search);

  // The `tier` query parameter is intentionally no longer read: the Tier
  // filter has been removed from the interface (V2 REVISION Phase 1 §6).
  if (sp.has('node')) return { kind: 'assignment', node: sp.get('node')! };
  if (sp.has('concept')) return { kind: 'concept', concept: sp.get('concept')! };
  if (sp.get('view') === 'browse-all') return { kind: 'browse-all' };
  if (sp.get('view') === 'concepts') return { kind: 'concepts' };
  if (sp.get('view') === 'artifacts') return { kind: 'artifacts' };
  const track = sp.get('track');
  if (track === 'ai-fluency' || track === 'machine-learning') {
    return { kind: 'track', track };
  }
  return { kind: 'default' };
}

export function initLearningMap(root: HTMLElement): void {
  const stage = root.querySelector<HTMLElement>('[data-map-stage]');
  const panel = root.querySelector<HTMLElement>('[data-map-panel]');
  const panelBody = root.querySelector<HTMLElement>('[data-map-panel-body]');
  const closeBtn = root.querySelector<HTMLElement>('[data-map-close]');
  const roster = root.querySelector<HTMLElement>('[data-map-roster]');
  const search = root.querySelector<HTMLInputElement>('[data-map-search]');
  const searchResults = root.querySelector<HTMLElement>('[data-map-search-results]');
  const tooltip = root.querySelector<HTMLElement>('[data-map-tooltip]');
  const regionEl = root.querySelector<HTMLElement>('[data-map-region]');
  const expandBtn = root.querySelector<HTMLElement>('[data-map-expand]');

  if (!stage || !panel || !roster) {
    root.classList.add('map-failed');
    return;
  }

  // Non-null aliases so closures are not subject to null-narrowing.
  const stageEl = stage;
  const panelEl = panel;
  // The client renderers write into the panel body; the panel chrome (the
  // close control, V2 REVISION Phase 1 §7) belongs to the shell and survives
  // every render.
  const panelBodyEl = panelBody ?? panel;
  const rosterEl = roster;

  const tokens = readTokens();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DURATION = reduceMotion ? 0 : 220;

  let state: ViewState = parseInitialState();
  let savedViewport: { zoom: number; pan: { x: number; y: number } } | null = null;
  // id of the roster button that triggered a selection; focus returns here on
  // close (the button element is replaced on every render, so store the id).
  let lastTriggerRef: string | null = null;

  let cy: Core;
  try {
    cy = cytoscape({
      container: stageEl,
      elements: [],
      style: buildStyle(tokens),
      layout: { name: 'preset' },
      minZoom: 0.25,
      maxZoom: 3,
      wheelSensitivity: 0.25,
    });
  } catch (err) {
    console.error('Learning Map failed to initialise', err);
    root.classList.add('map-failed');
    return;
  }

  const fallback = root.querySelector<HTMLElement>('[data-map-fallback]');

  function fit() {
    cy.animate({
      fit: { eles: cy.elements(), padding: 60 },
      duration: DURATION,
    });
  }

  // --- Hover tooltip (V2 §8) ---
  // A single DOM tooltip positioned beside the hovered node. It reveals the
  // full canonical title plus the short description, keeping the graph label
  // itself to the shortest useful descriptor (§7).
  let hoveredNode: NodeSingular | null = null;

  function positionTooltip(n: NodeSingular): void {
    if (!tooltip || !regionEl) return;
    const rp = n.renderedPosition();
    const regionRect = regionEl.getBoundingClientRect();
    const stageRect = stageEl.getBoundingClientRect();
    const x = stageRect.left - regionRect.left + rp.x;
    const y = stageRect.top - regionRect.top + rp.y;
    const tw = tooltip.offsetWidth;
    const th = tooltip.offsetHeight;
    const GAP = 14;
    let left = x - tw / 2;
    let top = y - th - GAP;
    // Clamp horizontally so the tooltip never leaves the region.
    left = Math.max(8, Math.min(left, regionRect.width - tw - 8));
    // Flip below the node when there is no room above (near the top edge).
    if (top < 8) top = y + GAP;
    tooltip.style.left = `${Math.round(left)}px`;
    tooltip.style.top = `${Math.round(top)}px`;
  }

  function showTooltip(n: NodeSingular): void {
    if (!tooltip) return;
    const title = String(n.data('title') || n.data('label') || '');
    const description = String(n.data('description') || '');
    tooltip.textContent = '';
    const strong = document.createElement('strong');
    strong.textContent = title;
    tooltip.appendChild(strong);
    if (description) {
      const span = document.createElement('span');
      span.textContent = description;
      tooltip.appendChild(span);
    }
    tooltip.hidden = false;
    positionTooltip(n);
  }

  function hideTooltip(): void {
    if (!tooltip) return;
    tooltip.hidden = true;
    tooltip.textContent = '';
  }

  // --- Homepage map expand/collapse (V2 §13) ---
  // Toggles the `.map-section` composition so the graph takes the full width
  // and the adjacent context panel recedes. Layout changes are picked up by
  // the existing ResizeObserver on the stage.
  const sectionEl = root.closest<HTMLElement>('.map-section');

  function setExpanded(expanded: boolean): void {
    if (!sectionEl) return;
    sectionEl.classList.toggle('is-expanded', expanded);
    if (expandBtn) {
      expandBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      expandBtn.textContent = expanded ? 'Collapse map' : 'Expand map';
    }
    // Re-fit once the new layout has been applied so the graph actually uses
    // the space it gains (or returns to the compact composition cleanly).
    requestAnimationFrame(() => {
      cy.resize();
      fit();
    });
  }

  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      setExpanded(!(sectionEl?.classList.contains('is-expanded') ?? false));
    });
  }

  // V2 §12: the end-of-work-section `Explore the map` CTA. The anchor's
  // default navigation to #map is kept (it works without JS); with JS the
  // map additionally expands into the full-width graph experience so the
  // click lands on the actual full Knowledge Graph, not a cramped preview.
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest?.('a[data-explore-map]')) {
      setExpanded(true);
    }
  });

  function applyViewClasses() {
    if (state.kind === 'track') {
      const track: Track = state.track ?? 'ai-fluency';
      cy.nodes('[nodeType = "assignment"]').forEach((n) => {
        n.toggleClass('dimmed', n.data('track') !== track);
      });
      cy.edges().forEach((e) => {
        const srcTrack = cy.getElementById(e.data('source')).data('track');
        const tgtTrack = cy.getElementById(e.data('target')).data('track');
        if (srcTrack === undefined || tgtTrack === undefined) {
          // Connective edge (concept/artifact): bright while its assignment
          // endpoint belongs to the chosen track.
          const assignmentTrack = srcTrack ?? tgtTrack;
          e.toggleClass('dimmed', assignmentTrack !== track);
        } else {
          e.toggleClass('dimmed', srcTrack !== track && tgtTrack !== track);
        }
      });
    } else if (state.kind === 'assignment') {
      const selectedId = state.node ?? '';
      const sel = cy.getElementById(selectedId);
      if (sel.nonempty()) {
        cy.nodes().forEach((n) => {
          const connected = sel.closedNeighborhood().contains(n);
          n.toggleClass('bright', connected);
        });
      }
    } else if (state.kind === 'concept') {
      const sel = cy.getElementById(state.concept ?? '');
      if (sel.nonempty()) {
        cy.nodes().forEach((n) => {
          const connected = sel.closedNeighborhood().contains(n);
          n.toggleClass('bright', connected);
        });
      }
    }

    // Selected ring (outer ring per DESIGN_SPEC §49).
      cy.nodes().forEach((n) => {
        n.removeClass('selected');
      });
    if (state.kind === 'assignment') {
      cy.getElementById(state.node ?? '').addClass('selected');
    }
    if (state.kind === 'concept') {
      cy.getElementById(state.concept ?? '').addClass('selected');
    }
  }

  function render({ fitNow = true } = {}) {
    const { nodes, edges } = buildGraphElements(state);
    cy.elements().remove();
    cy.add([...nodes, ...edges]);
    hoveredNode = null;
    hideTooltip();
    applyViewClasses();
    if (fitNow) fit();
    updateRoster();
    updatePanel();
    updateFilters();
    updateURL();
    updateFallback();
  }

  function updatePanel() {
    if (state.kind === 'assignment' && state.node) {
      const a = assignmentById.get(state.node);
      if (a) {
        renderAssignmentPanel(panelBodyEl, a);
        root.classList.add('is-open');
        return;
      }
    }
    if (state.kind === 'concept' && state.concept) {
      renderConceptPanel(panelBodyEl, state.concept);
      root.classList.add('is-open');
      return;
    }
    renderEmptyPanel(panelBodyEl);
    root.classList.remove('is-open');
  }

  function updateRoster() {
    rosterEl.textContent = '';
    const list = document.createElement('ul');
    const items: { id: string; label: string; type: string }[] = [];
    cy.nodes().forEach((n) => {
      const type = n.data('nodeType');
      if (type === 'artifact') return;
      items.push({ id: n.id(), label: n.data('label'), type });
    });
    for (const it of items) {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'map-roster__button';
      btn.dataset.roster = it.id;
      btn.textContent = it.label;
      btn.setAttribute('aria-label', `${it.type} ${it.label}`);
      li.appendChild(btn);
      list.appendChild(li);
    }
    rosterEl.appendChild(list);
  }

  function updateURL() {
    const p = new URLSearchParams();
    switch (state.kind) {
      case 'default':
        break;
      case 'track':
        p.set('track', state.track ?? 'ai-fluency');
        break;
      case 'concept':
        p.set('concept', state.concept ?? '');
        break;
      case 'assignment':
        p.set('node', state.node ?? '');
        break;
      case 'browse-all':
        p.set('view', 'browse-all');
        break;
      case 'concepts':
        p.set('view', 'concepts');
        break;
      case 'artifacts':
        p.set('view', 'artifacts');
        break;
    }
    const qs = p.toString();
    const next = qs ? `${location.pathname}?${qs}` : location.pathname;
    history.replaceState(null, '', next);
  }

  function updateFilters() {
    const primary = root.querySelectorAll<HTMLElement>('[data-filter-primary]');
    primary.forEach((btn) => {
      const v = btn.dataset.filterPrimary as FilterKind;
      const active = primaryActive(v);
      btn.classList.toggle('is-active', active);
      if (active) btn.setAttribute('aria-pressed', 'true');
      else btn.removeAttribute('aria-pressed');
    });
    const browseAll = root.querySelector<HTMLElement>('[data-filter-browseall]');
    if (browseAll) browseAll.classList.toggle('is-active', state.kind === 'browse-all');
  }

  function primaryActive(v: FilterKind): boolean {
    switch (v) {
      case 'all':
        return state.kind === 'default' || state.kind === 'assignment' || state.kind === 'concept';
      case 'ai-fluency':
        return state.kind === 'track' && state.track === 'ai-fluency';
      case 'machine-learning':
        return state.kind === 'track' && state.track === 'machine-learning';
      case 'concepts':
        return state.kind === 'concepts';
      case 'artifacts':
        return state.kind === 'artifacts';
    }
  }

  function updateFallback() {
    if (!fallback) return;
    fallback.textContent = '';
    // Mirror the graph state in the static fallback list so the non-graph
    // route always matches what the graph shows (single source of truth).
    const assignments = [
      ...new Set(
        buildGraphElements(state).nodes.map((n) => (n.data as { ref: string }).ref)
      ),
    ];
    const list = document.createElement('ul');
    list.className = 'map-fallback__list';
    for (const id of assignments) {
      const a = assignmentById.get(id);
      if (!a) continue;
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = `/work/${id}/`;
      link.textContent = a.officialCode ? `${a.officialCode} · ${a.title}` : a.title;
      li.appendChild(link);
      list.appendChild(li);
    }
    fallback.appendChild(list);
  }

  // --- interactions ---
  cy.on('mouseover', 'node', (evt) => {
    const n = evt.target;
    n.addClass('hover');
    n.closedNeighborhood().forEach((el: any) => el.addClass('bright'));
    hoveredNode = n;
    showTooltip(n);
  });
  cy.on('mouseout', 'node', (evt) => {
    const n = evt.target;
    n.removeClass('hover');
    n.closedNeighborhood().forEach((el: any) => el.removeClass('bright'));
    hoveredNode = null;
    hideTooltip();
  });
  // Robustness: if the pointer leaves the map stage in a single jump (fast
  // mouse move, coalesced events), Cytoscape may never emit the node
  // `mouseout`. Clean up on the DOM `mouseleave` so the tooltip and hover
  // state never linger once the pointer is outside the graph (V2 §8 —
  // "hover does not permanently clutter the graph").
  stageEl.addEventListener('mouseleave', () => {
    if (hoveredNode) {
      hoveredNode.removeClass('hover');
      hoveredNode.closedNeighborhood().forEach((el: any) => el.removeClass('bright'));
      hoveredNode = null;
    }
    hideTooltip();
  });
  // Keep the tooltip anchored while the viewport is panned/zoomed.
  cy.on('pan zoom', () => {
    if (hoveredNode) positionTooltip(hoveredNode);
  });

  function selectByRef(ref: string, type?: string): void {
    const nodeType = type ?? nodeTypeFor(ref);
    savedViewport = { zoom: cy.zoom(), pan: cy.pan() };
    if (nodeType === 'assignment') {
      state = { ...state, kind: 'assignment', node: ref, concept: undefined };
    } else if (nodeType === 'concept') {
      state = { ...state, kind: 'concept', concept: ref, node: undefined };
    } else if (nodeType === 'artifact') {
      const primary = primaryAssignmentForArtifact(ref);
      if (primary) state = { ...state, kind: 'assignment', node: primary, concept: undefined };
      else return;
    }
    render();
    // Move focus into the panel (DESIGN_SPEC §38); the aside is tabindex="-1".
    panelEl.focus({ preventScroll: true });
  }

  function nodeTypeFor(ref: string): string {
    if (assignmentById.has(ref)) return 'assignment';
    if (conceptById.has(ref)) return 'concept';
    return 'artifact';
  }

  cy.on('tap', 'node', (evt) => {
    const n = evt.target;
    selectByRef(n.id(), n.data('nodeType'));
  });

  function closeSelection() {
    if (state.kind !== 'assignment' && state.kind !== 'concept') return;
    state = { ...state, kind: 'default', node: undefined, concept: undefined };
    render({ fitNow: false });
    if (savedViewport) {
      cy.zoom(savedViewport.zoom);
      cy.pan(savedViewport.pan);
    }
    // Return focus to the roster trigger (fresh button for the same id).
    if (lastTriggerRef) {
      const btn = rosterEl.querySelector<HTMLElement>(`[data-roster="${lastTriggerRef}"]`);
      if (btn) btn.focus({ preventScroll: true });
      lastTriggerRef = null;
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (state.kind === 'assignment' || state.kind === 'concept')) {
      closeSelection();
    }
  });

  // V2 REVISION Phase 1 §7: the panel carries its own visible close control,
  // wired to the exact same path as the Escape key, so closing never has to be
  // discovered.
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeSelection());
  }

  // --- explicit graph navigation (V2 REVISION Phase 1 §8) ---
  // Additive to the existing gestures: zoom/pan are reachable from labelled
  // buttons so navigation never depends on discovering a gesture. Zooming is
  // computed about the centre of the viewport (and the pan compensated) so the
  // graph stays put under the user's eye instead of sliding to a corner.
  const PAN_STEP = 140;

  function zoomBy(factor: number): void {
    const from = cy.zoom();
    const to = Math.min(Math.max(from * factor, cy.minZoom()), cy.maxZoom());
    if (to === from) return;
    const centre = { x: cy.width() / 2, y: cy.height() / 2 };
    const pan = cy.pan();
    const scale = to / from;
    cy.animate({
      zoom: to,
      pan: { x: centre.x - (centre.x - pan.x) * scale, y: centre.y - (centre.y - pan.y) * scale },
      duration: DURATION,
    });
  }

  function panBy(dx: number, dy: number): void {
    const pan = cy.pan();
    cy.animate({ pan: { x: pan.x + dx, y: pan.y + dy }, duration: DURATION });
  }

  const navActions: Record<string, () => void> = {
    'zoom-in': () => zoomBy(1.3),
    'zoom-out': () => zoomBy(1 / 1.3),
    // Pan left/right move the *viewport*, i.e. they reveal graph that is
    // currently off-screen in that direction (content shifts the other way).
    'pan-left': () => panBy(PAN_STEP, 0),
    'pan-right': () => panBy(-PAN_STEP, 0),
  };
  root.querySelectorAll<HTMLElement>('[data-map-nav]').forEach((btn) => {
    const action = navActions[btn.dataset.mapNav ?? ''];
    if (!action) return;
    btn.addEventListener('click', action);
  });

  // --- filter controls ---
  root.querySelectorAll<HTMLElement>('[data-filter-primary]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.filterPrimary as FilterKind;
      switch (v) {
        case 'all':
          state = { ...state, kind: 'default', track: undefined, concept: undefined, node: undefined };
          break;
        case 'ai-fluency':
          state = { ...state, kind: 'track', track: 'ai-fluency', concept: undefined, node: undefined };
          break;
        case 'machine-learning':
          state = { ...state, kind: 'track', track: 'machine-learning', concept: undefined, node: undefined };
          break;
        case 'concepts':
          state = { ...state, kind: 'concepts', concept: undefined, node: undefined };
          break;
        case 'artifacts':
          state = { ...state, kind: 'artifacts', node: undefined };
          break;
      }
      render();
    });
  });
  const browseAll = root.querySelector<HTMLElement>('[data-filter-browseall]');
  if (browseAll) {
    browseAll.addEventListener('click', () => {
      state = { ...state, kind: 'browse-all', track: undefined, concept: undefined, node: undefined };
      render();
    });
  }

  // --- keyboard roster ---
  rosterEl.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-roster]');
    if (!btn) return;
    lastTriggerRef = btn.dataset.roster ?? null;
    selectByRef(btn.dataset.roster ?? '');
  });

  // --- search ---
  function searchMatches(query: string): { id: string; label: string; type: string }[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: { id: string; label: string; type: string }[] = [];
    assignmentById.forEach((a, id) => {
      const hay = `${a.officialCode ?? ''} ${a.id} ${a.title} ${(a.sourceAliases ?? []).join(' ')}`.toLowerCase();
      if (hay.includes(q)) out.push({ id, label: `${a.officialCode ?? ''} ${a.title}`.trim(), type: 'assignment' });
    });
    conceptById.forEach((c, id) => {
      if (c.name.toLowerCase().includes(q)) out.push({ id, label: c.name, type: 'concept' });
    });
    return out.slice(0, 8);
  }

  if (search && searchResults) {
    search.addEventListener('input', () => {
      const matches = searchMatches(search.value);
      searchResults.textContent = '';
      if (search.value.trim() === '' || matches.length === 0) {
        searchResults.hidden = true;
        return;
      }
      searchResults.hidden = false;
      const list = document.createElement('ul');
      matches.forEach((m) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'map-search__result';
        btn.textContent = m.label;
        btn.addEventListener('click', () => {
          search.value = m.label;
          searchResults.hidden = true;
          selectByRef(m.id, m.type);
        });
        li.appendChild(btn);
        list.appendChild(li);
      });
      searchResults.appendChild(list);
    });
    search.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const first = searchResults.querySelector<HTMLElement>('button');
        if (first) first.click();
      }
    });
    document.addEventListener('click', (e) => {
      if (!search.contains(e.target as Node)) searchResults.hidden = true;
    });
  }

  // Concept boxes are measured from real font metrics, so re-evaluate the
  // stylesheet once the self-hosted variable fonts have loaded — otherwise a
  // first paint before the font arrives would size the boxes from the
  // fallback font's metrics (V2 REVISION Phase 1 §1).
  if (typeof document !== 'undefined' && 'fonts' in document) {
    document.fonts.ready
      .then(() => {
        labelBoxCache.clear();
        cy.style().update();
        cy.resize();
      })
      .catch(() => {
        /* non-fatal: the boxes keep their fallback-metric size */
      });
  }

  // --- sizing ---
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => cy.resize());
    ro.observe(stageEl);
  }
  window.addEventListener('resize', () => cy.resize());

  // --- kick off ---
  root.classList.add('js-map-ready');
  try {
    render();
  } catch (err) {
    console.error('Learning Map render failed', err);
    root.classList.remove('js-map-ready');
    root.classList.add('map-failed');
  }

  // Test/debug hook (used by the Playwright interaction suite). Exposes the
  // Cytoscape instance, the current view state, and a programmatic `select`
  // that runs the exact same selection pipeline as a tap (state, panel, URL,
  // selection ring). This lets the suite drive and assert the real behaviour
  // deterministically while canvas-coordinate clicks are also covered in one test.
  (window as unknown as Record<string, unknown>).__learningMap = {
    cy,
    getState: () => state,
    select: (ref: string, type?: string) => selectByRef(ref, type),
    close: () => closeSelection(),
    nav: navActions,
  };

  // Announce map region for assistive tech (the browse route is the primary
  // accessible path; the map is an enhancement).
  const region = root.querySelector<HTMLElement>('[data-map-region]');
  if (region) region.setAttribute('aria-label', 'Learning Map. You can also browse the work without the map.');
}

// auto-start on DOMContentLoaded (Astro bundles this module only on map pages)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startAll);
} else {
  startAll();
}

function startAll(): void {
  document.querySelectorAll<HTMLElement>('[data-learning-map]').forEach(initLearningMap);
}
