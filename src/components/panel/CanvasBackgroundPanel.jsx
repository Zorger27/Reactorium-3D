import React from "react";
import { useTranslation } from 'react-i18next';
import '@/components/panel/CanvasBackgroundPanel.scss';

/**
 * Панель выбора фона Canvas в fullscreen режиме
 *
 * @param {Object} props
 * @param {string} props.currentBackground - Текущий фон ('sky01' | 'sky02' | 'sky03' | 'desert01' | ...)
 * @param {Function} props.onBackgroundChange - Callback для изменения фона
 * @param {Function} props.onActivate - Callback для открытия fullscreen с выбранным фоном
 * @param {boolean} props.isOpen - Состояние открытия меню
 * @param {Function} props.onToggle - Callback для открытия/закрытия меню
 * @param {Object} props.canvasContainer - Ref на canvas контейнер для fullscreen
 */

const CanvasBackgroundPanel = ({
                                 currentBackground = 'scene01',
                                 onBackgroundChange,
                                 onActivate,
                                 isOpen = false,
                                 onToggle,
                                 canvasContainer
                               }) => {
  const { t } = useTranslation();

  const handleBackgroundClick = (backgroundName) => {
    // Устанавливаем выбранный фон
    if (onBackgroundChange) {
      onBackgroundChange(backgroundName);
    }

    // Открываем fullscreen с этим фоном
    if (onActivate) {
      onActivate(backgroundName);
    }

    // Запускаем fullscreen
    openFullscreen();
  };

  const openFullscreen = () => {
    const canvasContainerElement = canvasContainer;

    if (canvasContainerElement?.requestFullscreen) {
      canvasContainerElement.requestFullscreen().catch((error) => {
        console.error('Enter fullscreen error:', error.message);
      });
    } else if (canvasContainerElement?.['mozRequestFullScreen']) {
      canvasContainerElement['mozRequestFullScreen']();
    } else if (canvasContainerElement?.['webkitRequestFullscreen']) {
      canvasContainerElement['webkitRequestFullscreen']();
    } else if (canvasContainerElement?.['msRequestFullscreen']) {
      canvasContainerElement['msRequestFullscreen']();
    }
  };

  return (
    <div className="canvas-background-buttons">
      {/* Главная кнопка */}
      <button
        className={`main-canvas-background-button ${isOpen ? 'open' : ''}`}
        onClick={() => {
          if (onToggle) onToggle(!isOpen);
        }}
        title={isOpen ? t('canvas-background.menu-close') : t('canvas-background.menu-open')}
      >
        <i className={`main-canvas-background-icon fas ${isOpen ? 'fa-times' : 'fa-image'}`}></i>
        <span className="main-canvas-background-text">{t('canvas-background.title')}</span>
      </button>

      {/* Подменю с кнопками */}
      <div className={`canvas-background-submenu ${isOpen ? 'open' : ''}`}>
        <button
          className={currentBackground === 'scene01' ? 'active' : ''}
          onClick={() => handleBackgroundClick('scene01')}
          title={t('canvas-background.scene01')}
        >
          <i className="fas fa-cloud-sun"></i>
        </button>
        <button
          className={currentBackground === 'scene02' ? 'active' : ''}
          onClick={() => handleBackgroundClick('scene02')}
          title={t('canvas-background.scene02')}
        >
          <i className="fas fa-cloud-moon"></i>
        </button>
        <button
          className={currentBackground === 'scene03' ? 'active' : ''}
          onClick={() => handleBackgroundClick('scene03')}
          title={t('canvas-background.scene03')}
        >
          <i className="fas fa-sun"></i>
        </button>
        <button
          className={currentBackground === 'scene04' ? 'active' : ''}
          onClick={() => handleBackgroundClick('scene04')}
          title={t('canvas-background.scene04')}
        >
          <i className="fas fa-mountain"></i>
        </button>
      </div>
    </div>
  );
};

export default CanvasBackgroundPanel;