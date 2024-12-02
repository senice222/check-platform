import React from 'react';
import styles from './sum-filter.module.scss';
import Button from '../../ui/button/button';

interface SumFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (from: string, to: string) => void;
}

const SumFilter: React.FC<SumFilterProps> = ({ isOpen, onClose, onApply }) => {
  const [fromValue, setFromValue] = React.useState('');
  const [toValue, setToValue] = React.useState('');

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(fromValue, toValue);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.content}>
          <div className={styles.inputs}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="От"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="До"
                value={toValue}
                onChange={(e) => setToValue(e.target.value)}
              />
            </div>
          </div>
          <Button
            label="Применить"
            onClick={handleApply}
            style={{ marginTop: '16px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default SumFilter; 