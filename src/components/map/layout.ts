/**
 * Deterministic seed layout (DESIGN_SPEC §10–14, IMPLEMENTATION_PLAN Task 2.1.5).
 *
 * The map uses a single fixed coordinate space so that every state is identical
 * on every load and never feels like random force-directed spaghetti. Concepts
 * form the central "connective tissue" band; the two tracks sit above and below
 * it; ML-01 sits at the far-left of the ML spine (the ML entrance).
 *
 * These coordinates are static and never randomised. Assignments/concepts that
 * are hidden in a given view keep their fixed positions and are simply not
 * added to the Cytoscape instance (so the default state stays calm).
 */

import type { Track } from '../../data/types';

export interface Point {
  x: number;
  y: number;
}

/** A fixed position for every possible graph node id. */
const POSITIONS: Record<string, Point> = {};

function row(ids: string[], y: number, startX: number, step: number): void {
  ids.forEach((id, i) => {
    POSITIONS[id] = { x: startX + i * step, y };
  });
}

/* -------- Concepts: central connective-tissue band (y = 470) -------- */
row(
  [
    'concept-problem-framing',
    'concept-data-evidence',
    'concept-baseline',
    'concept-evaluation',
    'concept-prompting',
    'concept-workflow-design',
    'concept-agents-tools',
    'concept-human-judgment',
    'concept-deployment',
    'concept-communication',
  ],
  470,
  120,
  160
);

/* -------- ML spine: lower band, ML-01 at the entrance (y = 690) -------- */
row(
  [
    'ml-01-run-starter-notebooks',
    'ml-02-research-question-lane',
    'ml-03-ml-task-framing',
    'ml-04-data-contract',
    'ml-07-baseline-action-score',
    'ml-08-capstone-modeling',
    'ml-09-validation-claim-audit',
    'ml-10-content-action-playbook',
    'ml-11-ship-paper',
    'ml-12-tell-story',
  ],
  690,
  120,
  160
);

/* -------- AI Fluency — AI Systems / Agents strand + convergence (y = 190) -------- */
row(
  [
    'fl-01-workflow-audit',
    'fl-prompt-ladder',
    'fl-02-prompting-fundamentals',
    'fl-04-automation-workflow',
    'fl-05-agent-mcp-basics',
    'fl-06-agent-design',
    'fl-07-build-agent',
    'fl-09-documentation-demo',
  ],
  190,
  120,
  150
);
// FL-10 convergence node reads as the meeting point of both AI Fluency strands.
POSITIONS['fl-10-final-package'] = { x: 1620, y: 190 };

/* -------- AI Fluency — Portfolio / Public Work strand (y = 330) -------- */
row(
  [
    'fl-portfolio-proof',
    'fl-portfolio-sitemap',
    'fl-portfolio-cases',
    'fl-identity-kit',
    'fl-curate-images',
    'fl-content-ctas',
    'fl-stack-choice',
    'fl-empty-live-page',
    'fl-explain-build',
    'pf-04-personal-website',
    'fl-dynamic-feature',
    'fl-mobile-audit',
    'fl-crit-review',
    'fl-site-hardening',
    'fl-domain-badge',
    'fl-maintenance-plan',
  ],
  330,
  90,
  102
);

/**
 * Returns the fixed seed position for a node id, or a default if unknown.
 */
export function seedPosition(id: string): Point {
  return POSITIONS[id] ?? { x: 840, y: 470 };
}

/**
 * Positions for a set of node ids, deterministically ordered by the fixed grid.
 */
export function positionsFor(ids: string[]): { id: string; position: Point }[] {
  return ids.map((id) => ({ id, position: seedPosition(id) }));
}

/** Map-space extent used to fit the whole graph. */
export const LAYOUT_WIDTH = 1760;
export const LAYOUT_HEIGHT = 860;

/** Tracks span the upper region; ML spans the lower; concepts sit between. */
export function trackRegion(track: Track): 'upper' | 'lower' {
  return track === 'ai-fluency' ? 'upper' : 'lower';
}
