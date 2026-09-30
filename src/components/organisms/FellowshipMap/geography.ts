import { project, toPath, type Point } from "./route";

/**
 * Rysunek Śródziemia: własny, w stylu rysunku technicznego (cienkie linie, szewrony gór, kwadratowe
 * kropki lasów, kreskowanie morza i Mordoru). Współrzędne w milach od Hobbitonu (x na wschód, y na
 * południe), odczytane z ogólnej mapy Śródziemia z dokładnością do kilkunastu mil; na `viewBox`
 * rzutuje `project`. Bez tekstu: etykiety są w HTML, żeby trzymać skalę `--t-*`.
 * Liczone raz przy imporcie, identycznie na serwerze i kliencie.
 */

type Poly = readonly (readonly [number, number])[];

const pts = (poly: Poly): Point[] => poly.map(([x, y]) => project({ x, y }));

/** Łamana w milach → ścieżka SVG. */
const line = (poly: Poly) => toPath(pts(poly));

/** Gładka krzywa przez punkty (Catmull-Rom → Bézier): rzeki i wybrzeże. */
function smooth(poly: Poly): string {
  const p = pts(poly);
  let d = `M${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += `C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/** Szewrony „^” co `step` jednostek `viewBox` wzdłuż łamanej (grzbiet gór). */
function ridge(poly: Poly, step = 11, size = 5): string {
  const points = pts(poly);
  let out = "";
  let carry = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    for (let d = carry; d < len; d += step) {
      const x = a.x + ((b.x - a.x) * d) / len;
      const y = a.y + ((b.y - a.y) * d) / len;
      out += `M${(x - size).toFixed(1)} ${(y + size * 0.55).toFixed(1)}L${x.toFixed(1)} ${(y - size * 0.55).toFixed(1)}L${(x + size).toFixed(1)} ${(y + size * 0.55).toFixed(1)}`;
      carry = d + step - len;
    }
  }
  return out;
}

function inside(p: Point, polygon: readonly Point[]): boolean {
  let hit = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) hit = !hit;
  }
  return hit;
}

function bounds(polygon: readonly Point[]) {
  const xs = polygon.map((p) => p.x);
  const ys = polygon.map((p) => p.y);
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
}

/** Las: kwadratowe kropki w siatce z przesunięciem co drugi rząd, przycięte do wielokąta. */
function forest(poly: Poly, step = 8): string {
  const polygon = pts(poly);
  const { x0, x1, y0, y1 } = bounds(polygon);
  let out = "";
  for (let y = y0 + step / 2, row = 0; y <= y1; y += step * 0.8, row++) {
    for (let x = x0 + step / 2 + (row % 2) * (step / 2); x <= x1; x += step) {
      if (inside({ x, y }, polygon)) out += `M${x.toFixed(1)} ${y.toFixed(1)}h0.01`;
    }
  }
  return out;
}

/** Kreskowanie wielokąta: ukośne (Mordor) albo poziome (morze). Przycinane w SVG przez `clipPath`. */
function hatch(polygon: readonly Point[], step: number, slant: boolean): string {
  const { x0, x1, y0, y1 } = bounds(polygon);
  const h = y1 - y0;
  let out = "";
  if (slant) for (let x = x0 - h; x <= x1; x += step) out += `M${x.toFixed(1)} ${y1.toFixed(1)}l${h.toFixed(1)} ${(-h).toFixed(1)}`;
  else for (let y = y0; y <= y1; y += step) out += `M${x0.toFixed(1)} ${y.toFixed(1)}H${x1.toFixed(1)}`;
  return out;
}

/** Bagna: krótkie poziome kreski w trzech rzędach wokół punktu (mile). */
function marsh(cx: number, cy: number): string {
  const c = project({ x: cx, y: cy });
  let out = "";
  for (let r = -1; r <= 1; r++) {
    for (let k = -2; k <= 2; k++) {
      const x = c.x + k * 8 + (r % 2 === 0 ? 0 : 4);
      out += `M${(x - 2.5).toFixed(1)} ${(c.y + r * 6).toFixed(1)}h5`;
    }
  }
  return out;
}

/** Miasto / twierdza: mały kwadrat (mile). */
function fort(x: number, y: number): string {
  const c = project({ x, y });
  return `M${(c.x - 2.5).toFixed(1)} ${(c.y - 2.5).toFixed(1)}h5v5h-5Z`;
}

/* ---------- obszary (mile) ---------- */

/** Wybrzeże od Harlindonu po Andrast: morze leży na zachód od tej linii. */
const COAST: Poly = [
  [-240, 206],
  [-164, 276],
  [-84, 350],
  [-14, 424],
  [48, 504],
  [96, 590],
  [138, 680],
  [168, 796],
];

const SEA = pts([[-240, 206], ...COAST, [-240, 796]]);

/** Zatoka Lune z Szarymi Przystaniami na jej końcu. */
const GULF: Poly = [
  [-240, -34],
  [-192, -14],
  [-150, 8],
  [-190, 30],
  [-240, 44],
];

const MORDOR = pts([
  [720, 552],
  [1120, 512],
  [1120, 770],
  [718, 770],
]);

const DOOM = project({ x: 820, y: 650 });

export const OUTLINES = {
  sea: toPath(SEA) + "Z" + line(GULF) + "Z",
  mordor: toPath(MORDOR) + "Z",
};

