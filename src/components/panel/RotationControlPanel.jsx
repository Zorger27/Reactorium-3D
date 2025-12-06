import React from "react";
import { useTranslation } from 'react-i18next';
import '@/components/panel/RotationControlPanel.scss';

/**
 * Универсальная панель управления вращением
 *
 * @param {Object} props
 * @param {boolean} props.isRotating - Текущее состояние вращения
 * @param {Function} props.onClockwise - Callback для вращения по часовой стрелке
 * @param {Function} props.onCounterClockwise - Callback для вращения против часовой стрелки
 * @param {Function} props.onPause - Callback для паузы/продолжения
 * @param {Function} props.onStop - Callback для остановки и сброса
 * @param {Function} props.onFlip - Callback для поворота на 180°
 */
const RotationControlPanel = ({
                                isRotating = false,
                                onClockwise,
                                onCounterClockwise,
                                onPause,
                                onStop,
                                onFlip
                              }) => {
  const { t } = useTranslation();

  return (
    <div className="rotation-buttons">
      <button onClick={onClockwise} title={t('control.clockwise')}>
        <i className="fa-solid fa-left-long"></i>
      </button>

      <button onClick={onPause} title={isRotating ? t('control.pause') : t('control.continue')}>
        <i className={`fas ${isRotating ? "fa-pause" : "fa-play"}`}></i>
      </button>

      <button onClick={onStop} title={t('control.stop')}>
        <i className="fas fa-stop"></i>
      </button>

      <button onClick={onFlip} title={t('control.180')}>
        <i className="fas fa-sync-alt"></i>
      </button>

      <button onClick={onCounterClockwise} title={t('control.counterclockwise')}>
        <i className="fa-solid fa-right-long"></i>
      </button>
    </div>
  );
};

export default RotationControlPanel;