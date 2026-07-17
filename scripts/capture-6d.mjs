import { chromium } from '@playwright/test';
const browser = await chromium.launch({headless:true, executablePath:'/usr/bin/chromium', args:['--no-sandbox']});
const shots = [
  {name:'desktop-home-en', viewport:{width:1440,height:1000}, reducedMotion:'no-preference'},
  {name:'tablet-home-en', viewport:{width:1024,height:900}, reducedMotion:'no-preference'},
  {name:'mobile-home-en', viewport:{width:390,height:844}, reducedMotion:'no-preference'},
  {name:'desktop-home-reduced-motion', viewport:{width:1440,height:1000}, reducedMotion:'reduce'},
];
for (const shot of shots) {
  const context = await browser.newContext({viewport:shot.viewport, reducedMotion:shot.reducedMotion});
  const page = await context.newPage();
  const errors=[];
  page.on('console', msg=>{ if(msg.type()==='error') errors.push(msg.text()); });
  page.on('pageerror', e=>errors.push(e.message));
  await page.goto('http://localhost:3000', {waitUntil:'networkidle'});
  await page.screenshot({path:`artifacts/6d/${shot.name}.png`, fullPage:true});
  console.log(shot.name, 'errors', errors.length);
  if(errors.length) console.log(errors.join('\n'));
  await context.close();
}
const context = await browser.newContext({viewport:{width:1440,height:1000}});
const page = await context.newPage();
await page.goto('http://localhost:3000', {waitUntil:'networkidle'});
const es = page.getByText('ES', {exact:true}).first();
if (await es.count()) await es.click();
await page.waitForTimeout(600);
await page.screenshot({path:'artifacts/6d/desktop-home-es.png', fullPage:true});
await context.close();
await browser.close();
