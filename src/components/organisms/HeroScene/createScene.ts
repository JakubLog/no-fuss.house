import {
  ACESFilmicToneMapping,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  WebGLRenderer,
  type Texture,
} from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader, type Font } from "three/addons/loaders/FontLoader.js";
import { LegacyRoomEnvironment } from "./legacyRoomEnvironment";
import { createBody, FixedStepper, stepWorld, TICK_RATE, type Body, type World } from "./physics";
import type { FussStore, SceneFit, SceneRepel } from "./types";

/**
 * Scena napisu 3D 1:1 z legacy (no-fuss-v5.html / 404.html, moduł „Obiekt 3D w hero”).
 * Czysty moduł imperatywny: React montuje go w `HeroScene` i woła `dispose()` przy unmount.
 */

export const FONT_URL = "/three/fonts/helvetiker_bold.typeface.json";

export const DEFAULT_FIT: SceneFit = {
  widthDesktop: 0.62,
  widthMobile: 0.86,
  maxScale: 1.4,
  offsetYDesktop: 0.02,
  offsetYMobile: 0.12,
};

export const DEFAULT_REPEL: SceneRepel = { radius: 1.2, strength: 60 };

const MOBILE_BREAKPOINT = 768;
const SIZE = 2;

/* Font ładowany raz na sesję (hero ↔ 404 bez ponownego pobierania). */
let fontPromise: Promise<Font> | null = null;
function loadFont(): Promise<Font> {
  if (!fontPromise) {
    fontPromise = new FontLoader().loadAsync(FONT_URL).catch((error: unknown) => {
      fontPromise = null;
      throw error;
    });
  }
  return fontPromise;
}

interface Letter {
  mesh: Mesh<TextGeometry, MeshPhysicalMaterial>;
  body: Body;
}

export interface CreateSceneOptions {
  text: string;
  fuss: FussStore;
  fit: SceneFit;
  repel: SceneRepel | false;
  /** Pierwsza klatka z literami narysowana. */
  onReady?: () => void;
  /** Font się nie wczytał (WebGL działa, ale nie ma czego rysować). */
  onError?: (error: unknown) => void;
}

export interface SceneHandle {
  dispose(): void;
}

/**
 * Tworzy scenę na podanej kanwie. Rzuca wyjątek, gdy WebGL jest niedostępny.
 * Pętla działa tylko, gdy kanwa jest w viewporcie i karta jest widoczna.
 * Fizyka w `physics.ts` (stały krok jak legacy, sprawdzana symulacją).
 */
