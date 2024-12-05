import React, { useState, useEffect } from 'react';
import styles from './date-selector.module.scss';
import { Calendar, Cross, ArrowLeft, ArrowRight } from '../../svgs/svgs';

interface DateSelectorProps {
  onDateChange: (start: string, end: string) => void;
  type?: string;
}

const DateSelector: React.FC<DateSelectorProps> = ({ onDateChange, type }) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const handleDateClick = (date: Date) => {
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
    if (selectedStartDate && selectedEndDate) {
      onDateChange(formatDate(selectedStartDate), formatDate(selectedEndDate));
    }
  }, [selectedStartDate, selectedEndDate]);

  const clearSelection = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    onDateChange('', '');
  };

  const toggleCalendar = () => {
    if (type !== 'date') {
      setIsOpen(!isOpen);
    }
  };

  const getSelectedDateRange = () => {
    if (!selectedStartDate) return '';
    if (!selectedEndDate) return formatDate(selectedStartDate);
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

  if (type === 'date') {
    return (
      <div className={styles.dateSelector}>
        <div className={styles.selectedRange}>
          <span>По дате чеков</span>
          {getSelectedDateRange() && (
            <div className={styles.dateRange}>
              <span>{getSelectedDateRange()}</span>
              <button onClick={clearSelection}>
                <Cross />
              </button>
            </div>
          )}
        </div>
        {renderCalendar()}
      </div>
    );
  }

  return (
    <div className={styles.dateSelector}>
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
