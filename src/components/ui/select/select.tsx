import { useState, useRef, useEffect } from 'react';
import { ArrowSelect } from '../../svgs/svgs';
import styles from './select.module.scss';
import ActiveSelect from '../active-select/active-select';

interface SelectProps {
  icon: JSX.Element;
  label: string;
  type?: string;
  options?: Array<{ id: string; label: string; checked: boolean; }>;
  onOptionChange?: (options: Array<{ id: string; label: string; checked: boolean; }>) => void;
}

const Select = ({ icon, label, type, options = [], onOptionChange }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionChange = (newOptions: Array<{ id: string; label: string; checked: boolean; }>) => {
    onOptionChange?.(newOptions);
  };

  return (
    <div className={styles.selectWrapper} ref={selectRef} data-select-type={type}>
      <div 
        className={`${styles.customSelect} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.icon}>{icon}</div>
        <p className={styles.label}>{label}</p>
        <div className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>
          <ArrowSelect />
        </div>
      </div>
      <ActiveSelect
        isOpen={isOpen}
        options={options}
        onOptionChange={handleOptionChange}
        type={type}
      />
    </div>
  );
};

export default Select;
