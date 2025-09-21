import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import '@/pages/menu/Project1.scss';
import {Link} from "react-router-dom";
import {useSpaCleanup} from "@/hooks/useSpaCleanup.js";
import ToggleFooterButton from "@/components/util/ToggleFooterButton.jsx";
import MetaTags from "@/components/seo/MetaTags.jsx";
import ChromaCube1x from "@/components/app/ChromaCube/ChromaCube1x.jsx";
import ChromaCube2x from "@/components/app/ChromaCube/ChromaCube2x.jsx";

export const Project1 = () => {
  const { t } = useTranslation();
  const siteUrl = import.meta.env.VITE_SITE_URL;
  useSpaCleanup();

  const [mode, setMode] = useState("ChromaCube2x"); // "ChromaCube2x" | "cChromaCube1x"

  // Загружаем сохранённый режим при первом рендере
  useEffect(() => {
    const savedMode = localStorage.getItem("chromaCubeMode");
    if (savedMode === "chroma-cube-2x" || savedMode === "chroma-cube-1x") {
      setMode(savedMode);
    }
  }, []);

  // Сохраняем режим при каждом изменении
  useEffect(() => {
    localStorage.setItem("chromaCubeMode", mode);
  }, [mode]);

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
            <button className={mode} onClick={() => setMode(mode === "chroma-cube-2x" ? "chroma-cube-1x" : "chroma-cube-2x")}>
              {mode === "chroma-cube-2x" ? t("project1.chroma-cube-1x") : t("project1.chroma-cube-2x")}
            </button>
          </div>

          <ToggleFooterButton />
        </h1>
        <hr className="custom-line" />

        {mode === "chroma-cube-2x" && <ChromaCube2x />}
        {mode === "chroma-cube-1x" && <ChromaCube1x />}

      </div>
    </div>
  );
};