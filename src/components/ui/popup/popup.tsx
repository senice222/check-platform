import React, { useState, useEffect } from "react";
import styles from "./PopUp.module.scss";

interface PopUpProps {
   message: string;
   duration: number;
   visible: boolean;
   setVisible: React.Dispatch<React.SetStateAction<boolean>>;
   title: string;
}

const PopUp = ({ message, duration, visible, setVisible, title }: PopUpProps) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <div className={`${styles.popUp} ${visible ? styles.active : ""}`}>
      <div className={styles.left}>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
      <svg
        onClick={() => setVisible(false)}
        xmlns="http://www.w3.org/2000/svg"
        width={12}
        height={12}
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M11 1L1 11M1 1L11 11"
          stroke="#98A2B3"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default PopUp;
