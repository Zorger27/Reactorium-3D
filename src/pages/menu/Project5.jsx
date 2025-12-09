import React, {useCallback, useEffect, useRef, useState} from 'react';
import '@/pages/menu/Project5.scss';
import Orbitron from "@/components/app/Compositions/Orbitron.jsx";
import CuboVerse from "@/components/app/Compositions/CuboVerse.jsx";
import { useTranslation } from 'react-i18next';
import {Link} from "react-router-dom";
import {useSpaCleanup} from "@/hooks/useSpaCleanup.js";
import ToggleFooterButton from "@/components/util/ToggleFooterButton.jsx";
import MetaTags from "@/components/seo/MetaTags.jsx";
import CanvasFullScreen from "@/components/util/CanvasFullScreen.jsx";

export const Project5 = () => {
  const { t } = useTranslation();
  const siteUrl = import.meta.env.VITE_SITE_URL;
  useSpaCleanup();

  const [mode, setMode] = useState("orbitron"); // "orbitron" | "cuboverse"
  const canvasRef = useRef(null);
  const [canvasContainer, setCanvasContainer] = useState(null);

  // Состояние для отслеживания полноэкранного режима
  const [canvasFullscreen, setCanvasFullscreen] = useState(false);

  // Callback для установки контейнера
  const setCanvasRef = useCallback((element) => {
    canvasRef.current = element;
    setCanvasContainer(element);
  }, []);

  // Загружаем сохранённый режим при первом рендере
  useEffect(() => {
    const savedMode = localStorage.getItem("compositionMode");
    if (savedMode === "orbitron" || savedMode === "cuboverse") {
      setMode(savedMode);
    }
  }, []);

  // Сохраняем режим при каждом изменении
  useEffect(() => {
    localStorage.setItem("compositionMode", mode);
  }, [mode]);

  return (
    <div className="project5">

      <MetaTags
        mainTitle={t('project5.name')}
        metaTags={[
          { name: "description", content: t('project5.disc') },

          // Open Graph meta tags
          { property: "og:title", content: t('project5.name') },
          { property: "og:description", content: t('project5.disc') },
          { property: "og:image", content: `${siteUrl}/ogimage/project5.jpg` },
          { property: "og:url", content: `${siteUrl}/project5` },
          { property: "og:type", content: "website" },
          { property: "og:site_name", content: `${siteUrl}` },

          // Twitter meta tags
          { property: "twitter:title", content: t('project5.name') },
          { property: "twitter:description", content: t('project5.disc') },
          { property: "twitter:image", content: `${siteUrl}/ogimage/project5.jpg` },
          { name: "twitter:card", content: "summary_large_image" },

          // SEO-теги
          { name: "author", content: "Anatolii Zorin" },
          { name: "robots", content: "index,follow" },
        ]}
      />

      <div className="container">
        <h1><Link to="/" className="back-to-menu" title={t('extra.back')}>
          <i className="fa fa-arrow-circle-left"></i></Link>
          {t('project5.name')}

          <div className="mode-switch">
            <button className={mode} onClick={() => setMode(mode === "orbitron" ? "cuboverse" : "orbitron")}>
              {mode === "orbitron" ? t("project5.name-cuboverse") : t("project5.name-orbitron")}
            </button>
          </div>

          <CanvasFullScreen canvasContainer={canvasContainer} onCanvasChange={setCanvasFullscreen}/>
          <ToggleFooterButton />
        </h1>
        <hr className="custom-line" />

        {mode === "orbitron" && <Orbitron ref={setCanvasRef} canvasFullscreen={canvasFullscreen} />}
        {mode === "cuboverse" && <CuboVerse ref={setCanvasRef} canvasFullscreen={canvasFullscreen} />}

      </div>
    </div>
  );
};