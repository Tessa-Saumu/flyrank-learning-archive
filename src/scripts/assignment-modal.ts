/**
 * V2 assignment modal + lazy evidence activation (V2_IMPROVEMENT_SPEC §2–4).
 *
 * - Assignment cards keep their real `href` for no-JS/direct links, but with
 *   JavaScript enabled a click opens the complete assignment detail in an
 *   in-context modal (same page, scroll preserved).
 * - The modal fetches the existing static /work/[slug] route and injects the
 *   same `<main>` markup, so the visual is the existing assignment page placed
 *   above the current page.
 * - Evidence panels load their heavy viewer only after the visitor chooses
 *   `Show evidence`.
 */

import { initWorkFilter } from './work-filter';

let lastTrigger: HTMLElement | null = null;
let requestToken = 0;
let dialog: HTMLDialogElement | null = null;
let modalBody: HTMLElement | null = null;
let modalLabel: HTMLSpanElement | null = null;
let closeButton: HTMLButtonElement | null = null;

function appendMissingStyles(source: Document, target: Document): void {
  const existing = Array.from(target.querySelectorAll('style'));
  source.querySelectorAll('style').forEach((style) => {
    if (style.textContent && !existing.some((s) => s.textContent === style.textContent)) {
      target.head.appendChild(style);
    }
  });
  // Production builds ship component styles as external stylesheets rather
  // than inline <style> tags. Copy those too (deduped by href, root-relative
  // so they resolve from any host page) so the injected assignment page
  // renders with its real styles, not only the host page's.
  const existingLinks = new Set(
    Array.from(target.querySelectorAll<HTMLLinkElement>('head link[rel="stylesheet"]')).map(
      (l) => l.getAttribute('href')
    )
  );
  source.querySelectorAll('head link[rel="stylesheet"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && !existingLinks.has(href)) {
      target.head.appendChild(link.cloneNode());
      existingLinks.add(href);
    }
  });
}

function setModalLoading(id: string): void {
  if (!modalBody) return;
  clearEvidence(modalBody);
  modalBody.setAttribute('data-assignment-id', id);
  modalBody.innerHTML =
    '<p class="assignment-modal__loading">Loading record&hellip;</p>';
}

