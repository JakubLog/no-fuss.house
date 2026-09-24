import type { ReactNode } from "react";

export interface VisuallyHiddenProps {
  children?: ReactNode;
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3";
  id?: string;
  /** Np. `status` dla komunikatów ogłaszanych przez czytniki ekranu. */
  role?: "status" | "alert";
}

/** Treść tylko dla czytników ekranu (klasa globalna `.sr-only`). Server Component. */
export function VisuallyHidden({ children, as: Tag = "span", id, role }: VisuallyHiddenProps) {
  return (
    <Tag id={id} role={role} className="sr-only">
      {children}
    </Tag>
  );
}
