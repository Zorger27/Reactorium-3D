import React from 'react';
import '@/pages/menu/Project4.scss';
import { useTranslation } from 'react-i18next';
import {Link} from "react-router-dom";
import {useSpaCleanup} from "@/hooks/useSpaCleanup.js";
import ToggleFooterButton from "@/components/util/ToggleFooterButton.jsx";
import MetaTags from "@/components/seo/MetaTags.jsx";

export const Project4 = () => {
  const { t } = useTranslation();
  const siteUrl = import.meta.env.VITE_SITE_URL;

  useSpaCleanup();

  return (
    <div className="project4">

      <MetaTags
        mainTitle={t('project4.name')}
        metaTags={[
          { name: "description", content: t('project4.disc') },

          // Open Graph meta tags
          { property: "og:title", content: t('project4.name') },
          { property: "og:description", content: t('project4.disc') },
          { property: "og:image", content: `${siteUrl}/ogimage/project4.jpg` },
          { property: "og:url", content: `${siteUrl}/project4` },
          { property: "og:type", content: "website" },
          { property: "og:site_name", content: `${siteUrl}` },

          // Twitter meta tags
          { property: "twitter:title", content: t('project4.name') },
          { property: "twitter:description", content: t('project4.disc') },
          { property: "twitter:image", content: `${siteUrl}/ogimage/project4.jpg` },
          { name: "twitter:card", content: "summary_large_image" },

          // SEO-теги
          { name: "author", content: "Anatolii Zorin" },
          { name: "robots", content: "index,follow" },
        ]}
      />

      <div className="container">
        <h1><Link to="/" className="back-to-menu" title={t('extra.back')}>
          <i className="fa fa-arrow-circle-left"></i></Link>
          {t('project4.name')}
          <ToggleFooterButton />
        </h1>
        <hr className="custom-line" />
      </div>
    </div>
  );
};