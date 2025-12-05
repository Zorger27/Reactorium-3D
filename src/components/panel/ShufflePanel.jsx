import React from "react";
import { useTranslation } from 'react-i18next';
import '@/components/panel/ShufflePanel.scss';

/**
 * Универсальная панель перемешивания кубов
 *
 * @param {Object} props
 * @param {Function} props.onShuffle - Callback для перемешивания
 * @param {Function} props.onReset - Callback для сброса позиций
 * @param {boolean} props.isOpen - Состояние открытия меню
 * @param {Function} props.onToggle - Callback для открытия/закрытия меню
 * @param {boolean} props.isVisible - Показывать ли панель (для условия cubeLevel !== 1)
 */
const ShufflePanel = ({
                        onShuffle,
                        onReset,
                        isOpen = false,
                        onToggle,
                        isVisible = true
                      }) => {
  const { t } = useTranslation();

  const handleShuffle = () => {
    if (onShuffle) onShuffle();
    // Меню остаётся открытым
  };

  const handleReset = () => {
    if (onReset) onReset();
    // Меню остаётся открытым
  };

  // Если не видна - не рендерим
  if (!isVisible) return null;

  return (
    <div className="shuffle-buttons">
      {/* Главная кнопка */}
      <button
        className={`main-shuffle-button ${isOpen ? 'open' : ''}`}
        onClick={() => {
          if (onToggle) onToggle(!isOpen);
        }}
        title={isOpen ? t('shuffle.menu-close') : t('shuffle.menu-open')}
      >
        <i className={`main-shuffle-icon fas ${isOpen ? 'fa-times' : 'fa-globe'}`}></i>
        <span className="main-shuffle-text">{t('shuffle.title')}</span>
      </button>

      {/* Подменю с кнопками */}
      <div className={`shuffle-submenu ${isOpen ? 'open' : ''}`}>
        <button onClick={handleShuffle} title={t('shuffle.begin')}><i className="fas fa-random"></i></button>
        <button onClick={handleReset} title={t('shuffle.reset')}><i className="fas fa-undo"></i></button>
      </div>
    </div>
  );
};

export default ShufflePanel;