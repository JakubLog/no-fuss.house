/**
 * Zapieka mapę otoczenia napisu 3D (PMREM z `LegacyRoomEnvironment` z `legacyRoomEnvironment.js`, sigma 0.04, rozmiar 256) do
 * `public/three/env/room-pmrem.bin.gz`, żeby przeglądarka nie renderowała pokoju i nie kompilowała shaderów
 * PMREM przy każdym wejściu. Uruchom po zmianie pokoju albo three.js: `pnpm bake:env`.
 *
 * Jak: lokalny serwer podaje stronę z three z node_modules i `legacyRoomEnvironment.js`,
 * Chrome headless (SwiftShader, deterministycznie) renderuje PMREM tym samym kodem co runtime,
 * odczytuje piksele (half float RGBA) i odsyła je POST-em. Ścieżka Chrome: zmienna CHROME albo domyślna instalacja macOS.
 *
 * Format (odczyt: `envMap.ts`), całość w gzip: nagłówek u32 LE szerokość, wysokość; potem RGB half float
 * (bez alfy: shader bierze tylko `.rgb`) rozdzielone na płaszczyzny bajtów (najpierw starsze, potem młodsze
 * bajty wszystkich składowych), z mantysą zaokrągloną do 6 bitów (błąd względny ≤ 0.8%, poniżej kroku
 * 8-bitowego ekranu). Płaszczyzny i zaokrąglenie: 226 KB zamiast 923 KB dla surowego RGBA.
 * Wymaga Node ≥ 22.18 (uruchamianie `.ts` bez kompilacji) i Chrome.
 */
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public/three/env/room-pmrem.bin.gz");
const chrome = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
/** Obcinane bity mantysy half float (10 → 6). */
const DROP_BITS = 4;

const page = `<!doctype html>
<script type="importmap">{"imports":{"three":"/three.module.js"}}</script>
<script type="module">
import { PMREMGenerator, WebGLRenderer } from "three";
import { LegacyRoomEnvironment } from "/room.js";
try {
  const renderer = new WebGLRenderer();
  const target = new PMREMGenerator(renderer).fromScene(new LegacyRoomEnvironment(), 0.04);
  const { width, height } = target;
  const pixels = new Uint16Array(width * height * 4);
  renderer.readRenderTargetPixels(target, 0, 0, width, height, pixels);
  await fetch("/result?w=" + width + "&h=" + height, { method: "POST", body: pixels });
} catch (error) {
  await fetch("/error", { method: "POST", body: String(error?.stack ?? error) });
}
</script>`;

const files: Record<string, () => Promise<string>> = {
  "/": async () => page,
  "/three.module.js": () => readFile(join(root, "node_modules/three/build/three.module.js"), "utf8"),
  "/three.core.js": () => readFile(join(root, "node_modules/three/build/three.core.js"), "utf8"),
  "/room.js": () => readFile(join(root, "scripts/legacyRoomEnvironment.js"), "utf8"),
};

const { promise: result, resolve, reject } = Promise.withResolvers<{ width: number; height: number; data: Buffer }>();

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (req.method === "POST") {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    res.end();
    const body = Buffer.concat(chunks);
    if (url.pathname === "/result") {
      resolve({ width: Number(url.searchParams.get("w")), height: Number(url.searchParams.get("h")), data: body });
    } else {
      reject(new Error(body.toString()));
    }
    return;
  }
  const file = files[url.pathname];
  if (!file) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": url.pathname === "/" ? "text/html" : "text/javascript" });
  res.end(await file());
});
server.listen(0, "127.0.0.1");
await once(server, "listening");
const address = server.address();
if (!address || typeof address === "string") throw new Error("Brak adresu serwera");

const browser = spawn(
  chrome,
  [
    "--headless=new",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    `--user-data-dir=${join(root, "node_modules/.cache/bake-env-chrome")}`,
    `http://127.0.0.1:${address.port}/`,
  ],
  { stdio: "ignore" },
);
const timeout = setTimeout(() => reject(new Error("Chrome nie odesłał mapy w 60 s")), 60_000);

try {
  const { width, height, data } = await result;
  if (data.length !== width * height * 8) throw new Error(`Zły rozmiar danych: ${data.length} B dla ${width}×${height}`);
  const rgba = new Uint16Array(data.buffer.slice(data.byteOffset, data.byteOffset + data.length));
  const texels = width * height;
  const file = Buffer.alloc(8 + texels * 6);
  file.writeUInt32LE(width, 0);
  file.writeUInt32LE(height, 4);
  const planeSize = texels * 3;
  for (let t = 0; t < texels; t++) {
    for (let c = 0; c < 3; c++) {
      /* Zaokrąglenie do 6 bitów mantysy; przeniesienie do wykładnika jest poprawne (half jest monotoniczny). */
      const half = ((rgba[t * 4 + c] + (1 << (DROP_BITS - 1))) >> DROP_BITS) << DROP_BITS;
      file[8 + t * 3 + c] = half >> 8;
      file[8 + planeSize + t * 3 + c] = half & 0xff;
    }
  }
  await mkdir(dirname(out), { recursive: true });
  const gz = gzipSync(file, { level: 9 });
  await writeFile(out, gz);
  console.log(`${out}: ${width}×${height}, ${(gz.length / 1024).toFixed(0)} KB`);
} finally {
  clearTimeout(timeout);
  browser.kill();
  server.close();
}
