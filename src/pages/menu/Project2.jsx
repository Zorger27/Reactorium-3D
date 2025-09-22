import React, {useEffect, useState} from 'react';
import '@/pages/menu/Project2.scss';
import { useTranslation } from 'react-i18next';
import {Link} from "react-router-dom";
import {useSpaCleanup} from "@/hooks/useSpaCleanup.js";
import ToggleFooterButton from "@/components/util/ToggleFooterButton.jsx";
import MetaTags from "@/components/seo/MetaTags.jsx";
import TexoCube1x from "@/components/app/TexoCube/TexoCube1x.jsx";
import TexoCube2x from "@/components/app/TexoCube/TexoCube2x.jsx";
import TexoCube3x from "@/components/app/TexoCube/TexoCube3x.jsx";

export const Project2 = () => {
  const { t } = useTranslation();
  const siteUrl = import.meta.env.VITE_SITE_URL;
  useSpaCleanup();

  const [mode, setMode] = useState("texo-cube-1x"); // "texo-cube-1x" | "texo-cube-2x" | "texo-cube-3x"

  // Массив режимов для циклического переключения
  const modes = ["texo-cube-1x", "texo-cube-2x", "texo-cube-3x"];

  // Загружаем сохранённый режим при первом рендере
  useEffect(() => {
    const savedMode = localStorage.getItem("texoCubeMode");
    if (savedMode && modes.includes(savedMode)) {
      setMode(savedMode);
    }
  }, []);

  // Сохраняем режим при каждом изменении
  useEffect(() => {
    localStorage.setItem("texoCubeMode", mode);
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
      case "texo-cube-1x":
        return t("project2.texo-cube-1x");
      case "texo-cube-2x":
        return t("project2.texo-cube-2x");
      case "texo-cube-3x":
        return t("project2.texo-cube-3x");
      default:
        return t("project2.texo-cube-1x");
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

          <ToggleFooterButton />
        </h1>
        <hr className="custom-line" />

        {mode === "texo-cube-1x" && <TexoCube1x />}
        {mode === "texo-cube-2x" && <TexoCube2x />}
        {mode === "texo-cube-3x" && <TexoCube3x />}

      </div>
    </div>
  );
};