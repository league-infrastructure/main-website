#!/usr/bin/env node

import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Listen to console events
  page.on('console', msg => {
    console.log('[BROWSER]', msg.type(), msg.text());
  });
  
  // Listen to page errors
  page.on('pageerror', error => {
    console.error('[PAGE ERROR]', error.message);
  });
  
  // Navigate to the test page
  console.log('Navigating to http://localhost:4321/test/p13events');
  await page.goto('http://localhost:4321/test/p13events', { waitUntil: 'networkidle2' });
  
  // Wait a bit for any async operations
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Get the output text
  const output = await page.$eval('.pike13-events__output', el => el.textContent);
  console.log('\n[OUTPUT]', output);
  
  await browser.close();
})();
