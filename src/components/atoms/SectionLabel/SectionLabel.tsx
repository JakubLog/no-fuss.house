const SEPARATOR = " / ";

export interface SectionLabelProps {
  /** Etykieta sekcji „NN / Nazwa”, np. „03.5 / Codzienność”. Bez separatora cała jest nazwą. */
  label: string;
}

/**
 * Treść nagłówka z etykiety sekcji: numer widoczny, ale `aria-hidden`, więc nagłówek
 * (czytnik, wyszukiwarka) to sama nazwa („Codzienność”, nie „03.5 / Codzienność”).
 * Wstawiać do elementu nagłówka. Server Component.
 */
export function SectionLabel({ label }: SectionLabelProps) {
  const at = label.indexOf(SEPARATOR);
  if (at < 0) return label;
  const cut = at + SEPARATOR.length;
  return (
    <>
      <span aria-hidden="true">{label.slice(0, cut)}</span>
      {label.slice(cut)}
    </>
  );
}
