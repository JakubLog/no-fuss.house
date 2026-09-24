/**
 * Pobiera krój z Google Fonts dla ImageResponse (satori przyjmuje TTF/OTF, nie woff2).
 * Z `text` Google zwraca tylko potrzebne glify. Gdy sieci brak, zwraca `null`
 * i obraz renderuje się domyślnym krojem (build się nie wywraca).
 */
export async function loadGoogleFont(family: string, weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    const res = await fetch(src);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}
