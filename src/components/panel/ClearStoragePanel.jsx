import React from "react";
import { useTranslation } from 'react-i18next';
import '@/components/panel/ClearStoragePanel.scss';

/**
 * Универсальная панель очистки localStorage
 *
 * @param {Object} props
 * @param {string} props.storagePrefix - Префикс ключей для очистки (например, 'singleCubeForge')
 * @param {Function} props.onClearCurrent - Callback после очистки текущих данных
 * @param {Function} props.onClearAll - Callback после полной очистки
 * @param {boolean} props.isOpen - Состояние открытия меню
 * @param {Function} props.onToggle - Callback для открытия/закрытия меню
 */
const ClearStoragePanel = ({
                             storagePrefix,
                             onClearCurrent,
                             onClearAll,
                             isOpen = false,
                             onToggle
                           }) => {
  const { t } = useTranslation();

  // === Очистка ТЕКУЩЕГО localStorage (только с префиксом) ===
  const clearCurrentStorage = () => {
    // Проверяем, есть ли вообще что очищать
    const hasData = Object.keys(localStorage).some(key => key.startsWith(storagePrefix));
    if (!hasData) {
      alert(t('storage.noData'));
      return;
    }

    const confirmed = window.confirm(t('storage.confirm-clear-current'));
    if (!confirmed) {
      alert(t('storage.alertNo'));
      return;
    }

    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(storagePrefix)) {
          localStorage.removeItem(key);
        }
      });

      // Вызываем callback для родителя (сброс состояния)
      if (onClearCurrent) onClearCurrent();

      alert(t('storage.alertYes'));
    } catch (e) {
      console.error('Ошибка при очистке localStorage:', e);
    }

    if (onToggle) onToggle(false);
  };

  // === Полная очистка localStorage ===
  const clearAllStorage = () => {
    if (localStorage.length === 0) {
      alert(t('storage.noData'));
      return;
    }

    const confirmed = window.confirm(t('storage.confirm-clear-all'));
    if (!confirmed) {
      alert(t('storage.alertNo'));
      return;
    }

    try {
      localStorage.clear();

      // Вызываем callback для родителя (сброс состояния)
      if (onClearAll) onClearAll();

      alert(t('storage.alertYes'));
    } catch (e) {
      console.error('Ошибка при очистке всего localStorage:', e);
    }

    if (onToggle) onToggle(false);
  };

  return (
    <div className="clear-buttons">
      {/* Главная кнопка */}
      <button className={`main-clear-button ${isOpen ? 'open' : ''}`}
        onClick={() => {
          if (onToggle) onToggle(!isOpen);
        }}
        title={isOpen ? t('storage.menu-close') : t('storage.menu-open')}
      >
        <i className={`main-clear-icon fas ${isOpen ? 'fa-times' : 'fa-trash-alt'}`}></i>
        <span className="main-clear-text">{t('storage.title')}</span>
      </button>

      {/* Подменю */}
      <div className={`clear-submenu ${isOpen ? 'open' : ''}`}>
        <button onClick={clearCurrentStorage} title={t('storage.clearCurrent')}>
          <i className="fas fa-broom"></i>
        </button>
        <button onClick={clearAllStorage} title={t('storage.clearAll')}>
          <i className="fas fa-fire"></i>
        </button>
      </div>
    </div>
  );
};

export default ClearStoragePanel;