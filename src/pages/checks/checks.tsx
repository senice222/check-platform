import React, { useState, useCallback, useEffect } from 'react';
import styles from './checks.module.scss';
import { FilterState } from '../../types/filter-state';
import SelectGroup from '../../components/select-group/select-group';
import FilterBottomSheet from '../../components/modals/filter-bottom-sheet/filter-bottom-sheet';
import NewChecksTable from '../../components/tables/checks-table/new-checks-table';
import Button from '../../components/ui/button/button';
import { DownloadSvg } from '../../components/svgs/svgs';
import SearchBottomSheet from '../../components/modals/search-bottom-sheet/search-bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchChecks } from '../../store/slices/checkSlice';
import Pagination from '../../components/ui/pagination/pagination';
import ExportChecksModal from '../../components/modals/export-checks-modal/export-checks-modal';

interface CheckData {
  id: string;
  date: string;
  company: {
    id: string;
    name: string;
    inn: string;
  };
  seller: {
    id: string;
    name: string;
    inn: string;
    isElite?: boolean;
  };
  product: string;
  unit: string;
  quantity: string;
  priceForOne: string;
  fullPrice: string;
  vat: string;
}

const Checks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { checks, pagination, isLoading } = useSelector((state: RootState) => state.check);
  console.log(checks);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    date: { start: '', end: '' },
    users: [],
    companies: [],
    sellers: [],
    status: '',
    statuses: [],
    sum: { from: '', to: '' },
    search: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isMobile, setIsMobile] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\./g, '/');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const loadChecks = useCallback(() => {
    const apiFilters = {
      companies: filters.companies,
      sellers: filters.sellers,
      dateStart: filters.date.start,
      dateEnd: filters.date.end,
      sumFrom: filters.sum?.from,
      sumTo: filters.sum?.to,
      search: searchQuery
    };

    dispatch(fetchChecks({
      filters: apiFilters,
      pagination: {
        page: pagination.page,
        limit: pagination.limit
      }
    }));
  }, [dispatch, filters, searchQuery, pagination.page, pagination.limit]);

  useEffect(() => {
    loadChecks();
  }, [loadChecks]);

  const handleDesktopFilterChange = useCallback((newFilters: any) => {
    setFilters(prev => ({
      ...prev,
      companies: newFilters.companies,
      sellers: newFilters.sellers,
      sum: newFilters.sum
    }));
  }, []);

  const handleDateChange = useCallback((start: string, end: string) => {
    setFilters(prev => ({
      ...prev,
      date: { start, end }
    }));
  }, []);

  const handleMobileFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handlePageChange = (page: number) => {
    dispatch(fetchChecks({
      filters: {
        companies: filters.companies || [],
        sellers: filters.sellers || [],
        dateStart: filters.date?.start || '',
        dateEnd: filters.date?.end || '',
        sumFrom: filters.sum?.from || '',
        sumTo: filters.sum?.to || '',
        search: searchQuery
      },
      pagination: {
        page,
        limit: 10
      }
    }));
  };

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const renderCard = (check: CheckData, index: number) => (
    <div className={styles.card} key={check.id}>
      <div className={styles.cardBody}>
        <div className={styles.header}>
          <div className={styles.idDate}>
            <span className={styles.id}>№{index + 1}</span>
            <span className={styles.date}>{formatDate(check.date)}</span>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.companyBlock}>
            <span className={styles.label}>Покупатель</span>
            <span className={styles.companyName}>
              {check.application?.company?.name || 'Н/Д'}
            </span>
            <span className={styles.inn}>
              ИНН {check.application?.company?.inn || 'Н/Д'}
            </span>
          </div>
          <div className={styles.sellerBlock}>
            <span className={styles.label}>Продавец</span>
            <span className={styles.sellerName}>
              {check.application?.seller?.name || 'Н/Д'}
            </span>
            <span className={styles.inn}>
              ИНН {check.application?.seller?.inn || 'Н/Д'}
            </span>
          </div>
          <div className={styles.priceBlock}>
            <div className={styles.priceRow}>
              <span className={styles.label}>Сумма:</span>
              <span className={styles.value}>{formatPrice(check.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h2>Чеки</h2>
        <Button
          icon={<DownloadSvg />}
          variant="purple"
          styleLabel={{ fontSize: "14px" }}
          label="Экспортировать в XLS"
          style={{ width: "200px", height: "32px" }}
          onClick={handleExport}
        />
      </div>

      <SelectGroup 
        onDateChange={handleDateChange}
        onFilterChange={handleDesktopFilterChange}
        filters={filters}
        onFiltersChange={handleMobileFilterChange}
        hideClientFilter={true}
        hideStatusFilter={true}
        // className={isMobile ? 'mobileView' : ''}
      />

      <NewChecksTable 
        data={checks}
        onFilterOpen={() => setIsFilterOpen(true)}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isLoading={isLoading}
        onExport={handleExport}
      />

      {!isLoading && pagination && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
        />
      )}

      <FilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={handleMobileFilterChange}
        onDateChange={handleDateChange}
        onSumChange={() => {}}
        hideClientFilter={true}
        hideStatusFilter={true}
      />

      <SearchBottomSheet<CheckData>
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        data={checks}
        renderCard={(item, index) => renderCard(item, index)}
        filterFunction={(item, query) => {
          const searchQuery = query.toLowerCase();
          return (
            (item.application?.company?.name?.toLowerCase().includes(searchQuery) || false) ||
            (item.application?.seller?.name?.toLowerCase().includes(searchQuery) || false) ||
            (item.id?.toLowerCase().includes(searchQuery) || false)
          );
        }}
        emptyStateText={{
          title: 'Это поиск чеков',
          description: 'Здесь можно искать чеки по номеру, компании или продавцу.',
          searchTitle: 'Ничего не найдено',
          searchDescription: 'Чеков с такими параметрами нет. Проверьте ваш запрос.'
        }}
      />

      <ExportChecksModal 
        isOpened={isExportModalOpen}
        setOpen={setIsExportModalOpen}
        data={checks}
        initialData={checks}
      />
    </div>
  );
};

export default Checks; 