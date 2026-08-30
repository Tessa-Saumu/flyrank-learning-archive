/**
 * Adapter unit tests (IMPLEMENTATION_PLAN §2.6 — Node, no browser).
 *
 * These run under the Playwright node runner (esbuild TS transform, no browser
 * required) and assert the pure data-to-renderer contract:
 *  - node count by type per view
 *  - edge count = 34 in browse-all; 18 in the calm default
 *  - no `approved: false` edges ever reach the renderer
 *  - rejected-edge pairs are absent as direct edges
 *  - every concept's members match the locked registry
 *  - tier→size mapping is monotonic (core > supporting > reference)
 */
import { test, expect } from '@playwright/test';
import { buildGraphElements, TIER_SIZE, defaultAnchorIds } from '../src/components/map/adapter';
import { concepts } from '../src/data/concepts';
import { rejectedEdges } from '../src/data/graph';
import { assignments } from '../src/data/assignments';

function typeOf(n: { data: { nodeType: string } }): string {
  return n.data.nodeType;
}

function refOf(n: { data: { ref: string } }): string {
  return n.data.ref;
}

test('default view: calm anchor state', () => {
  const { nodes, edges } = buildGraphElements({ kind: 'default', tier: 'all' });
  const assignments = nodes.filter((n) => typeOf(n) === 'assignment');
  const conceptsEls = nodes.filter((n) => typeOf(n) === 'concept');

  // Exactly 10 concept nodes + 19 anchors (18 core + ML-01).
  expect(conceptsEls.length).toBe(10);
  expect(assignments.length).toBe(19);
  expect(defaultAnchorIds().size).toBe(19);

  // ML-01 sits visibly at the ML entrance.
  expect(assignments.some((n) => refOf(n) === 'ml-01-run-starter-notebooks')).toBe(true);

  // No reference-tier nodes in the default view.
  const refTier = assignments.filter((n) => (n.data as { tier?: string }).tier === 'reference');
  expect(refTier.length).toBe(0);

  // Only approved high-confidence edges, calm default.
  expect(edges.length).toBe(18);
  for (const e of edges) {
    expect(e.data.approved).toBe(true);
    expect((e.data as { confidence: string }).confidence).toBe('high');
  }
});

test('browse-all view: full archive', () => {
  const { nodes, edges } = buildGraphElements({ kind: 'browse-all', tier: 'all' });
  expect(nodes.filter((n) => typeOf(n) === 'assignment').length).toBe(35);
  expect(nodes.filter((n) => typeOf(n) === 'concept').length).toBe(10);
  // All 34 approved public edges.
  expect(edges.length).toBe(34);
  for (const e of edges) expect(e.data.approved).toBe(true);
});

test('never emits an unapproved edge', () => {
  for (const kind of ['default', 'track', 'browse-all'] as const) {
    const { edges } = buildGraphElements({ kind, tier: 'all' } as { kind: 'default' | 'track' | 'browse-all' });
    expect(edges.length).toBeGreaterThan(0);
    for (const e of edges) expect(e.data.approved).toBe(true);
  }
});

test('rejected-edge pairs never appear as direct edges', () => {
  const pairs = new Set<string>();
  for (const r of rejectedEdges) {
    pairs.add(`${r.source}::${r.target}`);
    pairs.add(`${r.target}::${r.source}`);
  }
  // browse-all is the superset view; if they are absent here they are absent everywhere.
  const { edges } = buildGraphElements({ kind: 'browse-all', tier: 'all' });
  for (const e of edges) {
    const d = e.data as { source: string; target: string };
    expect(pairs.has(`${d.source}::${d.target}`)).toBe(false);
    expect(pairs.has(`${d.target}::${d.source}`)).toBe(false);
  }
});

test('every concept view exposes exactly its locked members', () => {
  for (const c of concepts) {
    const { nodes } = buildGraphElements({ kind: 'concept', concept: c.id, tier: 'all' });
    const members = nodes.filter((n) => typeOf(n) === 'assignment').map((n) => refOf(n)).sort();
    expect(members).toEqual([...c.assignments].sort());
  }
});

test('concept selection promotes reference-tier assignments', () => {
  // Human Judgment maps fl-curate-images (reference tier); selecting the
  // concept must make it visible (tier promotion per DESIGN_SPEC §16/§49).
  const { nodes } = buildGraphElements({ kind: 'concept', concept: 'concept-human-judgment', tier: 'all' });
  const refs = nodes.filter((n) => typeOf(n) === 'assignment').map((n) => refOf(n));
  expect(refs).toContain('fl-curate-images');
});

test('tier size mapping is monotonic (core > supporting > reference)', () => {
  expect(TIER_SIZE.core).toBeGreaterThan(TIER_SIZE.supporting);
  expect(TIER_SIZE.supporting).toBeGreaterThan(TIER_SIZE.reference);
});

test('track view keeps cross-track bridges from the other track', () => {
  const { nodes } = buildGraphElements({ kind: 'track', track: 'ai-fluency', tier: 'all' });
  const assignmentRefs = nodes.filter((n) => typeOf(n) === 'assignment').map((n) => refOf(n));
  const inTrack = assignmentRefs.filter((id) => {
    const a = assignments.find((x) => x.id === id);
    return a && a.track === 'ai-fluency';
  });
  // Both AI Fluency strands are represented, plus cross-track ML bridges.
  expect(inTrack.length).toBe(25); // 25 AI Fluency assignments
  expect(assignmentRefs).toContain('ml-02-research-question-lane');
  expect(assignmentRefs).toContain('ml-11-ship-paper');
  expect(assignmentRefs).toContain('ml-12-tell-story');
});

test('assignment view: node plus immediate neighbourhood plus artifacts', () => {
  const { nodes } = buildGraphElements({ kind: 'assignment', node: 'ml-09-validation-claim-audit', tier: 'all' });
  const assignments = nodes.filter((n) => typeOf(n) === 'assignment').map((n) => refOf(n));
  expect(assignments).toContain('ml-09-validation-claim-audit');
  // Direct-edge neighbours (ml-08 builds on → ml-09; ml-09 → ml-10).
  expect(assignments).toContain('ml-08-capstone-modeling');
  expect(assignments).toContain('ml-10-content-action-playbook');
  // Its linked concepts appear.
  const conceptsEls = nodes.filter((n) => typeOf(n) === 'concept').map((n) => refOf(n));
  expect(conceptsEls).toContain('concept-evaluation');
  // Its proof artifact marker appears.
  const artifactsEls = nodes.filter((n) => typeOf(n) === 'artifact');
  expect(artifactsEls.length).toBeGreaterThan(0);
});

test('artifacts view exposes all 11 shared artifacts', () => {
  const { nodes } = buildGraphElements({ kind: 'artifacts', tier: 'all' });
  expect(nodes.filter((n) => typeOf(n) === 'artifact').length).toBe(11);
});
