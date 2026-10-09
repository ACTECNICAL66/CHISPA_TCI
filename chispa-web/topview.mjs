// Vista cenital para verificar orientación del modelo
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

// Cámara cenital: mirando hacia abajo desde arriba del centro
await page.evaluate(() => {
  const { camera, controls } = window.__chispa;
  camera.position.set(0.001, 18, 0.001);
  controls.target.set(0, 0, 0);
  controls.update();
});
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: '../v_top.png' });

// Vista frontal desde el sur (z positivo) para identificar la puerta
await page.evaluate(() => {
  const { camera, controls } = window.__chispa;
  camera.position.set(0, 3.5, 14);
  controls.target.set(0, 1.5, 0);
  controls.update();
});
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: '../v_front.png' });

await browser.close();
console.log('ok');
