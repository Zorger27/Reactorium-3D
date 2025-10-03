import React, { useState, useRef, useEffect } from "react";
import SliderControl from "@/components/util/SliderControl";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { ControlButton } from "@/components/ui/ControlButton";
import "@/components/util/ControlBlock.scss";

function ControlBlock({ label, sliders = [], gapConfig = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Закрытие при клике вне блока
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="control-block" ref={containerRef}>
      <div className={`label-all ${isOpen ? "open" : "closed"}`}>
        <div className={`control-label ${isOpen ? "open" : "closed"}`} onClick={() => setIsOpen(prev => !prev)}>
         {label}
        </div>
        {isOpen && (
          <div className="controls-wrapper">
            {/* Gap блок с атомарными компонентами */}
            {gapConfig && (
              <div className="gap-block">
                <div className="gap-control">
                  <ControlButton icon="fa-solid fa-minus-circle" onClick={gapConfig.decrease} variant="minus"/>

                  <RangeSlider
                    min={gapConfig.min}
                    max={gapConfig.max}
                    step={gapConfig.step}
                    value={gapConfig.value}
                    onChange={gapConfig.onChange}
                    style={{pointerEvents: "auto"}}
                  />

                  <ControlButton icon="fa-solid fa-plus-circle" onClick={gapConfig.increase} variant="plus"/>
                </div>
                <div className="reset-wrapper">
                  <ControlButton icon="fa-solid fa-undo" onClick={gapConfig.reset} variant="reset"/>

                  <div className="gap-value">
                    {gapConfig.value.toFixed(2)}x
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