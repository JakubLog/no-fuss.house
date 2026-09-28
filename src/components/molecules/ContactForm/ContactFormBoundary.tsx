"use client";

import { catchError } from "next/error";
import type { ReactNode } from "react";

/**
 * Error boundary formularza kontaktu (`catchError` z Next: przepuszcza `redirect()`/`notFound()`, czyści się przy
 * nawigacji). `useActionState` rzuca odrzucone wywołanie Server Action (429 z Vercel Firewall, brak sieci,
 * przekroczony `bodySizeLimit`) do najbliższego boundary; bez niego padłaby cała strona. Zamiast dzieci renderuje
 * `fallback` od rodzica.
 */
export const ContactFormBoundary = catchError(({ fallback }: { fallback: ReactNode }) => fallback);
