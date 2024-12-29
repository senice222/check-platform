import React, { useState, useRef, useEffect } from 'react';
import styles from './row-menu.module.scss';

interface RowMenuProps {
  options: Array<{
    id: string;
    label: string;
    onClick: () => void;
    danger?: boolean;
    color?: string;
  }>;
  variant?: 'card' | 'default';
}

const RowMenu: React.FC<RowMenuProps> = ({ options, variant }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleButtonClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.top + rect.height,
        left: rect.left - 180 + rect.width,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.menuWrapper} ref={menuRef}>
      <button 
        ref={buttonRef}
        className={styles.menuButton} 
        onClick={handleButtonClick}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 4.5C8.82843 4.5 9.5 3.82843 9.5 3C9.5 2.17157 8.82843 1.5 8 1.5C7.17157 1.5 6.5 2.17157 6.5 3C6.5 3.82843 7.17157 4.5 8 4.5Z" fill="#0F1324" fillOpacity="0.6"/>
          <path d="M8 9.5C8.82843 9.5 9.5 8.82843 9.5 8C9.5 7.17157 8.82843 6.5 8 6.5C7.17157 6.5 6.5 7.17157 6.5 8C6.5 8.82843 7.17157 9.5 8 9.5Z" fill="#0F1324" fillOpacity="0.6"/>
          <path d="M8 14.5C8.82843 14.5 9.5 13.8284 9.5 13C9.5 12.1716 8.82843 11.5 8 11.5C7.17157 11.5 6.5 12.1716 6.5 13C6.5 13.8284 7.17157 14.5 8 14.5Z" fill="#0F1324" fillOpacity="0.6"/>
        </svg>
      </button>
      
      {isOpen && (
        <div 
          className={`${styles.menuDropdown} ${variant === 'card' ? styles.cardVariant : ''}`}
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`
          }}
        >
          {options.map((option) => (
            <button
              key={option.id}
              className={`${styles.menuItem} ${option.danger ? styles.danger : ''}`}
              onClick={() => {
                option.onClick();
                setIsOpen(false);
              }}
              style={{ color: option.color }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RowMenu; 