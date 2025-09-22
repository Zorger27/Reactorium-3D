import React, { useEffect, useCallback } from 'react';
import './CanvasFullScreen.scss';
import { useTranslation } from 'react-i18next';

const CanvasFullScreen = ({ canvasContainer }) => {
  const handleKeyDown = useCallback((event) => {
    if ((event.key === 'Backspace' || event.key === ' ') && document.fullscreenElement) {
      document.exitFullscreen().catch((error) => {
        console.error('Exit fullscreen error:', error.message);
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

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

  const { t } = useTranslation();
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