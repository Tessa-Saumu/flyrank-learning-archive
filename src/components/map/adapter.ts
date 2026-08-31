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

/**
 * Edge relationship kinds produced for the renderer. The three canonical
 * assignment relationships come from the graph data model; `concept` and
 * `artifact` are connective edges derived from the concept `assignments`
 * mapping (CONTENT_REGISTRY §4.1) and the `artifactLinks` mapping (§3.2).
 * These are subordinate to the dependency edges and carry no direction.
 */
export type EdgeRelationship = Relationship | 'concept' | 'artifact';

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
  /** Short node label (V2 §7 descriptor for assignments; name for concepts/artifacts). */
  label: string;
  /** Full canonical title/name for the hover tooltip (V2 §8). */
  title?: string;
  /** Short canonical description for the hover tooltip (V2 §8). */
  description?: string;
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
  relationship: EdgeRelationship;
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
  let visibleAssignments: Set<string>;
  let visibleConcepts: Set<string>;

  switch (state.kind) {
    case 'default':
      visibleAssignments = defaultAnchorIds();
      visibleConcepts = ids(ALL_CONCEPT_IDS);
      break;
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
      visibleAssignments = as;
      visibleConcepts = cs;
      break;
    }
    case 'concept': {
      const c = conceptById.get(state.concept ?? '');
      visibleAssignments = ids(c ? c.assignments : []);
      visibleConcepts = c ? new Set([c.id]) : new Set();
      break;
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
      visibleAssignments = as;
      visibleConcepts = ids(a ? a.concepts : []);
      break;
    }
    case 'browse-all':
      visibleAssignments = ids(ALL_ASSIGNMENT_IDS);
      visibleConcepts = ids(ALL_CONCEPT_IDS);
      break;
    case 'concepts':
      visibleAssignments = new Set();
      visibleConcepts = ids(ALL_CONCEPT_IDS);
      break;
    case 'artifacts':
      visibleAssignments = ids(ALL_ASSIGNMENT_IDS);
      visibleConcepts = ids(ALL_CONCEPT_IDS);
      break;
  }

  // Artifact visibility (V2 §11). Artifacts are visible by default: any
  // artifact linked to a visible assignment is shown. The concept-only view
  // shows no assignments and therefore no artifacts; the dedicated `artifacts`
  // view exposes the full artifact set.
  const visibleArtifacts = new Set<string>();
  if (state.kind === 'artifacts') {
    for (const id of ALL_ARTIFACT_IDS) visibleArtifacts.add(id);
  } else if (state.kind !== 'concepts') {
    for (const l of artifactLinks) {
      if (visibleAssignments.has(l.assignmentId)) visibleArtifacts.add(l.artifactId);
    }
  }

  return { assignments: visibleAssignments, concepts: visibleConcepts, artifacts: visibleArtifacts };
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

  // Connective edges — concept mappings (V2 §10.2) and artifact links
  // (V2 §11). These are derived from the canonical data model (concept
  // `assignments` and `artifactLinks`) so no concept or artifact floats
  // without an intentional relationship. They render subordinate to the
  // dependency edges and carry no arrowhead.
  for (const cid of visible.concepts) {
    const c = conceptById.get(cid);
    if (!c) continue;
    for (const aid of c.assignments) {
      if (!visible.assignments.has(aid)) continue;
      edges.push({
        group: 'edges',
        data: {
          id: `edge-concept-${aid}-${cid}`,
          source: aid,
          target: cid,
          relationship: 'concept',
          confidence: 'high',
          approved: true,
        },
      });
    }
  }
  for (const l of artifactLinks) {
    if (!visible.artifacts.has(l.artifactId) || !visible.assignments.has(l.assignmentId)) continue;
    edges.push({
      group: 'edges',
      data: {
        id: `edge-artifact-${l.assignmentId}-${l.artifactId}`,
        source: l.assignmentId,
        target: l.artifactId,
        relationship: 'artifact',
        confidence: 'high',
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
        label: a.descriptor ?? a.title,
        title: a.title,
        description: a.task,
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
        title: c.name,
        description: c.description,
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
        title: art.title,
        description: art.description,
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
