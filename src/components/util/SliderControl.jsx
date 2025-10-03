import React from "react";
import "@/components/util/SliderControl.scss";

import { RangeSlider } from "@/components/ui/RangeSlider";
import { ControlButton } from "@/components/ui/ControlButton";

function SliderControl({ label, value, handlers, min, max, defaultValue, formatValue }) {
  return (
    <div className="slider-control">
      <div className="slider-label">{label}</div>
      <div className="slider-wrapper">
        <ControlButton
          icon="fa-solid fa-minus-circle"
          onClick={handlers.decrease}
          variant="minus"
        />
        <RangeSlider
          min={min}
          max={max}
          step="1"
          value={value}
          onChange={handlers.onChange}
        />
        <ControlButton
          icon="fa-solid fa-plus-circle"
          onClick={handlers.increase}
          variant="plus"
        />
      </div>
      <div className="reset-wrapper">
        <ControlButton
          icon="fa-solid fa-undo"
          onClick={() => handlers.reset(defaultValue)}
          variant="reset"
        />
        <div className="scale-value">
          {formatValue ? formatValue(value) : value}°
        </div>
      </div>
    </div>
  );
}

export default SliderControl;