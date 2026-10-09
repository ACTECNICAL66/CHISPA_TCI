// Vista móvil rápida
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
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await page.goto(url, { waitUntil: 'load' });
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: '../v_mobile_hero.png' });
await page.evaluate(() => document.getElementById('visor').scrollIntoView());
await new Promise(r => setTimeout(r, 5000));
await page.screenshot({ path: '../v_mobile_visor.png' });
await browser.close();
console.log('ok');
