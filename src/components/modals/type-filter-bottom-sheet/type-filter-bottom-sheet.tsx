import React, { useRef, useState, useEffect } from 'react';
import styles from './type-filter-bottom-sheet.module.scss';
import CheckBox from '../../ui/check-box/check-box';

interface TypeFilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  options: { id: string; label: string; checked: boolean }[];
  onOptionChange: (options: { id: string; label: string; checked: boolean }[]) => void;
}

const TypeFilterBottomSheet: React.FC<TypeFilterBottomSheetProps> = ({
  isOpen,
  onClose,
  options,
  onOptionChange
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState<number>(0);
  const [currentY, setCurrentY] = useState<number>(0);
  const [localOptions, setLocalOptions] = useState(options);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff < 0) return;
    setCurrentY(diff);
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (currentY > 100) {
      handleClose();
    }
    if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(0)';
    }
    setCurrentY(0);
  };

  const handleOptionChange = (id: string) => {
    const newOptions = localOptions.map(opt => 
      opt.id === id ? { ...opt, checked: !opt.checked } : opt
    );
    setLocalOptions(newOptions);
    onOptionChange(newOptions);
  };

  const handleReset = () => {
    const newOptions = localOptions.map(opt => ({ ...opt, checked: false }));
    setLocalOptions(newOptions);
    onOptionChange(newOptions);
  };

  if (!isOpen) return null;

  const selectedOptions = localOptions.filter(opt => opt.checked);

  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay} onClick={handleClose} />
      <div 
        ref={sheetRef}
        className={`${styles.sheet} ${isClosing ? styles.closing : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.dragIndicator} />
          <div className={styles.headerContent}>
            <h2>Фильтры</h2>
            <button onClick={handleClose}>Закрыть</button>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.filterBlock}>
            <div className={styles.filterHeader}>
              <div className={styles.filterTitle}>По типу</div>
              {selectedOptions.length > 0 && (
                <div className={styles.appliedFilter}>
                  <span>Выбрано: {selectedOptions.length}</span>
                  <button onClick={handleReset} className={styles.resetButton}>✕</button>
                </div>
              )}
            </div>
            <div className={styles.options}>
              {localOptions.map(option => (
                <div 
                  key={option.id} 
                  className={styles.optionItem}
                  onClick={() => handleOptionChange(option.id)}
                >
                  <CheckBox
                    isChecked={option.checked}
                    setChecked={() => handleOptionChange(option.id)}
                  />
                  <div className={`${styles.typeBadge} ${styles[option.id]}`}>
                    {option.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypeFilterBottomSheet; 