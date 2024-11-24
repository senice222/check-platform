import React from 'react';
import styles from './button.module.scss';

interface ButtonProps {
  onClick?: (e : React.MouseEvent) => void;
  label: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  styleLabel?: React.CSSProperties;
  variant?: 'white' | 'purple';
}

const Button: React.FC<ButtonProps> = ({ onClick, label, disabled = false, style, styleLabel, icon, variant = 'purple' }) => {
  return (
    <button
      className={`${styles.button} ${variant === "white" ? styles.whiteBtn : ""}`}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && (
        <div className={styles.icon}>
          {icon}
        </div>
      )}
      <p style={styleLabel}>{label}</p>
    </button>
  );
};

export default Button;

