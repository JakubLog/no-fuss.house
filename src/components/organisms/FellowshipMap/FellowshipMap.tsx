import { cx } from "@/lib/cx";
import { Reveal } from "../Reveal";
import { FellowshipBoard } from "./FellowshipBoard";
import styles from "./FellowshipMap.module.css";

/**
 * Sekcja pod hero 404 (`#mordor`): „Z no-fuss dotarliby szybciej”. Nagłówek w `Reveal`,
 * pod nim interaktywna mapa trasy Drużyny Pierścienia (`FellowshipBoard`, klient) i przypis
 * o źródle dat. Mapa to SVG, nie druga scena 3D (DESIGN.md: jedna scena na stronę). Server Component.
 */
export function FellowshipMap() {
  return (
    <section id="mordor" aria-labelledby="mordor-heading" className="section tone-light">
      <Reveal className={styles.head}>
        <p className={cx("mono fade", styles.label)}>Droga do Mordoru</p>
        <h2 id="mordor-heading" className={cx("fade", styles.title)} style={{ "--i": 1 }}>
          Z no-fuss dotarliby szybciej
        </h2>
        <p className={cx("fade", styles.lead)} style={{ "--i": 2 }}>
          Zgubić się to nic wstydliwego. Drużyna Pierścienia szła z Shire’u do Góry Przeznaczenia 184 dni:
          przez kopalnię, bagna i dwumiesięczną naradę.
        </p>
      </Reveal>
      <FellowshipBoard />
      <p className={cx("mono-sm", styles.note)}>
        * Tempo marszu Drużyny bez postojów, w linii prostej na tej mapie. Mapa poglądowa, rysowana od ręki. Daty
        z Kroniki Lat („Władca Pierścieni”, Dodatek B), kalendarz Shire’u. Pytanie o orły zostawiamy fandomowi.
      </p>
    </section>
  );
}
