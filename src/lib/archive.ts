/**
 * Read-only lookup helpers over the validated data modules.
 * Components are dumb renderers; all content lives in `src/data/*`.
 */
import { assignments } from '../data/assignments';
import { concepts } from '../data/concepts';
import { artifacts, artifactLinks } from '../data/artifacts';
import { publicEdges } from '../data/graph';
import type {
  Assignment,
  Artifact,
  ArtifactLink,
  Concept,
  GraphEdge,
  Strand,
  Tier,
  Track,
} from '../data/types';

export const assignmentById = new Map(assignments.map((a) => [a.id, a]));
export const conceptById = new Map(concepts.map((c) => [c.id, c]));
export const artifactById = new Map(artifacts.map((a) => [a.id, a]));

export function getAssignment(id: string): Assignment | undefined {
  return assignmentById.get(id);
}

export function getConcept(id: string): Concept | undefined {
  return conceptById.get(id);
}

export function getArtifact(id: string): Artifact | undefined {
  return artifactById.get(id);
}

/** Concepts mapped to an assignment (in registry order). */
export function conceptsForAssignment(id: string): Concept[] {
  const a = assignmentById.get(id);
  if (!a) return [];
  return a.concepts.map((cid) => conceptById.get(cid)).filter((c): c is Concept => Boolean(c));
}

/** Artifacts linked from an assignment, with their role + display mode. */
export function artifactsForAssignment(id: string): { artifact: Artifact; link: ArtifactLink }[] {
  return artifactLinks
    .filter((l) => l.assignmentId === id)
    .map((l) => ({ artifact: artifactById.get(l.artifactId), link: l }))
    .filter((x): x is { artifact: Artifact; link: ArtifactLink } => Boolean(x.artifact));
}

/** Assignments mapped to a concept (in registry order). */
export function assignmentsForConcept(id: string): Assignment[] {
  const c = conceptById.get(id);
  if (!c) return [];
  return c.assignments.map((aid) => assignmentById.get(aid)).filter((a): a is Assignment => Boolean(a));
}

export interface EdgeWithTarget {
  edge: GraphEdge;
  other: Assignment;
}

/** Approved direct edges touching an assignment (either direction). */
export function edgesForAssignment(id: string): EdgeWithTarget[] {
  return publicEdges
    .filter((e) => e.source === id || e.target === id)
    .map((e) => {
      const otherId = e.source === id ? e.target : e.source;
      const other = assignmentById.get(otherId);
      return other ? { edge: e, other } : null;
    })
    .filter((x): x is EdgeWithTarget => Boolean(x));
}

/** Assignments in a given strand, ordered by week then title. */
export function assignmentsByStrand(strand: Strand): Assignment[] {
  return assignments
    .filter((a) => a.strand === strand)
    .sort((a, b) => (a.week ?? 0) - (b.week ?? 0) || a.title.localeCompare(b.title));
}

/**
 * Canonical learning-path sequences per strand, following PRODUCT_SPEC §11.
 * ML-01 sits visibly at the ML entrance; AI Fluency has two strands that
 * converge at FL-10. Assignments the §11 path omits (e.g. `fl-identity-kit`,
 * `fl-curate-images`, `fl-explain-build`) are inserted at their registry week.
 */
const STRAND_ORDER: Record<Strand, string[]> = {
  'ml-spine': [
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
  'portfolio-public-work': [
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
  'ai-systems-agents': [
    'fl-01-workflow-audit',
    'fl-prompt-ladder',
    'fl-02-prompting-fundamentals',
    'fl-04-automation-workflow',
    'fl-05-agent-mcp-basics',
    'fl-06-agent-design',
    'fl-07-build-agent',
    'fl-09-documentation-demo',
  ],
  convergence: ['fl-10-final-package'],
};

/** Assignments in a strand, in canonical §11 learning-path order. */
export function orderedAssignmentsForStrand(strand: Strand): Assignment[] {
  return STRAND_ORDER[strand]
    .map((id) => assignmentById.get(id))
    .filter((a): a is Assignment => Boolean(a));
}

/** Assignments in a given track, ordered by week then title. */
export function assignmentsByTrack(track: Track): Assignment[] {
  return assignments
    .filter((a) => a.track === track)
    .sort((a, b) => (a.week ?? 0) - (b.week ?? 0) || a.title.localeCompare(b.title));
}

/** Assignments in a given tier. */
export function assignmentsByTier(tier: Tier): Assignment[] {
  return assignments.filter((a) => a.tier === tier);
}

/* -------- Display labels (never hard-coded counts; only labels) -------- */

export function trackLabel(track: Track): string {
  return track === 'machine-learning' ? 'Machine Learning' : 'AI Fluency';
}

export function strandLabel(strand: Strand): string {
  switch (strand) {
    case 'portfolio-public-work':
      return 'Portfolio / Public Work';
    case 'ai-systems-agents':
      return 'AI Systems / Agents';
    case 'ml-spine':
      return 'ML spine';
    case 'convergence':
      return 'Convergence';
  }
}

export function tierLabel(tier: Tier): string {
  switch (tier) {
    case 'core':
      return 'Core';
    case 'supporting':
      return 'Supporting';
    case 'reference':
      return 'Reference';
  }
}

export function relationshipLabel(rel: GraphEdge['relationship']): string {
  switch (rel) {
    case 'builds-on':
      return 'builds on';
    case 'connects-to':
      return 'connects to';
    case 'cross-track':
      return 'cross-track';
  }
}

export function evidenceStatusLabel(status: Assignment['evidenceStatus']): string {
  switch (status) {
    case 'available':
      return 'Evidence: available';
    case 'partial':
      return 'Evidence: partial';
    case 'private':
      return 'Evidence: private';
    case 'missing':
      return 'Evidence: missing';
    case 'not-applicable':
      return 'Evidence: not applicable';
  }
}

/** Compact display label: official code when present, otherwise the title. */
export function displayLabel(a: Assignment): string {
  return a.officialCode ?? a.title;
}

/** The single visible metadata line, e.g. "WEEK 6 · MACHINE LEARNING · CORE". */
export function metadataLine(a: Assignment): string {
  const parts: string[] = [];
  if (a.week !== undefined) parts.push(`Week ${a.week}`);
  parts.push(trackLabel(a.track));
  parts.push(tierLabel(a.tier));
  return parts.join(' · ');
}
