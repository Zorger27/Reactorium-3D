import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import "./ToggleFullScreen.scss";

export default function ToggleFullScreen({ className = "", style }) {
  const { t } = useTranslation();
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Проверка состояния при изменении fullscreen
  const handleFullScreenChange = useCallback(() => {
    setIsFullScreen(
      !!(
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      )
    );
  }, []);

  // Вход в полноэкранный режим
  const enterFullScreen = useCallback(() => {
    const element = document.documentElement;

    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    }
  }, []);

  // Выход из полноэкранного режима
  const exitFullScreen = useCallback(() => {
    if (
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    ) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }, []);

  // Переключатель
  const toggleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      enterFullScreen();
    } else {
      exitFullScreen();
    }
  }, [isFullScreen, enterFullScreen, exitFullScreen]);

  // Обработка клавиш (пробел и Backspace)
  const handleKeyPress = useCallback(
    (event) => {
      if ((event.key === " " || event.key === "Backspace") && isFullScreen) {
        toggleFullScreen();
      }
    },
    [isFullScreen, toggleFullScreen]
  );

  // Подписка на события
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullScreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullScreenChange);
    };
  }, [handleKeyPress, handleFullScreenChange]);

  return (
    <i
      onClick={toggleFullScreen}
      className={`toggle-fullScreen-btn ${className}`.trim()}
      style={style}
      title={isFullScreen ? t("extra.closeFullScreen") : t("extra.toggleFullScreen")}
    >
      <span className={`fa ${isFullScreen ? "fa-compress-arrows-alt" : "fa-expand-arrows-alt"}`}></span>
    </i>
  );
}