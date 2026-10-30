// node render.js <scene> <fmt> <mode: stills|video> [outdir]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
(async () => {
  const [scene, fmt, mode, out] = process.argv.slice(2);
  const W = 1080, H = fmt === 'story' ? 1920 : 1350, FPS = 30;
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  page.on('console', m => console.log('console:', m.text()));
  page.on('pageerror', e => console.log('pageerror:', e.message));
  await page.goto('file://' + path.resolve(__dirname, 'anim/anim.html') + `?scene=${scene}&fmt=${fmt}`);
  const DUR = await page.evaluate(() => window.ready);
  const el = await page.$('#stage');
  if (mode === 'stills') {
    const ts = (process.argv[6] || '0.3,2.8,4.0,6.5,9.5,13.5').split(',').map(Number);
    for (const t of ts) { await page.evaluate(t => window.render(t), t); await el.screenshot({ path: `${out}/${scene}-${fmt}-${t}.png` }); }
  } else {
    const file = `${out}/${scene}-${fmt}.mp4`;
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo',
      '-map', '0:v', '-map', '1:a', '-shortest', '-c:v', 'libx264', '-profile:v', 'main', '-level', '4.0', '-preset', 'slow', '-crf', '18',
      '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', file], { stdio: ['pipe', 'inherit', 'inherit'] });
    const n = Math.round(DUR * FPS);
    for (let i = 0; i < n; i++) {
      await page.evaluate(t => window.render(t), i / FPS);
      const buf = await el.screenshot({ type: 'jpeg', quality: 96 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
    // okładka: kadr z hero
    await page.evaluate(t => window.render(t), 3.0);
    await el.screenshot({ path: `${out}/${scene}-${fmt}-cover.png` });
    console.log('done', file, n, 'frames');
  }
  await browser.close();
})();
