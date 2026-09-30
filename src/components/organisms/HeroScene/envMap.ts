import { CubeUVReflectionMapping, DataTexture, HalfFloatType, LinearFilter, LinearSRGBColorSpace, RGBAFormat } from "three";

/**
 * Zapieczona mapa otoczenia (PMREM pokoju `scripts/legacyRoomEnvironment.ts`, generuje `pnpm bake:env`).
 * Gotowa tekstura CubeUV: bez renderowania pokoju i kompilacji shaderów PMREM przy wejściu.
 * Format opisuje `scripts/bake-env.ts`.
 */
export const ENV_URL = "/three/env/room-pmrem.bin.gz";

const HALF_ONE = 0x3c00;

interface EnvData {
  width: number;
  height: number;
  /** RGBA half float. */
  data: Uint16Array;
}

async function fetchEnv(): Promise<EnvData> {
  const response = await fetch(ENV_URL);
  if (!response.ok) throw new Error(`${ENV_URL}: HTTP ${response.status}`);
  let bytes = new Uint8Array(await response.arrayBuffer());
  /* Serwer mógł rozpakować sam (Content-Encoding: gzip), więc gzip rozpoznajemy po sygnaturze 1f 8b. */
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
    bytes = new Uint8Array(await new Response(stream).arrayBuffer());
  }
  const header = new DataView(bytes.buffer, bytes.byteOffset, 8);
  const width = header.getUint32(0, true);
  const height = header.getUint32(4, true);
  const texels = width * height;
  if (bytes.byteLength !== 8 + texels * 6) throw new Error(`${ENV_URL}: zły rozmiar (${bytes.byteLength} B)`);
  /* Płaszczyzny bajtów RGB (starsze, potem młodsze) → RGBA; alfa 1 (shader bierze tylko `.rgb`). */
  const data = new Uint16Array(texels * 4);
  const lo = 8 + texels * 3;
  for (let t = 0; t < texels; t++) {
    for (let c = 0; c < 3; c++) {
      const i = t * 3 + c;
      data[t * 4 + c] = (bytes[8 + i] << 8) | bytes[lo + i];
    }
    data[t * 4 + 3] = HALF_ONE;
  }
  return { width, height, data };
}

/* Dane pobierane i dekodowane raz na sesję (hero ↔ 404); tekstura osobno dla każdego renderera. */
let envPromise: Promise<EnvData> | null = null;
export function loadEnvMap(): Promise<EnvData> {
  if (!envPromise) {
    envPromise = fetchEnv().catch((error: unknown) => {
      envPromise = null;
      throw error;
    });
  }
  return envPromise;
}

/** Tekstura jak cel `PMREMGenerator.fromScene`: CubeUV, half float, liniowa, bez mipmap. */
export function createEnvMap({ width, height, data }: EnvData): DataTexture {
  const texture = new DataTexture(data, width, height, RGBAFormat, HalfFloatType);
  texture.mapping = CubeUVReflectionMapping;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.colorSpace = LinearSRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
