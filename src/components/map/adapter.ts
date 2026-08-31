/**
 * Map data adapter (IMPLEMENTATION_PLAN Task 2.1.2).
 *
 * The only place data meets the renderer. A pure, deterministic, unit-testable
 * function that translates the validated Phase 1 data modules into Cytoscape
 * elements for a given view state. Rendering bugs should be traceable to either
 * this adapter's output or the style config, never to ad-hoc element mutation.
 *
 * Rules enforced here (and by scripts/validate-data.mjs):
 *  - Only `approved: true` edges ever reach the renderer (asserted below).
 *  - Rejected edges (CONTENT_REGISTRY §4.4) never appear as direct edges.
 *  - Concept-mediated relationships are never drawn as direct assignment edges.
 */
import { assignments } from '../../data/assignments';
import { concepts } from '../../data/concepts';
import { artifacts, artifactLinks } from '../../data/artifacts';
import { publicEdges, rejectedEdges } from '../../data/graph';
import type { Relationship, Tier, Track } from '../../data/types';
import { seedPosition } from './layout';

export type NodeType = 'assignment' | 'concept' | 'artifact';

export type ViewKind =
  | 'default'
  | 'track'
  | 'concept'
  | 'assignment'
  | 'browse-all'
  | 'concepts'
  | 'artifacts';

export interface ViewState {
  kind: ViewKind;
  track?: Track;
  concept?: string;
  node?: string;
  tier?: Tier | 'all';
}

/** Narrative weight, not importance (DESIGN_SPEC §12). Monotonic: core > supporting > reference. */
export const TIER_SIZE: Record<Tier, number> = {
  core: 1,
  supporting: 0.82,
  reference: 0.66,
};

export interface GraphNodeData {
  id: string;
  nodeType: NodeType;
  /** Underlying canonical id (assignment/concept/artifact id). */
  ref: string;
  label: string;
  track?: Track;
  tier?: Tier;
  strand?: string;
  officialCode?: string;
  /** Multiplicative size factor (tier for assignments; fixed for concepts/artifacts). */
  size: number;
  artifactType?: string;
}

export interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  relationship: Relationship;
  confidence: string;
  approved: true;
}

export interface GraphElement {
  group: 'nodes' | 'edges';
  data: GraphNodeData | GraphEdgeData;
  position?: { x: number; y: number };
}

export interface GraphElements {
  nodes: GraphElement[];
  edges: GraphElement[];
}

/** All canonical assignment ids (used by tests and the client). */
export const ALL_ASSIGNMENT_IDS = assignments.map((a) => a.id);
/** All canonical concept ids. */
export const ALL_CONCEPT_IDS = concepts.map((c) => c.id);
/** All canonical artifact ids. */
export const ALL_ARTIFACT_IDS = artifacts.map((a) => a.id);

const assignmentById = new Map(assignments.map((a) => [a.id, a]));
const conceptById = new Map(concepts.map((c) => [c.id, c]));
const artifactById = new Map(artifacts.map((a) => [a.id, a]));

/** Default anchor set: core-tier assignments + ML-01 (the ML entrance). */
export function defaultAnchorIds(): Set<string> {
  return new Set(
    assignments.filter((a) => a.tier === 'core' || a.id === 'ml-01-run-starter-notebooks').map((a) => a.id)
  );
}

function ids(list: string[]): Set<string> {
  return new Set(list);
}

/**
 * Computes which node ids are visible for a view state (before the tier filter).
 */
export function visibleIdsForKind(state: ViewState): {
  assignments: Set<string>;
  concepts: Set<string>;
  artifacts: Set<string>;
} {
  switch (state.kind) {
    case 'default':
      return { assignments: defaultAnchorIds(), concepts: ids(ALL_CONCEPT_IDS), artifacts: new Set() };
    case 'track': {
      const track: Track = state.track ?? 'ai-fluency';
      const as = new Set(assignments.filter((a) => a.track === track).map((a) => a.id));
      // Keep cross-track bridges from the other track so the cross-track story
      // stays visible; the chosen track remains dominant (dimmed in the client).
      for (const e of publicEdges) {
        if (e.relationship !== 'cross-track') continue;
        if (as.has(e.source)) as.add(e.target);
        if (as.has(e.target)) as.add(e.source);
      }
      const cs = new Set(concepts.filter((c) => c.assignments.some((id) => as.has(id))).map((c) => c.id));
      return { assignments: as, concepts: cs, artifacts: new Set() };
    }
    case 'concept': {
      const c = conceptById.get(state.concept ?? '');
      return {
        assignments: ids(c ? c.assignments : []),
        concepts: c ? new Set([c.id]) : new Set(),
        artifacts: new Set(),
      };
    }
    case 'assignment': {
      const a = assignmentById.get(state.node ?? '');
      const as = new Set<string>();
      if (a) {
        as.add(a.id);
        for (const e of publicEdges) {
          if (e.source === a.id) as.add(e.target);
          if (e.target === a.id) as.add(e.source);
        }
      }
      const linked = a ? artifactLinks.filter((l) => l.assignmentId === a.id).map((l) => l.artifactId) : [];
      return { assignments: as, concepts: ids(a ? a.concepts : []), artifacts: ids(linked) };
    }
    case 'browse-all':
      return { assignments: ids(ALL_ASSIGNMENT_IDS), concepts: ids(ALL_CONCEPT_IDS), artifacts: new Set() };
    case 'concepts':
      return { assignments: new Set(), concepts: ids(ALL_CONCEPT_IDS), artifacts: new Set() };
    case 'artifacts':
      return {
        assignments: ids(ALL_ASSIGNMENT_IDS),
        concepts: ids(ALL_CONCEPT_IDS),
        artifacts: ids(ALL_ARTIFACT_IDS),
      };
  }
}

