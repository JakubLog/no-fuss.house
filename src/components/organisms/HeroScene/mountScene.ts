import type { SceneHandle, SceneInit, SceneInputs, SceneLayout } from "./createScene";
import type { FromWorker, ToWorker } from "./scene.worker";
import type { FussStore, SceneFit, SceneRepel } from "./types";

/*
 * Host sceny na głównym wątku. Tylko importy typów z `createScene` i workera: three.js nie trafia do tego
 * bundla, ładuje go worker, a na ścieżce awaryjnej dynamiczny import.
 */

export interface MountSceneOptions {
  text: string;
  fuss: FussStore;
  fit: SceneFit;
  repel: SceneRepel | false;
  /** Ramka napisu od 768 px (patrz `HeroSceneProps.frame`). */
  frame: HTMLElement | null;
  onReady: () => void;
  /** Brak WebGL albo nieudany start sceny: rodzic pokazuje fallback CSS. */
  onError: (error: unknown) => void;
}

/**
 * Montuje scenę na kanwie i zwraca funkcję sprzątającą. Scena rysuje w workerze (`OffscreenCanvas`), więc
 * budowa napisu i klatki nie blokują strony; gdy przeglądarka nie ma WebGL w workerze (próbka `probe` z workera)
 * albo workera nie da się uruchomić, scena działa na głównym wątku.
 * Kanwa musi być świeża: `transferControlToOffscreen` działa raz na element.
 * Host mierzy stronę (rozmiar kanwy, ramka, viewport, widoczność karty, wskaźnik, reduced motion, zamieszanie)
 * i przekazuje zmiany do sceny przez `SceneInputs`.
 */
export function mountHeroScene(canvas: HTMLCanvasElement, options: MountSceneOptions): () => void {
  const { text, fuss, fit, repel, frame } = options;
  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let inView = true;
  let pointer = { x: 0, y: 0 };
  let disposed = false;
  /* Cel wejść: scena lokalna albo pośrednik workera; `null` dopóki scena nie wystartuje. */
  let scene: SceneInputs | null = null;
  let local: SceneHandle | null = null;
  let worker: Worker | null = null;

  const onReady = () => {
    if (!disposed) options.onReady();
  };
  const onError = (error: unknown) => {
    if (!disposed) options.onError(error);
  };

  const isActive = () => inView && document.visibilityState !== "hidden";

  const measure = (): SceneLayout => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const box = frame?.getBoundingClientRect();
    let frameLayout: SceneLayout["frame"] = null;
    if (box && box.height > 0) {
      const own = canvas.getBoundingClientRect();
      frameLayout = { offsetY: own.top + height / 2 - (box.top + box.height / 2), height: box.height };
    }
    return { width, height, pixelRatio: window.devicePixelRatio, frame: frameLayout };
  };

  /* Stan w chwili startu sceny; kolejne zmiany idą przez `scene`. */
  const snapshot = (): SceneInit => ({
    text,
    fit,
    repel,
    fuss: fuss.get(),
    pointer,
    reduced: reducedQuery.matches,
    active: isActive(),
    layout: measure(),
  });

  const startLocal = async () => {
    /* Dynamicznie: statyczny import wciągnąłby three.js na główny wątek także wtedy, gdy rysuje worker. */
    const { createHeroScene } = await import("./createScene");
    if (disposed) return;
    local = createHeroScene(canvas, snapshot(), { onReady, onError });
    scene = local;
  };
  const fallBackToLocal = () => {
    worker?.terminate();
    worker = null;
    startLocal().catch(onError);
  };

  const startWorker = () => {
    const created = new Worker(new URL("./scene.worker.ts", import.meta.url), { type: "module" });
    worker = created;
    const send = (message: ToWorker, transfer: Transferable[] = []) => created.postMessage(message, transfer);
    let probed = false;
    created.addEventListener("message", (event: MessageEvent<FromWorker>) => {
      const message = event.data;
      if (message.type === "probe") {
        probed = true;
        if (!message.ok) {
          fallBackToLocal();
          return;
        }
        const offscreen = canvas.transferControlToOffscreen();
        send({ type: "init", canvas: offscreen, init: snapshot() }, [offscreen]);
        scene = {
          setFuss: (value) => send({ type: "fuss", value }),
          setPointer: (x, y) => send({ type: "pointer", x, y }),
          setLayout: (layout) => send({ type: "layout", layout }),
          setActive: (value) => send({ type: "active", value }),
          setReduced: (value) => send({ type: "reduced", value }),
        };
      } else if (message.type === "ready") {
        onReady();
      } else {
        onError(new Error(message.message));
      }
    });
    /* Skrypt workera się nie wczytał (przed próbką): scena na głównym wątku. Później: błąd sceny. */
    created.addEventListener("error", (event) => {
      if (probed) onError(event.error ?? new Error(event.message));
      else fallBackToLocal();
    });
  };

  if (typeof Worker === "function" && typeof canvas.transferControlToOffscreen === "function") {
    try {
      startWorker();
    } catch {
      fallBackToLocal();
    }
  } else {
    startLocal().catch(onError);
  }

  /* ---------- wejścia ze strony ---------- */
  const onMouseMove = (event: MouseEvent) => {
    /* 1:1 z legacy: mousemove na oknie, względem rozmiaru okna, start = środek ekranu */
    pointer = { x: event.clientX / window.innerWidth - 0.5, y: event.clientY / window.innerHeight - 0.5 };
    scene?.setPointer(pointer.x, pointer.y);
  };
  const onVisibility = () => scene?.setActive(isActive());
  const onReducedChange = (event: MediaQueryListEvent) => scene?.setReduced(event.matches);
  const unsubscribeFuss = fuss.subscribe((value) => scene?.setFuss(value));

  const intersection = new IntersectionObserver(([entry]) => {
    inView = entry?.isIntersecting ?? true;
    scene?.setActive(isActive());
  });
  intersection.observe(canvas);

  const resize = new ResizeObserver(() => scene?.setLayout(measure()));
  resize.observe(canvas);
  /* Ramka zmienia się bez zmiany kanwy (np. po wczytaniu fontu h1 rośnie, a pas maleje). */
  if (frame) resize.observe(frame);

  window.addEventListener("mousemove", onMouseMove, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  reducedQuery.addEventListener("change", onReducedChange);

  return () => {
    disposed = true;
    scene = null;
    unsubscribeFuss();
    intersection.disconnect();
    resize.disconnect();
    window.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("visibilitychange", onVisibility);
    reducedQuery.removeEventListener("change", onReducedChange);
    /* Zamknięcie workera zwalnia jego kontekst WebGL razem z zasobami sceny. */
    worker?.terminate();
    local?.dispose();
  };
}
