import { createHeroScene, type SceneHandle, type SceneInit, type SceneLayout } from "./createScene";

/**
 * Worker sceny: three.js, geometria, kompilacja shaderów, fizyka i rysowanie poza głównym wątkiem
 * (kanwa przekazana przez `transferControlToOffscreen`). Na słabym sprzęcie napis pojawia się później,
 * ale strona (scroll, reveal, animacje) nie czeka na scenę. Protokół: `ToWorker` / `FromWorker`, host w `mountScene.ts`.
 */

/** Główny wątek → worker. Poza `init` każda wiadomość to jedno wejście `SceneInputs`. */
export type ToWorker =
  | { type: "init"; canvas: OffscreenCanvas; init: SceneInit }
  | { type: "fuss"; value: number }
  | { type: "pointer"; x: number; y: number }
  | { type: "layout"; layout: SceneLayout }
  | { type: "active"; value: boolean }
  | { type: "reduced"; value: boolean };

/** Worker → główny wątek. `probe` przychodzi zawsze pierwsze, zaraz po starcie workera. */
export type FromWorker = { type: "probe"; ok: boolean } | { type: "ready" } | { type: "error"; message: string };

const post = (message: FromWorker) => self.postMessage(message);

/*
 * WebGL2 w `OffscreenCanvas` i rAF w workerze: Safari 16.4–16.x i Safari 17 na macOS 13 / iOS 16 mają
 * `OffscreenCanvas` tylko z kontekstem 2D. Bez tego host rysuje scenę na głównym wątku.
 */
function probe(): boolean {
  if (typeof OffscreenCanvas === "undefined" || typeof requestAnimationFrame !== "function") return false;
  try {
    const gl = new OffscreenCanvas(1, 1).getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return gl !== null;
  } catch {
    return false;
  }
}

let scene: SceneHandle | null = null;

self.addEventListener("message", (event: MessageEvent<ToWorker>) => {
  const message = event.data;
  if (message.type === "init") {
    try {
      scene = createHeroScene(message.canvas, message.init, {
        onReady: () => post({ type: "ready" }),
        onError: (error) => post({ type: "error", message: String(error) }),
      });
    } catch (error) {
      post({ type: "error", message: String(error) });
    }
    return;
  }
  if (!scene) return;
  switch (message.type) {
    case "fuss":
      scene.setFuss(message.value);
      break;
    case "pointer":
      scene.setPointer(message.x, message.y);
      break;
    case "layout":
      scene.setLayout(message.layout);
      break;
    case "active":
      scene.setActive(message.value);
      break;
    case "reduced":
      scene.setReduced(message.value);
      break;
  }
});

post({ type: "probe", ok: probe() });
