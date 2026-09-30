import {
  ACESFilmicToneMapping,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  type Texture,
} from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader, type Font } from "three/addons/loaders/FontLoader.js";
import { createEnvMap, loadEnvMap } from "./envMap";
import { createBody, FixedStepper, scatterBody, stepWorld, TICK_RATE, type Body, type World } from "./physics";
import type { SceneFit, SceneRepel } from "./types";

/**
 * Scena napisu 3D 1:1 z legacy (no-fuss-v5.html / 404.html, moduł „Obiekt 3D w hero”).
 * Czysty moduł imperatywny bez DOM: działa w workerze na `OffscreenCanvas` (`scene.worker.ts`), a gdy
 * przeglądarka nie ma WebGL w workerze, na głównym wątku. Stan strony (rozmiar, wskaźnik, zamieszanie,
 * widoczność) podaje `mountHeroScene` przez `SceneHandle`.
 */

export const FONT_URL = "/three/fonts/helvetiker_bold.typeface.json";

const MOBILE_BREAKPOINT = 768;
/*
 * Kanwa zajmuje całe hero, a materiał (clearcoat + iryzacja) jest drogi na piksel: przy DPR 2
 * i oknie 1440×900 to 2880×1800 px z MSAA co klatkę. 1.5 to −44% pikseli, na ekranie nieodróżnialne od 2.
 */
const MAX_PIXEL_RATIO = 1.5;
const SIZE = 2;
/** Przechył grupy w osi Z (legacy): prawy koniec napisu wyżej, więc napis jest wyższy o `baseW · sin`. */
const TILT_Z = 0.06;

/* Font ładowany raz na życie wątku (patrz cache w `envMap.ts`: w workerze to jeden montaż sceny). */
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

/** Bryła jednego znaku, wyśrodkowana w (x, y); wymiary z bounding boxa przed przesunięciem. */
interface Glyph {
  geometry: TextGeometry;
  cx: number;
  cy: number;
  /** Promień kolizji. */
  r: number;
  minY: number;
  maxY: number;
}

function buildGlyph(font: Font, ch: string): Glyph | null {
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
  if (!bb) {
    geometry.dispose();
    return null;
  }
  const cx = (bb.max.x + bb.min.x) / 2;
  const cy = (bb.max.y + bb.min.y) / 2;
  geometry.translate(-cx, -cy, -0.25);
  const r = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y) * 0.5 * 0.92;
  return { geometry, cx, cy, r, minY: bb.min.y, maxY: bb.max.y };
}

/** Układ kanwy na stronie, mierzony na głównym wątku (`mountScene.ts`). */
export interface SceneLayout {
  /** Rozmiar kanwy w px CSS. */
  width: number;
  height: number;
  /** `devicePixelRatio` okna; scena ogranicza go do 1.5. */
  pixelRatio: number;
  /**
   * Ramka napisu (od 768 px): `offsetY` = środek kanwy − środek ramki w px (dodatnie: ramka wyżej),
   * `height` = wysokość ramki. `null`: bez ramki albo ramka o wysokości 0 (`display: none`).
   */
  frame: { offsetY: number; height: number } | null;
}

export interface SceneInit {
  text: string;
  fit: SceneFit;
  repel: SceneRepel | false;
  /** Zamieszanie na starcie 0–1: litery startują w tej pozie. */
  fuss: number;
  /** Wskaźnik względem okna: clientX / innerWidth − 0.5 (legacy, 0 = środek ekranu). */
  pointer: { x: number; y: number };
  reduced: boolean;
  /** Kanwa w viewporcie i karta widoczna. */
  active: boolean;
  layout: SceneLayout;
}

export interface SceneEvents {
  /** Pierwsza klatka z literami narysowana. */
  onReady(): void;
  /** Start sceny się nie powiódł (font, mapa otoczenia, geometria): WebGL działa, ale nie ma czego rysować. */
  onError(error: unknown): void;
}

/** Wejścia sceny; w workerze każda metoda to jedna wiadomość (`scene.worker.ts`). */
export interface SceneInputs {
  setFuss(value: number): void;
  setPointer(x: number, y: number): void;
  setLayout(layout: SceneLayout): void;
  /** Pętla działa tylko, gdy kanwa jest w viewporcie i karta jest widoczna. */
  setActive(active: boolean): void;
  setReduced(reduced: boolean): void;
}

export interface SceneHandle extends SceneInputs {
  dispose(): void;
}

/**
 * Tworzy scenę na podanej kanwie. Rzuca wyjątek, gdy WebGL jest niedostępny.
 * Start: font i zapieczona mapa otoczenia równolegle → każdy znak osobno (extrude z fazą w osobnym zadaniu)
 * → kompilacja shaderów w tle (`compileAsync`) → pierwsza klatka.
 * Fizyka w `physics.ts` (stały krok jak legacy, sprawdzana symulacją).
 */
