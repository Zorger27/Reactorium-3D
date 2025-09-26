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
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);

    window.addEventListener("resize", handleResize);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // === Если fullscreen активен → переписываем стиль ===
  if (isFullscreen) {
    return {
      height: "100vh",
      width: "100%",
      margin: "0",
    };
  }

  // === Обычное состояние ===
  let currentStyle = stylesByBreakpoint.default || {};

  if (windowWidth <= 768 && stylesByBreakpoint["768"]) {
    currentStyle = { ...currentStyle, ...stylesByBreakpoint["768"] };
  } else if (windowWidth <= 1020 && stylesByBreakpoint["1020"]) {
    currentStyle = { ...currentStyle, ...stylesByBreakpoint["1020"] };
  }

  return currentStyle;
}
