import Image from "next/image";
import Link from "next/link";
import { Tag } from "@/components/atoms/Tag";
import type { WorkTile as WorkTileData } from "@/content/home";
import { cx } from "@/lib/cx";
import { MetaRow } from "../MetaRow";
import styles from "./WorkTile.module.css";

export interface WorkTileProps {
  tile: WorkTileData;
  /** Atrybut `sizes` okładki, dopasowany do szerokości kafla w siatce (ustawia rodzic). */
  sizes: string;
  /** Indeks staggeru okładki (legacy: drugi kafel w parze ma `--i:1`). */
  index?: number;
  className?: string;
}

/** Szerokość jednego telefonu w okładce z ekranami (~27% kafla). */
function screenSizes(sizes: string): string {
  return sizes.replace(/(\d+(?:\.\d+)?)vw/g, (_, n: string) => `${Math.ceil(Number(n) * 0.28)}vw`);
}

/**
 * Kafel realizacji (legacy `.tile`): link do case study, okładka 16:10 (albo 1:1)
 * w masce ze skalą 1.03 na hover, tag w prawym górnym rogu, wiersz mono nazwa | rok.
 * Okładka ma klasę `.fade`, więc odsłania się, gdy przodek (Reveal) dostanie `is-in`.
 * Server Component.
 */
export function WorkTile({ tile, sizes, index, className }: WorkTileProps) {
  const { href, title, years, kind, cover, screens, square } = tile;

  return (
    <Link href={href} className={cx(styles.tile, className)}>
      <Tag className={styles.tag}>{kind}</Tag>
      {screens ? (
        <div
          className={cx("fade", styles.media, styles.screens, square && styles.square)}
          style={index ? { "--i": index } : undefined}
          role="img"
          aria-label={cover.alt}
        >
          {screens.map((screen, i) => (
            <span key={screen.src} className={cx(styles.phone, styles[`phone${i + 1}`])}>
              <Image
                src={screen.src}
                alt=""
                width={screen.width}
                height={screen.height}
                sizes={screenSizes(sizes)}
                className={styles.phoneImg}
              />
            </span>
          ))}
        </div>
      ) : (
        <div
          className={cx("fade", styles.media, square && styles.square)}
          style={index ? { "--i": index } : undefined}
        >
          <Image
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            sizes={sizes}
            className={styles.img}
          />
        </div>
      )}
      <MetaRow name={title} meta={years} arrow />
    </Link>
  );
}
