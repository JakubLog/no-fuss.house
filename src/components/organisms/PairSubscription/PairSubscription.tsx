import { cx } from "@/lib/cx";
import styles from "./PairSubscription.module.css";

export interface PairSubscriptionProps {
  className?: string;
}

/**
 * Ilustracja „jedna subskrypcja na parę” (legacy `.sub`): karta 24,99 zł → dwie osoby.
 * Copy 1:1. Server Component.
 */
export function PairSubscription({ className }: PairSubscriptionProps) {
  return (
    <div className={cx(styles.sub, className)}>
      <div className={cx("mono-sm", styles.card)}>
        <span>1 subskrypcja</span>
        <strong>
          24,99 zł
          <br />
          <span className="mono-sm">/ mies. za parę</span>
        </strong>
      </div>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
      <div className={styles.people} role="img" aria-label="Dwie osoby">
        <span aria-hidden="true">A</span>
        <span aria-hidden="true">M</span>
      </div>
    </div>
  );
}
