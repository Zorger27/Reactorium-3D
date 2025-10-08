import { useEffect, useState } from "react";

export function useLocalStorage(key, defaultValue, parser = v => v) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? parser(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, String(state));
    } catch {}
  }, [key, state]);

  return [state, setState];
}