export function createHeroScene(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  init: SceneInit,
  events: SceneEvents,
): SceneHandle {
  const { text, fit, repel } = init;
  let { reduced, active, layout } = init;
  let fussTarget = init.fuss;
  let mx = init.pointer.x;
  let my = init.pointer.y;

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.toneMapping = ACESFilmicToneMapping;
  /* legacy: 1.15 w konstruktorze, ale applyTheme() od razu ustawiał 0.8 */
  renderer.toneMappingExposure = 0.8;

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.z = 12;
  let envMap: Texture | null = null;

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
  /* Bryły znaków; powtórzone znaki (dwa „s”) dzielą geometrię. */
  const glyphs = new Map<string, Glyph | null>();
  let baseW = 1;
  let baseH = 1;
  let disposed = false;
  /* Litery zbudowane i shadery skompilowane: wolno rysować (pętla, zmiana układu). */
  let live = false;
  let readySent = false;
  /* legacy: grupa startuje z obrotem 0 i dostaje (−0.12, 0, 0.06) po wczytaniu fontu */
  const world: World = { bodies: [], fuss: fussTarget, rotX: 0, rotY: 0, posZ: 0 };

  /* ---------- geometria ---------- */
  const visH = () => 2 * Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
  const visW = () => visH() * camera.aspect;

  const fitScene = () => {
    const { width: w, height: h } = layout;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(layout.pixelRatio, MAX_PIXEL_RATIO));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const mobile = w < MOBILE_BREAKPOINT;
    const byWidth = (visW() * (mobile ? fit.widthMobile : fit.widthDesktop)) / baseW;
    /* Ramka (desktop): środek i wysokość z prostokątów na stronie, px → jednostki świata na z = 0. */
    const frame = mobile ? null : layout.frame;
    const unit = visH() / h;
    if (frame) {
      const byHeight = fit.heightDesktop ? (frame.height * unit * fit.heightDesktop) / baseH : Infinity;
      group.scale.setScalar(Math.min(byWidth, byHeight, fit.maxScale));
      group.position.y = frame.offsetY * unit;
      return;
    }
    group.scale.setScalar(Math.min(byWidth, fit.maxScale));
    group.position.y = visH() * (mobile ? fit.offsetYMobile : fit.offsetYDesktop);
  };

  const buildLetters = (font: Font) => {
    const k = SIZE / font.data.resolution;
    let x = 0;
    let minY = Infinity;
    let maxY = -Infinity;
    Array.from(text).forEach((ch, i) => {
      const glyph = font.data.glyphs[ch] ?? font.data.glyphs.o;
      const advance = (glyph?.ha ?? 0) * k;
      const shape = glyphs.get(ch);
      if (shape) {
        minY = Math.min(minY, shape.minY);
        maxY = Math.max(maxY, shape.maxY);
        const mesh = new Mesh(shape.geometry, material);
        group.add(mesh);
        letters.push({ mesh, body: createBody(x + shape.cx, shape.cy, i, shape.r) });
      }
      x += advance;
    });
    baseW = x || 1;
    /* Wysokość napisu na ekranie: glify + różnica wysokości końców przez przechył `TILT_Z`. */
    baseH = (maxY > minY ? maxY - minY : 1) + baseW * Math.sin(TILT_Z);
    /* Start w pozie startowego zamieszania: przy 1 (404, hero `/` przed ułożeniem) litery od razu są rozrzucone. */
    for (const { body } of letters) {
      body.hx -= x / 2;
      body.hy -= SIZE * 0.36;
      scatterBody(body, world.fuss);
    }
    world.bodies = letters.map((letter) => letter.body);
    world.rotX = -0.12;
    world.rotY = 0;
    group.rotation.set(-0.12, 0, TILT_Z);
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
      fussTarget,
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
      events.onReady();
    }
  };

  /* ---------- pętla z pauzą ---------- */
  let raf = 0;
  let running = false;
  let last = 0;

  const stepper = new FixedStepper();

  const frame = (now: number) => {
    const steps = stepper.advance((now - last) / 1000);
    last = now;
    for (let s = 0; s < steps; s++) tick();
    if (steps > 0) draw();
    raf = requestAnimationFrame(frame);
  };

  const syncLoop = () => {
    const shouldRun = !disposed && active && live;
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

  fitScene();

  const start = async () => {
    const [font, env] = await Promise.all([loadFont(), loadEnvMap()]);
    if (disposed) return;
    envMap = createEnvMap(env);
    scene.environment = envMap;
    /*
     * Extrude z fazą to najdroższa część startu: każdy znak w osobnym zadaniu (setTimeout 0), co liczy się
     * na głównym wątku. Konstruktor zamiast `Promise.withResolvers`: to API jest od Safari 17.4, a cele Next
     * sięgają Safari 16.4.
     */
    for (const ch of new Set(text)) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (disposed) return;
      if (ch !== " ") glyphs.set(ch, buildGlyph(font, ch));
    }
    buildLetters(font);
    /* Kompilacja w tle (KHR_parallel_shader_compile): bez niej pierwsza klatka blokuje wątek na linkowaniu. */
    await renderer.compileAsync(scene, camera);
    if (disposed) return;
    live = true;
    syncLoop();
  };
  start().catch((error: unknown) => {
    if (!disposed) events.onError(error);
  });

  return {
    setFuss(value) {
      fussTarget = value;
    },
    setPointer(x, y) {
      mx = x;
      my = y;
    },
    setLayout(next) {
      layout = next;
      fitScene();
      if (!running && live) renderer.render(scene, camera);
    },
    setActive(value) {
      active = value;
      syncLoop();
    },
    setReduced(value) {
      reduced = value;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      syncLoop();
      cancelAnimationFrame(raf);
      for (const letter of letters) group.remove(letter.mesh);
      letters.length = 0;
      for (const glyph of glyphs.values()) glyph?.geometry.dispose();
      glyphs.clear();
      material.dispose();
      envMap?.dispose();
      renderer.dispose();
    },
  };
}
