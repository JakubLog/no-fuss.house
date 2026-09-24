/** Łączy nazwy klas, pomijając wartości fałszywe. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
