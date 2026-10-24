const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch();
  for (const fmt of (process.argv[2] || 'feed,story').split(',')) {
    const pg = await b.newPage({ viewport: { width: 1080, height: fmt === 'story' ? 1920 : 1350 } });
    pg.on('pageerror', e => console.log('err', e.message));
    for (const id of ['ah', 'otb', 'busybee', 'ourmoney', 'sassy']) {
      await pg.goto('file://' + path.resolve(__dirname, 'anim/covers.html') + `?id=${id}&fmt=${fmt}`);
      await pg.evaluate(() => window.ready);
      await (await pg.$('#s')).screenshot({ path: `out/okladki/${id}-${fmt}.png` });
    }
  }
  await b.close();
})();
