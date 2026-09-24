import type { SceneRepel } from "./types";

/**
 * Fizyka liter 1:1 z legacy (no-fuss-v5.html / 404.html). Czysta, bez three.js i DOM,
 * żeby dało się ją zasymulować w node i porównać z legacy klatka po klatce.
 *
 * Krok czasu: legacy liczył `clock.getElapsedTime()` a zaraz potem `clock.getDelta()`,
 * więc delta wychodziła 0 i przez `|| .016` każda klatka dostawała stałe dt = 0.016.
 * Sprężyny, tłumienie i lerpy (0.12 zamieszanie, 0.05 obrót) są strojone pod ten krok
 * wykonywany 60 razy na sekundę. Odtwarzamy dokładnie to: `TICK_RATE` kroków na sekundę
 * (akumulator w `FixedStepper`), każdy z dt = `LEGACY_DT`. Przy 60 Hz: jeden krok na klatkę,
 * wynik identyczny z legacy; przy 120 Hz tempo nie przyspiesza dwukrotnie.
 *
 * Świadome odejście od legacy (stabilność pod kursorem): legacy przy zamieszaniu < 1% teleportował
 * literę do domu, gdy |v| < 0.05, także wtedy, gdy kursor ją odpychał. Kursor stojący nad napisem
 * dawał cykl: odepchnięcie → wyhamowanie → teleport → odepchnięcie (widoczne „ścinki”), a sprężyna
 * (k = 40, tłumienie ≈ 3.9/s, ζ ≈ 0.3) i tak nie dochodziła do spoczynku bez oscylacji. Tu:
 * 1. odpychanie jest siłą w tym samym bilansie co sprężyna (ten sam krok) i działa wzdłuż prostej
 *    kursor → cel sprężyny, więc istnieje jeden punkt stały (bez ujemnej sztywności w poprzek);
 * 2. w pobliżu kursora i przy zamieszaniu ≈ 0 dokładamy tłumienie do krytycznego (ζ = 1)
 *    względem sztywności sprężyna + gradient odpychania: litera dochodzi do równowagi bez drgań;
 * 3. dosunięcie do domu tylko gdy odpychanie na literę = 0, litera jest ≤ 0.002 od domu i wolna.
 * Poza tym (rozrzut, drgania zamieszania, kolizje) fizyka jest bitowo równa legacy.
 */
export const LEGACY_DT = 0.016;
export const TICK_RATE = 60;
const TICK = 1 / TICK_RATE;
/** Tolerancja drgań rAF: klatka krótsza o ≤ 25% ticka nadal robi krok (60 Hz = zawsze 1 krok). */
const SLACK = TICK * 0.25;
/** Po pauzie (karta w tle, poza viewportem) nie nadrabiamy zaległości. */
const MAX_STEPS_PER_FRAME = 4;

const SPRING = 40;
/** Tłumienie legacy v *= 0.02^dt jako współczynnik [1/s]: −ln(0.02) ≈ 3.91. */
const BASE_DAMPING = -Math.log(0.02);
/** Docelowy współczynnik tłumienia w strefie spokoju (krytyczne: najszybsze dojście bez przestrzału). */
const SETTLE_ZETA = 1;
/** Strefa tłumienia wokół kursora: do 1.25 × promień odpychania, wygaszana liniowo. */
const NEAR_BAND = 0.25;
/** Poniżej tego zamieszania litery mają się uspokoić (pełne tłumienie przy 0). */
const CALM_FUSS = 0.05;
/** Dosunięcie do domu: maks. odległość (niewidoczny skok) i prędkość. */
const SNAP_DIST = 0.002;
const SNAP_SPEED = 0.05;

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Mnożnik prędkości dokładający tłumienie do ζ = SETTLE_ZETA dla sztywności `stiffness`, z wagą 0–1. */
const dampFactor = (stiffness: number, weight: number, dt: number) =>
  1 / (1 + Math.max(0, 2 * SETTLE_ZETA * Math.sqrt(stiffness) - BASE_DAMPING) * weight * dt);

