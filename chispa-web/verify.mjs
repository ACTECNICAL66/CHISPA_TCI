// Verificación end-to-end con Chrome real
import puppeteer from 'puppeteer-core';
import path from 'path';
import { pathToFileURL } from 'url';

const pagePath = path.resolve('dist/index.html');
const url = pathToFileURL(pagePath).href;
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--window-size=1440,1000', '--hide-scrollbars']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });

const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[PAGEERROR] ${e.message}`));

await page.goto(url, { waitUntil: 'load', timeout: 60000 });
await new Promise(r => setTimeout(r, 2500));
await page.screenshot({ path: '../v_hero.png' });

// Sección visor: scroll, esperar carga del modelo 3D
await page.evaluate(() => document.getElementById('visor').scrollIntoView());
await new Promise(r => setTimeout(r, 6000));
await page.screenshot({ path: '../v_visor.png' });

// Estado del visor: canvas existe? contexto webgl?
const viewerInfo = await page.evaluate(() => {
  const c = document.querySelector('#viewer canvas');
  const pct = document.getElementById('loadPct')?.textContent;
  const loadingGone = !document.getElementById('viewerLoading') || document.getElementById('viewerLoading').classList.contains('hidden');
  return { canvas: !!c, size: c ? [c.width, c.height] : null, pct, loadingGone, webgl: c ? !!c.getContext('webgl2') : false };
});
console.log('VIEWER:', JSON.stringify(viewerInfo));

// Clic en vista Taller y captura
await page.click('[data-view="taller"]');
await new Promise(r => setTimeout(r, 2500));
await page.screenshot({ path: '../v_visor_taller.png' });

// Alternar corte OFF (mostrar techo)
await page.click('#btnCut');
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: '../v_visor_corte_off.png' });
await page.click('#btnCut');

// Plano / propuesta
await page.evaluate(() => document.getElementById('propuesta').scrollIntoView());
await new Promise(r => setTimeout(r, 1800));
await page.screenshot({ path: '../v_propuesta.png' });

// Clic zona taller en el plano
await page.click('.zone[data-zone="taller"]');
await new Promise(r => setTimeout(r, 900));
await page.screenshot({ path: '../v_zona_taller.png' });

// Instalaciones + equipo
await page.evaluate(() => document.getElementById('instalaciones').scrollIntoView());
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: '../v_instalaciones.png' });
await page.evaluate(() => document.getElementById('equipo').scrollIntoView());
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: '../v_equipo.png' });

// Página completa (device scale 0.35 para que quepa)
await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 0.32 });
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: '../v_full.png', fullPage: true });

console.log('LOGS (primeros 30):');
logs.slice(0, 30).forEach(l => console.log(' ', l.slice(0, 300)));
await browser.close();
console.log('OK verificación completa');
