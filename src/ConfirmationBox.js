import { useState } from "react";
import "./ConfirmationBox.css";

const ANIMATION_TIMEOUT = 250;

const ConfirmationBox = ({ title, description, onConfirm, confirmText, onCancel, cancelText }) => {
  const [animationClass, setAnimationClass] = useState("fade-in");

  const handleClose = (callback) => {
    setAnimationClass("fade-out");
    setTimeout(() => {
      callback(); 
    }, ANIMATION_TIMEOUT);
  };

  return (
    <div className={`confirmation-box ${animationClass}`}>
      <p style={{ fontWeight: "bold" }}>{title}</p>
      <p>{description}</p>
      <div style={{ display: "flex", justifyContent: "space-around", margin: "16px 0" }}>
        <button 
            style={{ width: "20%", justifyContent: "center" }} 
            onClick={() => handleClose(onConfirm)}>
          {confirmText}
        </button>
        <button 
            style={{ width: "20%", justifyContent: "center" }} 
            onClick={() => handleClose(onCancel)}>
          {cancelText}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationBox;