export const GEOGRAPHY = {
  mountains: [
    /* Góry Mgliste: od Gundabadu po Methedras nad Isengardem */
    ridge([
      [488, -70],
      [462, -20],
      [440, 40],
      [428, 110],
      [416, 180],
      [396, 238],
      [384, 262],
      [386, 320],
      [380, 390],
      [368, 452],
    ]),
    /* Góry Błękitne, przecięte Zatoką Lune */
    ridge([
      [-206, -150],
      [-200, -90],
      [-196, -40],
    ]),
    ridge([
      [-198, 52],
      [-212, 110],
      [-232, 170],
    ]),
    /* Wichrowe Wzgórza, na ich południowym krańcu Wichrowy Czub */
    ridge([
      [200, -80],
      [206, -46],
      [212, -22],
    ]),
    /* Góry Białe: od Andrastu po Mindolluinę za Minas Tirith */
    ridge([
      [176, 770],
      [236, 718],
      [310, 668],
      [380, 632],
      [450, 650],
      [520, 664],
      [590, 684],
      [630, 700],
    ]),
    /* Emyn Muil wokół Nen Hithoel */
    ridge(
      [
        [548, 478],
        [590, 470],
        [626, 492],
      ],
      9,
      4,
    ),
    ridge(
      [
        [596, 545],
        [630, 540],
      ],
      9,
      4,
    ),
    /* Ered Lithui */
    ridge([
      [728, 548],
      [800, 538],
      [900, 528],
      [1000, 520],
      [1120, 514],
    ]),
    /* Ephel Dúath */
    ridge([
      [716, 562],
      [712, 604],
      [716, 646],
      [722, 686],
      [718, 724],
      [722, 770],
    ]),
  ].join(""),
  forests: [
    /* Mroczna Puszcza */
    forest([
      [562, -70],
      [840, -70],
      [846, 60],
      [816, 190],
      [736, 262],
      [650, 320],
      [604, 330],
      [584, 270],
      [572, 170],
      [560, 60],
    ]),
    /* Fangorn */
    forest([
      [388, 396],
      [440, 380],
      [478, 410],
      [472, 460],
      [424, 478],
      [390, 452],
    ]),
    /* Stary Las */
    forest([
      [52, 10],
      [86, 4],
      [96, 36],
      [62, 46],
    ]),
    /* Lothlórien */
    forest(
      [
        [428, 288],
        [486, 292],
        [490, 324],
        [440, 330],
      ],
      7,
    ),
  ].join(""),
  rivers: [
    /* Anduina: od północy przez Nen Hithoel i Rauros, obok Minas Tirith do Pelargiru */
    smooth([
      [522, -70],
      [512, 20],
      [502, 120],
      [494, 220],
      [492, 318],
      [528, 384],
      [560, 444],
      [576, 500],
      [582, 530],
      [588, 556],
      [600, 600],
      [634, 640],
      [664, 690],
      [648, 730],
      [630, 772],
    ]),
    /* Brandywina */
    smooth([
      [30, -70],
      [40, -30],
      [46, 10],
      [58, 70],
      [74, 140],
      [70, 230],
      [30, 330],
      [-20, 400],
    ]),
    /* Bruinen i Szara Woda do morza */
    smooth([
      [428, -40],
      [396, -12],
      [370, -2],
      [336, 60],
      [296, 128],
      [236, 250],
      [186, 336],
      [120, 450],
      [80, 540],
    ]),
    /* Szara Woda (Mitheithel) z północy przez Ostatni Most */
    smooth([
      [300, -70],
      [308, -10],
      [304, 60],
      [296, 128],
    ]),
    /* Srebrna Żyła: z Doliny Półmroku przez Lórien do Anduiny */
    smooth([
      [404, 282],
      [440, 300],
      [470, 312],
      [492, 318],
    ]),
    /* Rzeka Entów przez Rohan */
    smooth([
      [462, 462],
      [500, 520],
      [548, 572],
      [600, 600],
    ]),
    /* Isena */
    smooth([
      [366, 480],
      [362, 540],
      [310, 590],
      [230, 630],
      [150, 690],
    ]),
  ],
  marsh: marsh(668, 524),
  /* Wielki Gościniec (Szare Przystanie → Rivendell) i Zielona / Zachodnia Droga (Bree → Minas Tirith) */
  roads: [
    line([
      [-150, 8],
      [-70, 6],
      [0, 0],
      [45, 8],
      [125, 5],
      [170, 0],
      [215, -10],
      [310, -10],
      [370, -2],
      [390, -5],
    ]),
    line([
      [125, 5],
      [150, 120],
      [180, 240],
      [190, 334],
      [270, 450],
      [356, 556],
      [430, 624],
      [520, 640],
      [612, 690],
      [640, 702],
    ]),
  ].join(""),
  shire: line([
    [-80, -56],
    [42, -64],
    [48, 10],
    [60, 64],
    [-20, 82],
    [-90, 40],
  ]) + "Z",
  coast: [
    smooth(COAST) + smooth(GULF),
    smooth(COAST.map(([x, y]) => [x + 10, y] as const)) + smooth(GULF.map(([x, y]) => [x, y + (y < 8 ? -7 : 7)] as const)),
  ],
  seaHatch: hatch([...SEA, ...pts(GULF)], 7, false),
  mordorHatch: hatch(MORDOR, 8, true),
  /* Szare Przystanie, Minas Tirith, Edoras, Isengard, Barad-dûr */
  forts: [fort(-150, 8), fort(640, 702), fort(430, 624), fort(366, 476), fort(900, 604)].join(""),
  /* Góra Przeznaczenia: trójkąt, przystanek w jego wnętrzu */
  doom: `M${DOOM.x} ${DOOM.y - 14}L${DOOM.x + 13} ${DOOM.y + 8}L${DOOM.x - 13} ${DOOM.y + 8}Z`,
} as const;
