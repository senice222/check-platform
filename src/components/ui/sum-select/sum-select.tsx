import React from 'react';
import styles from './sum-select.module.scss';
import { ArrowSelect, Dollar } from '../../svgs/svgs';

interface SumSelectProps {
  onApply: (from: string, to: string) => void;
}

const SumSelect: React.FC<SumSelectProps> = ({ onApply }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [fromValue, setFromValue] = React.useState('');
  const [toValue, setToValue] = React.useState('');
  const selectRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApply = () => {
    onApply(fromValue, toValue);
    setIsOpen(false);
  };

  return (
    <div className={styles.selectWrapper} ref={selectRef}>
      <div 
        className={`${styles.customSelect} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.icon}><Dollar /></div>
        <p className={styles.label}>По сумме</p>
        <div className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>
          <ArrowSelect />
        </div>
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.inputs}>
            <div className={styles.inputGroup}>
              <label>От</label>
              <input
                type="number"
                placeholder="0"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>До</label>
              <input
                type="number"
                placeholder="999999"
                value={toValue}
                onChange={(e) => setToValue(e.target.value)}
              />
            </div>
          </div>
          <button className={styles.applyButton} onClick={handleApply}>
            Применить
          </button>
        </div>
      )}
    </div>
  );
};

export default SumSelect; 