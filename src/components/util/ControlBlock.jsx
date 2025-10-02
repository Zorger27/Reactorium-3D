import React, { useState, useRef, useEffect } from "react";
import SliderControl from "./SliderControl";
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
      <div
        className={`control-label ${isOpen ? "open" : "closed"}`}
        onClick={() => setIsOpen(prev => !prev)}
      >
        {label}
      </div>

      {isOpen && (
        <div className="controls-wrapper">
          {/* Gap блок с рабочим range input */}
          {gapConfig && (
            <div className="gap-control">
              <button onClick={gapConfig.decrease}>-</button>
              <input
                type="range"
                min={gapConfig.min}
                max={gapConfig.max}
                step={gapConfig.step}
                value={gapConfig.value}
                onChange={(e) => gapConfig.onChange(parseFloat(e.target.value))}
                style={{ pointerEvents: "auto" }}
              />
              <button onClick={gapConfig.increase}>+</button>
              <button onClick={gapConfig.reset}>⟲</button>
              <span>{gapConfig.value.toFixed(2)}x</span>
            </div>
          )}

          {/* Rotation sliders */}
          {sliders.map((s, i) => (
            <SliderControl key={i} {...s} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ControlBlock;
