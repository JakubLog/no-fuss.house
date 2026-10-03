"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
  type TouchEvent,
} from "react";
import { Button } from "@/components/atoms/Button";
import { FELLOWSHIP_REGIONS, FELLOWSHIP_STOPS } from "@/content/fellowship";
import { cx } from "@/lib/cx";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { GEOGRAPHY, OUTLINES } from "./geography";
import {
  FINISH,
  FULL_ROUTE_PATH,
  lengthAtDay,
  NOFUSS_DAYS,
  nofussAt,
  project,
  routeUpTo,
  shireDate,
  START,
  stopIndexAt,
  toPath,
  TOTAL_DAYS,
  VIEW_H,
  VIEW_W,
} from "./route";
import { BEATS, beatFrom, PUNCHLINE_DAY, travelMs } from "./story";
import styles from "./FellowshipMap.module.css";

const NARROW_QUERY = "(max-width: 767px)";

/** Kamera na telefonie w trakcie przebiegu: przybliżenie i podążanie za Drużyną. */
const FOLLOW_ZOOM = 1.8;

/** Minimalne przesunięcie palcem (px), które przełącza etap. */
const SWIPE_PX = 48;

const NOFUSS_DAY = Math.round(NOFUSS_DAYS);

/** Jaka część planszy musi być widoczna, żeby trasa ruszyła sama. */
const AUTOPLAY_VISIBLE = 0.6;

interface View {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Kadr pełny i kadr na telefon (< 768 px): przycięty do trasy, od Shire'u po Mordor (mile od Hobbitonu). */
const FULL_VIEW: View = { x: 0, y: 0, w: VIEW_W, h: VIEW_H };
const NARROW_VIEW: View = (() => {
  const a = project({ x: -100, y: -90 });
  const b = project({ x: 1000, y: 760 });
  return { x: a.x, y: a.y, w: b.x - a.x, h: b.y - a.y };
})();

/** Pozycja w % kadru dla punktu w jednostkach `viewBox`. */
const at = (p: { x: number; y: number }, v: View) => ({
  left: `${((p.x - v.x) / v.w) * 100}%`,
  top: `${((p.y - v.y) / v.h) * 100}%`,
});
const STOPS = FELLOWSHIP_STOPS.map((s) => ({ ...s, pos: project(s) }));
const REGIONS = FELLOWSHIP_REGIONS.map((r) => ({ ...r, pos: project(r) }));
const pad3 = (n: number) => String(Math.floor(n)).padStart(3, "0");
const easeInOut = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);

interface Story {
  beat: number;
  phase: "travel" | "hold";
  /** Czas w bieżącej fazie (ms); w postoju stoi, gdy kursor jest nad opisem. */
  elapsed: number;
  /** Dzień, z którego trwa przejazd. */
  from: number;
}

/**
 * Interaktywna mapa trasy Drużyny (Client Component): przełączniki tras, „Wyruszamy”, suwak dnia,
 * przystanki jako przyciski nad rysunkiem SVG i panel etapu z komentarzem no-fuss.
 * Odtwarzanie to opowieść (`story.ts`): krótki przejazd do przystanku, postój na czas czytania (pasek pod
 * opisem), puenta w dniu 58. Bieżący przystanek wynika z `day`. Opowieść rusza sama raz, gdy plansza
 * wejdzie w kadr (o ile nikt wcześniej nie kliknął mapy i nie ma reduced motion).
 */
