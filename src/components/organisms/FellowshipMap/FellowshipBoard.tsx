"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { FELLOWSHIP_REGIONS, FELLOWSHIP_STOPS } from "@/content/fellowship";
import { cx } from "@/lib/cx";
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
import styles from "./FellowshipMap.module.css";


/** 184 dni drogi w 12 s: postoje w Rivendell i Lórien widać jako stojący znacznik przy biegnącym liczniku. */
const PLAY_MS = 12000;

const NOFUSS_DAY = Math.round(NOFUSS_DAYS);
const pct = (v: number, of: number) => `${(v / of) * 100}%`;
/** Pozycja w % planszy dla punktu w jednostkach `viewBox`. */
const at = (p: { x: number; y: number }) => ({ left: pct(p.x, VIEW_W), top: pct(p.y, VIEW_H) });
const STOPS = FELLOWSHIP_STOPS.map((s) => ({ ...s, pos: project(s) }));
const REGIONS = FELLOWSHIP_REGIONS.map((r) => ({ ...r, pos: project(r) }));
const pad3 = (n: number) => String(Math.floor(n)).padStart(3, "0");

/**
 * Interaktywna mapa trasy Drużyny (Client Component): przełączniki tras, „Wyruszamy”, suwak dnia,
 * przystanki jako przyciski nad rysunkiem SVG i panel etapu z komentarzem no-fuss.
 * Stan to tylko `day` (0–184) i `playing`; bieżący przystanek wynika z dnia.
 */
export function FellowshipBoard() {
  const uid = useId();
  const reduced = useReducedMotion();
  const [day, setDay] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showFellowship, setShowFellowship] = useState(true);
  const [showNofuss, setShowNofuss] = useState(true);
  /* Dzień, od którego rusza odtwarzanie (ustawiany w `play`, czytany w efekcie). */
  const fromRef = useRef(0);

  useEffect(() => {
    if (!playing) return;
    const start = performance.now() - (fromRef.current / TOTAL_DAYS) * PLAY_MS;
    let raf = 0;
    const tick = (now: number) => {
      const next = Math.min(TOTAL_DAYS, ((now - start) / PLAY_MS) * TOTAL_DAYS);
      setDay(next);
      if (next < TOTAL_DAYS) raf = requestAnimationFrame(tick);
      else setPlaying(false);
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
    setPlaying(false);
    setDay(Math.max(0, Math.min(TOTAL_DAYS, d)));
  };

  const play = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (reduced) {
      setDay(TOTAL_DAYS);
      return;
    }
    fromRef.current = done ? 0 : day;
    setPlaying(true);
  };

  const sliderId = `${uid}-day`;
  const dayText = `Dzień ${pad3(day)} · ${shireDate(day)}`;

  return (
    <div className={styles.layout}>
      <div className={cx("tone-dark", styles.board)}>
        <div className={cx("mono-sm", styles.controls)}>
          <div className={styles.toggles} role="group" aria-label="Trasy na mapie">
            <button type="button" aria-pressed={showFellowship} onClick={() => setShowFellowship((v) => !v)}>
              <i className={styles.swatchFellowship} aria-hidden="true" />
              Drużyna · {TOTAL_DAYS} dni
            </button>
            <button type="button" aria-pressed={showNofuss} onClick={() => setShowNofuss((v) => !v)}>
              <i className={styles.swatchNofuss} aria-hidden="true" />
              no-fuss · {NOFUSS_DAY} dni*
            </button>
          </div>
          <Button onClick={play} className={styles.play}>
            {playing ? "Pauza ‖" : done ? "Jeszcze raz ↺" : day > 0 ? "Dalej →" : "Wyruszamy →"}
          </Button>
        </div>

        <div className={styles.map} style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
          <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden="true" focusable="false">
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
              style={at(r.pos)}
              aria-hidden="true"
            >
              {r.name}
            </span>
          ))}

          <ol className={styles.stops} aria-label="Przystanki Drużyny">
            {STOPS.map((s, i) => (
              <li key={s.id} style={at(s.pos)}>
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
                  onClick={() => goTo(s.day)}
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
              style={at(nofuss)}
              aria-hidden="true"
            />
          ) : null}
          {showFellowship ? (
            <i
              className={styles.marker}
              style={at(marker)}
              aria-hidden="true"
            />
          ) : null}
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

        <p className={cx("mono-sm", styles.status)} aria-live="polite">
          {!playing && nofussArrived && showNofuss
            ? done
              ? `no-fuss na miejscu od dnia ${NOFUSS_DAY}. Drużyna dotarła w dniu ${TOTAL_DAYS}.`
              : `no-fuss na miejscu od dnia ${NOFUSS_DAY}. Drużyna w tym czasie: ${stop.name}.`
            :" "}
        </p>
      </div>

      <article className={styles.panel} aria-live={playing ? "off" : "polite"}>
        <p className={cx("mono-sm", styles.panelMeta)}>
          <span>
            Etap {String(index + 1).padStart(2, "0")}/{FELLOWSHIP_STOPS.length}
          </span>
          <span>{stop.date}</span>
        </p>
        <h3 className={styles.panelTitle}>{stop.name}</h3>
        <p className={styles.panelText}>{stop.what}</p>
        <dl className={styles.panelNofuss}>
          <dt className="mono-sm">U nas</dt>
          <dd>{stop.nofuss}</dd>
        </dl>
        <div className={styles.panelNav}>
          <Button
            variant="ghost"
            onClick={() => goTo(FELLOWSHIP_STOPS[index - 1]?.day ?? 0)}
            disabled={index === 0}
            aria-label="Poprzedni przystanek"
          >
            ← Wstecz
          </Button>
          <Button
            variant="ghost"
            onClick={() => goTo(FELLOWSHIP_STOPS[index + 1]?.day ?? TOTAL_DAYS)}
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
