// Verificación final de flujos interactivos
import puppeteer from 'puppeteer-core';
import path from 'path';
import { pathToFileURL } from 'url';

const url = pathToFileURL(path.resolve('dist/index.html')).href;
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--hide-scrollbars']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(url, { waitUntil: 'load' });
await page.evaluate(() => document.getElementById('visor').scrollIntoView());
await new Promise(r => setTimeout(r, 5000));

// 1) Estado inicial del Corte (debe estar activado)
const cut0 = await page.$eval('#btnCut', (b) => b.getAttribute('aria-pressed'));

// 2) Toggle Girar: activa autorrotación
await page.click('#btnRotate');
const rotOn = await page.evaluate(() => window.__chispa && 'controls' in window.__chispa);
const rotPressed = await page.$eval('#btnRotate', (b) => b.getAttribute('aria-pressed'));

// 3) Doble toggle de Corte: vuelve al estado inicial
await page.click('#btnCut');
const cutOff = await page.$eval('#btnCut', (b) => b.getAttribute('aria-pressed'));
await page.click('#btnCut');
const cutBack = await page.$eval('#btnCut', (b) => b.getAttribute('aria-pressed'));

// 4) Botón "Ver en 3D" desde una zona del plano: selecciona taller y mueve cámara
await page.evaluate(() => document.getElementById('propuesta').scrollIntoView());
await new Promise(r => setTimeout(r, 1000));
await page.click('.zone[data-zone="taller"]');
await new Promise(r => setTimeout(r, 300));
const camBefore = await page.evaluate(() => window.__chispa.camera.position.toArray().map(v => +v.toFixed(2)));
await page.evaluate(() => document.getElementById('zoneViewBtn').click());
await new Promise(r => setTimeout(r, 2500)); // scroll + tween de cámara
const camAfter = await page.evaluate(() => window.__chispa.camera.position.toArray().map(v => +v.toFixed(2)));
const scrolled = await page.evaluate(() => {
  const r = document.getElementById('visor').getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
});

console.log(JSON.stringify({
  cut_inicial: cut0,              // esperado "true"
  girar_pressed: rotPressed,      // esperado "true"
  hook_debug: rotOn,              // esperado true
  corte_tras_1_click: cutOff,     // esperado "false"
  corte_tras_2_clicks: cutBack,   // esperado "true"
  cam_antes: camBefore,
  cam_despues: camAfter,
  camara_se_movio: JSON.stringify(camBefore) !== JSON.stringify(camAfter),
  visor_visible_tras_ver_en_3d: scrolled
}, null, 1));
console.log('errores_js:', errors.length ? errors : 'ninguno');
await browser.close();
