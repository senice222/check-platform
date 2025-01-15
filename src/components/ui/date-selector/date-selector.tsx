import React, { useState, useEffect } from 'react';
import styles from './date-selector.module.scss';
import { Calendar, Cross, ArrowLeft, ArrowRight, ArrowSelect } from '../../svgs/svgs';

interface DateSelectorProps {
  onDateChange: (start: string, end?: string) => void;
  fullWidth?: boolean;
  closeOnClickOutside?: boolean;
  singleDate?: boolean;
  inputStyle?: boolean;
  label?: string;
  type?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
}

const DateSelector: React.FC<DateSelectorProps> = ({ 
  onDateChange, 
  fullWidth = false,
  closeOnClickOutside = false,
  singleDate = false,
  inputStyle = false,
  label,
  type,
  defaultStartDate,
  defaultEndDate
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    defaultStartDate ? new Date(defaultStartDate) : null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    defaultEndDate ? new Date(defaultEndDate) : null
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // формат YYYY-MM-DD
  };

  const handleDateClick = (date: Date) => {
    if (singleDate) {
        setSelectedStartDate(date);
        setSelectedEndDate(null);
        setIsOpen(false);
        return;
    }
    
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      if (date < selectedStartDate) {
        setSelectedStartDate(date);
        setSelectedEndDate(null);
      } else {
        setSelectedEndDate(date);
        if (type !== 'date') {
          setIsOpen(false);
        }
      }
    }
  };

  useEffect(() => {
    if (singleDate && selectedStartDate) {
      onDateChange(formatDate(selectedStartDate));
    }
    if (selectedStartDate && selectedEndDate) {
      onDateChange(formatDate(selectedStartDate), formatDate(selectedEndDate));
    }
  }, [selectedStartDate, selectedEndDate]);

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    onDateChange('', '');
    setIsOpen(false);
  };

  const toggleCalendar = () => {
    if (type !== 'date') {
      setIsOpen(!isOpen);
    }
  };

  const getSelectedDateRange = () => {
    if (!selectedStartDate) return '';
    if (singleDate || !selectedEndDate) return formatDate(selectedStartDate);
    return `${formatDate(selectedStartDate)} – ${formatDate(selectedEndDate)}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    for (let i = 0; i < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1); i++) {
      days.push({ date: null, type: 'blank' });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      days.push({ date: currentDate, type: 'day' });
    }
    
    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date > selectedStartDate && date < selectedEndDate;
  };

  const isDateSelected = (date: Date) => {
    if (!date) return false;
    return (
      (selectedStartDate && date.getTime() === selectedStartDate.getTime()) ||
      (selectedEndDate && date.getTime() === selectedEndDate.getTime())
    );
  };

  const getDateClassName = (date: Date | null) => {
    if (!date) return styles.blank;
    
    const classNames = [styles.day];
    
    if (isDateSelected(date)) {
      if (selectedStartDate && date.getTime() === selectedStartDate.getTime()) {
        classNames.push(styles.firstSelected);
      }
      if (selectedEndDate && date.getTime() === selectedEndDate.getTime()) {
        classNames.push(styles.lastSelected);
      }
    }
    
    if (isDateInRange(date)) {
      classNames.push(styles.inRange);
    }
    
    return classNames.join(' ');
  };

  const changeMonth = (increment: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  const renderCalendar = () => (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <span>
          {currentMonth.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}
        </span>
        <div>
          <button onClick={() => changeMonth(-1)}><ArrowLeft /></button>
          <button onClick={() => changeMonth(1)}><ArrowRight /></button>
        </div>
      </div>
      <div className={styles.days}>
        <div className={styles.dayLabel}>П</div>
        <div className={styles.dayLabel}>В</div>
        <div className={styles.dayLabel}>С</div>
        <div className={styles.dayLabel}>Ч</div>
        <div className={styles.dayLabel}>П</div>
        <div className={styles.dayLabel}>С</div>
        <div className={styles.dayLabel}>В</div>
        {getDaysInMonth(currentMonth).map((day, index) => (
          <div
            key={index}
            className={day.date ? getDateClassName(day.date) : styles.blank}
            onClick={() => day.date && handleDateClick(day.date)}
          >
            {day.date ? day.date.getDate() : ''}
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const wrapper = target.closest(`.${styles.inputStyleWrapper}`);
      const calendar = target.closest(`.${styles.calendarPopover}`);
      
      if (closeOnClickOutside && !wrapper && !calendar) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeOnClickOutside]);

  useEffect(() => {
    setSelectedStartDate(defaultStartDate ? new Date(defaultStartDate) : null);
    setSelectedEndDate(defaultEndDate ? new Date(defaultEndDate) : null);
  }, [defaultStartDate, defaultEndDate]);

  if (inputStyle) {
    return (
      <div className={styles.inputStyleWrapper}>
        {label && <label className={styles.label}>{label}</label>}
        <div 
          className={`${styles.inputStyleTrigger} ${isOpen ? styles.active : ''}`} 
          onClick={(e) => {
            e.stopPropagation();
            toggleCalendar();
          }}
        >
          <span className={styles.value}>
            {getSelectedDateRange() || 'Выберите дату'}
          </span>
          <ArrowSelect className={`${styles.arrow} ${isOpen ? styles.open : ''}`} />
        </div>
        {isOpen && (
          <div 
            className={styles.calendarPopover}
            onClick={(e) => e.stopPropagation()}
          >
            {renderCalendar()}
          </div>
        )}
      </div>
    );
  }

  if (type === 'date') {
    return (
      <div className={styles.dateSelector}>
        <div className={styles.selectedRange}>
          <span>По дате чеков</span>
          <div className={styles.dateRange}>
            <span className={getSelectedDateRange() ? styles.active : ''}>
              {getSelectedDateRange() || 'Все'}
            </span>
            {getSelectedDateRange() && (
              <button onClick={clearSelection}>
                <Cross />
              </button>
            )}
          </div>
        </div>
        {renderCalendar()}
      </div>
    );
  }

  return (
    <div className={`${styles.dateSelector} ${fullWidth ? styles.fullWidth : ''}`}>
      <div 
        className={`${styles.trigger} ${isOpen ? styles.active : ''}`} 
        onClick={toggleCalendar}
      >
        <div className={styles.icon}><Calendar /></div>
        <p className={styles.label}>
          {getSelectedDateRange() || 'По дате'}
        </p>
        <div className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>
          <ArrowRight />
        </div>
      </div>
      {isOpen && (
        <div className={styles.calendarPopover}>
          {renderCalendar()}
        </div>
      )}
    </div>
  );
};

export default DateSelector;
