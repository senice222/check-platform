import React, { useState, useCallback, useEffect } from 'react';
import styles from './sum-range-filter.module.scss';

interface SumRangeFilterProps {
  label: string;
  onRangeChange?: (from: number | null, to: number | null) => void;
  isMobile?: boolean;
  defaultFrom?: string;
  defaultTo?: string;
}

const SumRangeFilter: React.FC<SumRangeFilterProps> = ({ 
  label, 
  onRangeChange,
  isMobile = false,
  defaultFrom = '',
  defaultTo = ''
}) => {
  const [from, setFrom] = useState<string>(defaultFrom);
  const [to, setTo] = useState<string>(defaultTo);

  useEffect(() => {
    setFrom(defaultFrom);
    setTo(defaultTo);
  }, [defaultFrom, defaultTo]);

  const validateAndFormatNumber = (value: string): string => {
    return value.replace(/[^\d.]/g, '');
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = validateAndFormatNumber(e.target.value);
    setFrom(value);
    if (!isMobile) {
      setFrom(value);
    }
    if (onRangeChange) {
      const fromNumber = value ? parseFloat(value) : null;
      const toNumber = to ? parseFloat(to) : null;
      onRangeChange(fromNumber, toNumber);
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = validateAndFormatNumber(e.target.value);
    setTo(value);
    if (!isMobile) {
      setTo(value);
    }
    if (onRangeChange) {
      const fromNumber = from ? parseFloat(from) : null;
      const toNumber = value ? parseFloat(value) : null;
      onRangeChange(fromNumber, toNumber);
    }
  };

  const handleClear = useCallback(() => {
    setFrom('');
    setTo('');
    onRangeChange?.(null, null);
  }, [onRangeChange]);
  
  return (
    <div className={styles.wrapper} data-mobile={isMobile}>
      {isMobile && (
        <div className={styles.filterHeader}>
          <span className={styles.filterLabel}>{label}</span>
          <div className={styles.appliedFilter}>
            <span>{from || to ? `${from || '0'} – ${to || '∞'}` : 'Все'}</span>
            {(from || to) && (
              <button 
                className={styles.clearButton}
                onClick={handleClear}
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}
      <div className={styles.inputsContainer}>
        <input
          type="text"
          placeholder="от"
          value={from}
          onChange={handleFromChange}
          className={styles.input}
          inputMode="decimal"
        />
        <input
          type="text"
          placeholder="до"
          value={to}
          onChange={handleToChange}
          className={styles.input}
          inputMode="decimal"
        />
      </div>
    </div>
  );
};

export default React.memo(SumRangeFilter); 