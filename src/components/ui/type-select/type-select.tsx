import React, { useState, useRef, useEffect } from 'react';
import s from './type-select.module.scss';
import { ArrowSelect } from '../../svgs/svgs';

type CompanyType = 'elite' | 'white';

interface TypeSelectProps {
  value: CompanyType | '';
  onChange: (value: CompanyType) => void;
}

const TypeSelect: React.FC<TypeSelectProps> = ({ value, onChange }) => {
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

  const renderValue = () => {
    if (!value) return <span className={s.placeholder}>Выберите тип</span>;
    return (
      <span className={`${s.typeBadge} ${s[value]}`}>
        {value === 'elite' ? 'Элитная' : 'Белая'}
      </span>
    );
  };

  return (
    <div className={s.selectWrapper} ref={selectRef}>
      <button
        className={s.selectButton}
        onClick={() => setIsOpen(!isOpen)}
        data-open={isOpen}
      >
        {renderValue()}
        <ArrowSelect />
      </button>
      
      {isOpen && (
        <div className={s.dropdown}>
          <div 
            className={s.option} 
            onClick={() => {
              onChange('white');
              setIsOpen(false);
            }}
          >
            <span className={`${s.typeBadge} ${s.white}`}>Белая</span>
          </div>
          <div 
            className={s.option}
            onClick={() => {
              onChange('elite');
              setIsOpen(false);
            }}
          >
            <span className={`${s.typeBadge} ${s.elite}`}>Элитная</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypeSelect; 