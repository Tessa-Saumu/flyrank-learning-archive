import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { artifacts } from '../src/data/artifacts';

test('all generated evidence bytes and MIME types match original assets', async ({ request }) => {
  // Includes the original 83 MB demo plus every PDF/image and SHA-256 checks.
  test.setTimeout(120000);
  for (const art of artifacts) {
    const src = art.embedUrl ?? art.previewImage;
    if (!src?.startsWith('/evidence/assignments/')) continue;
    const res = await request.get(src);
    expect(res.ok(), src).toBeTruthy();
    expect(res.headers()['content-type']).toContain(src.endsWith('.pdf') ? 'application/pdf' : src.endsWith('.mp4') ? 'video/mp4' : 'image/png');
    const original = await readFile(new URL(`../assignment-artifacts/${src.split('/').pop()}`, import.meta.url));
    const hash = (data: Buffer) => createHash('sha256').update(data).digest('hex');
    expect(hash(await res.body()), src).toBe(hash(original));
  }
  const partial = await request.get('/evidence/assignments/fl-09-documentation-demo.mp4', {headers:{Range:'bytes=0-1023'}});
  expect(partial.status()).toBe(206);
  expect((await partial.body()).length).toBe(1024);
});

for (const width of [1280, 390]) {
  for (const surface of ['direct', 'popup']) {
    test(`PDF reveal, sizing, download and repeated activation: ${surface}, ${width}px`, async ({ page }) => {
      await page.setViewportSize({width,height:900});
      if (surface === 'popup') {
        await page.goto('/work/');
        await page.locator('[data-assignment-card][data-assignment-id="fl-01-workflow-audit"]').click();
        await expect(page.locator('[data-modal-body] .detail__title')).toBeVisible();
      } else await page.goto('/work/fl-01-workflow-audit/');
      const card = page.locator('[data-artifact-preview][data-type="pdf"]');
      await expect(card.locator('iframe')).toHaveCount(0);
      const show = card.getByRole('button', {name:'Show evidence'});
      await show.click();
      const frame = card.locator('iframe');
      await expect(frame).toBeVisible();
      await expect(frame).toHaveAttribute('src','/evidence/assignments/fl-01-workflow-audit.pdf');
      await expect(frame).toHaveCSS('height','520px');
      const box = await frame.boundingBox();
      const parent = await card.locator('[data-evidence-target]').boundingBox();
      expect(box!.width).toBeLessThanOrEqual(parent!.width);
      await expect(card.getByRole('link',{name:/Open artifact/})).toBeVisible();
      const download = page.waitForEvent('download');
      await card.getByRole('link',{name:'Download pdf'}).click();
      expect((await download).suggestedFilename()).toBe('fl-01-workflow-audit.pdf');
      await (await download).delete();
      await expect(card.locator('iframe')).toHaveCount(1);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
      if(surface==='popup') {
        await page.keyboard.press('Escape');
        await expect(page.locator('[data-modal-body] iframe')).toHaveCount(0);
        await expect(page.locator('[data-assignment-card][data-assignment-id="fl-01-workflow-audit"]')).toBeFocused();
      }
      // Release native PDF workers before the browser context is torn down.
      await page.goto('/work/');
    });
  }
}

