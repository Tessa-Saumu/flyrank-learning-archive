/**
 * Client-side detail panel renderer for the Learning Map (Task 2.3.5).
 *
 * The Phase 1 DetailPanel is server-rendered for the static /work/[slug] route.
 * In the map, the panel must update without a page reload, so the same typed
 * data modules are rendered client-side here. It mirrors the DetailPanel
 * structure (code / metadata / title, three beats, PROOF, Connections) so the
 * map is never the only route to the content. No copy lives in this file.
 */
import { assignmentById, artifactById, conceptById } from './adapter';
import { artifactLinks } from '../../data/artifacts';
import { publicEdges } from '../../data/graph';
import { notebookForAssignment } from '../../data/notebooks';
import {
  evidenceStatusLabel,
  relationshipLabel,
  trackLabel,
} from '../../lib/archive';
import type { Assignment, Artifact, ArtifactLink } from '../../data/types';

function escapeHtml(s: string | undefined): string {
  return (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Client-side equivalent of ArtifactPreview for the map panel. Renders the
 * same display modes (CONTENT_REGISTRY §3.1) without an iframe (the map panel
 * is intentionally light; deeper inspection links to the full /work page, which
 * renders the real ArtifactPreview with lazy embeds). Status is always shown
 * with text, never colour alone (DESIGN_SPEC §25).
 */
function renderArtifactPanel(assignmentId: string, art: Artifact, link: ArtifactLink): string {
  const role = { produces: 'Produces', uses: 'Uses', documents: 'Documents', demonstrates: 'Demonstrates' }[link.role];
  const hasUrl = Boolean(art.url);
  const mode = link.displayMode;

  if (mode === 'link') {
    return `
      <div class="panel__artifact panel__artifact--link">
        <span class="panel__artifact-meta">${escapeHtml(art.type)} · ${role}</span>
        <span class="panel__artifact-title">${escapeHtml(art.title)}</span>
        ${hasUrl ? `<a class="panel__artifact-link" href="${escapeHtml(art.url)}" rel="noopener noreferrer">Open ↗</a>` : `<span class="panel__artifact-link panel__artifact-link--pending">Link pending</span>`}
      </div>`;
  }

  const notebook = notebookForAssignment(assignmentId);
  if (mode === 'embed' && notebook) {
    return `
      <article class="panel__artifact panel__artifact--notebook">
        <span class="panel__artifact-meta">${escapeHtml(art.type)} · ${role} · ${escapeHtml(notebook.filename)}</span>
        <h3 class="panel__artifact-title">${escapeHtml(art.title)}</h3>
        <p class="panel__artifact-desc">${escapeHtml(notebook.outcome)}</p>
        <p class="panel__artifact-pending">Evidence (charts, metric table, code excerpt) attaches here when supplied.</p>
      </article>`;
  }

  // preview + embed (without a notebook) render as a compact evidence card.
  return `
    <article class="panel__artifact">
      <span class="panel__artifact-meta">${escapeHtml(art.type)} · ${role}</span>
      <h3 class="panel__artifact-title">${escapeHtml(art.title)}</h3>
      <p class="panel__artifact-desc">${escapeHtml(art.description)}</p>
      <div class="panel__artifact-foot">
        <span class="panel__status">${escapeHtml(evidenceStatusLabel('partial'))}</span>
        ${hasUrl ? `<a class="panel__artifact-link" href="${escapeHtml(art.url)}" rel="noopener noreferrer">Open artifact ↗</a>` : `<span class="panel__artifact-link panel__artifact-link--pending">Link pending</span>`}
      </div>
    </article>`;
}

export function renderAssignmentPanel(container: HTMLElement, a: Assignment): void {
  const metaParts: string[] = [];
  if (a.week !== undefined) metaParts.push(`Week ${a.week}`);
  metaParts.push(trackLabel(a.track), a.tier.toUpperCase());
  const metaLine = metaParts.join(' · ');

  const concepts = a.concepts.map((id) => conceptById.get(id)).filter(Boolean);
  const links = artifactLinks.filter((l) => l.assignmentId === a.id);
  const edges = publicEdges.filter((e) => e.source === a.id || e.target === a.id);

  const code = a.officialCode ?? a.title;

  const conceptChips = concepts
    .map((c) => `<a class="panel__chip" href="/concepts/${c!.id}/">${escapeHtml(c!.name)}</a>`)
    .join('');

  const artifactCards = links
    .map((l) => {
      const art = artifactById.get(l.artifactId);
      if (!art) return '';
      return renderArtifactPanel(a.id, art, l);
    })
    .join('');

  const edgeItems = edges
    .map((e) => {
      const otherId = e.source === a.id ? e.target : e.source;
      const other = assignmentById.get(otherId);
      if (!other) return '';
      return `
        <li class="panel__edge">
          <span class="panel__edge-rel">${escapeHtml(relationshipLabel(e.relationship))}</span>
          <a href="/work/${escapeHtml(other.id)}/">${escapeHtml(other.title)}</a>
          ${e.relationship === 'cross-track' ? '<span class="panel__edge-track">cross-track</span>' : ''}
        </li>`;
    })
    .join('');

  container.innerHTML = `
    <article class="panel__detail">
      <header class="panel__header">
        <p class="panel__code">${escapeHtml(code)}</p>
        <p class="panel__meta">${escapeHtml(metaLine)}</p>
        <h2 class="panel__title">${escapeHtml(a.title)}</h2>
      </header>
      <div class="panel__beats">
        <section class="panel__beat">
          <h3 class="panel__beat-label">Task</h3>
          <p class="panel__beat-body">${escapeHtml(a.task)}</p>
        </section>
        <section class="panel__beat">
          <h3 class="panel__beat-label">Lesson</h3>
          <p class="panel__beat-body">${escapeHtml(a.lesson)}</p>
        </section>
        <section class="panel__beat">
          <h3 class="panel__beat-label">Takeaway</h3>
          <p class="panel__beat-body">${escapeHtml(a.takeaway)}</p>
        </section>
      </div>
      <section class="panel__section">
        <h3 class="panel__section-label">Proof</h3>
        <div class="panel__artifacts">${artifactCards || '<p class="panel__none">No proof artifact listed.</p>'}</div>
      </section>
      ${conceptChips || edgeItems ? `
        <section class="panel__section">
          <h3 class="panel__section-label">Connections</h3>
          ${conceptChips ? `<div class="panel__chips">${conceptChips}</div>` : ''}
          ${edgeItems ? `<ul class="panel__edges">${edgeItems}</ul>` : ''}
        </section>` : ''}
      <a class="panel__full" href="/work/${escapeHtml(a.id)}/">Open full record →</a>
    </article>
  `;
}

export function renderConceptPanel(container: HTMLElement, conceptId: string): void {
  const c = conceptById.get(conceptId);
  if (!c) return;
  const items = c.assignments
    .map((id) => assignmentById.get(id))
    .filter(Boolean)
    .map((a) => `<li><a href="/work/${escapeHtml(a!.id)}/">${escapeHtml(a!.title)}</a></li>`)
    .join('');
  container.innerHTML = `
    <article class="panel__detail">
      <header class="panel__header">
        <p class="panel__eyebrow">Concept</p>
        <h2 class="panel__title">${escapeHtml(c.name)}</h2>
      </header>
      <p class="panel__beat-body">${escapeHtml(c.description)}</p>
      <section class="panel__section">
        <h3 class="panel__section-label">Assignments it connects</h3>
        <ul class="panel__edges">${items}</ul>
      </section>
      <p class="panel__note">This concept mediates relationships between the assignments above.</p>
    </article>
  `;
}

export function renderEmptyPanel(container: HTMLElement): void {
  container.innerHTML = '';
}
