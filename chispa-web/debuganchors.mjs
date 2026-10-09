// Mapeo de orientación: cajas de colores en anclajes conocidos
import puppeteer from 'puppeteer-core';
import path from 'path';
import { pathToFileURL } from 'url';

const url = pathToFileURL(path.resolve('dist/index.html')).href;
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--window-size=1440,1000', '--use-angle=swiftshader', '--hide-scrollbars']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });
await page.goto(url, { waitUntil: 'load' });
await page.evaluate(() => document.getElementById('visor').scrollIntoView());
await new Promise(r => setTimeout(r, 5000));

// Anclajes en coords locales del GLB (mm, y-up) según OpenSKP:
// TV, estantería, cartel CHISPA, pizarra, aire
await page.evaluate(() => {
  const { box } = window.__chispa;
  box([9001, 2363, -3373], [500, 500, 500], 0xff2222);   // TV (rojo)
  box([3700, 500, -5557], [500, 500, 500], 0x22cc44);    // Estantería (verde)
  box([5353, 3087, 75], [500, 500, 500], 0x2266ff);      // Cartel CHISPA (azul)
  box([6718, 2107, -5864], [500, 500, 500], 0xffcc00);   // Pizarra (amarillo)
  box([8668, 3561, -3365], [500, 500, 500], 0xff00ff);   // AIRE (magenta)
});
await new Promise(r => setTimeout(r, 800));

// Cenital
await page.evaluate(() => {
  const { camera, controls, fitTo } = window.__chispa;
  const m = window.__chispa.model();
  const bb = new (m.constructor.prototype.parenting ? Object : Object)();
  camera.position.set(0.01, 20, 0.01);
  controls.target.set(0, 0, 0);
  controls.update();
});
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: '../v_map_top.png' });

// Frontal desde +Z
await page.evaluate(() => {
  const { camera, controls } = window.__chispa;
  camera.position.set(0, 4, 16);
  controls.target.set(0, 1.5, 0);
  controls.update();
});
await new Promise(r => setTimeout(r, 1000));
await page.screenshot({ path: '../v_map_front_z.png' });

// Frontal desde +X
await page.evaluate(() => {
  const { camera, controls } = window.__chispa;
  camera.position.set(16, 4, 0);
  controls.target.set(0, 1.5, 0);
  controls.update();
});
await new Promise(r => setTimeout(r, 1000));
await page.screenshot({ path: '../v_map_front_x.png' });

await browser.close();
console.log('ok');
