const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  pg.on('pageerror', e => console.log('err', e.message));
  for (const id of ['ah', 'otb', 'busybee', 'ourmoney', 'sassy']) for (const v of [0, 1, 2]) {
    await pg.goto('file://' + path.resolve(__dirname, 'anim/stills.html') + `?id=${id}&v=${v}`);
    await pg.evaluate(() => window.ready);
    await (await pg.$('#s')).screenshot({ path: `out/stille/${id}-${v + 1}.png` });
  }
  await b.close();
})();
