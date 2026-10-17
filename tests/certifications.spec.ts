import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { certifications, certificationCompleted, certificationGoal, certificationPercent } from '../src/data/certifications';

test('certificate registry, original assets, thumbnails and sitemap agree', async ({ request }) => {
  expect(certificationCompleted).toBe(14);
  expect(certificationGoal).toBe(20);
  expect(certificationPercent).toBe(70);
  expect(new Set(certifications.map(c=>c.sha256)).size).toBe(14);
  const sitemap=await (await request.get('/sitemap.xml')).text();
  const bundle=await request.get('/evidence/certifications/claude-certificates.zip');
  const originalBundle=await readFile(new URL('../public/evidence/certifications/claude-certificates.zip',import.meta.url));
  expect(await bundle.body()).toEqual(originalBundle);
  const manifest=await (await request.get('/evidence/certifications/manifest.json')).json();
  expect(manifest.certificates).toHaveLength(14);
  for(const c of certifications) {
    const pdf=await request.get(c.pdfPath);
    expect(pdf.ok(),c.id).toBeTruthy();
    expect(pdf.headers()['content-type']).toContain('application/pdf');
    expect(createHash('sha256').update(await pdf.body()).digest('hex')).toBe(c.sha256);
    expect((await request.get(c.previewImage)).ok()).toBeTruthy();
    expect((await request.get(`/certifications/${c.id}/`)).ok()).toBeTruthy();
    expect(sitemap).toContain(`/certifications/${c.id}/`);
  }
});

for(const width of [390,1024,1366]) {
  test(`third destination, progress and certificate cards fit at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});
    const pdfRequests:string[]=[];
    page.on('request',req=>{if(req.url().endsWith('.pdf'))pdfRequests.push(req.url());});
    await page.goto('/certifications/');
    const nav=page.getByRole('navigation',{name:'Learning sections'});
    await expect(nav.getByRole('link')).toHaveCount(3);
    await expect(nav.getByRole('link',{name:'Claude Certs'})).toHaveAttribute('aria-current','page');
    await expect(page.getByRole('heading',{name:'14 of 20 completed · 70%'})).toBeVisible();
    await expect(page.getByRole('progressbar')).toHaveAttribute('value','14');
    await expect(page.locator('[data-certificate-card]')).toHaveCount(14);
    expect(pdfRequests).toEqual([]);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
    for(const link of await nav.getByRole('link').all()) await expect(link).toBeVisible();
    const images=page.locator('[data-certificate-card] img');
    await images.last().scrollIntoViewIfNeeded();
    await expect.poll(()=>images.last().evaluate((img:HTMLImageElement)=>img.naturalWidth)).toBeGreaterThan(0);
  });
}

for(const width of [390,1280]) {
  test(`certificate popup reuses lazy PDF viewer and restores focus at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto('/certifications/');
    const card=page.locator('[data-certificate-id="claude-101"]');
    await card.click();
    const dialog=page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('[data-certificate-detail="claude-101"]')).toBeVisible();
    await expect(page).toHaveURL('/certifications/');
    await expect(dialog.locator('iframe')).toHaveCount(0);
    await dialog.getByRole('button',{name:'Show evidence'}).click();
    const frame=dialog.locator('iframe');
    await expect(frame).toBeVisible();
    await expect(frame).toHaveAttribute('src','/evidence/certifications/claude-101.pdf');
    await expect(frame).toHaveCSS('height','520px');
    await expect(dialog.getByRole('link',{name:/Open artifact/})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
    const download=page.waitForEvent('download');
    await dialog.getByRole('link',{name:'Download certificate',exact:true}).click();
    const file=await download;
    expect(file.suggestedFilename()).toBe('claude-101.pdf');
    await file.delete();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(card).toBeFocused();
    await expect(dialog.locator('iframe')).toHaveCount(0);
  });
}

test('certificate direct routes and downloads work without JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto('/certifications/');
  const bundle=page.waitForEvent('download');
  await page.getByRole('link',{name:'Download all certificates'}).click();
  const archive=await bundle;
  expect(archive.suggestedFilename()).toBe('claude-certificates.zip');
  await archive.delete();
  await page.locator('[data-certificate-id="claude-101"]').click();
  await expect(page).toHaveURL('/certifications/claude-101/');
  await expect(page.getByRole('heading',{name:'Claude 101',exact:true,level:1})).toBeVisible();
  await expect(page.getByRole('link',{name:'Download certificate',exact:true})).toHaveAttribute('href','/evidence/certifications/claude-101.pdf');
  await context.close();
});

test('certificate failure can fall back to the direct page',async({page})=>{
  await page.route('**/certifications/claude-101/',route=>route.fulfill({status:503,body:'Unavailable'}));
  await page.goto('/certifications/');
  await page.locator('[data-certificate-id="claude-101"]').click();
  await expect(page.locator('[data-record-fallback]')).toHaveAttribute('href','/certifications/claude-101/');
});

test('certificate listing and popup have no serious accessibility violations',async({page})=>{
  await page.goto('/certifications/');
  let audit=await new AxeBuilder({page}).analyze();
  expect(audit.violations.filter(v=>v.impact==='critical'||v.impact==='serious')).toEqual([]);
  await page.locator('[data-certificate-id="claude-101"]').click();
  await expect(page.locator('[data-certificate-detail]')).toBeVisible();
  audit=await new AxeBuilder({page}).analyze();
  expect(audit.violations.filter(v=>v.impact==='critical'||v.impact==='serious')).toEqual([]);
});
