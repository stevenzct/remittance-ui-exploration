await Promise.all([cdp('Page.enable'), cdp('Runtime.enable'), cdp('Network.enable')]);
try {
  for (const [width, motion] of [[1440, 'no-preference'], [390, 'reduce']]) {
    await cdp('Emulation.setDeviceMetricsOverride', {width,height:1100,deviceScaleFactor:1,mobile:false});
    await cdp('Emulation.setEmulatedMedia', {features:[{name:'prefers-reduced-motion',value:motion}]});
    await cdp('Page.navigate', {url:'http://127.0.0.1:3100/prototype-v1'});
    await until(`document.querySelector('[aria-label="Choose where you work"]') && [...document.images].every(i=>i.complete)`);
    await evaluate('document.fonts.ready.then(() => true)');
    await delay(400);
    await click('[aria-label="Philippines home wallet"]');
    assert.equal(await evaluate(`document.querySelector('.prototype-work-location-loading') === null`), true);
    let previous;
    for (const [country,currency] of [['Hong Kong','HKD'],['Singapore','SGD'],['Saudi Arabia','SAR']]) {
      await choose(country,currency,previous);
      await evaluate(`document.querySelector('[aria-label="Wallet and offers"]').scrollTop=400`);
      await click('[aria-label="Philippines home wallet"]');
      await until(`document.querySelector('[aria-label="Loading Philippines"]')`);
      assert(await evaluate(`document.querySelector('[class*="home"][inert]') !== null`));
      assert((await evaluate(`decodeURIComponent(document.querySelector('[aria-label="Loading Philippines"] img').src)`)).includes('/assets/prototype-figma/work-location-philippines-loading.png'));
      if (width === 1440 && country === 'Hong Kong') {
        await until(`document.querySelector('[aria-label="Loading Philippines"] img').complete`);
        await delay(650);
        await screenshot('philippines-transition.png');
      }
      await until(`document.querySelector('[aria-label="PHP wallet"]') && !document.querySelector('.prototype-work-location-loading')`);
      await delay(60);
      assert.equal(await evaluate(`document.activeElement?.getAttribute('aria-label')`), 'Philippines home wallet');
      assert.equal(await evaluate(`document.querySelector('[aria-label="Wallet and offers"]').scrollTop`), 0);
      assert.equal(await evaluate(`document.querySelector('[aria-label="Philippines home wallet"]').getAttribute('aria-pressed')`), 'true');
      assert.equal(await evaluate(`document.querySelector('[aria-label="Work country: ${country}"]').getAttribute('aria-pressed')`), 'false');
      assert((await evaluate(`document.querySelector('[aria-label="PHP wallet"]').innerText`)).includes('₱3,000.00'));
      assert.deepEqual(await evaluate(`[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)`), []);
      await click('[aria-label="Philippines home wallet"]');
      assert(await evaluate(`document.querySelector('.prototype-work-location-loading') === null`));
      previous=country;
      console.log(`PASS ${country} → Philippines (${width}px, ${motion}): artwork, wallet, scroll, focus, retained work country, no replay on active PHP`);
    }
    await screenshot(`philippines-wallet-${width}.png`);
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(failedResponses, []);
  console.log('PASS no browser errors or failed asset requests');
} finally {
  await fs.writeFile(new URL('report.json',directory),JSON.stringify({errors,failedResponses},null,2));
  ws.close();
}
