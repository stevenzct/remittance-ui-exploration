import fs from 'node:fs/promises';

const directory = new URL('./hk-qa/', import.meta.url);
await fs.mkdir(directory, { recursive: true });
let targets;
for(let attempt=0;attempt<30;attempt++) {
  try { targets=await fetch('http://127.0.0.1:9331/json/list').then(r=>r.json()); break; }
  catch(error) { if(attempt===29) throw error; await new Promise(r=>setTimeout(r,300)); }
}
const target = targets.find(t => t.type === 'page');
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
let requestId = 0;
const pending = new Map();
const errors = [];
const responses = [];
ws.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.id) {
    const callbacks = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) callbacks?.reject(new Error(JSON.stringify(message.error)));
    else callbacks?.resolve(message.result);
  }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
  if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) responses.push({ status: message.params.response.status, url: message.params.response.url });
};
function cdp(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++requestId; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
const delay = ms => new Promise(r => setTimeout(r, ms));
async function until(expression, timeout = 12000) {
  const started = Date.now();
  while (!(await evaluate(expression))) { if (Date.now() - started > timeout) throw new Error(`Timed out: ${expression}`); await delay(100); }
}
async function click(selector) {
  const point = await evaluate(`(() => { const element = document.querySelector(${JSON.stringify(selector)}); element.scrollIntoView({block:'nearest'}); const r=element.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`);
  await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 });
  await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 });
}
async function key(key, code = key, modifiers = 0) {
  await cdp('Input.dispatchKeyEvent', {type:'keyDown',key,code,modifiers});
  await cdp('Input.dispatchKeyEvent', {type:'keyUp',key,code,modifiers});
}
async function screenshot(selector, filename, nativeWidth) {
  const clip = await evaluate(`(() => {const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height};})()`);
  const result = await cdp('Page.captureScreenshot', { format:'png', captureBeyondViewport:true, clip:{...clip,scale:nativeWidth ? nativeWidth/clip.width : 1} });
  await fs.writeFile(new URL(filename, directory), Buffer.from(result.data,'base64'));
}
await Promise.all([cdp('Page.enable'), cdp('Runtime.enable'), cdp('Network.enable')]);
const all = [];
for (const width of [1440,390,320]) {
  await cdp('Emulation.setDeviceMetricsOverride',{width,height:1100,deviceScaleFactor:1,mobile:false});
  await cdp('Page.navigate',{url:'http://localhost:3000/prototype-v1'});
  await until(`document.querySelector('[aria-label="Choose where you work"]') && [...document.images].every(i=>i.complete)`);
  await evaluate('document.fonts.ready');
  await delay(300);
  await click('[aria-label="Choose where you work"]');
  await until(`document.querySelector('[role="dialog"]')`);
  await delay(350);
  const geometry = await evaluate(`(() => {
    const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};
    const sheet=document.querySelector('[role="dialog"]');const canvas=document.querySelector('[class*="canvas"]');
    return {canvas:rect(canvas),sheet:rect(sheet),rows:[...sheet.querySelectorAll('label')].map(e=>({text:e.innerText,rect:rect(e),indicator:rect(e.querySelector('img:last-child'))})),shellBackground:getComputedStyle(document.querySelector('[aria-label="Payso first-launch phone prototype"]')).background,statusBackdrop:getComputedStyle(document.querySelector('[class*="statusBackdrop"]')).background,focus:document.activeElement?.getAttribute('aria-label')};
  })()`);
  if(width===1440) await screenshot('[aria-label="Payso first-launch phone prototype"]','desktop-work-sheet-phone.png');
  else await screenshot('[aria-label="Payso first-launch phone prototype"]',`mobile-${width}-work-sheet-phone.png`);
  await key('Escape');
  await until(`!document.querySelector('[role="dialog"]')`);
  await evaluate(`document.querySelector('[aria-label="Wallet and offers"]').scrollTop=450`);
  const beforeScroll = await evaluate(`document.querySelector('[aria-label="Wallet and offers"]').scrollTop`);
  await click('[aria-label="Choose where you work"]');
  await delay(250);
  await click('input[value="Hong Kong"]');
  await until(`document.querySelector('.prototype-work-location-loading')`);
  const transition = await evaluate(`(() => {const a=document.querySelector('.prototype-work-location-loading-artwork');const r=a.getBoundingClientRect();return {layoutWidth:getComputedStyle(a).width,layoutHeight:getComputedStyle(a).height,width:r.width,height:r.height,focus:document.activeElement?.getAttribute('aria-label'),inert:document.querySelector('[class*="home"][inert]')!==null};})()`);
  await until(`document.querySelector('[aria-label="HKD wallet"]') && !document.querySelector('.prototype-work-location-loading')`);
  await delay(400);
  const hkd = await evaluate(`({text:document.querySelector('[aria-label="HKD wallet"]').innerText,scroll:document.querySelector('[aria-label="Wallet and offers"]').scrollTop,workActive:document.querySelector('[aria-label="Work country: Hong Kong"]').getAttribute('aria-pressed'),homeActive:document.querySelector('[aria-label="Philippines home wallet"]').getAttribute('aria-pressed'),focus:document.activeElement?.getAttribute('aria-label'),missingImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)})`);
  if(width===1440) await screenshot('[class*="canvas"]','hkd-native-375x812.png',375);
  await click('[aria-label="Work country: Hong Kong"]');
  await delay(270);
  await click('input[value="Hong Kong"]');
  await until(`document.querySelector('.prototype-work-location-loading')`);
  await until(`document.querySelector('[aria-label="HKD wallet"]') && !document.querySelector('.prototype-work-location-loading')`);
  await click('[aria-label="Philippines home wallet"]');
  const ph = await evaluate(`({wallet:document.querySelector('[aria-label="PHP wallet"]')!==null,active:document.querySelector('[aria-label="Philippines home wallet"]').getAttribute('aria-pressed')})`);
  all.push({width,geometry,beforeScroll,transition,hkd,reselectCurrentHongKong:true,ph});
  console.log(JSON.stringify(all.at(-1)));
}
const result={results:all,errors,failedResponses:responses};
await fs.writeFile(new URL('report.json',directory),JSON.stringify(result,null,2));
console.log(JSON.stringify({errors,failedResponses:responses}));
ws.close();
