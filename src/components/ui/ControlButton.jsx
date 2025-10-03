import React from "react";
import "@/components/ui/ControlButton.scss";

export const ControlButton = ({ icon, onClick, variant = "default", ...props }) => {
  return (
    <button
      className={`control-button control-button--${variant}`}
      onClick={onClick}
      {...props}
    >
      {icon && <i className={icon} />}
      {props.children}
    </button>
  );
};