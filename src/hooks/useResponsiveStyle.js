import { useState, useEffect } from "react";

/**
 * Хук для responsive inline-стилей
 * @param {Object} stylesByBreakpoint - объект вида:
 * {
 *   default: {...},
 *   "1020": {...}, // <= 1020px
 *   "768": {...}   // <= 768px
 * }
 */
export function useResponsiveStyle(stylesByBreakpoint) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // По умолчанию берём default
  let currentStyle = stylesByBreakpoint.default || {};

  // Проверяем брейкпоинты (от меньшего к большему)
  if (windowWidth <= 768 && stylesByBreakpoint["768"]) {
    currentStyle = { ...currentStyle, ...stylesByBreakpoint["768"] };
  } else if (windowWidth <= 1020 && stylesByBreakpoint["1020"]) {
    currentStyle = { ...currentStyle, ...stylesByBreakpoint["1020"] };
  }

  return currentStyle;
}
