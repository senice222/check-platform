import React from 'react';
import s from './active-select.module.scss';
import CheckBox from '../check-box/check-box';
import StatusBadge from '../status-badge/status-badge';
import { ApplicationStatus } from '../../../constants/statuses';

interface Option {
  id: string;
  label: string;
  checked: boolean;
}

interface ActiveSelectProps {
  isOpen: boolean;
  options: Option[];
  onOptionChange: (options: Option[]) => void;
  type?: string;
}

const ActiveSelect: React.FC<ActiveSelectProps> = ({
  isOpen,
  options,
  onOptionChange,
  type,
}) => {
  const handleCheckboxChange = (id: string) => {
    const updatedOptions = options.map(option => 
      option.id === id ? { ...option, checked: !option.checked } : option
    );
    onOptionChange(updatedOptions);
  };

  if (!isOpen) return null;

  return (
    <div className={s.selectDropdown} data-select-type={type}>
      <div className={s.optionsList}>
        {options.map(option => (
          <div 
            key={option.id} 
            className={s.optionItem}
            onClick={() => handleCheckboxChange(option.id)}
            data-checked={option.checked}
          >
            <CheckBox
              isChecked={option.checked}
              setChecked={() => handleCheckboxChange(option.id)}
            />
            {type === 'status' ? (
              <StatusBadge status={option.label as ApplicationStatus} />
            ) : (
              <span>{option.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveSelect;
