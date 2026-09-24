import { Heading } from "@/components/atoms/Heading";
import { Reveal } from "@/components/organisms/Reveal";
import { rolesSplit } from "@/content/about";
import { people } from "@/content/site";
import { cx } from "@/lib/cx";
import styles from "./RolesSplit.module.css";

/**
 * „Kto co robi” (legacy o-nas-v5): wiersze z torem 2 px i rombem w akcencie.
 * Romb startuje na środku i jedzie do `--v`, gdy wiersz dostanie `is-in`
 * (Reveal = IntersectionObserver). Animacja w CSS. Server Component.
 */
export function RolesSplit() {
  const [left, right] = people;
  return (
    <section className="section" aria-labelledby="kto-co-robi">
      <Reveal className={cx("mono", styles.head)}>
        <h2 id="kto-co-robi" className="fade">
          {rolesSplit.label}
        </h2>
        <span className="fade" style={{ "--i": 1 }}>
          {rolesSplit.number}
        </span>
      </Reveal>
      <div className={cx("mono-sm", styles.legend)}>
        <span>← {left.givenName}</span>
        <span>{right.givenName} →</span>
      </div>
      {rolesSplit.rows.map((row) => (
        <Reveal key={row.label} className={styles.row} style={{ "--v": row.position }}>
          <Heading as="h3" variant="title" lines={[row.label]} className={styles.rowTitle} />
          <div className={styles.track} aria-hidden="true">
            <b />
          </div>
        </Reveal>
      ))}
    </section>
  );
}
