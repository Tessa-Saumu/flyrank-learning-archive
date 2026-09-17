/**
 * verify-phase3.mjs — Phase 3 validation script for V2 REVISION.
 * Tests Work filtering logic, terminology removal, and rendered output.
 */
import fs from 'fs';
import path from 'path';
import { assignments } from '../src/data/assignments.ts';
import { concepts } from '../src/data/concepts.ts';
import { applyFilter } from '../src/scripts/work-filter.ts';

const errors = [];
const fail = (msg) => errors.push(msg);

console.log('=== VERIFYING PHASE 3 IMPLEMENTATION ===\n');

// 1. Check data census & categories
const aiAssignments = assignments.filter((a) => a.track === 'ai-fluency');
const mlAssignments = assignments.filter((a) => a.track === 'machine-learning');

if (aiAssignments.length !== 25) fail(`Expected 25 AI Fluency assignments, got ${aiAssignments.length}`);
if (mlAssignments.length !== 10) fail(`Expected 10 Machine Learning assignments, got ${mlAssignments.length}`);
if (assignments.length !== 35) fail(`Expected 35 total assignments, got ${assignments.length}`);
if (concepts.length !== 10) fail(`Expected 10 concepts, got ${concepts.length}`);

// 2. Check built HTML files
const distDir = 'dist';
const homeHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
const workHtml = fs.readFileSync(path.join(distDir, 'work', 'index.html'), 'utf8');

// Check FilterBar on Home
if (!homeHtml.includes('data-filter-bar')) fail('Home page missing data-filter-bar');
if (!homeHtml.includes('data-filter-track="ai-fluency"')) fail('Home page missing data-filter-track="ai-fluency"');
if (!homeHtml.includes('data-filter-track="machine-learning"')) fail('Home page missing data-filter-track="machine-learning"');
if (!homeHtml.includes('data-filter-track="all"')) fail('Home page missing data-filter-track="all"');

// Check BrowseWork on Home
if (!homeHtml.includes('data-browse-work')) fail('Home page missing data-browse-work');
if (!homeHtml.includes('data-track-group')) fail('Home page missing data-track-group');
if (!homeHtml.includes('data-strand-group')) fail('Home page missing data-strand-group');

// Check FilterBar on Work
if (!workHtml.includes('data-filter-bar')) fail('Work page missing data-filter-bar');
if (!workHtml.includes('data-filter-track="ai-fluency"')) fail('Work page missing data-filter-track="ai-fluency"');
if (!workHtml.includes('data-filter-track="machine-learning"')) fail('Work page missing data-filter-track="machine-learning"');
if (!workHtml.includes('data-work-view="assignments"')) fail('Work page missing data-work-view="assignments"');
if (!workHtml.includes('data-work-view="concepts"')) fail('Work page missing data-work-view="concepts"');

// 3. Check Terminology Removal across all HTML files
function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const p = path.join(dir, item);
    if (fs.statSync(p).isDirectory()) {
      files = files.concat(walk(p));
    } else if (p.endsWith('.html')) {
      files.push(p);
    }
  }
  return files;
}

const htmlFiles = walk('dist');
const forbiddenInPublicUI = [
  { name: 'Tier concept label', regex: />\s*Tier\s*</i },
  { name: 'Supporting reference label', regex: /supporting\s+reference/i },
  { name: 'Core tier label', regex: />\s*Core\s*</ },
  { name: 'Supporting tier label', regex: />\s*Supporting\s*</ },
  { name: 'Reference tier label', regex: />\s*Reference\s*</ },
  { name: 'T1 filter label', regex: />\s*T1\s*</i },
  { name: 'T2 filter label', regex: />\s*T2\s*</i },
  { name: 'T3 filter label', regex: />\s*T3\s*</i },
];

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  // Strip script and style tags
  const clean = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  for (const check of forbiddenInPublicUI) {
    if (check.regex.test(clean)) {
      fail(`Found forbidden terminology "${check.name}" in ${file}`);
    }
  }
}

// 4. Test filtering simulation in memory
console.log('Testing work-filter logic simulation...');

class MockElement {
  constructor(tag, attrs = {}) {
    this.tagName = tag.toUpperCase();
    this.attributes = { ...attrs };
    this.children = [];
    this.hidden = false;
    this.classList = {
      classes: new Set(),
      toggle(cls, val) {
        if (val === undefined) val = !this.classes.has(cls);
        if (val) this.classes.add(cls);
        else this.classes.delete(cls);
      },
      has(cls) { return this.classes.has(cls); }
    };
  }
  getAttribute(name) { return this.attributes[name] ?? null; }
  setAttribute(name, val) { this.attributes[name] = val; }
  removeAttribute(name) { delete this.attributes[name]; }
  appendChild(child) { this.children.push(child); return child; }

