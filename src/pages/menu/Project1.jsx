import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import '@/pages/menu/Project1.scss';
import {Link} from "react-router-dom";
import {useSpaCleanup} from "@/hooks/useSpaCleanup.js";
import ToggleFooterButton from "@/components/util/ToggleFooterButton.jsx";
import MetaTags from "@/components/seo/MetaTags.jsx";
import ChromaCube1x from "@/components/app/ChromaCube/ChromaCube1x.jsx";
import ChromaCube2x from "@/components/app/ChromaCube/ChromaCube2x.jsx";
import ChromaCube3x from "@/components/app/ChromaCube/ChromaCube3x.jsx";

export const Project1 = () => {
  const { t } = useTranslation();
  const siteUrl = import.meta.env.VITE_SITE_URL;
  useSpaCleanup();

  const [mode, setMode] = useState("chroma-cube-1x"); // "chroma-cube-1x" | "chroma-cube-2x" | "chroma-cube-3x"

  // Массив режимов для циклического переключения
  const modes = ["chroma-cube-1x", "chroma-cube-2x", "chroma-cube-3x"];

  // Загружаем сохранённый режим при первом рендере
  useEffect(() => {
    const savedMode = localStorage.getItem("chromaCubeMode");
    if (savedMode && modes.includes(savedMode)) {
      setMode(savedMode);
    }
  }, []);

  // Сохраняем режим при каждом изменении
  useEffect(() => {
    localStorage.setItem("chromaCubeMode", mode);
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
      case "chroma-cube-1x":
        return t("project1.chroma-cube-1x");
      case "chroma-cube-2x":
        return t("project1.chroma-cube-2x");
      case "chroma-cube-3x":
        return t("project1.chroma-cube-3x");
      default:
        return t("project1.chroma-cube-1x");
    }
  };

  return (
    <div className="project1">

      <MetaTags
        mainTitle={t('project1.name')}
        metaTags={[
          { name: "description", content: t('project1.disc') },

          // Open Graph meta tags
          { property: "og:title", content: t('project1.name') },
          { property: "og:description", content: t('project1.disc') },
          { property: "og:image", content: `${siteUrl}/ogimage/project1.jpg` },
          { property: "og:url", content: `${siteUrl}/project1` },
          { property: "og:type", content: "website" },
          { property: "og:site_name", content: `${siteUrl}` },

          // Twitter meta tags
          { property: "twitter:title", content: t('project1.name') },
          { property: "twitter:description", content: t('project1.disc') },
          { property: "twitter:image", content: `${siteUrl}/ogimage/project1.jpg` },
          { name: "twitter:card", content: "summary_large_image" },
        ]}
      />

      <div className="container">
        <h1><Link to="/" className="back-to-menu" title={t('extra.back')}>
          <i className="fa fa-arrow-circle-left"></i></Link>
          {t('project1.name')}

          <div className="mode-switch">
            <button className={mode} onClick={switchToNextMode}>
              {getButtonText()}
            </button>
          </div>

          <ToggleFooterButton />
        </h1>
        <hr className="custom-line" />

        {mode === "chroma-cube-1x" && <ChromaCube1x />}
        {mode === "chroma-cube-2x" && <ChromaCube2x />}
        {mode === "chroma-cube-3x" && <ChromaCube3x />}

      </div>
    </div>
  );
};