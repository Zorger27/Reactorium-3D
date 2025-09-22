import React, {useCallback, useEffect, useState, useRef} from 'react';
import '@/pages/menu/Project3.scss';
import { useTranslation } from 'react-i18next';
import {Link} from "react-router-dom";
import {useSpaCleanup} from "@/hooks/useSpaCleanup.js";
import ToggleFooterButton from "@/components/util/ToggleFooterButton.jsx";
import MetaTags from "@/components/seo/MetaTags.jsx";
import PictoCube1x from "@/components/app/PictoCube/PictoCube1x.jsx";
import PictoCube2x from "@/components/app/PictoCube/PictoCube2x.jsx";
import PictoCube3x from "@/components/app/PictoCube/PictoCube3x.jsx";
import CanvasFullScreen from "@/components/util/CanvasFullScreen.jsx";

export const Project3 = () => {
  const { t } = useTranslation();
  const siteUrl = import.meta.env.VITE_SITE_URL;
  useSpaCleanup();

  const [mode, setMode] = useState("picto-cube-1x"); // "picto-cube-1x" | "picto-cube-2x" | "picto-cube-3x"
  const canvasRef = useRef(null);
  const [canvasContainer, setCanvasContainer] = useState(null);

  // Массив режимов для циклического переключения
  const modes = ["picto-cube-1x", "picto-cube-2x", "picto-cube-3x"];

  // Callback для установки контейнера
  const setCanvasRef = useCallback((element) => {
    canvasRef.current = element;
    setCanvasContainer(element);
  }, []);

  // Загружаем сохранённый режим при первом рендере
  useEffect(() => {
    const savedMode = localStorage.getItem("pictoCubeMode");
    if (savedMode && modes.includes(savedMode)) {
      setMode(savedMode);
    }
  }, []);

  // Сохраняем режим при каждом изменении
  useEffect(() => {
    localStorage.setItem("pictoCubeMode", mode);
  }, [mode]);

  // Функция для переключения на следующий режим
  const switchToNextMode = () => {
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
  };

  // Функция для получения текста кнопки (следующий режим)
  const getButtonText = () => {
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    const nextMode = modes[nextIndex];

    switch (nextMode) {
      case "picto-cube-1x":
        return t("project3.picto-cube-1x");
      case "picto-cube-2x":
        return t("project3.picto-cube-2x");
      case "picto-cube-3x":
        return t("project3.picto-cube-3x");
      default:
        return t("project3.picto-cube-1x");
    }
  };

  return (
    <div className="project3">

      <MetaTags
        mainTitle={t('project3.name')}
        metaTags={[
          { name: "description", content: t('project3.disc') },

          // Open Graph meta tags
          { property: "og:title", content: t('project3.name') },
          { property: "og:description", content: t('project3.disc') },
          { property: "og:image", content: `${siteUrl}/ogimage/project3.jpg` },
          { property: "og:url", content: `${siteUrl}/project3` },
          { property: "og:type", content: "website" },
          { property: "og:site_name", content: `${siteUrl}` },

          // Twitter meta tags
          { property: "twitter:title", content: t('project3.name') },
          { property: "twitter:description", content: t('project3.disc') },
          { property: "twitter:image", content: `${siteUrl}/ogimage/project3.jpg` },
          { name: "twitter:card", content: "summary_large_image" },
        ]}
      />

      <div className="container">
        <h1><Link to="/" className="back-to-menu" title={t('extra.back')}>
          <i className="fa fa-arrow-circle-left"></i></Link>
          {t('project3.name')}

          <div className="mode-switch">
            <button className={mode} onClick={switchToNextMode}>
              {getButtonText()}
            </button>
          </div>

          <CanvasFullScreen canvasContainer={canvasContainer} />
          <ToggleFooterButton />
        </h1>
        <hr className="custom-line" />

        {mode === "picto-cube-1x" && <PictoCube1x ref={setCanvasRef} />}
        {mode === "picto-cube-2x" && <PictoCube2x ref={setCanvasRef} />}
        {mode === "picto-cube-3x" && <PictoCube3x ref={setCanvasRef} />}

      </div>
    </div>
  );
};