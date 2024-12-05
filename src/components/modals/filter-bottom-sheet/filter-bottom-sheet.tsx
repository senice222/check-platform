import React, { useRef, useEffect, useState } from 'react';
import styles from './filter-bottom-sheet.module.scss';
import SelectGroup from '../../select-group/select-group';
import selectStyles from '../../select-group/select-group.module.scss';
import { ApplicationStatus } from '../../../constants/statuses';
import { TableData } from '../../active-applications/active-applications';
import DateSelector from '../../ui/date-selector/date-selector';
import SumRangeFilter from '../../ui/sum-range-filter/sum-range-filter';
import { FilterState } from '../../../types/filter-state';

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onDateChange: (start: string, end: string) => void;
  onSumChange: (from: number | null, to: number | null) => void;
  data?: TableData[];
  initialData?: TableData[];
  sumRange?: { from: number | null; to: number | null };
  hideClientFilter?: boolean;
  hideStatusFilter?: boolean;
}

const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onDateChange,
  onSumChange,
  data,
  initialData,
  sumRange,
  hideClientFilter = false,
  hideStatusFilter = false
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [startY, setStartY] = useState<number>(0);
  const [currentY, setCurrentY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      document.body.style.overflow = 'hidden';
    } else {
      setIsClosing(true);
      document.body.style.overflow = 'unset';
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    document.body.style.overflow = 'unset';
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    if (diff < 0) return;
    
    setCurrentY(diff);
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (currentY > 100) {
      handleClose();
    }
    if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(0)';
    }
    setCurrentY(0);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    onFiltersChange({
      ...filters,
      users: newFilters.users,
      companies: newFilters.companies,
      sellers: newFilters.sellers,
      status: newFilters.status
    });
  };

  return (
    <div className={`${styles.wrapper} ${isVisible ? styles.visible : ''}`}>
      <div className={`${styles.overlay} ${isClosing ? styles.closing : ''}`} onClick={handleClose}>
        <div 
          ref={sheetRef}
          className={`${styles.sheet} ${isClosing ? styles.closing : ''}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.dragIndicator} />
          <div className={styles.header}>
            <h2>Фильтры</h2>
            <button onClick={handleClose}>Готово</button>
          </div>
          <div className={styles.content}>
            <div className={styles.dateSection}>
              <DateSelector 
                onDateChange={onDateChange}
                type="date"
                defaultStartDate={filters?.date?.start}
                defaultEndDate={filters?.date?.end}
              />
            </div>
            <div className={styles.sumSection}>
              <SumRangeFilter 
                label="По сумме"
                onRangeChange={onSumChange}
                isMobile={true}
                defaultFrom={sumRange?.from?.toString()}
                defaultTo={sumRange?.to?.toString()}
              />
            </div>
            <SelectGroup 
              className={selectStyles.mobileView}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onDateChange={onDateChange}
              data={initialData}
              initialData={initialData}
              hideClientFilter={hideClientFilter}
              hideStatusFilter={hideStatusFilter}
            />
            <div className={styles.applyButton}>
              <button onClick={handleClose}>Применить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBottomSheet; 