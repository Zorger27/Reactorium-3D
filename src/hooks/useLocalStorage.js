import { useEffect, useState, useCallback, useRef } from "react";

export function useLocalStorage(key, defaultValue, parser = v => v) {
  const skipNextWriteRef = useRef(false);

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
      if (skipNextWriteRef.current) {
        skipNextWriteRef.current = false;
        return;
      }
      localStorage.setItem(key, String(state));
    } catch {}
  }, [key, state]);

  // Синхронизация между вкладками
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === key) {
        if (e.newValue === null) {
          setState(defaultValue);
        } else {
          setState(parser(e.newValue));
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key, parser, defaultValue]);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {}

    skipNextWriteRef.current = true;

    setState(defaultValue);
  }, [key, defaultValue]);

  return [state, setState, reset];
}