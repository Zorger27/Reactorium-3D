import React from "react";
import { useTranslation } from 'react-i18next';
import '@/components/panel/CubeStylePanel.scss';

/**
 * Универсальная панель выбора стиля куба
 *
 * @param {Object} props
 * @param {string} props.currentStyle - Текущий стиль ('photo' | 'texture' | 'color')
 * @param {Function} props.onStyleChange - Callback для изменения стиля
 * @param {boolean} props.isOpen - Состояние открытия меню
 * @param {Function} props.onToggle - Callback для открытия/закрытия меню
 */
const CubeStylePanel = ({
                          currentStyle = 'photo',
                          onStyleChange,
                          isOpen = false,
                          onToggle
                        }) => {
  const { t } = useTranslation();

  const handleStyleClick = (style) => {
    if (onStyleChange) onStyleChange(style);
    // Меню остаётся открытым после выбора стиля
  };

  return (
    <div className="cube-style-buttons">
      {/* Главная кнопка */}
      <button
        className={`main-cube-style-button ${isOpen ? 'open' : ''}`}
        onClick={() => {
          if (onToggle) onToggle(!isOpen);
        }}
        title={isOpen ? t('cube-style.menu-close') : t('cube-style.menu-open')}
      >
        <i className={`main-cube-style-icon fas ${isOpen ? 'fa-times' : 'fa-palette'}`}></i>
        <span className="main-cube-style-text">{t('cube-style.title')}</span>
      </button>

      {/* Подменю с кнопками */}
      <div className={`cube-style-submenu ${isOpen ? 'open' : ''}`}>
        <button
          className={currentStyle === 'photo' ? 'active' : ''}
          onClick={() => handleStyleClick('photo')}
          title={t('cube-style.photo')}
        >
          <i className="fas fa-image"></i>
        </button>
        <button
          className={currentStyle === 'texture' ? 'active' : ''}
          onClick={() => handleStyleClick('texture')}
          title={t('cube-style.texture')}
        >
          <i className="fas fa-layer-group"></i>
        </button>
        <button
          className={currentStyle === 'color' ? 'active' : ''}
          onClick={() => handleStyleClick('color')}
          title={t('cube-style.color')}
        >
          <i className="fas fa-tint"></i>
        </button>
      </div>
    </div>
  );
};

export default CubeStylePanel;