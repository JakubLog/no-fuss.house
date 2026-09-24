import Image from "next/image";
import { Fade } from "@/components/atoms/Fade";
import { Heading } from "@/components/atoms/Heading";
import { PhotoPlaceholder } from "@/components/atoms/PhotoPlaceholder";
import { STICKERS } from "@/components/atoms/StickerLayer";
import { Reveal } from "@/components/organisms/Reveal";
import { personCards, stickerPlay } from "@/content/about";
import { people } from "@/content/site";
import { cx } from "@/lib/cx";
import { DragSticker } from "./DragSticker";
import styles from "./StickerBoard.module.css";

const INSTRUCTIONS_ID = "play-instructions";

/**
 * „Oklej nas” (legacy `#play`): placeholder Magdy, zdjęcie Kuby i sześć naklejek do
 * przeciągania (wskaźnik, dotyk, strzałki). Sekcja jest serwerowa, klienckie są
 * tylko naklejki (`DragSticker`). Server Component.
 */
export function StickerBoard() {
  const [magda, kuba] = people;
  const kubaPhoto = personCards[kuba.id].photo;
  return (
    <Reveal as="section" id={stickerPlay.id} aria-labelledby="play-title" className={cx("section tone-dark", styles.play)}>
      <div className={styles.head}>
        <Heading id="play-title" as="h2" variant="display" lines={[stickerPlay.title]} className={styles.title} />
        <Fade as="span" index={2} className="mono">
          {stickerPlay.hint}
        </Fade>
      </div>
      <p id={INSTRUCTIONS_ID} className="sr-only">
        {stickerPlay.instructions}
      </p>
      <div className={cx(styles.photos, "fade")} style={{ "--i": 3 }}>
        <PhotoPlaceholder label={magda.givenName} className={styles.photo} />
        {kubaPhoto ? (
          <Image
            src={kubaPhoto.src}
            width={kubaPhoto.width}
            height={kubaPhoto.height}
            alt={kubaPhoto.alt}
            sizes="(min-width: 750px) 300px, 40vw"
            draggable={false}
            className={`${styles.photo} ${styles.img}`}
          />
        ) : (
          <PhotoPlaceholder label={kuba.givenName} tone="lime" className={styles.photo} />
        )}
      </div>
      {stickerPlay.spots.map(([left, top], i) => (
        <DragSticker
          key={`${left}-${top}`}
          svg={STICKERS[i % STICKERS.length]}
          left={left}
          top={top}
          size={96 + ((i * 17) % 40)}
          rotate={(i % 2 ? 1 : -1) * (8 + i * 3)}
          label={stickerPlay.stickerLabel}
          describedBy={INSTRUCTIONS_ID}
          index={4 + (i % 5)}
        />
      ))}
    </Reveal>
  );
}
