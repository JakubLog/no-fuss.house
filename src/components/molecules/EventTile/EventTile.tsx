import Image from "next/image";
import { ArrowLink } from "@/components/atoms/ArrowLink";
import { Button } from "@/components/atoms/Button";
import { PhotoPlaceholder } from "@/components/atoms/PhotoPlaceholder";
import { Tag } from "@/components/atoms/Tag";
import { eventDate, eventPeople, eventPhotoLabel, type KnowledgeEvent } from "@/content/events";
import { cx } from "@/lib/cx";
import { FactRow } from "../FactRow";
import { MetaRow } from "../MetaRow";
import styles from "./EventTile.module.css";

export interface EventTileProps {
  event: KnowledgeEvent;
  /**
   * `upcoming`: kafel `--tile` z tagiem (i logo `logo` w prawym górnym rogu), dużą datą, faktami „Gdzie” / „Kto”
   * i przyciskiem zapisów.
   * `past`: zdjęcie 16:10 z tagiem, wiersz mono data | gdzie, opis, osoby, link do nagrania / relacji.
   */
  variant: "upcoming" | "past";
  className?: string;
}

/** `sizes` zdjęcia: kafle stoją w siatce 1 → 2 (640 px) → 3 kolumny (1024 px) na `/wiedza` i w zajawce na `/`. */
const GRID_SIZES = "(min-width: 1024px) 30vw, (min-width: 640px) 48vw, 100vw";
/** `sizes` logo (rastrowe; SVG idzie bez optymalizacji): stała wysokość, szerokość z proporcji; górna granica. */
const LOGO_SIZES = "200px";

/**
 * Kafel wydarzenia (`/wiedza`, zajawka na `/`). `<article id={event.id}>`, więc `/wiedza#<id>` prowadzi
 * do kafla, a tytuł `h3` go nazywa. Link-placeholder (`href: null`): przycisk zapisów przygaszony
 * („wkrótce” dla czytników), link minionego się nie renderuje. Server Component.
 */
export function EventTile({ event, variant, className }: EventTileProps) {
  const date = eventDate(event);
  const titleId = `${event.id}-title`;
  /* Wydarzenie, obiekt, miasto (każde opcjonalne); bez powtórzenia miasta, gdy jest już w nazwie wydarzenia („Infoshare Katowice”). */
  const city = event.place && !event.host?.includes(event.place) ? event.place : null;
  const where = [event.host, event.venue, city].filter(Boolean).join(", ");
  const who = eventPeople(event);

  if (variant === "upcoming") {
    return (
      <article id={event.id} aria-labelledby={titleId} className={cx(styles.upcoming, className)}>
        <div className={styles.top}>
          <Tag className={styles.format}>{event.format}</Tag>
          {event.logo ? (
            <Image
              src={event.logo.src}
              alt={event.logo.alt}
              width={event.logo.width}
              height={event.logo.height}
              sizes={LOGO_SIZES}
              className={styles.logo}
            />
          ) : null}
        </div>
        <time dateTime={date.iso} className={styles.when}>
          <span className={styles.day}>{date.day}</span>{" "}
          <span className="mono">
            {[date.year, date.weekday, event.time].filter(Boolean).join(" · ")}
          </span>
        </time>
        <div>
          <h3 id={titleId} className={styles.title}>
            {event.title}
          </h3>
          {event.text ? <p className={styles.text}>{event.text}</p> : null}
        </div>
        <dl className={cx("mono-sm", styles.facts)}>
          {where ? <FactRow term="Gdzie">{where}</FactRow> : null}
          <FactRow term="Kto">{who}</FactRow>
        </dl>
        {event.link ? (
          <Button href={event.link.href} external className={styles.cta}>
            {event.link.label} ↗
          </Button>
        ) : null}
      </article>
    );
  }

  return (
    <article id={event.id} aria-labelledby={titleId} className={cx(styles.past, className)}>
      <div className={cx(styles.media, event.logo && styles.shade)}>
        {event.logo ? (
          <span className={styles.badge}>
            <Image
              src={event.logo.src}
              alt={event.logo.alt}
              width={event.logo.width}
              height={event.logo.height}
              sizes={LOGO_SIZES}
              className={styles.badgeLogo}
            />
          </span>
        ) : null}
        <Tag className={styles.tag}>{event.format}</Tag>
        {event.photo ? (
          <Image
            src={event.photo.src}
            alt={event.photo.alt}
            width={event.photo.width}
            height={event.photo.height}
            sizes={GRID_SIZES}
            className={styles.photo}
          />
        ) : (
          <PhotoPlaceholder label={eventPhotoLabel} className={styles.placeholder} />
        )}
      </div>
      <MetaRow name={<time dateTime={date.iso}>{date.label}</time>} meta={where} className={styles.meta} />
      <h3 id={titleId} className={styles.title}>
        {event.title}
      </h3>
      {event.text ? <p className={styles.text}>{event.text}</p> : null}
      <p className={cx("mono-sm", styles.people)}>{who}</p>
      {event.link?.href ? (
        <ArrowLink href={event.link.href} className={cx("mono", styles.link)}>
          {event.link.label}
        </ArrowLink>
      ) : null}
    </article>
  );
}