/** Deterministyczny „losowy” rozrzut litery (legacy `rnd`), wynik w [-1, 1]. */
export const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Body {
  /** Pozycja domowa (zamieszanie 0), w układzie grupy. */
  hx: number;
  hy: number;
  /** Indeks znaku w tekście (seed rozrzutu). */
  i: number;
  /** Promień kolizji. */
  r: number;
  p: Vec3;
  v: Vec3;
  rot: Vec3;
  scale: number;
  /** Stan z bieżącego kroku: waga strefy kursora 0–1 i dodatkowa sztywność od odpychania. */
  near: number;
  repelK: number;
  repelled: boolean;
  /** Kierunek odpychania (jednostkowy, xy). */
  nx: number;
  ny: number;
}

export interface World {
  bodies: Body[];
  /** Wygładzone zamieszanie 0–1. */
  fuss: number;
  /** Obrót i „oddech” całej grupy. */
  rotX: number;
  rotY: number;
  posZ: number;
}

export interface StepInput {
  /** Cel zamieszania 0–1 (suwak). */
  fussTarget: number;
  /** Czas w sekundach (drgania, oddech). */
  t: number;
  /** Wskaźnik względem okna: clientX / innerWidth − 0.5 (legacy, start 0 = środek). */
  mx: number;
  my: number;
  /** Widoczny rozmiar sceny w jednostkach świata. */
  visW: number;
  visH: number;
  groupY: number;
  groupScale: number;
  reduced: boolean;
  repel: SceneRepel | false;
}

export function createBody(hx: number, hy: number, i: number, r: number): Body {
  return {
    hx,
    hy,
    i,
    r,
    p: { x: hx, y: hy, z: 0 },
    v: { x: 0, y: 0, z: 0 },
    rot: { x: 0, y: 0, z: 0 },
    scale: 1,
    near: 0,
    repelK: 0,
    repelled: false,
    nx: 1,
    ny: 0,
  };
}

