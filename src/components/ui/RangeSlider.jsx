import React from "react";
import "@/components/ui/RangeSlider.scss";

export const RangeSlider = ({ min, max, step, value, onChange, ...props }) => {
  return (
    <input
      type="range"
      className="range-slider"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      {...props}
    />
  );
};