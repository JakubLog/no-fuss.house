import { ImageResponse } from "next/og";
import { BrandMark } from "@/lib/seo/brand-mark";

const SIZES = [32, 192, 512] as const;

/** Ikony: `/icon/32` (favicon), `/icon/192`, `/icon/512` (manifest, logo w JSON-LD). */
export function generateImageMetadata() {
  return SIZES.map((size) => ({
    id: String(size),
    size: { width: size, height: size },
    contentType: "image/png",
  }));
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const size = Number(await id) || 32;
  return new ImageResponse(<BrandMark size={size} />, { width: size, height: size });
}
