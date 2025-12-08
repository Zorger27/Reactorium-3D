import React, { useEffect, useCallback } from 'react';
import '@/components/util/CanvasFullScreen.scss';
import { useTranslation } from 'react-i18next';

const CanvasFullScreen = ({ canvasContainer, onFullscreenChange }) => {
  const { t } = useTranslation();

  const handleFullscreenChange = useCallback(() => {
    const fullscreenActive = document.fullscreenElement === canvasContainer;

    // Уведомляем родителя об изменении
    if (onFullscreenChange) {
      onFullscreenChange(fullscreenActive);
    }
  }, [onFullscreenChange, canvasContainer]);

  const handleKeyDown = useCallback((event) => {
    if ((event.key === 'Backspace' || event.key === ' ') && document.fullscreenElement) {
      document.exitFullscreen().catch((error) => {
        console.error('Exit fullscreen error:', error.message);
      });
    }
  }, []);

  useEffect(() => {
    // Отслеживаем изменения fullscreen
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Отслеживаем клавиши
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, handleFullscreenChange]);

  const fullScreenView = () => {
    const canvasContainerElement = canvasContainer;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch((error) => {
        console.error('Exit fullscreen error:', error.message);
      });
    } else {
      if (canvasContainerElement?.requestFullscreen) {
        canvasContainerElement.requestFullscreen().catch((error) => {
          console.error('Enter fullscreen error:', error.message);
        });
      } else if (canvasContainerElement?.['mozRequestFullScreen']) { // Firefox
        canvasContainerElement['mozRequestFullScreen']();
      } else if (canvasContainerElement?.['webkitRequestFullscreen']) { // Chrome, Safari and Opera
        canvasContainerElement['webkitRequestFullscreen']();
      } else if (canvasContainerElement?.['msRequestFullscreen']) { // IE/Edge
        canvasContainerElement['msRequestFullscreen']();
      }
    }
  };

  return (
    <button
      onClick={fullScreenView}
      className="canvas-full-screen"
      title={t('extra.canvasFullScreen')}
    >
      <i className="fa fa-expand"></i>
    </button>
  );
};

export default CanvasFullScreen;