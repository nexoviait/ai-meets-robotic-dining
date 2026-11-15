import { useCallback, useEffect, useState } from "react";

const EVT = "aihub-storage";

export function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** localStorage-backed state, hydrated after mount and synced across components. */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    setValue(readLS(key, initial));
    const sync = (e: Event) => {
      const k = (e as CustomEvent).detail ?? (e as StorageEvent).key;
      if (k === key) setValue(readLS(key, initial));
    };
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = readLS(key, initial);
      const v = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      window.localStorage.setItem(key, JSON.stringify(v));
      setValue(v);
      window.dispatchEvent(new CustomEvent(EVT, { detail: key }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  return [value, set] as const;
}

export const uid = (prefix = "") =>
  prefix + Math.random().toString(36).slice(2, 7).toUpperCase() + Date.now().toString(36).slice(-3).toUpperCase();