export function FellowshipBoard() {
  const uid = useId();
  const reduced = useReducedMotion();
  const narrow = useMediaQuery(NARROW_QUERY);
  const view = narrow ? NARROW_VIEW : FULL_VIEW;
  const mapRef = useRef<HTMLDivElement>(null);
  const [day, setDay] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showFellowship, setShowFellowship] = useState(true);
  const [showNofuss, setShowNofuss] = useState(true);
  /* Postęp postoju 0–1 (pasek pod opisem). */
  const [holdK, setHoldK] = useState(0);
  /* Stan opowieści (ustawiany w handlerach, czytany w pętli rAF) i kontekst pętli: telefon, reduced motion, kursor nad opisem. */
  const storyRef = useRef<Story>({ beat: 0, phase: "hold", elapsed: 0, from: 0 });
  const envRef = useRef({ narrow: false, reduced: false, hover: false });
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  /* Plansza i flaga „ktoś już ruszył mapę” (ręcznie albo autostartem): autostart tylko raz i nie po interakcji. */
  const boardRef = useRef<HTMLDivElement>(null);
  const touchedRef = useRef(false);

  /* Autostart: trasa rusza sama, gdy plansza w większości wejdzie w kadr. Bez autostartu przy reduced motion. */
  useEffect(() => {
    const board = boardRef.current;
    if (!board || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || touchedRef.current) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        touchedRef.current = true;
        storyRef.current = { ...beatFrom(0), elapsed: 0, from: 0 };
        setPlaying(true);
        io.disconnect();
      },
      { threshold: AUTOPLAY_VISIBLE },
    );
    io.observe(board);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    envRef.current.narrow = narrow;
    envRef.current.reduced = reduced;
  }, [narrow, reduced]);

  /* Pętla opowieści: przejazd (dzień z easingiem) → postój (pasek czytania) → następny takt; po ostatnim koniec. */
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(100, now - last);
      last = now;
      const st = storyRef.current;
      const beat = BEATS[st.beat];
      const env = envRef.current;
      if (st.phase === "travel") {
        st.elapsed += dt;
        const k = env.reduced ? 1 : Math.min(1, st.elapsed / travelMs(st.from, beat.day));
        setDay(st.from + (beat.day - st.from) * easeInOut(k));
        setHoldK(0);
        if (k >= 1) {
          st.phase = "hold";
          st.elapsed = 0;
        }
      } else {
        if (!env.hover) st.elapsed += dt;
        const holdMs = env.narrow ? beat.holdNarrowMs : beat.holdMs;
        setHoldK(Math.min(1, st.elapsed / holdMs));
        if (st.elapsed >= holdMs) {
          if (st.beat === BEATS.length - 1) {
            setHoldK(0);
            setPlaying(false);
            return;
          }
          storyRef.current = { beat: st.beat + 1, phase: "travel", elapsed: 0, from: beat.day };
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const index = stopIndexAt(day);
  const stop = FELLOWSHIP_STOPS[index];
  const walked = routeUpTo(lengthAtDay(day));
  const marker = walked[walked.length - 1];
  const nofuss = nofussAt(day);
  const nofussArrived = day >= NOFUSS_DAYS;
  const done = day >= TOTAL_DAYS;

  const goTo = (d: number) => {
    touchedRef.current = true;
    setPlaying(false);
    setHoldK(0);
    setDay(Math.max(0, Math.min(TOTAL_DAYS, d)));
  };

  const play = () => {
    touchedRef.current = true;
    if (playing) {
      setPlaying(false);
      return;
    }
    const from = done ? 0 : day;
    if (done) setDay(0);
    /* Wznowienie w środku postoju nie zaczyna czytania od zera. */
    const resume = storyRef.current.phase === "hold" && Math.abs(BEATS[storyRef.current.beat].day - from) < 0.5;
    if (!resume) storyRef.current = { ...beatFrom(from), elapsed: 0, from };
    setPlaying(true);
  };

  /** Etap wstecz / dalej (przyciski panelu i gest). W trakcie opowieści przeskok do sąsiedniego taktu bez zatrzymania. */
  const step = (dir: -1 | 1) => {
    if (!playing) {
      goTo(FELLOWSHIP_STOPS[index + dir]?.day ?? (dir > 0 ? TOTAL_DAYS : 0));
      return;
    }
    const st = storyRef.current;
    const target = Math.max(0, Math.min(BEATS.length - 1, st.phase === "hold" ? st.beat + dir : dir > 0 ? st.beat : st.beat - 1));
    storyRef.current = { beat: target, phase: "hold", elapsed: 0, from: BEATS[target].day };
    setDay(BEATS[target].day);
    setHoldK(0);
  };

  /* Kursor nad opisem wstrzymuje odliczanie postoju (doczytanie bez pośpiechu). Tylko mysz. */
  const holdOnHover = {
    onPointerEnter: (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType === "mouse") envRef.current.hover = true;
    },
    onPointerLeave: () => {
      envRef.current.hover = false;
    },
  };

  /* Puenta: opowieść stoi dokładnie na dniu 58 (przejazd kończy się równo na dniu taktu). */
  const punchline = playing && day === PUNCHLINE_DAY;

  /* Przesunięcie palcem w poziomie: w lewo następny etap, w prawo poprzedni; pionowe zostaje przewijaniem strony. */
  const swipe = {
    onTouchStart: (e: TouchEvent<HTMLElement>) => {
      const t = e.touches[0];
      swipeRef.current = { x: t.clientX, y: t.clientY };
    },
    onTouchEnd: (e: TouchEvent<HTMLElement>) => {
      const from = swipeRef.current;
      swipeRef.current = null;
      const t = e.changedTouches[0];
      if (!from || !t) return;
      const dx = t.clientX - from.x;
      const dy = t.clientY - from.y;
      if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      step(dx < 0 ? 1 : -1);
    },
  };

  /* Kamera (telefon, w trakcie przebiegu): scena przybliżona i przesunięta tak, żeby Drużyna była na środku,
     przycięta do krawędzi mapy. Przejście CSS wygładza podążanie i powrót do całej trasy po pauzie. */
  const following = narrow && playing && !reduced;
  const camera: CSSProperties = (() => {
    if (!following) return {};
    const u = (marker.x - view.x) / view.w;
    const v = (marker.y - view.y) / view.h;
    const clamp = (k: number) => Math.min(0, Math.max((1 - FOLLOW_ZOOM) * 100, (0.5 - FOLLOW_ZOOM * k) * 100));
    return { transform: `translate(${clamp(u)}%, ${clamp(v)}%) scale(${FOLLOW_ZOOM})` };
  })();

  /**
   * Przystanek dla kliknięcia: z myszy / dotyku najbliższy wskaźnikowi (na telefonie przystanki leżą bliżej
   * niż szerokość palca, a przycisk na wierzchu przejmowałby stuknięcie sąsiada); z klawiatury ten z fokusem.
   */
  const pick = (e: MouseEvent<HTMLButtonElement>, own: number) => {
    const points = mapRef.current?.querySelectorAll("ol > li");
    if (e.detail === 0 || !points) return own;
    let best = own;
    let bestDist = Infinity;
    /* `li` ma rozmiar 0 × 0 w punkcie przystanku, więc jego prostokąt to pozycja na ekranie (także pod kamerą). */
    points.forEach((li, i) => {
      const r = li.getBoundingClientRect();
      const d = Math.hypot(e.clientX - r.left, e.clientY - r.top);
      if (d < bestDist) {
        best = i;
        bestDist = d;
      }
    });
    return best;
  };

  const sliderId = `${uid}-day`;
  const dayText = `Dzień ${pad3(day)} · ${shireDate(day)}`;

  return (
    <div className={styles.layout}>
      <div ref={boardRef} className={cx("tone-dark", styles.board)}>
        <div className={cx("mono-sm", styles.controls)}>
          <div className={styles.toggles} role="group" aria-label="Trasy na mapie">
            <button type="button" aria-pressed={showFellowship} onClick={() => setShowFellowship((v) => !v)}>
              <i className={styles.swatchFellowship} aria-hidden="true" />
              Drużyna<span className={styles.days}> · {TOTAL_DAYS} dni</span>
            </button>
            <button type="button" aria-pressed={showNofuss} onClick={() => setShowNofuss((v) => !v)}>
              <i className={styles.swatchNofuss} aria-hidden="true" />
              no-fuss<span className={styles.days}> · {NOFUSS_DAY} dni</span>
            </button>
          </div>
          <Button onClick={play} className={styles.play}>
            {/* Na telefonie krótsze etykiety: przełączniki i przycisk mieszczą się w jednym rzędzie (od 360 px). */}
            <span className={styles.long}>
              {playing ? "Pauza ‖" : done ? "Jeszcze raz ↺" : day > 0 ? "Wznów →" : "Wyruszamy →"}
            </span>
            <span className={styles.short}>
              {playing ? "Pauza ‖" : done ? "Od nowa ↺" : day > 0 ? "Wznów →" : "W drogę →"}
            </span>
          </Button>
        </div>

        <div ref={mapRef} className={styles.map} style={{ aspectRatio: `${view.w} / ${view.h}` }}>
          <div className={styles.stage} style={camera}>
            <svg viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`} aria-hidden="true" focusable="false">
              <defs>
                <clipPath id={`${uid}-sea`}>
                  <path d={OUTLINES.sea} />
                </clipPath>
                <clipPath id={`${uid}-mordor`}>
                  <path d={OUTLINES.mordor} />
                </clipPath>
              </defs>
              <g className={styles.terrain}>
                <path className={styles.hatch} d={GEOGRAPHY.seaHatch} clipPath={`url(#${uid}-sea)`} />
                <path className={styles.hatch} d={GEOGRAPHY.mordorHatch} clipPath={`url(#${uid}-mordor)`} />
                {GEOGRAPHY.coast.map((d, i) => (
                  <path key={d} className={i === 0 ? styles.coast : styles.coastEcho} d={d} />
                ))}
                {GEOGRAPHY.rivers.map((d) => (
                  <path key={d} className={styles.river} d={d} />
                ))}
                <path className={styles.border} d={GEOGRAPHY.shire} />
                <path className={styles.road} d={GEOGRAPHY.roads} />
                <path className={styles.forest} d={GEOGRAPHY.forests} />
                <path className={styles.marsh} d={GEOGRAPHY.marsh} />
                <path className={styles.mountains} d={GEOGRAPHY.mountains} />
                <path className={styles.fort} d={GEOGRAPHY.forts} />
                <path className={cx(styles.doom, showNofuss && styles.doomTarget)} d={GEOGRAPHY.doom} />
              </g>

              {showFellowship ? (
                <g>
                  <path className={styles.routePlan} d={FULL_ROUTE_PATH} />
                  <path className={styles.routeWalked} d={toPath(walked)} />
                </g>
              ) : null}

              {showNofuss ? (
                <g>
                  <path className={styles.nofussPlan} d={`M${START.x} ${START.y}L${FINISH.x} ${FINISH.y}`} />
                  <path className={styles.nofussWalked} d={`M${START.x} ${START.y}L${nofuss.x} ${nofuss.y}`} />
                </g>
              ) : null}
            </svg>

            {REGIONS.map((r) => (
              <span
                key={r.name}
                className={cx("mono-sm", styles.region, r.wide && styles.regionWide)}
                style={at(r.pos, view)}
                aria-hidden="true"
              >
                {r.name}
              </span>
            ))}

            <ol className={styles.stops} aria-label="Przystanki Drużyny">
              {STOPS.map((s, i) => (
                <li key={s.id} style={at(s.pos, view)}>
                  <button
                    type="button"
                    className={cx(
                      styles.stop,
                      i < index && styles.passed,
                      i === index && styles.current,
                      s.pos.x > 480 && styles.labelLeft,
                      i === STOPS.length - 1 && styles.pinned,
                    )}
                    aria-current={i === index ? "step" : undefined}
                    aria-label={`${s.name}, ${s.date}`}
                    onClick={(e) => goTo(STOPS[pick(e, i)].day)}
                  >
                    <i aria-hidden="true" />
                    <span className="mono-sm" aria-hidden="true">
                      {s.name}
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            {/* Znaczniki w HTML, nie w SVG: stały rozmiar w px niezależnie od skali mapy. */}
            {showNofuss ? (
              <i
                className={cx(styles.marker, styles.markerNofuss)}
                style={at(nofuss, view)}
                aria-hidden="true"
              />
            ) : null}
            {showFellowship ? (
              <i
                className={styles.marker}
                style={at(marker, view)}
                aria-hidden="true"
              />
            ) : null}
          </div>
        </div>

        <div className={cx("mono-sm", styles.timeline)}>
          <label htmlFor={sliderId}>Oś czasu</label>
          <output htmlFor={sliderId} className={styles.dayOut}>
            {dayText}
          </output>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={TOTAL_DAYS}
            step={1}
            value={Math.floor(day)}
            aria-valuetext={`${dayText}, ${stop.name}`}
            onChange={(e) => goTo(Number(e.currentTarget.value))}
          />
        </div>

        {/* Poniżej 1024 px panel jest pod mapą, poza ekranem: tu skrót bieżącego etapu (stała wysokość jak w panelu).
            Dla czytników pełny panel niżej, więc tu `aria-hidden`. */}
        <div className={styles.stopLine} style={{ "--k": holdK }} aria-hidden="true" {...swipe} {...holdOnHover}>
          <p className={cx("mono-sm", styles.stopMeta)}>
            <span>
              Etap {String(index + 1).padStart(2, "0")}/{FELLOWSHIP_STOPS.length}
            </span>
            <span>{stop.date}</span>
          </p>
          <p className={cx(styles.stopWhat, styles.stack)}>
            {FELLOWSHIP_STOPS.map((s, i) => (
              <span key={s.id} aria-hidden={i !== index || undefined}>
                <b>{s.name}.</b> {s.what}
              </span>
            ))}
          </p>
          <p className={cx("mono-sm", styles.swipeHint)}>← Przesuń, żeby zmienić etap →</p>
        </div>

        <p className={cx("mono-sm", styles.status)} aria-live="polite">
          {punchline && showNofuss ? (
            <span className={styles.statusHot}>
              Dzień {NOFUSS_DAY}: no-fuss już na miejscu. Drużyna wciąż na naradzie w {stop.name}.
            </span>
          ) : nofussArrived && showNofuss ? (
            done ? (
              `no-fuss na miejscu w dniu ${NOFUSS_DAY}, Drużyna w dniu ${TOTAL_DAYS}.`
            ) : (
              `no-fuss na miejscu od dnia ${NOFUSS_DAY}. Drużyna: ${stop.name}.`
            )
          ) : (
            "\u00a0"
          )}
        </p>
      </div>

      <article
        className={styles.panel}
        style={{ "--k": holdK }}
        aria-live={playing ? "off" : "polite"}
        {...swipe}
        {...holdOnHover}
      >
        <p className={cx("mono-sm", styles.panelMeta)}>
          <span>
            Etap {String(index + 1).padStart(2, "0")}/{FELLOWSHIP_STOPS.length}
          </span>
          <span>{stop.date}</span>
        </p>
        {/* Wszystkie etapy w jednej komórce siatki (widoczny tylko bieżący): pola mają wysokość najdłuższego
            tekstu, więc Wstecz / Dalej stoją w tym samym miejscu na każdym etapie i każdej szerokości. */}
        <h3 className={cx(styles.panelTitle, styles.stack)}>
          {FELLOWSHIP_STOPS.map((s, i) => (
            <span key={s.id} aria-hidden={i !== index || undefined}>
              {s.name}
            </span>
          ))}
        </h3>
        <p className={cx(styles.panelText, styles.stack)}>
          {FELLOWSHIP_STOPS.map((s, i) => (
            <span key={s.id} aria-hidden={i !== index || undefined}>
              {s.what}
            </span>
          ))}
        </p>
        <dl className={styles.panelNofuss}>
          <dt className="mono-sm">U nas</dt>
          <dd className={styles.stack}>
            {FELLOWSHIP_STOPS.map((s, i) => (
              <span key={s.id} aria-hidden={i !== index || undefined}>
                {s.nofuss}
              </span>
            ))}
          </dd>
        </dl>
        <div className={styles.panelNav}>
          <Button
            variant="ghost"
            onClick={() => step(-1)}
            disabled={index === 0}
            aria-label="Poprzedni przystanek"
          >
            ← Wstecz
          </Button>
          <Button
            variant="ghost"
            onClick={() => step(1)}
            disabled={index === FELLOWSHIP_STOPS.length - 1}
            aria-label="Następny przystanek"
          >
            Dalej →
          </Button>
        </div>
      </article>
    </div>
  );
}
