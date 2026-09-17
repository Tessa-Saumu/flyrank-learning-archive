/**
 * work-filter.ts — Shared Work filter and search controller (V2 REVISION Phase 3 §15).
 *
 * Provides identical, client-side category filtering (All · AI Fluency ·
 * Machine Learning · Concepts) across both the dedicated /work/ page and the
 * homepage #browse section without navigating away.
 *
 * Key behaviors:
 * 1. Category tab click: immediately filters the assignment cards in place.
 *    - 'all': shows all 35 assignments across both tracks.
 *    - 'ai-fluency': shows only the 25 AI Fluency assignments (ML track hidden).
 *    - 'machine-learning': shows only the 10 Machine Learning assignments (AI Fluency track hidden).
 *    - 'concepts': on /work/, toggles to the concepts grid without page reload;
 *      on homepage, navigates to /work/?view=concepts.
 * 2. Obvious active filter state: active tab gets `.is-active` and `aria-current="page"`.
 * 3. Clearing/resetting: clicking 'All' restores all work.
 * 4. In-place operation: `event.preventDefault()` prevents navigation away.
 * 5. URL sync: `history.replaceState` updates the query parameter (?track=)
 *    so deep links work without triggering a page reload.
 * 6. Search integration: live search input filters within the active category.
 * 7. Initial deep-link handling: reads ?track= or ?view= on load and activates.
 */

export type TrackFilter = 'all' | 'ai-fluency' | 'machine-learning';

export interface WorkFilterState {
  track: TrackFilter;
  view: 'work' | 'concepts';
  search: string;
}

export function applyFilter(
  root: HTMLElement,
  state: WorkFilterState,
  options?: { updateUrl?: boolean; basePath?: string }
): void {
  const browseList = root.querySelector<HTMLElement>('[data-browse-list], #browse-list');
  const doc = typeof document !== 'undefined' ? document : null;
  const conceptsView = doc ? doc.querySelector<HTMLElement>('[data-work-view="concepts"]') : null;
  const assignmentsView = doc ? doc.querySelector<HTMLElement>('[data-work-view="assignments"]') : null;
  const emptyMessage = root.querySelector<HTMLElement>('[data-browse-empty]');

  // Handle Concepts view toggle on pages that support it (/work/)
  if (conceptsView && assignmentsView) {
    if (state.view === 'concepts') {
      conceptsView.hidden = false;
      assignmentsView.hidden = true;
    } else {
      conceptsView.hidden = true;
      assignmentsView.hidden = false;
    }
  }

  // Filter assignment cards in the browse list
  if (browseList && state.view === 'work') {
    const items = browseList.querySelectorAll<HTMLElement>('[data-search-item]');
    let totalVisible = 0;

    items.forEach((item) => {
      const itemTrack = item.getAttribute('data-track') || '';
      const itemText = (item.getAttribute('data-search-text') || '').toLowerCase();

      const matchesTrack = state.track === 'all' || itemTrack === state.track;
      const matchesSearch = !state.search || itemText.includes(state.search);
      const isVisible = matchesTrack && matchesSearch;

      item.hidden = !isVisible;
      if (isVisible) totalVisible++;
    });

    // Update strand groups (hide if empty)
    browseList.querySelectorAll<HTMLElement>('[data-strand-group]').forEach((strand) => {
      const visible = strand.querySelectorAll('[data-search-item]:not([hidden])').length;
      strand.hidden = visible === 0;
    });

    // Update track groups (hide if empty)
    browseList.querySelectorAll<HTMLElement>('[data-track-group]').forEach((trackGroup) => {
      const visible = trackGroup.querySelectorAll('[data-search-item]:not([hidden])').length;
      trackGroup.hidden = visible === 0;
    });

    // Show empty message if no assignments match
    if (emptyMessage) {
      emptyMessage.hidden = totalVisible > 0;
    }
  }

  // Update FilterBar tabs
  if (doc) {
    const filterBars = doc.querySelectorAll<HTMLElement>('[data-filter-bar]');
    filterBars.forEach((bar) => {
      const items = bar.querySelectorAll<HTMLAnchorElement>('[data-filter-item]');
      items.forEach((item) => {
        const itemTrack = item.getAttribute('data-filter-track');
        const itemView = item.getAttribute('data-filter-view');

        let isActive = false;
        if (state.view === 'concepts') {
          isActive = itemView === 'concepts';
        } else {
          isActive = !itemView && itemTrack === state.track;
        }

        item.classList.toggle('is-active', isActive);
        if (isActive) {
          item.setAttribute('aria-current', 'page');
        } else {
          item.removeAttribute('aria-current');
        }
      });
    });
  }

  // Update URL if requested
  if (options?.updateUrl && typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    if (state.view === 'concepts') {
      url.searchParams.set('view', 'concepts');
      url.searchParams.delete('track');
      url.searchParams.delete('concept');
    } else {
      url.searchParams.delete('view');
      url.searchParams.delete('concept');
      if (state.track === 'all') {
        url.searchParams.delete('track');
      } else {
        url.searchParams.set('track', state.track);
      }
    }
    const nextPath = url.pathname + (url.search ? url.search : '') + url.hash;
    window.history.replaceState(null, '', nextPath);
  }
}

export function initWorkFilter(): void {
  if (typeof document === 'undefined') return;

  const browseRoots = document.querySelectorAll<HTMLElement>('[data-browse-work]');
  if (browseRoots.length === 0) return;

  const urlParams = new URLSearchParams(window.location.search);
  const initialTrackParam = urlParams.get('track');
  const initialViewParam = urlParams.get('view');

  let currentTrack: TrackFilter = 'all';
  if (initialTrackParam === 'ai-fluency' || initialTrackParam === 'machine-learning') {
    currentTrack = initialTrackParam;
  }

  const state: WorkFilterState = {
    track: currentTrack,
    view: initialViewParam === 'concepts' ? 'concepts' : 'work',
    search: '',
  };

  // Initial render / sync
  browseRoots.forEach((root) => {
    applyFilter(root, state);
  });

  // Intercept clicks on filter bar items
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const filterItem = target.closest<HTMLAnchorElement>('[data-filter-item]');
    if (!filterItem) return;

    const itemTrack = filterItem.getAttribute('data-filter-track') as TrackFilter | null;
    const itemView = filterItem.getAttribute('data-filter-view');

    // On homepage, clicking Concepts navigates to /work/?view=concepts normally
    const hasConceptsViewOnPage = document.querySelector('[data-work-view="concepts"]') !== null;
    if (itemView === 'concepts' && !hasConceptsViewOnPage) {
      return; // allow standard navigation to /work/?view=concepts
    }

    event.preventDefault();

    if (itemView === 'concepts') {
      state.view = 'concepts';
    } else if (itemTrack) {
      state.view = 'work';
      state.track = itemTrack;
    }

    browseRoots.forEach((root) => {
      applyFilter(root, state, { updateUrl: true });
    });
  });

  // Handle live search input
  browseRoots.forEach((root) => {
    const searchInput = root.querySelector<HTMLInputElement>('[data-search-input]');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
      state.search = searchInput.value.trim().toLowerCase();
      applyFilter(root, state);
    });
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWorkFilter);
  } else {
    initWorkFilter();
  }
}