export function createHeroScene(canvas: HTMLCanvasElement, options: CreateSceneOptions): SceneHandle {
  const { text, fuss: fussStore, fit, repel, onReady, onError } = options;
  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = reducedQuery.matches;

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = ACESFilmicToneMapping;
  /* legacy: 1.15 w konstruktorze, ale applyTheme() od razu ustawiał 0.8 */
  renderer.toneMappingExposure = 0.8;

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.z = 12;

  const pmrem = new PMREMGenerator(renderer);
  /* legacy (r160): `new RoomEnvironment()` bez renderera → światło 5, nie 900 (patrz LegacyRoomEnvironment) */
  const room = new LegacyRoomEnvironment();
  const envMap: Texture = pmrem.fromScene(room, 0.04).texture;
  scene.environment = envMap;

  const key = new DirectionalLight(0xffffff, 1.2);
  key.position.set(-4, 6, 8);
  scene.add(key);
  const rim = new DirectionalLight(0xeaffb0, 1.4);
  rim.position.set(6, -2, -4);
  scene.add(rim);

  /* Limonka z clearcoatem i iryzacją (DESIGN.md → Elevation & Depth). */
  const material = new MeshPhysicalMaterial({
    color: 0xbbff00,
    roughness: 0.1,
    metalness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    iridescence: 0.6,
    iridescenceIOR: 1.4,
    iridescenceThicknessRange: [120, 520],
    envMapIntensity: 0.9,
  });

  const group = new Group();
  scene.add(group);

  const letters: Letter[] = [];
  let baseW = 1;
  let disposed = false;
  let readySent = false;
  /* legacy: grupa startuje z obrotem 0 i dostaje (−0.12, 0, 0.06) po wczytaniu fontu */
  const world: World = { bodies: [], fuss: fussStore.get(), rotX: 0, rotY: 0, posZ: 0 };

  /* ---------- wskaźnik: 1:1 z legacy (mousemove na oknie, start = środek ekranu) ---------- */
  let mx = 0;
  let my = 0;
  const onMouseMove = (event: MouseEvent) => {
    mx = event.clientX / window.innerWidth - 0.5;
    my = event.clientY / window.innerHeight - 0.5;
  };

  /* ---------- geometria ---------- */
  const visH = () => 2 * Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
  const visW = () => visH() * camera.aspect;

  const fitScene = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const mobile = w < MOBILE_BREAKPOINT;
    const scale = Math.min((visW() * (mobile ? fit.widthMobile : fit.widthDesktop)) / baseW, fit.maxScale);
    group.scale.setScalar(scale);
    group.position.y = visH() * (mobile ? fit.offsetYMobile : fit.offsetYDesktop);
  };

  const buildLetters = (font: Font) => {
    const k = SIZE / font.data.resolution;
    let x = 0;
    Array.from(text).forEach((ch, i) => {
      const glyph = font.data.glyphs[ch] ?? font.data.glyphs.o;
      const advance = (glyph?.ha ?? 0) * k;
      if (ch !== " ") {
        const geometry = new TextGeometry(ch, {
          font,
          size: SIZE,
          depth: 0.5,
          curveSegments: 16,
          bevelEnabled: true,
          bevelThickness: 0.34,
          bevelSize: 0.2,
          bevelSegments: 14,
        });
        geometry.computeBoundingBox();
        const bb = geometry.boundingBox;
        if (bb) {
          const cx = (bb.max.x + bb.min.x) / 2;
          const cy = (bb.max.y + bb.min.y) / 2;
          geometry.translate(-cx, -cy, -0.25);
          const mesh = new Mesh(geometry, material);
          group.add(mesh);
          const r = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y) * 0.5 * 0.92;
          letters.push({ mesh, body: createBody(x + cx, cy, i, r) });
        } else {
          geometry.dispose();
        }
      }
      x += advance;
    });
    baseW = x || 1;
    for (const { body } of letters) {
      body.hx -= x / 2;
      body.hy -= SIZE * 0.36;
      body.p.x = body.hx;
      body.p.y = body.hy;
      body.p.z = 0;
    }
    world.bodies = letters.map((letter) => letter.body);
    world.rotX = -0.12;
    world.rotY = 0;
    group.rotation.set(-0.12, 0, 0.06);
    fitScene();
    syncGroup();
  };

  const syncGroup = () => {
    for (const { mesh, body } of letters) {
      mesh.position.set(body.p.x, body.p.y, body.p.z);
      mesh.rotation.set(body.rot.x, body.rot.y, body.rot.z);
      mesh.scale.setScalar(body.scale);
    }
    group.rotation.x = world.rotX;
    group.rotation.y = world.rotY;
    group.position.z = world.posZ;
  };

  /* ---------- klatka: fizyka 1:1 z legacy (physics.ts) ---------- */
  let ticks = 0;
  const tick = () => {
    stepWorld(world, {
      fussTarget: fussStore.get(),
      /* czas drgań i oddechu: jak legacy liczony w sekundach, 60 kroków = 1 s */
      t: ticks / TICK_RATE,
      mx,
      my,
      visW: visW(),
      visH: visH(),
      groupY: group.position.y,
      groupScale: group.scale.x,
      reduced,
      repel,
    });
    ticks++;
  };

  const draw = () => {
    syncGroup();
    renderer.render(scene, camera);
    if (!readySent && letters.length) {
      readySent = true;
      onReady?.();
    }
  };

  /* ---------- pętla z pauzą ---------- */
  let raf = 0;
  let running = false;
  let last = 0;
  let inView = true;
  let pageVisible = document.visibilityState !== "hidden";

  const stepper = new FixedStepper();

  const frame = (now: number) => {
    const steps = stepper.advance((now - last) / 1000);
    last = now;
    for (let s = 0; s < steps; s++) tick();
    if (steps > 0) draw();
    raf = requestAnimationFrame(frame);
  };

  const syncLoop = () => {
    const shouldRun = !disposed && inView && pageVisible && letters.length > 0;
    if (shouldRun && !running) {
      running = true;
      /* wznowienie po pauzie: zegar od nowa, pierwsza klatka to zwykły krok (bez skoku dt) */
      stepper.reset();
      last = performance.now() - 1000 / TICK_RATE;
      raf = requestAnimationFrame(frame);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  };

  const onVisibility = () => {
    pageVisible = document.visibilityState !== "hidden";
    syncLoop();
  };
  const onReducedChange = (event: MediaQueryListEvent) => {
    reduced = event.matches;
  };

  const intersection = new IntersectionObserver(([entry]) => {
    inView = entry?.isIntersecting ?? true;
    syncLoop();
  });
  intersection.observe(canvas);

  const resize = new ResizeObserver(() => {
    fitScene();
    if (!running && letters.length) renderer.render(scene, camera);
  });
  resize.observe(canvas);

  window.addEventListener("mousemove", onMouseMove, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  reducedQuery.addEventListener("change", onReducedChange);

  fitScene();

  loadFont().then(
    (font) => {
      if (disposed) return;
      buildLetters(font);
      syncLoop();
    },
    (error: unknown) => {
      if (!disposed) onError?.(error);
    },
  );

  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      syncLoop();
      cancelAnimationFrame(raf);
      intersection.disconnect();
      resize.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedQuery.removeEventListener("change", onReducedChange);
      for (const letter of letters) {
        group.remove(letter.mesh);
        letter.mesh.geometry.dispose();
      }
      letters.length = 0;
      material.dispose();
      envMap.dispose();
      pmrem.dispose();
      room.dispose();
      renderer.dispose();
    },
  };
}
