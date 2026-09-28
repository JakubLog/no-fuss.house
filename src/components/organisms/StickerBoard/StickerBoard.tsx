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

/**
 * „Oklej nas” (legacy `#play`): zdjęcia Magdy i Kuby (`personCards[id].photo`; bez zdjęcia placeholder,
 * Kuby limonkowy) i sześć naklejek do przeciągania wskaźnikiem lub palcem (dekoracja poza kolejnością
 * Tab, `aria-hidden`). Sekcja jest serwerowa, klienckie są tylko naklejki (`DragSticker`). Server Component.
 */
export function StickerBoard() {
  return (
    <Reveal as="section" id={stickerPlay.id} aria-labelledby="play-title" className={cx("section tone-dark", styles.play)}>
      <div className={styles.head}>
        <Heading id="play-title" as="h2" variant="display" lines={[stickerPlay.title]} className={styles.title} />
        <Fade as="span" index={2} className="mono">
          {stickerPlay.hint}
        </Fade>
      </div>
      <div className={cx(styles.photos, "fade")} style={{ "--i": 3 }}>
        {people.map((person, i) => {
          const photo = personCards[person.id].photo;
          return photo ? (
            <Image
              key={person.id}
              src={photo.src}
              width={photo.width}
              height={photo.height}
              alt={photo.alt}
              sizes="(min-width: 768px) and (orientation: landscape) 300px, (min-width: 1023px) 450px, 44vw"
              draggable={false}
              className={`${styles.photo} ${styles.img}`}
              style={{ objectPosition: photo.focus }}
            />
          ) : (
            <PhotoPlaceholder
              key={person.id}
              label={person.givenName}
              tone={i === 1 ? "lime" : "tile"}
              className={styles.photo}
            />
          );
        })}
      </div>
      {stickerPlay.spots.map(({ landscape, portrait }, i) => (
        <DragSticker
          key={landscape.join("-")}
          svg={STICKERS[i % STICKERS.length]}
          landscapeSpot={landscape}
          portraitSpot={portrait}
          size={96 + ((i * 17) % 40)}
          rotate={(i % 2 ? 1 : -1) * (8 + i * 3)}
          index={4 + (i % 5)}
        />
      ))}
    </Reveal>
  );
}
