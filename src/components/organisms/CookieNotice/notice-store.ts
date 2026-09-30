import { cookieNotice } from "@/content/legal";

/**
 * Stan zamknięcia `CookieNotice` dla `useSyncExternalStore`: wpis `cookieNotice.storageKey` w `localStorage`
 * z bieżącą `version`. Bez dostępu do `localStorage` (blokada, stary tryb prywatny) zamknięcie trzyma się
 * w pamięci do przeładowania. Zdarzenie `storage` synchronizuje zamknięcie między kartami.
 */

type Listener = () => void;

const listeners = new Set<Listener>();
let dismissedInMemory = false;

function readStored(): string | null {
  try {
    return window.localStorage.getItem(cookieNotice.storageKey);
  } catch {
    return null;
  }
}

export function isNoticeDismissed(): boolean {
  return dismissedInMemory || readStored() === cookieNotice.version;
}

export function subscribeNotice(listener: Listener): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === cookieNotice.storageKey) listener();
  };
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function dismissNotice(): void {
  dismissedInMemory = true;
  try {
    window.localStorage.setItem(cookieNotice.storageKey, cookieNotice.version);
  } catch {
    // Bez localStorage zamknięcie trwa do przeładowania strony.
  }
  listeners.forEach((listener) => listener());
}