/**
 * Builds Cytoscape elements for the given view state.
 *
 * Only `approved: true` public edges are ever included (publicEdges is already
 * filtered; this is asserted for auditability). Rejected edges are never drawn.
 */
export function buildGraphElements(state: ViewState): GraphElements {
  const visible = visibleIdsForKind(state);

  // Apply the tier filter to the assignment set.
  if (state.tier && state.tier !== 'all') {
    for (const id of [...visible.assignments]) {
      const a = assignmentById.get(id);
      if (!a || a.tier !== state.tier) visible.assignments.delete(id);
    }
  }

  // Edges: only approved public edges whose both endpoints are visible.
  const edges: GraphElement[] = [];
  const rejectedPairs = new Set<string>();
  for (const r of rejectedEdges) {
    rejectedPairs.add(`${r.source}::${r.target}`);
    rejectedPairs.add(`${r.target}::${r.source}`);
  }
  for (const e of publicEdges) {
    if (!visible.assignments.has(e.source) || !visible.assignments.has(e.target)) continue;
    // The calm default view shows only the strongest (high-confidence) edges
    // (IMPLEMENTATION_PLAN §2.1, DESIGN_SPEC §10). Other views show all approved edges.
    if (state.kind === 'default' && e.confidence !== 'high') continue;
    const pair = `${e.source}::${e.target}`;
    if (rejectedPairs.has(pair)) {
      // Rejected edges are asserted to be absent from publicEdges by the
      // validator; this is a defensive guard.
      continue;
    }
    if (e.approved !== true) continue;
    edges.push({
      group: 'edges',
      data: {
        id: `edge-${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
        relationship: e.relationship,
        confidence: e.confidence,
        approved: true,
      },
    });
  }

  // Nodes.
  const nodes: GraphElement[] = [];
  for (const id of visible.assignments) {
    const a = assignmentById.get(id);
    if (!a) continue;
    nodes.push({
      group: 'nodes',
      data: {
        id,
        nodeType: 'assignment',
        ref: id,
        label: a.officialCode ?? a.title,
        track: a.track,
        tier: a.tier,
        strand: a.strand,
        officialCode: a.officialCode,
        size: TIER_SIZE[a.tier],
      },
      position: seedPosition(id),
    });
  }
  for (const id of visible.concepts) {
    const c = conceptById.get(id);
    if (!c) continue;
    nodes.push({
      group: 'nodes',
      data: {
        id,
        nodeType: 'concept',
        ref: id,
        label: c.name.toUpperCase(),
        size: 1,
      },
      position: seedPosition(id),
    });
  }
  for (const id of visible.artifacts) {
    const art = artifactById.get(id);
    if (!art) continue;
    // An artifact is drawn at the centroid of the assignments that link to it,
    // offset slightly so it reads as a marker attached to the work.
    const linked = artifactLinks.filter((l) => l.artifactId === id).map((l) => l.assignmentId);
    let x = 0;
    let y = 0;
    let count = 0;
    for (const aid of linked) {
      const pos = seedPosition(aid);
      x += pos.x;
      y += pos.y;
      count++;
    }
    if (count > 0) {
      x = x / count + 34;
      y = y / count + 34;
    } else {
      x = 840;
      y = 470;
    }
    nodes.push({
      group: 'nodes',
      data: {
        id,
        nodeType: 'artifact',
        ref: id,
        label: art.title,
        artifactType: art.type,
        size: 1,
      },
      position: { x, y },
    });
  }

  return { nodes, edges };
}

/**
 * Returns the assignment id an artifact marker belongs to (its primary linked
 * assignment), used when an artifact is tapped so the panel can open.
 */
export function primaryAssignmentForArtifact(artifactId: string): string | undefined {
  const links = artifactLinks.filter((l) => l.artifactId === artifactId);
  return links[0]?.assignmentId;
}

/** The assignment id referenced by a node element (for assignment/concept/artifact). */
export function referenceId(data: GraphNodeData): string {
  return data.ref;
}

export { assignmentById, conceptById, artifactById };
