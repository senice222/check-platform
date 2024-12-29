import React, { useRef, useState, useEffect, useMemo } from 'react';
import styles from './search-bottom-sheet.module.scss';
import { SearchIcon, SearchIcon2 } from '../../svgs/svgs';

interface SearchBottomSheetProps<T> {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  data: T[];
  renderCard: (item: T) => React.ReactNode;
  filterFunction: (item: T, query: string) => boolean;
  emptyStateText?: {
    title?: string;
    description?: string;
    searchTitle?: string;
    searchDescription?: string;
  };
}

const SearchBottomSheet = <T,>({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  data,
  renderCard,
  filterFunction,
  emptyStateText = {
    title: 'Это поиск',
    description: 'Здесь можно искать элементы.',
    searchTitle: 'Ничего не найдено',
    searchDescription: 'Элементов с такими параметрами нет. Проверьте ваш запрос.'
  }
}: SearchBottomSheetProps<T>) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
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
    } else {
      handleClose();
    }
  }, [isOpen]);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleClose = () => {
    setIsClosing(true);
    onClose();
    setIsVisible(false);
    setIsClosing(false);
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

  const handleLocalSearchChange = (value: string) => {
    setLocalSearchQuery(value);
    onSearchChange(value);
  };

  const filteredItems = useMemo(() => {
    return data.filter(item => filterFunction(item, localSearchQuery.toLowerCase()));
  }, [localSearchQuery, data, filterFunction]);

  const renderEmptyState = () => {
    if (!localSearchQuery) {
      return (
        <div className={styles.emptyState}>
          <SearchIcon2 />
          <span>{emptyStateText.title}</span>
          <span className={styles.hint}>{emptyStateText.description}</span>
        </div>
      );
    }

    if (localSearchQuery && filteredItems.length === 0) {
      return (
        <div className={styles.emptyState}>
          <SearchIcon2 />
          <span>{emptyStateText.searchTitle}</span>
          <span className={styles.hint}>{emptyStateText.searchDescription}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`${styles.wrapper} ${isVisible ? styles.visible : ''}`}>
      <div className={`${styles.overlay} ${isVisible ? styles.visible2 : ''}`} onClick={handleClose}>
        <div
          ref={sheetRef}
          className={`${styles.sheet} ${isClosing ? styles.closing : ''}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.header}>
            <div className={styles.dragIndicator} />
            <div className={styles.headerContent}>
              <h2>Поиск</h2>
              <button onClick={handleClose}>Закрыть</button>
            </div>
            <div className={styles.searchWrapper}>
              <span className={styles.icon}>
                <SearchIcon />
              </span>
              <input
                className={styles.search}
                type="text"
                placeholder="Поиск"
                value={localSearchQuery}
                onChange={(e) => handleLocalSearchChange(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className={styles.results}>
            {renderEmptyState()}
            {localSearchQuery && filteredItems.length > 0 && filteredItems.map(renderCard)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBottomSheet; 