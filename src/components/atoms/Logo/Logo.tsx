import Link from "next/link";
import { cx } from "@/lib/cx";
import styles from "./Logo.module.css";

export interface LogoProps {
  /** Domyślnie strona główna. */
  href?: string;
  className?: string;
}

/** Logotyp „no—fuss” (body 700, kreska jako `<i>`). Server Component. */
export function Logo({ href = "/", className }: LogoProps) {
  return (
    <Link className={cx(styles.logo, className)} href={href} aria-label="no-fuss, strona główna">
      no<i aria-hidden="true" />fuss
    </Link>
  );
}
