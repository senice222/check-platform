import React, { useState, useRef, useEffect } from 'react';
import styles from './select.module.scss';
import ActiveSelect from '../active-select/active-select';
import { ApplicationStatus, STATUS_LABELS } from '../../../constants/statuses';
import { ArrowSelect, Cross } from '../../svgs/svgs';

interface SelectOption {
  id: string;
  label: string;
  checked: boolean;
}

interface SelectProps {
  icon: React.ReactNode;
  label: string;
  type: string;
  options: SelectOption[];
  onOptionChange: (options: SelectOption[]) => void;
}

const Select: React.FC<SelectProps> = ({
  icon,
  label,
  type,
  options,
  onOptionChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.selectWrapper} ref={selectRef} data-select-type={type}>
      {type.includes('mobile') && (
        <div className={styles.selectedRange}>
          <span>{label}</span>
          <div className={styles.dateRange}>
            <span className={options.some(opt => opt.checked) ? styles.active : ''}>
              {options.some(opt => opt.checked) 
                ? `${options.filter(opt => opt.checked).length} выбрано` 
                : 'Все'
              }
            </span>
            {options.some(opt => opt.checked) && (
              <button onClick={() => onOptionChange(options.map(opt => ({ ...opt, checked: false })))}>
                <Cross />
              </button>
            )}
          </div>
        </div>
      )}
      <button
        className={`${styles.selectButton} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {!type.includes('mobile') && icon}
        <span>
          {type.includes('mobile') 
            ? type.includes('sum')
              ? 'от - до'
              : 'Выберите нужных ' + label.toLowerCase().slice(3)
            : label
          }
        </span>
        <ArrowSelect />
      </button>
      <ActiveSelect
        isOpen={isOpen}
        options={options}
        onOptionChange={onOptionChange}
        type={type}
      />
    </div>
  );
};

export default Select;