async function loadAssignment(id: string, path = `/work/${encodeURIComponent(id)}/`): Promise<void> {
  if (!modalBody) return;
  const token = ++requestToken;
  setModalLoading(id);

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Assignment load failed (${response.status})`);
    const html = await response.text();
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    const main = parsed.querySelector('main');
    if (!main) throw new Error('Assignment content not found');

    appendMissingStyles(parsed, document);

    if (token !== requestToken) return;
    modalBody.innerHTML = main.innerHTML;

    const crumbs = modalBody.querySelector('.crumbs');
    if (crumbs) crumbs.remove();

    const title = modalBody.querySelector<HTMLElement>('h1.detail__title, h1');
    if (title && modalLabel) modalLabel.textContent = title.textContent?.trim() || 'Assignment';
  } catch (error) {
    if (token !== requestToken) return;
    modalBody.innerHTML =
      '<p class="assignment-modal__error">This record could not be loaded. <a data-record-fallback>Open the full record instead.</a></p>';
    const fallback = modalBody.querySelector<HTMLAnchorElement>('[data-record-fallback]');
    if (fallback) fallback.href = path;
  }
}

function openAssignment(id: string, trigger: HTMLElement | null, path?: string): void {
  if (!dialog || !modalBody || !closeButton) return;
  if (!dialog.open) lastTrigger = trigger;
  document.body.style.overflow = 'hidden';
  document.body.setAttribute('data-modal-open', '');

  if (!dialog.open) {
    dialog.showModal();
    dialog.classList.add('is-open');
    closeButton.focus();
  }

  void loadAssignment(id, path);
}

function closeAssignment(): void {
  if (!dialog) return;
  if (dialog.open) dialog.close();
}

const evidenceCleanup = new WeakMap<HTMLElement, () => void>();

function clearEvidence(container: HTMLElement): void {
  container.querySelectorAll<HTMLElement>('[data-evidence-target]').forEach((target) => {
    evidenceCleanup.get(target)?.();
    target.querySelectorAll('video').forEach((video) => {
      video.pause();
      video.removeAttribute('src');
      video.load();
    });
    target.replaceChildren();
    target.hidden = true;
  });
}

async function revealEvidence(button: HTMLButtonElement): Promise<void> {
  const card = button.closest<HTMLElement>(
    '[data-artifact-embed], [data-artifact-preview], [data-artifact-link]'
  );
  if (!card) return;

  const src = card.getAttribute('data-src') || '';
  const kind = card.getAttribute('data-evidence-kind') || '';
  const target = card.querySelector<HTMLElement>('[data-evidence-target]');
  const feedback = card.querySelector<HTMLElement>('[data-evidence-feedback]');
  if (!target || !src || !['pdf', 'video', 'live'].includes(kind)) return;
  if (card.dataset.evidenceState === 'loading' || card.dataset.evidenceState === 'ready') return;

  evidenceCleanup.get(target)?.();
  target.replaceChildren();
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout>;
  const update = (state: string, message: string) => {
    if (controller.signal.aborted) return;
    card.dataset.evidenceState = state;
    button.disabled = state === 'loading' || state === 'ready';
    button.textContent = state === 'error' ? 'Retry evidence' : state === 'ready' ? 'Evidence shown' : 'Loading evidence';
    if (feedback) {
      feedback.hidden = false;
      feedback.textContent = message;
    }
    if (state !== 'loading') clearTimeout(timer);
  };
  evidenceCleanup.set(target, () => {
    controller.abort();
    clearTimeout(timer);
    card.dataset.evidenceState = 'idle';
    button.disabled = false;
    button.textContent = 'Show evidence';
    button.setAttribute('aria-expanded', 'false');
    if (feedback) feedback.hidden = true;
  });
  update('loading', 'Loading evidence. You can also open or download the original.');
  timer = setTimeout(() => update('error', 'The viewer is taking too long. Open the original or retry.'), 20000);
  target.hidden = false;
  button.setAttribute('aria-expanded', 'true');
  const failed = () => update('error', 'The viewer could not load. Open the original or retry.');
  const label = card.getAttribute('data-title') || 'Evidence';
  try {
    // Check same-origin PDF delivery before handing off to the browser viewer.
    // Cross-origin live frames cannot reliably report whether their content painted.
    if (kind === 'pdf' && new URL(src, location.href).origin === location.origin) {
      const response = await fetch(src, { method: 'HEAD', signal: controller.signal });
      if (!response.ok || !response.headers.get('content-type')?.includes('application/pdf')) {
        throw new Error('PDF is unavailable');
      }
    }
    if (controller.signal.aborted) return;
    if (kind === 'video') {
      const video = document.createElement('video');
      video.controls = true;
      video.preload = 'metadata';
      video.addEventListener('loadedmetadata', () => update('ready', 'Video ready.'), { signal: controller.signal });
      video.addEventListener('error', failed, { signal: controller.signal });
      video.src = src;
      video.title = label;
      target.appendChild(video);
    } else {
      const iframe = document.createElement('iframe');
      iframe.className = 'preview__frame';
      iframe.title = label;
      iframe.loading = 'lazy';
      iframe.addEventListener('load', () => update('ready', 'Viewer opened. If the evidence is not visible, open the original.'), { signal: controller.signal });
      iframe.addEventListener('error', failed, { signal: controller.signal });
      iframe.src = src;
      target.appendChild(iframe);
    }
  } catch {
    failed();
  }
}

function isAssignmentHref(href: string): string | null {
  // Matches /work/<assignment-id>/ with optional trailing slash and
  // ignores query/hash (e.g. /work/fl-01-workflow-audit/ -> fl-01-workflow-audit)
  // Does NOT match /work/ index or /work/?view=... or /work/?concept=...
  const path = href.split('?')[0].split('#')[0];
  const m = path.match(/^\/work\/([^/]+)\/?$/);
  return m ? decodeURIComponent(m[1]) : null;
}

function handleClick(event: MouseEvent): void {
  const target = event.target as HTMLElement | null;
  if (!target) return;

  const certificate = target.closest<HTMLAnchorElement>('a[data-certificate-card]');
  if (certificate && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    openAssignment(certificate.dataset.certificateId || '', certificate, certificate.getAttribute('href') || '');
    return;
  }

  const card = target.closest<HTMLElement>('[data-assignment-card]');
  if (card) {
    event.preventDefault();
    openAssignment(card.getAttribute('data-assignment-id') || '', card);
    return;
  }

  // V2 REVISION Phase 2 §10 — site-wide assignment modal convention.
  // Any anchor that points at an assignment detail page (/work/<id>/) opens
  // that assignment in the same modal, regardless of where the link appears:
  // home, work index, track pages, framework pages, concept pages, or the
  // connections list inside a detail page. This keeps one consistent modal
  // implementation rather than per-page logic, and preserves the href for
  // no-JS/direct linking. The graph's side panel remains separate — it is
  // not an assignment link and does not go through this path.
  const anchor = target.closest<HTMLAnchorElement>('a[href^="/work/"]');
  if (anchor) {
    const href = anchor.getAttribute('href') || '';
    const assignmentId = isAssignmentHref(href);
    if (assignmentId) {
      event.preventDefault();
      openAssignment(assignmentId, anchor);
      return;
    }
  }

  const close = target.closest<HTMLElement>('[data-modal-close]');
  if (close) {
    event.preventDefault();
    closeAssignment();
    return;
  }

  const show = target.closest<HTMLElement>('[data-show-evidence]');
  if (show && show instanceof HTMLButtonElement) {
    void revealEvidence(show);
    return;
  }
}

function initialize(): void {
  // This base-layout entry point is shipped on every page. The browse
  // component's side-effect-only script was omitted from production output.
  initWorkFilter();
  dialog = document.querySelector<HTMLDialogElement>('[data-assignment-modal] dialog');
  modalBody = document.querySelector<HTMLElement>('[data-assignment-modal] [data-modal-body]');
  modalLabel = document.querySelector<HTMLElement>('[data-assignment-modal] [data-modal-label]');
  closeButton = document.querySelector<HTMLButtonElement>('[data-assignment-modal] [data-modal-close]');
  if (!dialog || !modalBody) return;

  document.addEventListener('click', handleClick);

  dialog.addEventListener('close', () => {
    requestToken++;
    if (modalBody) clearEvidence(modalBody);
    dialog?.classList.remove('is-open');
    document.body.style.overflow = '';
    document.body.removeAttribute('data-modal-open');
    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
