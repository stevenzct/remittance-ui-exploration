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
