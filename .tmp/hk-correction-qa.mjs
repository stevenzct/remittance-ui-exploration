import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const directory = new URL('./hk-correction-qa/', import.meta.url);
await fs.mkdir(directory, { recursive: true });
const targets = await fetch('http://127.0.0.1:9332/json/list').then(r => r.json());
const target = targets.find(t => t.type === 'page');
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
let requestId = 0;
const pending = new Map();
const errors = [];
const failedResponses = [];
ws.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.id) {
    const callbacks = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) callbacks?.reject(new Error(JSON.stringify(message.error)));
    else callbacks?.resolve(message.result);
  }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
  if (message.method === 'Network.responseReceived' && message.params.response.status >= 400 && !message.params.response.url.endsWith('/favicon.ico')) failedResponses.push({ status: message.params.response.status, url: message.params.response.url });
};
function cdp(method, params = {}) {
  return new Promise((resolve, reject) => { const id = ++requestId; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
}
async function evaluate(expression) {
  const result = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
const delay = ms => new Promise(r => setTimeout(r, ms));
async function until(expression, timeout = 30000) {
  const started = Date.now();
  while (!(await evaluate(`Boolean(${expression})`))) { if (Date.now() - started > timeout) throw new Error(`Timed out: ${expression}`); await delay(60); }
}
async function click(selector) {
  const point = await evaluate(`(() => { const element = document.querySelector(${JSON.stringify(selector)}); if(!element) throw new Error('Missing element'); element.scrollIntoView({block:'nearest',behavior:'instant'}); const r=element.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`);
  await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 });
  await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 });
}
async function key(key) {
  await cdp('Input.dispatchKeyEvent', {type:'keyDown',key,code:key});
  await cdp('Input.dispatchKeyEvent', {type:'keyUp',key,code:key});
}
async function screenshot(filename) {
  const clip = await evaluate(`(() => {const r=document.querySelector('[class*="canvas"]').getBoundingClientRect(); return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height};})()`);
  const result = await cdp('Page.captureScreenshot', {format:'png',captureBeyondViewport:true,clip:{...clip,scale:375/clip.width}});
  await fs.writeFile(new URL(filename, directory), Buffer.from(result.data,'base64'));
}
async function choose(country, currency, previous, captureTransition = false) {
  await click(previous ? `[aria-label="Work country: ${previous}"]` : '[aria-label="Choose where you work"]');
  await until(`document.querySelector('[role="dialog"]')`);
  await click(`input[value="${country}"]`);
  await until(`document.querySelector('.prototype-work-location-loading')`);
  assert(await evaluate(`document.querySelector('[class*="home"][inert]') !== null`), 'Content must be inert while transitioning');
  assert.equal(await evaluate(`document.querySelector('.prototype-work-location-loading').getAttribute('aria-label')`), `Loading ${country}`);
  if (captureTransition) {
    await until(`document.querySelector('.prototype-work-location-loading img')?.complete`);
    await delay(650);
    await screenshot(`${currency.toLowerCase()}-transition.png`);
  }
  await until(`document.querySelector('[aria-label="${currency} wallet"]') && !document.querySelector('.prototype-work-location-loading')`);
  await until(`[...document.images].every(i => i.complete)`);
  await delay(60);
  assert.equal(await evaluate(`document.activeElement?.getAttribute('aria-label')`), `Work country: ${country}`);
  assert.equal(await evaluate(`document.querySelector('[aria-label="Wallet and offers"]').scrollTop`), 0);
  assert.equal(await evaluate(`document.querySelector('[aria-label="Work country: ${country}"]').getAttribute('aria-pressed')`), 'true');
  assert.equal(await evaluate(`document.querySelector('[aria-label="Philippines home wallet"]').getAttribute('aria-pressed')`), 'false');
}

await Promise.all([cdp('Page.enable'), cdp('Runtime.enable'), cdp('Network.enable')]);
try {
  for (const width of [1440,390]) {
    await cdp('Emulation.setDeviceMetricsOverride', {width,height:1100,deviceScaleFactor:1,mobile:false});
    await cdp('Page.navigate', {url:'http://127.0.0.1:3100/prototype-v1'});
    await until(`document.querySelector('[aria-label="Choose where you work"]') && [...document.images].every(i=>i.complete)`);
    await evaluate('document.fonts.ready.then(() => true)');
    await delay(300);
    await choose('Hong Kong','HKD');
    await screenshot(`hong-kong-${width}.png`);
    const geometry = await evaluate(`(() => {
      const tab=document.querySelector('[aria-label="Work country: Hong Kong"]');
      const label=tab.querySelector('[class*="workLabel"]');
      const card=document.querySelector('[class*="bankCard"]');
      const badge=card.querySelector('[class*="actionRequired"]');
      const cardRect=card.getBoundingClientRect();
      const badgeRect=badge.getBoundingClientRect();
      return {tabWidth:getComputedStyle(tab).width,labelFits:label.scrollWidth<=label.clientWidth,cardWidth:getComputedStyle(card).width,cardHeight:getComputedStyle(card).height,badgeInside:badgeRect.left>=cardRect.left&&badgeRect.right<=cardRect.right,missingImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)};
    })()`);
    assert(geometry.labelFits);
    assert(geometry.badgeInside);
    assert.deepEqual(geometry.missingImages,[]);
    await click('[aria-label="Philippines home wallet"]');
    await until(`document.querySelector('[aria-label="PHP wallet"]') && !document.querySelector('.prototype-work-location-loading')`);
    assert(await evaluate(`document.querySelector('[aria-label="Choose where you work"]').innerText === 'Where you work'`));
    console.log(JSON.stringify({width,...geometry,philippinesReset:true}));
  }
  assert.deepEqual(errors,[]);
  assert.deepEqual(failedResponses,[]);
  console.log('PASS Hong Kong display and Philippines reset; no browser errors or failed asset requests.');
} finally { ws.close(); }
