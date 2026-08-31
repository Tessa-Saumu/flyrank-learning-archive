/**
 * Data model — the typed source of truth for routes, search, filters, and
 * (Phase 2) the graph. Interfaces per PRODUCT_SPEC §27 and DESIGN_SPEC §43–45,
 * extended with `sourceAliases`, `strand`, and `displayLabel` as required by
 * the implementation plan.
 */

export type Track = 'ai-fluency' | 'machine-learning';

/**
 * AI Fluency has two visible strands plus a convergence node (FL-10).
 * Machine Learning is a single sequential spine.
 * Source: CONTENT_REGISTRY §1.1.
 */
export type Strand =
  | 'portfolio-public-work'
  | 'ai-systems-agents'
  | 'ml-spine'
  | 'convergence';

export type Tier = 'core' | 'supporting' | 'reference';

export type Status = 'complete' | 'in-progress' | 'upcoming';

export type EvidenceStatus =
  | 'available'
  | 'partial'
  | 'private'
  | 'missing'
  | 'not-applicable';

export interface Assignment {
  id: string;
  track: Track;
  title: string;
  displayLabel?: string;
  /**
   * Short graph-node descriptor (V2_IMPROVEMENT_SPEC §7): the shortest useful
   * label for the Knowledge Graph node, derived from the canonical title /
   * source aliases. Identifies the assignment without explaining it.
   */
  descriptor: string;
  officialCode?: string;
  sourceAliases?: string[];
  strand: Strand;
  tier: Tier;
  status: Status;
  evidenceStatus: EvidenceStatus;
  week?: number;
  workloadHours?: number;
  phase?: string;
  task?: string;
  lesson?: string;
  takeaway?: string;
  /** Canonical concept IDs this assignment maps to (CONTENT_REGISTRY §4.1). */
  concepts: string[];
  /** Canonical artifact IDs this assignment links to (CONTENT_REGISTRY §3.2). */
  artifactLinks: string[];
  sourceUrl?: string;
  sourceReference?: string;
  canonicalisationStatus?: 'unreviewed' | 'reviewed';
}

export interface Concept {
  id: string;
  name: string;
  description: string;
  assignments: string[];
}

export type ArtifactType =
  | 'live'
  | 'github'
  | 'pdf'
  | 'video'
  | 'document'
  | 'image'
  | 'other';

export interface Artifact {
  id: string;
  title: string;
  type: ArtifactType;
  url?: string;
  embedUrl?: string;
  previewImage?: string;
  description: string;
}

export type ArtifactRole = 'produces' | 'uses' | 'documents' | 'demonstrates';

export type DisplayMode = 'embed' | 'preview' | 'link';

export interface ArtifactLink {
  assignmentId: string;
  artifactId: string;
  role: ArtifactRole;
  displayMode: DisplayMode;
}

export type Relationship = 'builds-on' | 'connects-to' | 'cross-track';

export type Confidence = 'high' | 'medium' | 'low';

export type Evidence = 'explicit' | 'strong-inference' | 'editorial';

export interface GraphEdge {
  source: string;
  target: string;
  relationship: Relationship;
  confidence: Confidence;
  evidence: Evidence;
  approved: boolean;
  reason: string;
  sourceReference?: string;
  canonicalisationStatus?: 'unreviewed' | 'reviewed';
}

/**
 * A relationship explicitly NOT drawn as a direct edge; the connection is
 * expressed through one or more mediating concepts instead (CONTENT_REGISTRY §4.4).
 */
export interface RejectedEdge {
  source: string;
  target: string;
  relationship: string;
  decision: string;
  mediatingConcepts: string[];
}