/** Jedna klatka legacy `render()` (bez samego rysowania). Kolejność operacji 1:1. */
export function stepWorld(world: World, input: StepInput, dt: number = LEGACY_DT): void {
  const { bodies } = world;
  const { t, reduced, repel } = input;
  world.fuss += (input.fussTarget - world.fuss) * 0.12;
  const f = world.fuss;
  const w = (reduced ? 0 : 1) * f;
  const scale = input.groupScale || 1;
  /* legacy: Vector3(mx·visW, −my·visH, 0).sub(group.position).divideScalar(scale) */
  const inv = 1 / scale;
  const mouseX = (input.mx * input.visW - 0) * inv;
  const mouseY = (-input.my * input.visH - input.groupY) * inv;

  /* sprężyna do celu + odpychanie od wskaźnika (od pierwszej klatki, jak legacy); obie jako siły w tym samym kroku */
  for (const u of bodies) {
    const tx = u.hx + rnd(u.i, 1) * 1.1 * f + Math.sin(t * 1.7 + u.i) * 0.12 * w;
    const ty = u.hy + rnd(u.i, 2) * 1.5 * f + Math.cos(t * 2.1 + u.i * 2) * 0.16 * w;
    const tz = rnd(u.i, 3) * 1.6 * f;
    u.v.x += (tx - u.p.x) * SPRING * dt;
    u.v.y += (ty - u.p.y) * SPRING * dt;
    u.v.z += (tz - u.p.z) * SPRING * dt;
    u.near = 0;
    u.repelK = 0;
    u.repelled = false;
    if (!reduced && repel) {
      const dx = u.p.x - mouseX;
      const dy = u.p.y - mouseY;
      const d = Math.hypot(dx, dy);
      const R = u.r + repel.radius;
      u.near = clamp01((R * (1 + NEAR_BAND) - d) / (R * NEAR_BAND));
      u.repelK = repel.strength / R;
      u.repelled = d < R;
      /*
       * Kierunek odpychania: od kursora przez cel sprężyny (nie przez bieżącą pozycję). Siła leży
       * wtedy na jednej prostej ze sprężyną, więc punkt stały jest jednoznaczny i nie ma „ślizgu”
       * w poprzek (w legacy kierunek od pozycji dawał ujemną sztywność poprzeczną). Wartość jak legacy.
       */
      const ex = tx - mouseX;
      const ey = ty - mouseY;
      const e = Math.hypot(ex, ey);
      if (e > 1e-4) {
        u.nx = ex / e;
        u.ny = ey / e;
      } else if (d > 1e-4) {
        u.nx = dx / d;
        u.ny = dy / d;
      }
      if (d < R && d > 1e-4) {
        const k = ((R - d) / R) * repel.strength * dt;
        u.v.x += u.nx * k;
        u.v.y += u.ny * k;
      }
    }
  }

  /* kolizje: rozpychanie par liter */
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const A = bodies[i];
      const B = bodies[j];
      const dx = B.p.x - A.p.x;
      const dy = B.p.y - A.p.y;
      const dz = (B.p.z - A.p.z) * 0.6;
      const d = Math.hypot(dx, dy, dz) || 1e-4;
      const min = (A.r + B.r) * Math.min(1, f * 3);
      if (d < min) {
        const push = (min - d) * 30 * dt;
        const nx = dx / d;
        const ny = dy / d;
        const nz = dz / d;
        A.v.x -= nx * push;
        A.v.y -= ny * push;
        A.v.z -= nz * push * 0.5;
        B.v.x += nx * push;
        B.v.y += ny * push;
        B.v.z += nz * push * 0.5;
      }
    }
  }

  /* integracja, tłumienie, dosunięcie przy 0%, obrót i skala liter */
  const damp = Math.pow(0.02, dt);
  const calm = clamp01(1 - f / CALM_FUSS);
  for (const u of bodies) {
    u.v.x *= damp;
    u.v.y *= damp;
    u.v.z *= damp;
    /*
     * Uspokojenie: tłumienie dołożone do ζ = 1 osobno dla każdego modu (niejawnie, stabilne):
     * wzdłuż odpychania sztywność = sprężyna + gradient odpychania, w poprzek i w z = sama sprężyna.
     */
    const settle = Math.max(u.near, calm);
    if (settle > 0) {
      const kAlong = dampFactor(SPRING + u.near * u.repelK, settle, dt);
      const kCross = dampFactor(SPRING, settle, dt);
      const along = u.v.x * u.nx + u.v.y * u.ny;
      const cx = u.v.x - along * u.nx;
      const cy = u.v.y - along * u.ny;
      u.v.x = along * kAlong * u.nx + cx * kCross;
      u.v.y = along * kAlong * u.ny + cy * kCross;
      u.v.z *= kCross;
    }
    u.p.x += u.v.x * dt;
    u.p.y += u.v.y * dt;
    u.p.z += u.v.z * dt;
    if (
      f < 0.01 &&
      !u.repelled &&
      Math.hypot(u.p.x - u.hx, u.p.y - u.hy, u.p.z) <= SNAP_DIST &&
      Math.sqrt(u.v.x * u.v.x + u.v.y * u.v.y + u.v.z * u.v.z) < SNAP_SPEED
    ) {
      u.p.x = u.hx;
      u.p.y = u.hy;
      u.p.z = 0;
      u.v.x = 0;
      u.v.y = 0;
      u.v.z = 0;
    }
    u.rot.x = rnd(u.i, 4) * 1.2 * f + Math.sin(t * 1.3 + u.i) * 0.25 * w + u.v.y * 0.02;
    u.rot.y = rnd(u.i, 5) * 1.4 * f - u.v.x * 0.02;
    u.rot.z = rnd(u.i, 6) * 1.9 * f + Math.cos(t * 1.9 + u.i) * 0.2 * w;
    u.scale = 1 + rnd(u.i, 7) * 0.35 * f;
  }

  /* obrót całości za wskaźnikiem i „oddech” */
  if (!reduced) {
    world.rotY += (input.mx * 0.5 - world.rotY) * 0.05;
    world.rotX += (-0.12 + input.my * 0.3 + Math.sin(t * 0.6) * 0.04 - world.rotX) * 0.05;
    world.posZ = Math.sin(t * 0.8) * 0.15;
  }
}

/**
 * Akumulator stałego kroku. `advance(sekundy)` zwraca liczbę kroków do wykonania w tej klatce.
 * 60 Hz → 1, 120 Hz → na przemian 0 i 1, 30 Hz → 2. Po długiej przerwie maks. `MAX_STEPS_PER_FRAME`.
 */
export class FixedStepper {
  private acc = 0;

  reset(): void {
    this.acc = 0;
  }

  advance(seconds: number): number {
    this.acc += Math.max(0, seconds);
    let steps = 0;
    while (this.acc >= TICK - SLACK && steps < MAX_STEPS_PER_FRAME) {
      this.acc -= TICK;
      steps++;
    }
    if (steps === MAX_STEPS_PER_FRAME) this.acc = Math.min(this.acc, TICK - SLACK);
    return steps;
  }
}
