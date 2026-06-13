// Shared SSR-safe localStorage JSON helpers (same contract as journeyState's
// internal ones — extracted so new state modules don't re-implement them).

export function canUseStorage(): boolean {
  return typeof window !== 'undefined';
}

export function readJSON<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or private mode; ignore
  }
}
