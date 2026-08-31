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
}

function setModalLoading(id: string): void {
  if (!modalBody) return;
  modalBody.setAttribute('data-assignment-id', id);
  modalBody.innerHTML =
    '<p class="assignment-modal__loading">Loading assignment&hellip;</p>';
}

async function loadAssignment(id: string): Promise<void> {
  if (!modalBody) return;
  const token = ++requestToken;
  setModalLoading(id);

  try {
    const response = await fetch(`/work/${encodeURIComponent(id)}/`);
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
      '<p class="assignment-modal__error">This assignment could not be loaded. <a href="/work/">Open the work index instead.</a></p>';
  }
}

function openAssignment(id: string, trigger: HTMLElement | null): void {
  if (!dialog || !modalBody || !closeButton) return;
  if (!dialog.open) lastTrigger = trigger;
  document.body.style.overflow = 'hidden';
  document.body.setAttribute('data-modal-open', '');

  if (!dialog.open) {
    dialog.showModal();
    dialog.classList.add('is-open');
    closeButton.focus();
  }

  void loadAssignment(id);
}

function closeAssignment(): void {
  if (!dialog) return;
  if (dialog.open) dialog.close();
}

function revealEvidence(button: HTMLElement): void {
  const card = button.closest<HTMLElement>(
    '[data-artifact-embed], [data-artifact-preview], [data-artifact-link]'
  );
  if (!card) return;

  const src = card.getAttribute('data-src') || '';
  const type = card.getAttribute('data-type') || '';
  const target = card.querySelector<HTMLElement>('[data-evidence-target]');
  const pending = card.querySelector<HTMLElement>('[data-evidence-pending]');
  const fallback = card.querySelector<HTMLElement>('[data-embed-fallback]');

  card.classList.add('preview--is-revealed');

  if (pending && !src) pending.hidden = false;

  if (target && src && !target.dataset.loaded) {
    const label = card.getAttribute('data-title') || type || 'Evidence';
    if (type === 'video') {
      const video = document.createElement('video');
      video.controls = true;
      video.preload = 'none';
      video.src = src;
      video.title = label;
      target.appendChild(video);
    } else {
      const iframe = document.createElement('iframe');
      iframe.className = 'preview__frame';
      iframe.title = label;
      iframe.loading = 'lazy';
      iframe.src = src;
      target.appendChild(iframe);
    }
    target.dataset.loaded = 'true';
  }

  if (target && src) target.hidden = false;
  if (fallback && src) fallback.hidden = true;
}

function handleClick(event: MouseEvent): void {
  const target = event.target as HTMLElement | null;
  if (!target) return;

  const card = target.closest<HTMLElement>('[data-assignment-card]');
  if (card) {
    event.preventDefault();
    openAssignment(card.getAttribute('data-assignment-id') || '', card);
    return;
  }

  const close = target.closest<HTMLElement>('[data-modal-close]');
  if (close) {
    event.preventDefault();
    closeAssignment();
    return;
  }

  const show = target.closest<HTMLElement>('[data-show-evidence]');
  if (show && show instanceof HTMLButtonElement) {
    revealEvidence(show);
    return;
  }

  // Inside the modal, assignment links open the next assignment in the same
  // modal rather than navigating away from the underlying page.
  if (dialog?.open && modalBody?.contains(target)) {
    const nextWork = target.closest<HTMLAnchorElement>('a[href^="/work/"]');
    if (nextWork) {
      event.preventDefault();
      const id = decodeURIComponent(nextWork.getAttribute('href') || '').replace(/^\/work\//, '').replace(/\/$/, '');
      openAssignment(id, nextWork);
    }
  }
}

function initialize(): void {
  dialog = document.querySelector<HTMLDialogElement>('[data-assignment-modal] dialog');
  modalBody = document.querySelector<HTMLElement>('[data-assignment-modal] [data-modal-body]');
  modalLabel = document.querySelector<HTMLElement>('[data-assignment-modal] [data-modal-label]');
  closeButton = document.querySelector<HTMLButtonElement>('[data-assignment-modal] [data-modal-close]');
  if (!dialog || !modalBody) return;

  document.addEventListener('click', handleClick);

  dialog.addEventListener('close', () => {
    requestToken++;
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
