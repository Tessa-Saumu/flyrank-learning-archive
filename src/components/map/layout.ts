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

/* ------------------------------------------------------------------ *
 * Artifact placement (V2 REVISION Phase 1 §2)
 * ------------------------------------------------------------------ */

/** Minimum centre-to-centre distance between two artifact nodes (map units). */
export const ARTIFACT_CLEARANCE = 88;
/** Minimum distance from an artifact node to an assignment/concept centre. */
export const ARTIFACT_NODE_CLEARANCE = 54;
/** An artifact never drifts further than this from its anchor. */
export const ARTIFACT_MAX_DRIFT = 160;
/** Orbit radius for a lone artifact attached to an anchor. */
export const ARTIFACT_ORBIT = 46;
/** Extra orbit radius added per additional artifact sharing an anchor. */
export const ARTIFACT_ORBIT_STEP = 18;

export interface ArtifactAnchor {
  /** Artifact node id. */
  id: string;
  /** The point the artifact belongs to (centroid of the work that cites it). */
  anchor: Point;
}

/**
 * Places artifact nodes around their anchors.
 *
 * Two artifacts attached to the same work used to be drawn at exactly the same
 * coordinate, so they stacked on top of one another and only the last one was
 * readable. This is deterministic and content-driven:
 *
 *  1. artifacts sharing an anchor are spread evenly on a circle around it
 *     (first one due north, then clockwise), with the orbit growing as the
 *     count grows, so the shape stays legible as artifact count increases;
 *  2. a fixed-order relaxation pass then separates any pair that is still
 *     closer than `ARTIFACT_CLEARANCE` and pushes artifacts clear of the
 *     assignment/concept nodes, while a tether keeps each artifact near its
 *     anchor so the relationship still reads at a glance.
 *
 * Pure function of its inputs — the same anchors always produce the same
 * positions, so the graph never jitters between renders or reloads.
 */
export function artifactLayout(anchors: ArtifactAnchor[], obstacles: Point[] = []): Map<string, Point> {
  const placed = new Map<string, Point>();
  const anchorOf = new Map<string, Point>();
  for (const a of anchors) anchorOf.set(a.id, a.anchor);
  const ids = anchors.map((a) => a.id);

  // 1 — group by anchor and spread each group on a circle.
  const groups = new Map<string, ArtifactAnchor[]>();
  for (const a of anchors) {
    // Rounded to an 8-unit grid so near-identical centroids group together.
    const key = `${Math.round(a.anchor.x / 8)}:${Math.round(a.anchor.y / 8)}`;
    const list = groups.get(key);
    if (list) list.push(a);
    else groups.set(key, [a]);
  }
  for (const group of groups.values()) {
    const n = group.length;
    const radius = n === 1 ? ARTIFACT_ORBIT : ARTIFACT_ORBIT + ARTIFACT_ORBIT_STEP * (n - 1);
    group.forEach((item, i) => {
      const angle = ((-90 + (360 / n) * i) * Math.PI) / 180;
      placed.set(item.id, {
        x: item.anchor.x + radius * Math.cos(angle),
        y: item.anchor.y + radius * Math.sin(angle),
      });
    });
  }

  // 2 — deterministic relaxation: separate artifacts, avoid nodes, stay tethered.
  for (let iteration = 0; iteration < 40; iteration++) {
    let moved = false;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = placed.get(ids[i])!;
        const b = placed.get(ids[j])!;
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let d = Math.hypot(dx, dy);
        if (d >= ARTIFACT_CLEARANCE) continue;
        if (d < 0.001) {
          // Degenerate overlap: separate along a deterministic axis.
          dx = 1;
          dy = 0;
          d = 1;
        }
        const push = (ARTIFACT_CLEARANCE - d) / 2;
        const ux = dx / d;
        const uy = dy / d;
        a.x -= ux * push;
        a.y -= uy * push;
        b.x += ux * push;
        b.y += uy * push;
        moved = true;
      }

      const p = placed.get(ids[i])!;
      for (const o of obstacles) {
        const dx = p.x - o.x;
        const dy = p.y - o.y;
        const d = Math.hypot(dx, dy);
        if (d >= ARTIFACT_NODE_CLEARANCE) continue;
        const ux = d < 0.001 ? 1 : dx / d;
        const uy = d < 0.001 ? 0 : dy / d;
        p.x = o.x + ux * ARTIFACT_NODE_CLEARANCE;
        p.y = o.y + uy * ARTIFACT_NODE_CLEARANCE;
        moved = true;
      }

      // Keep the artifact tethered to its anchor: relaxation may push it
      // around, but never further than the maximum drift, so the artifact
      // still visibly belongs to the work it cites.
      const anchor = anchorOf.get(ids[i])!;
      const offX = p.x - anchor.x;
      const offY = p.y - anchor.y;
      const drift = Math.hypot(offX, offY);
      if (drift > ARTIFACT_MAX_DRIFT) {
        p.x = anchor.x + (offX / drift) * ARTIFACT_MAX_DRIFT;
        p.y = anchor.y + (offY / drift) * ARTIFACT_MAX_DRIFT;
      }
    }
    if (!moved) break;
  }

  // Round once so the output is stable and serialisable.
  for (const [id, p] of placed) placed.set(id, { x: Math.round(p.x), y: Math.round(p.y) });
  return placed;
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
