import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

function readValue(key, fallbackValue) {
  if (typeof window === "undefined") {
    return fallbackValue;
  }

  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

export function useLocalStorageValue(key, fallbackValue = null) {
  return useSyncExternalStore(
    subscribe,
    () => readValue(key, fallbackValue),
    () => fallbackValue
  );
}