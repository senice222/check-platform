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
  data: any[];
  initialData: any[];
  onDateChange: (start: string, end: string) => void;
  onSumChange?: (from: number | null, to: number | null) => void;
  hideClientFilter?: boolean;
  hideCompanyFilter?: boolean;
  hideStatusFilter?: boolean;
}

const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  data,
  initialData,
  onDateChange,
  onSumChange,
  hideClientFilter = false,
  hideCompanyFilter = false,
  hideStatusFilter = false
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [startY, setStartY] = useState<number>(0);
  const [currentY, setCurrentY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterState>({
    date: filters.date || { start: '', end: '' },
    users: filters.users || [],
    companies: filters.companies || [],
    sellers: filters.sellers || [],
    status: filters.status || '',
    statuses: filters.statuses || [],
    sum: filters.sum || { from: '', to: '' },
    search: filters.search || ''
  });
  const [tempDateRange, setTempDateRange] = useState({
    start: filters.date?.start || '',
    end: filters.date?.end || ''
  });
  const [tempSumRange, setTempSumRange] = useState<{ from: number | null; to: number | null }>({
    from: null,
    to: null
  });
  // console.log(isVisible, 'filtersBottomSheet')
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTempFilters({
        date: filters.date || { start: '', end: '' },
        users: filters.users || [],
        companies: filters.companies || [],
        sellers: filters.sellers || [],
        status: filters.status || '',
        statuses: filters.statuses || [],
        sum: filters.sum || { from: '', to: '' },
        search: filters.search || ''
      });
      setTempDateRange({
        start: filters.date?.start || '',
        end: filters.date?.end || ''
      });
      setTempSumRange({
        from: filters.sum?.from ? Number(filters.sum.from) : null,
        to: filters.sum?.to ? Number(filters.sum.to) : null
      });
    }
  }, [isOpen, filters]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  const saveAndClose = () => {
    const updatedFilters = {
      ...tempFilters,
      date: tempDateRange.start || tempDateRange.end ? tempDateRange : { start: '', end: '' },
      sum: tempSumRange.from || tempSumRange.to ? {
        from: tempSumRange.from?.toString() || '',
        to: tempSumRange.to?.toString() || ''
      } : { from: '', to: '' },
      companies: tempFilters.companies || [],
      sellers: tempFilters.sellers || [],
      statuses: tempFilters.statuses || [],
      users: tempFilters.users || []
    };
    
    onFiltersChange(updatedFilters);
    onDateChange(tempDateRange.start, tempDateRange.end);
    if (tempSumRange.from !== null || tempSumRange.to !== null) {
      onSumChange?.(tempSumRange.from, tempSumRange.to);
    }
    handleClose();
  };

  const handleApplyFilters = () => {
    saveAndClose();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(`.${styles.dragArea}`)) {
      return;
    }
    
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
      saveAndClose();
    }
    if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(0)';
    }
    setCurrentY(0);
  };

  const handleTempFiltersChange = (newFilters: FilterState) => {
    console.log('FilterBottomSheet handleTempFiltersChange:', newFilters);
    setTempFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters,
      date: newFilters.date || { start: '', end: '' },
      users: newFilters.users || prevFilters.users,
      companies: newFilters.companies || prevFilters.companies,
      sellers: newFilters.sellers || prevFilters.sellers,
      status: newFilters.status || prevFilters.status,
      statuses: newFilters.statuses || prevFilters.statuses,
    }));

    if (newFilters.date && (!newFilters.date.start && !newFilters.date.end)) {
      setTempDateRange({ start: '', end: '' });
    }
  };

  const handleTempDateChange = (start: string, end: string) => {
    const newDateRange = { start, end };
    setTempDateRange(newDateRange);
    setTempFilters(prev => ({
      ...prev,
      date: newDateRange
    }));
  };

  const handleTempSumChange = (from: number | null, to: number | null) => {
    setTempSumRange({ from, to });
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      date: { start: '', end: '' },
      users: [],
      companies: [],
      sellers: [],
      status: '',
      statuses: [],
      sum: { from: '', to: '' },
      search: ''
    };
    
    setTempFilters(resetFilters);
    setTempDateRange({ start: '', end: '' });
    setTempSumRange({ from: null, to: null });
    onFiltersChange(resetFilters);
    handleClose();
  };

  const handleClearDate = () => {
    setTempDateRange({ start: '', end: '' });
    setTempFilters(prev => ({
      ...prev,
      date: { start: '', end: '' }
    }));
    onDateChange('', '');
  };

  return (
    <div className={`${styles.wrapper} ${isVisible ? styles.visible : ''}`}>
      <div 
        className={`${styles.overlay} ${isVisible ? styles.closing2 : ''}`} 
        onClick={saveAndClose}
      >
        <div 
          ref={sheetRef}
          className={`${styles.sheet} ${isVisible ? styles.closing : ''}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.dragArea}>
            <div className={styles.dragIndicator} />
            <div className={styles.header}>
              <h2>Фильтры</h2>
              <button onClick={saveAndClose}>Закрыть</button>
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.dateSection}>
              <DateSelector 
                onDateChange={handleTempDateChange}
                onClear={handleClearDate}
                type="date"
                defaultStartDate={tempDateRange.start}
                defaultEndDate={tempDateRange.end}
              />
            </div>
            <div className={styles.sumSection}>
              <SumRangeFilter 
                label="По сумме"
                onRangeChange={handleTempSumChange}
                isMobile={true}
                defaultFrom={tempSumRange.from?.toString()}
                defaultTo={tempSumRange.to?.toString()}
              />
            </div>
            <SelectGroup 
              className={selectStyles.mobileView}
              filters={tempFilters}
              onFiltersChange={handleTempFiltersChange}
              onDateChange={handleTempDateChange}
              data={initialData}
              initialData={initialData}
              hideClientFilter={hideClientFilter}
              hideCompanyFilter={hideCompanyFilter}
              hideStatusFilter={hideStatusFilter}
              useMobileView={true}
            />
            <div className={styles.applyButton}>
              <button onClick={handleApplyFilters}>Применить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBottomSheet; 