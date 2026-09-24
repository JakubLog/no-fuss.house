import { Fragment } from "react";
import { cx } from "@/lib/cx";
import styles from "./TechStack.module.css";

export interface TechStackGroup {
  label: string;
  items: readonly string[];
}

export interface TechStackProps {
  groups: readonly TechStackGroup[];
  className?: string;
}

/** Grupy technologii w obrysowanych chipach (legacy `.stack`). Server Component. */
export function TechStack({ groups, className }: TechStackProps) {
  return (
    <div className={className}>
      {groups.map((group) => (
        <Fragment key={group.label}>
          <p className={cx("mono-sm", styles.label)}>{group.label}</p>
          <ul className={cx("mono-sm", styles.stack)}>
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Fragment>
      ))}
    </div>
  );
}
