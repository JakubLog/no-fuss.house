import { WorkTile } from "@/components/molecules/WorkTile";
import { work, type WorkTile as WorkTileData, type WorkTileSize } from "@/content/home";
import { cx } from "@/lib/cx";
import { Reveal } from "../Reveal";
import styles from "./WorkGrid.module.css";

const HEADING_ID = "realizacje-heading";

/** `sizes` okładek: szerokość kafla w siatce 12 kolumn od 768 px, pełna szerokość niżej. */
const SIZES: Record<WorkTileSize, string> = {
  xl: "(min-width: 768px) 66vw, 100vw",
  l: "(min-width: 768px) 42vw, 100vw",
  m: "(min-width: 768px) 25vw, 100vw",
  s: "(min-width: 768px) 25vw, 100vw",
};

function placementClass(tile: WorkTileData): string {
  return cx(styles[tile.size], tile.offset === 1 && styles.off, tile.offset === 2 && styles.off2);
}

/**
 * Sekcja `#realizacje` (legacy `.work`, `tone-dark`): nagłówek mono z licznikiem
 * i asymetryczna siatka kafli. Każdy kafel odsłania się osobno (Reveal na `<li>`).
 * Server Component.
 */
export function WorkGrid() {
  return (
    <section id="realizacje" aria-labelledby={HEADING_ID} className={cx("section", "tone-dark", styles.work)}>
      <Reveal className={cx("mono", styles.head)}>
        <h2 id={HEADING_ID} className={cx("fade", styles.label)}>
          {work.label}
        </h2>
        <span className="fade" style={{ "--i": 1 }} aria-hidden="true">
          {work.counter}
        </span>
      </Reveal>
      <ol className={styles.grid}>
        {work.tiles.map((tile, i) => {
          /* Legacy: drugi kafel w parze (`.l + .l`, `.m + .m`) ma okładkę z `--i:1`. */
          const prev: WorkTileData | undefined = work.tiles[i - 1];
          const second = (tile.size === "l" || tile.size === "m") && prev?.size === tile.size;
          return (
            <Reveal as="li" key={tile.href} className={placementClass(tile)}>
              <WorkTile tile={tile} sizes={SIZES[tile.size]} index={second ? 1 : undefined} />
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}