  matches(sel) {
    const parts = sel.split(',').map(s => s.trim());
    for (const part of parts) {
      if (part === '[data-browse-list]' && this.attributes['data-browse-list'] !== undefined) return true;
      if (part === '#browse-list' && this.attributes['id'] === 'browse-list') return true;
      if (part === '[data-browse-empty]' && this.attributes['data-browse-empty'] !== undefined) return true;
      if (part === '[data-search-item]' && this.attributes['data-search-item'] !== undefined) return true;
      if (part === '[data-search-item]:not([hidden])' && this.attributes['data-search-item'] !== undefined && !this.hidden) return true;
      if (part === '[data-strand-group]' && this.attributes['data-strand-group'] !== undefined) return true;
      if (part === '[data-strand-group]:not([hidden])' && this.attributes['data-strand-group'] !== undefined && !this.hidden) return true;
      if (part === '[data-track-group]' && this.attributes['data-track-group'] !== undefined) return true;
      if (part === '[data-track-group]:not([hidden])' && this.attributes['data-track-group'] !== undefined && !this.hidden) return true;
      if (part === '[data-filter-item]' && this.attributes['data-filter-item'] !== undefined) return true;
    }
    return false;
  }

  querySelectorAll(sel) {
    const results = [];
    const scan = (node) => {
      for (const c of node.children) {
        if (c.matches(sel)) results.push(c);
        scan(c);
      }
    };
    scan(this);
    return results;
  }

  querySelector(sel) {
    const all = this.querySelectorAll(sel);
    return all.length > 0 ? all[0] : null;
  }
}

// Build mock browse tree
const mockRoot = new MockElement('div', { 'data-browse-work': '' });
const mockList = new MockElement('div', { 'data-browse-list': '', 'id': 'browse-list' });
mockRoot.appendChild(mockList);

for (const track of ['ai-fluency', 'machine-learning']) {
  const trackEl = new MockElement('section', { 'data-track-group': '', 'data-track': track });
  mockList.appendChild(trackEl);
  const strandEl = new MockElement('section', { 'data-strand-group': '' });
  trackEl.appendChild(strandEl);

  const trackAssignments = assignments.filter((a) => a.track === track);
  for (const a of trackAssignments) {
    const itemEl = new MockElement('li', {
      'data-search-item': '',
      'data-track': a.track,
      'data-search-text': `${a.title} ${a.officialCode ?? ''} ${a.id}`.toLowerCase()
    });
    strandEl.appendChild(itemEl);
  }
}

// Test 1: All filter
applyFilter(mockRoot, { track: 'all', view: 'work', search: '' });
let visibleItems = mockRoot.querySelectorAll('[data-search-item]:not([hidden])');
if (visibleItems.length !== 35) fail(`'all' filter expected 35 visible items, got ${visibleItems.length}`);

// Test 2: AI Fluency filter
applyFilter(mockRoot, { track: 'ai-fluency', view: 'work', search: '' });
visibleItems = mockRoot.querySelectorAll('[data-search-item]:not([hidden])');
if (visibleItems.length !== 25) fail(`'ai-fluency' filter expected 25 visible items, got ${visibleItems.length}`);
const visibleTracks = mockRoot.querySelectorAll('[data-track-group]:not([hidden])');
if (visibleTracks.length !== 1) fail(`'ai-fluency' expected 1 visible track group, got ${visibleTracks.length}`);

// Test 3: Machine Learning filter
applyFilter(mockRoot, { track: 'machine-learning', view: 'work', search: '' });
visibleItems = mockRoot.querySelectorAll('[data-search-item]:not([hidden])');
if (visibleItems.length !== 10) fail(`'machine-learning' filter expected 10 visible items, got ${visibleItems.length}`);
const visibleTracksML = mockRoot.querySelectorAll('[data-track-group]:not([hidden])');
if (visibleTracksML.length !== 1) fail(`'machine-learning' expected 1 visible track group, got ${visibleTracksML.length}`);

// Test 4: Search filter within ML
applyFilter(mockRoot, { track: 'machine-learning', view: 'work', search: 'capstone' });
visibleItems = mockRoot.querySelectorAll('[data-search-item]:not([hidden])');
if (visibleItems.length !== 1) fail(`search 'capstone' in ML expected 1 item, got ${visibleItems.length}`);

// Test 5: Reset to all
applyFilter(mockRoot, { track: 'all', view: 'work', search: '' });
visibleItems = mockRoot.querySelectorAll('[data-search-item]:not([hidden])');
if (visibleItems.length !== 35) fail(`reset to 'all' expected 35 items, got ${visibleItems.length}`);

if (errors.length > 0) {
  console.error('\n=== VERIFICATION FAILED ===');
  for (const err of errors) console.error(`  ✗ ${err}`);
  process.exit(1);
} else {
  console.log('✓ All Phase 3 checks passed successfully!');
}
