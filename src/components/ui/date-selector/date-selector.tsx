import React, { useState, useRef, useEffect } from "react";
import styles from "./date-selector.module.scss";
import { ArrowLeft, ArrowRight, ArrowSelect, CalendarIcon } from "../../svgs/svgs";

interface DateSelectorProps {
  onDateChange: (start: string, end: string) => void;
}

const CustomDateSelector: React.FC<DateSelectorProps> = ({ onDateChange }) => {
   const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
      start: null,
      end: null,
   });
   const [isOpen, setIsOpen] = useState(false);
   const [currentMonth, setCurrentMonth] = useState(new Date());
   const popoverRef = useRef<HTMLDivElement>(null);
   const triggerRef = useRef<HTMLDivElement>(null);

   const toggleCalendar = () => setIsOpen((prev) => !prev);

   const closeCalendar = (e: MouseEvent) => {
      if (
         popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
         triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
         setIsOpen(false);
      }
   };

   useEffect(() => {
      if (isOpen) {
         document.addEventListener("mousedown", closeCalendar);
      } else {
         document.removeEventListener("mousedown", closeCalendar);
      }
      return () => document.removeEventListener("mousedown", closeCalendar);
   }, [isOpen]);

   const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();

   const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

   const handleDateClick = (date: Date) => {
      if (!selectedDates.start) {
         const newDates = { start: date, end: null };
         setSelectedDates(newDates);
         onDateChange(date.toISOString().split('T')[0], '');
      } else if (!selectedDates.end) {
         if (date.getTime() === selectedDates.start.getTime()) {
            setSelectedDates({ start: null, end: null });
            onDateChange('', '');
         } else {
            const newDates = date > selectedDates.start 
               ? { start: selectedDates.start, end: date }
               : { start: date, end: selectedDates.start };
            setSelectedDates(newDates);
            onDateChange(
               newDates.start.toISOString().split('T')[0],
               newDates.end.toISOString().split('T')[0]
            );
         }
      } else {
         const newDates = { start: date, end: null };
         setSelectedDates(newDates);
         onDateChange(date.toISOString().split('T')[0], '');
      }
   };

   const renderDays = () => {
      const days = [];
      const totalDays = daysInMonth(currentMonth.getMonth(), currentMonth.getFullYear());
      const blanks = startOfMonth;

      for (let i = 0; i < blanks; i++) {
         days.push(<div key={`blank-${i}`} className={styles.blank}></div>);
      }

      for (let i = 1; i <= totalDays; i++) {
         const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
         const isStart = selectedDates.start && currentDate.toDateString() === selectedDates.start.toDateString();
         const isEnd = selectedDates.end && currentDate.toDateString() === selectedDates.end.toDateString();
         const isSelected = isStart || isEnd;
         const isInRange =
            selectedDates.start &&
            selectedDates.end &&
            currentDate > selectedDates.start &&
            currentDate < selectedDates.end;

         days.push(
            <div
               key={i}
               className={`${styles.day}
                        ${isSelected ? styles.selected : ""}
                        ${isInRange ? styles.inRange : ""}
                        ${isStart ? styles.firstSelected : ""}
                        ${isEnd ? styles.lastSelected : ""}`}
               onClick={() => handleDateClick(currentDate)}
            >
               {i}
            </div>
         );
      }

      return days;
   };

   const changeMonth = (direction: number) => {
      setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
   };

   const formatDateForDisplay = (date: Date) => {
      return date.toLocaleDateString('ru-RU', { 
         day: '2-digit',
         month: '2-digit',
         year: '2-digit'
      });
   };

   return (
      <div className={styles.dateSelector}>
         <div className={`${styles.trigger} ${isOpen ? styles.active : ''}`} onClick={toggleCalendar} ref={triggerRef}>
            <div className={styles.icon}><CalendarIcon /></div>
            <p className={styles.label}>
               {selectedDates.start 
                  ? selectedDates.end
                     ? `${formatDateForDisplay(selectedDates.start)} - ${formatDateForDisplay(selectedDates.end)}`
                     : formatDateForDisplay(selectedDates.start)
                  : 'По дате'}
            </p>
            <div className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>
              <ArrowSelect />
            </div>
         </div>
         <div className={`${styles.popover} ${isOpen ? styles.active : ""}`} ref={popoverRef}>
            <div className={styles.header}>
               <span>
                  {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
               </span>
               <div>
                  <button onClick={() => changeMonth(-1)}><ArrowLeft /></button>
                  <button onClick={() => changeMonth(1)}><ArrowRight /></button>
               </div>
            </div>
            <div className={styles.days}>
               <div className={styles.dayLabel}>S</div>
               <div className={styles.dayLabel}>M</div>
               <div className={styles.dayLabel}>T</div>
               <div className={styles.dayLabel}>W</div>
               <div className={styles.dayLabel}>T</div>
               <div className={styles.dayLabel}>F</div>
               <div className={styles.dayLabel}>S</div>
               {renderDays()}
            </div>
         </div>
      </div>
   );
};

export default CustomDateSelector;