test('notebook, image, link-only and missing records have truthful actions', async ({ page }) => {
  await page.goto('/work/ml-09-validation-claim-audit/');
  await expect(page.locator('.nb')).toHaveCount(1);
  await expect(page.locator('[data-artifact-preview]')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Show evidence'})).toHaveCount(0);
  await expect(page.locator('.nb__table')).toBeVisible();
  await page.goto('/work/fl-empty-live-page/');
  const imageCard = page.locator('[data-type="image"]');
  await expect(imageCard.locator('img')).toBeVisible();
  await expect.poll(()=>imageCard.locator('img').evaluate((img:HTMLImageElement)=>img.naturalWidth)).toBeGreaterThan(0);
  await expect(imageCard.getByRole('button')).toHaveCount(0);
  await expect(imageCard.locator('[data-evidence-pending]')).toBeHidden();
  await page.goto('/work/fl-10-final-package/');
  await expect(page.locator('[data-artifact-link]')).toHaveCount(4);
  await expect(page.getByRole('button',{name:'Show evidence'})).toHaveCount(0);
  await expect(page.locator('[data-artifact-link] a')).toHaveCount(3);
  await page.goto('/work/ml-11-ship-paper/');
  await expect(page.getByRole('button',{name:'Show evidence'})).toHaveCount(0);
  await expect(page.locator('[data-evidence-pending]')).toBeVisible();
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('PDF network error keeps fallback and offers a working retry', async ({ page }) => {
  const asset = '**/evidence/assignments/fl-01-workflow-audit.pdf';
  await page.route(asset, route=>route.fulfill({status:503,body:'Unavailable'}));
  await page.goto('/work/fl-01-workflow-audit/');
  await page.getByRole('button',{name:'Show evidence'}).click();
  await expect(page.getByRole('status')).toContainText('could not load');
  await expect(page.getByRole('link',{name:/Open artifact/})).toBeVisible();
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.unroute(asset);
  await page.getByRole('button',{name:'Retry evidence'}).click();
  await expect(page.locator('iframe')).toBeVisible();
});

test('video is lazy, plays, and is stopped and released on modal close', async ({ page }) => {
  const requests:string[]=[];
  page.on('request',req=>{if(req.url().endsWith('.mp4')) requests.push(req.url());});
  await page.goto('/work/');
  await page.locator('[data-assignment-card][data-assignment-id="fl-09-documentation-demo"]').click();
  await expect(page.locator('[data-modal-body] .detail__title')).toBeVisible();
  expect(requests).toHaveLength(0);
  await expect(page.locator('[data-modal-body] [data-artifact-preview] button')).toHaveCount(0);
  await page.getByRole('button',{name:'Show evidence'}).click();
  const video = page.locator('[data-modal-body] video');
  await video.scrollIntoViewIfNeeded();
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.readyState), {timeout:15000}).toBeGreaterThanOrEqual(1);
  await video.evaluate(async (v:HTMLVideoElement)=>{v.muted=true; await v.play();});
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime), {timeout:15000}).toBeGreaterThan(0);
  await expect(page.locator('[data-embed-fallback] a')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-modal-body] video')).toHaveCount(0);
});

test('video error and blocked live frame retain an external fallback', async ({ page }) => {
  await page.goto('/work/fl-09-documentation-demo/');
  // Native WebKit media requests can bypass page.route(). Use a real missing
  // same-origin asset so every engine exercises its actual media error path.
  await page.locator('[data-artifact-embed][data-type="video"]').evaluate(card => {
    card.setAttribute('data-src', '/evidence/assignments/unavailable.mp4');
  });
  await page.getByRole('button',{name:'Show evidence'}).click();
  await page.locator('video').scrollIntoViewIfNeeded();
  await expect(page.getByRole('status')).toContainText(/could not load|taking too long/, {timeout:25000});
  await expect(page.locator('[data-embed-fallback] a')).toBeVisible();
  await page.route('https://theresia-saumu.netlify.app/**',route=>route.abort());
  await page.goto('/work/pf-04-personal-website/');
  const live = page.locator('[data-artifact-embed]');
  await live.getByRole('button',{name:'Show evidence'}).click();
  await expect(live.locator('[data-embed-fallback] a')).toBeVisible();
});

test('without JavaScript PDF and source evidence remain accessible', async ({ browser }) => {
  const context = await browser.newContext({javaScriptEnabled:false});
  const page = await context.newPage();
  await page.goto('/work/fl-01-workflow-audit/');
  await expect(page.getByRole('link',{name:/Open artifact/})).toHaveAttribute('href','/evidence/assignments/fl-01-workflow-audit.pdf');
  await expect(page.getByRole('link',{name:'Download pdf'})).toBeVisible();
  await expect(page.locator('iframe')).toHaveCount(0);
  await context.close();
});

test('every generated HTML route and internal link resolves without page errors', async ({ page, request }) => {
  test.setTimeout(360000);
  const errors:string[]=[];
  page.on('pageerror',err=>errors.push(err.message));
  async function htmlRoutes(dir:URL,prefix=''):Promise<string[]> {
    const paths:string[]=[];
    for(const file of await readdir(dir,{withFileTypes:true})) {
      if(file.isDirectory()) paths.push(...await htmlRoutes(new URL(file.name+'/',dir),prefix+file.name+'/'));
      else if(file.name.endsWith('.html')) paths.push('/'+prefix+(file.name==='index.html'?'':file.name));
    }
    return paths;
  }
  const links = new Set<string>();
  const routes = await htmlRoutes(new URL('../dist/',import.meta.url));
  for(const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(),route).toBe(200);
    await expect(page.locator('main')).toBeVisible();
    for(const href of await page.locator('a[href^="/"]').evaluateAll(els=>els.map(el=>el.getAttribute('href')!))) links.add(href.split('#')[0]);
  }
  for(const link of links) expect((await request.get(link)).ok(),link).toBeTruthy();
  expect(errors).toEqual([]);
});
