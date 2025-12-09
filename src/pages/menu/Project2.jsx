import React, {useCallback, useEffect, useRef, useState} from 'react';
import '@/pages/menu/Project2.scss';
import { useTranslation } from 'react-i18next';
import {Link} from "react-router-dom";
import {useSpaCleanup} from "@/hooks/useSpaCleanup.js";
import ToggleFooterButton from "@/components/util/ToggleFooterButton.jsx";
import MetaTags from "@/components/seo/MetaTags.jsx";
import VortexCube1x from "@/components/app/VortexCube/VortexCube1x.jsx";
import VortexCube2x from "@/components/app/VortexCube/VortexCube2x.jsx";
import VortexCube3x from "@/components/app/VortexCube/VortexCube3x.jsx";
import CanvasFullScreen from "@/components/util/CanvasFullScreen.jsx";

export const Project2 = () => {
  const { t } = useTranslation();
  const siteUrl = import.meta.env.VITE_SITE_URL;
  useSpaCleanup();

  const [mode, setMode] = useState("vortex-cube-1x"); // "vortex-cube-1x" | "vortex-cube-2x" | "vortex-cube-3x"
  const canvasRef = useRef(null);
  const [canvasContainer, setCanvasContainer] = useState(null);

  // Состояние для отслеживания полноэкранного режима
  const [canvasFullscreen, setCanvasFullscreen] = useState(false);

  // Массив режимов для циклического переключения
  const modes = ["vortex-cube-1x", "vortex-cube-2x", "vortex-cube-3x"];

  // Callback для установки контейнера
  const setCanvasRef = useCallback((element) => {
    canvasRef.current = element;
    setCanvasContainer(element);
  }, []);

  // Загружаем сохранённый режим при первом рендере
  useEffect(() => {
    const savedMode = localStorage.getItem("vortexCubeMode");
    if (savedMode && modes.includes(savedMode)) {
      setMode(savedMode);
    }
  }, []);

  // Сохраняем режим при каждом изменении
  useEffect(() => {
    localStorage.setItem("vortexCubeMode", mode);
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
      case "vortex-cube-1x":
        return t("project2.vortex-cube-1x");
      case "vortex-cube-2x":
        return t("project2.vortex-cube-2x");
      case "vortex-cube-3x":
        return t("project2.vortex-cube-3x");
      default:
        return t("project2.vortex-cube-1x");
    }
  };

  return (
    <div className="project2">

      <MetaTags
        mainTitle={t('project2.name')}
        metaTags={[
          { name: "description", content: t('project2.disc') },

          // Open Graph meta tags
          { property: "og:title", content: t('project2.name') },
          { property: "og:description", content: t('project2.disc') },
          { property: "og:image", content: `${siteUrl}/ogimage/project2.jpg` },
          { property: "og:url", content: `${siteUrl}/project2` },
          { property: "og:type", content: "website" },
          { property: "og:site_name", content: `${siteUrl}` },

          // Twitter meta tags
          { property: "twitter:title", content: t('project2.name') },
          { property: "twitter:description", content: t('project2.disc') },
          { property: "twitter:image", content: `${siteUrl}/ogimage/project2.jpg` },
          { name: "twitter:card", content: "summary_large_image" },

          // SEO-теги
          { name: "author", content: "Anatolii Zorin" },
          { name: "robots", content: "index,follow" },
        ]}
      />

      <div className="container">
        <h1><Link to="/" className="back-to-menu" title={t('extra.back')}>
          <i className="fa fa-arrow-circle-left"></i></Link>
          {t('project2.name')}

          <div className="mode-switch">
            <button className={mode} onClick={switchToNextMode}>
              {getButtonText()}
            </button>
          </div>

          <CanvasFullScreen canvasContainer={canvasContainer} onCanvasChange={setCanvasFullscreen}/>
          <ToggleFooterButton />
        </h1>
        <hr className="custom-line" />

        {mode === "vortex-cube-1x" && <VortexCube1x ref={setCanvasRef} canvasFullscreen={canvasFullscreen} />}
        {mode === "vortex-cube-2x" && <VortexCube2x ref={setCanvasRef} canvasFullscreen={canvasFullscreen} />}
        {mode === "vortex-cube-3x" && <VortexCube3x ref={setCanvasRef} canvasFullscreen={canvasFullscreen} />}

      </div>
    </div>
  );
};