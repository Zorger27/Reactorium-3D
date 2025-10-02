import React from "react";
import "@/components/util/SliderControl.scss";

function SliderControl({
                         label,
                         value,
                         handlers,
                         min,
                         max,
                         defaultValue,
                         formatValue,
                       }) {
  return (
    <div className="slider-control">
      <div className="slider-label">{label}</div>
      <div className="slider-wrapper">
        <button className="slider-button minus" onClick={handlers.decrease}><i className="fa-solid fa-minus-circle" /></button>
        <input type="range" min={min} max={max} step="1" value={value}
          onChange={(e) => handlers.onChange(parseFloat(e.target.value))}
        />
        <button className="slider-button plus" onClick={handlers.increase}><i className="fa-solid fa-plus-circle" /></button>
      </div>
      <div className="reset-wrapper">
        <button className="slider-button reset" onClick={() => handlers.reset(defaultValue)}>
          <i className="fa-solid fa-undo" />
        </button>
        <div className="scale-value">
          {formatValue ? formatValue(value) : value}º
        </div>
      </div>
    </div>
  );
}

export default SliderControl;
