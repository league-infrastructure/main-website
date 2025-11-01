import puppeteer from 'puppeteer';

async function testUpcomingEvents() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('Navigating to localhost:4321/programs/tech-club/...');
  await page.goto('http://localhost:4321/programs/tech-club/', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  
  console.log('Page loaded, waiting for events section...');
  await page.waitForTimeout(3000); // Wait for scripts to run
  
  // Check if the component exists
  const componentExists = await page.evaluate(() => {
    const root = document.querySelector('.jtl-schedule-root');
    const container = document.querySelector('.schedule-container');
    return {
      rootExists: !!root,
      containerExists: !!container,
      rootHTML: root?.outerHTML.substring(0, 500) || null,
      containerHTML: container?.outerHTML.substring(0, 500) || null,
      dataAttribute: root?.getAttribute('data-meetup-group') || null,
    };
  });
  
  console.log('\n=== Component Check ===');
  console.log(JSON.stringify(componentExists, null, 2));
  
  // Check for JavaScript errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  // Check the actual rendered content
  const renderedContent = await page.evaluate(() => {
    const root = document.querySelector('.jtl-schedule-root');
    if (!root) return { error: 'No .jtl-schedule-root found' };
    
    const container = root.querySelector('.schedule-container');
    if (!container) return { error: 'No .schedule-container found' };
    
    return {
      containerInnerHTML: container.innerHTML.substring(0, 1000),
      classBoxes: container.querySelectorAll('.class-box').length,
      loadingState: container.querySelector('.upcoming-events__loading') !== null,
      errorState: container.querySelector('.upcoming-events__error') !== null,
      emptyState: container.querySelector('.upcoming-events__empty') !== null,
    };
  });
  
  console.log('\n=== Rendered Content ===');
  console.log(JSON.stringify(renderedContent, null, 2));
  
  // Check console logs
  const consoleLogs = await page.evaluate(() => {
    // This won't capture console.error from the script, but let's try
    return 'Check browser console manually';
  });
  
  // Take a screenshot
  const screenshot = await page.screenshot({
    type: 'png',
    fullPage: false,
  });
  
  const fs = await import('fs');
  fs.writeFileSync('test_upcoming_events.png', screenshot);
  console.log('\n=== Screenshot saved to test_upcoming_events.png ===');
  
  // Check network requests
  const networkRequests = await page.evaluate(() => {
    // We can't access this directly, but we can check if fetch was called
    return 'Check network tab manually';
  });
  
  // Try to manually trigger the fetch and see what happens
  const fetchTest = await page.evaluate(async () => {
    try {
      const response = await fetch('https://snips.jtlapp.net/leaguesync/meetups.json');
      const data = await response.json();
      return {
        success: true,
        hasTechClub: 'the-league-tech-club' in data,
        techClubEvents: data['the-league-tech-club']?.length || 0,
      };
    } catch (e) {
      return {
        success: false,
        error: e.message,
      };
    }
  });
  
  console.log('\n=== Fetch Test ===');
  console.log(JSON.stringify(fetchTest, null, 2));
  
  console.log('\n=== Errors ===');
  console.log(errors.length > 0 ? errors.join('\n') : 'No errors captured');
  
  await page.waitForTimeout(2000);
  await browser.close();
}

testUpcomingEvents().catch(console.error);
