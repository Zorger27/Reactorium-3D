import React, { useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import SliderControl from "@/components/util/SliderControl";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { ControlButton } from "@/components/ui/ControlButton";
import "@/components/util/ControlBlock.scss";

function ControlBlock({
                        label,
                        icon = null, // пропс для иконки
                        sliders = [],
                        gapConfig = null,
                        isOpen = false,
                        onToggle
                      }) {
  const { t } = useTranslation();
  const containerRef = useRef(null);

  // закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(e.target)) {
        onToggle?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="control-block" ref={containerRef}>
      <div className={`label-all ${isOpen ? "open" : "closed"}`}>
        <div
          className={`control-label ${isOpen ? "open" : "closed"}`}
          onClick={onToggle}
        >
          {icon && <i className={`label-icon ${icon}`}></i>}
          <span className="label-text">{label}</span>
        </div>

        {isOpen && (
          <div className="controls-wrapper">
            {/* Gap блок */}
            {gapConfig && (
              <div className="gap-block">
                <div className="gap-control">
                  <ControlButton
                    icon="fa-solid fa-minus-circle"
                    onClick={gapConfig.decrease}
                    title={t("control.decrease")}
                    variant="minus"
                  />

                  <RangeSlider
                    min={gapConfig.min}
                    max={gapConfig.max}
                    step={gapConfig.step}
                    value={gapConfig.value}
                    onChange={gapConfig.onChange}
                    style={{ pointerEvents: "auto" }}
                  />

                  <ControlButton
                    icon="fa-solid fa-plus-circle"
                    onClick={gapConfig.increase}
                    title={t("control.increase")}
                    variant="plus"
                  />
                </div>

                <div className="reset-wrapper">
                  <ControlButton
                    icon="fa-solid fa-undo"
                    onClick={gapConfig.reset}
                    title={t("control.reset")}
                    variant="reset"
                  />

                  <div className="gap-value">
                    {gapConfig.value.toFixed(3)}x
                  </div>
                </div>
              </div>
            )}

            {/* Rotation sliders */}
            {sliders.map((s, i) => (
              <SliderControl key={i} {...s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ControlBlock;
