import { Fade } from "@/components/atoms/Fade";
import styles from "./RolePath.module.css";

export interface RoleStage {
  /** Okres i etap (mono), np. „01.2025 – 05.2026 · Etap 1”. */
  when: string;
  title: string;
  /** Zakres (mono). */
  scope: string;
}

export interface RolePathProps {
  stages: readonly RoleStage[];
  /** Indeks staggeru (wewnątrz sekcji z `Reveal`). */
  index?: number;
  className?: string;
}

/**
 * Ścieżka roli w dwóch kaflach (legacy `.path`): ciemny etap 1, limonkowy etap 2.
 * Lista uporządkowana `<ol>`, tytuły jako `<h3>`. Server Component.
 */
export function RolePath({ stages, index, className }: RolePathProps) {
  return (
    <Fade as="div" index={index} className={className}>
      <ol className={styles.path}>
        {stages.map((stage) => (
          <li key={stage.title} className={styles.stage}>
            <span className="mono-sm">{stage.when}</span>
            <h3 className={styles.title}>{stage.title}</h3>
            <span className="mono-sm">{stage.scope}</span>
          </li>
        ))}
      </ol>
    </Fade>
  );
}

