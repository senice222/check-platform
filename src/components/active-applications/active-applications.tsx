import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchApplications } from '../../store/slices/applicationSlice';
import styles from './active-applications.module.scss';
import SelectGroup from '../select-group/select-group';
import ActiveTable from '../tables/active-table/active-table';
import Pagination from '../ui/pagination/pagination';
import { FilterState } from '../../types/filter-state';
import { ApplicationStatus } from '../../constants/statuses';
import Button from '../ui/button/button';
import { DownloadSvg } from '../svgs/svgs';
import { useNavigate } from 'react-router-dom';
import ApplicationsSearchBottomSheet from '../modals/applications-search-bottom-sheet/applications-search-bottom-sheet';
import ExportModal from '../modals/export-modal/export-modal';

interface ActiveApplicationsProps {
  isActiveOnly?: boolean;
}

const ActiveApplications: React.FC<ActiveApplicationsProps> = ({ isActiveOnly = true }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { applications = [], pagination, isLoading } = useSelector((state: RootState) => state.application);
  // console.log(applications);
  const [showSearch, setShowSearch] = useState(false);
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
  
  const [sumRange, setSumRange] = useState<{ from: number | null; to: number | null }>({
    from: null,
    to: null
  });

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const loadApplications = useCallback(() => {
    // console.log('Loading with filters:', filters);

    const apiFilters = {
      clients: filters.users.map(user => user.id),
      companies: filters.companies,
      sellers: filters.sellers,
      statuses: filters.status ? filters.status.split(',').filter(Boolean) : [],
      dateStart: filters.date.start,
      dateEnd: filters.date.end,
      sumFrom: filters.sum?.from || '',
      sumTo: filters.sum?.to || ''
    };

    // console.log('API filters:', apiFilters);

    dispatch(fetchApplications({
      filters: apiFilters,
      pagination: {
        page: pagination.page,
        limit: pagination.limit
      },
      activeOnly: isActiveOnly
    }));
  }, [dispatch, filters, pagination.page, pagination.limit, isActiveOnly]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleDateChange = (start: string, end: string) => {
    // console.log('Date change:', start, end);
    setFilters(prev => ({
      ...prev,
      date: { 
        start: start || '', 
        end: end || '' 
      }
    }));
  };

  const handleFilterChange = useCallback((newFilters: {
    clients: string[];
    companies: string[];
    sellers: string[];
    statuses: ApplicationStatus[];
    sum?: { from: string; to: string };
  }) => {
    setFilters(prev => ({
      ...prev,
      users: newFilters.clients.map(id => ({ id, name: id })),
      companies: newFilters.companies,
      sellers: newFilters.sellers,
      status: newFilters.statuses.join(','),
      statuses: newFilters.statuses,
      sum: newFilters.sum || { from: '', to: '' }
    }));

    const apiFilters = {
      clients: newFilters.clients,
      companies: newFilters.companies,
      sellers: newFilters.sellers,
      statuses: newFilters.statuses,
      dateStart: filters.date.start || undefined,
      dateEnd: filters.date.end || undefined,
      sumFrom: newFilters.sum?.from || undefined,
      sumTo: newFilters.sum?.to || undefined
    };

    dispatch(fetchApplications({
      filters: apiFilters,
      pagination: {
        page: 1,
        limit: 10
      }
    }));
  }, [dispatch, filters.date]);
  console.log(filters, pagination.limit)
  const handleSumChange = (from: number | null, to: number | null) => {
    setFilters(prev => ({
      ...prev,
      sum: {
        from: from?.toString() || '',
        to: to?.toString() || ''
      }
    }));
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchApplications({
      filters: {
        clients: filters.users.map(user => user.id),
        companies: filters.companies,
        sellers: filters.sellers,
        statuses: filters.status ? [filters.status] : [],
        dateStart: filters.date.start,
        dateEnd: filters.date.end,
        sumFrom: filters.sum.from,
        sumTo: filters.sum.to
      },
      pagination: {
        page,
        limit: 10
      }
    }));
  };

  const handleRemoveFilter = (type: string) => {
    switch (type) {
      case 'date':
        setFilters(prev => ({
          ...prev,
          date: { start: '', end: '' }
        }));
        break;
      case 'sum':
        setFilters(prev => ({
          ...prev,
          sum: { from: '', to: '' }
        }));
        break;
      // ... остальные case
    }
  };

  const handleSearchChange = (query: string) => {
    setFilters(prev => ({
      ...prev,
      search: query
    }));
  };

  const handleExport = (type: 'table' | 'text', exportFilters: FilterState) => {
    // Здесь логика экспорта с использованием переданных фильтров
    console.log('Exporting as:', type, 'with filters:', exportFilters);
  };

  // if (isLoading) {
  //   return <div>Загрузка...</div>;
  // }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h2>{isActiveOnly ? 'Активные заявки' : 'Заявки'}</h2>
        <Button
          icon={<DownloadSvg />}
          variant="purple"
          styleLabel={{ fontSize: "14px" }}
          label="Экспортировать в XLS"
          style={{ width: "200px", height: "32px" }}
          onClick={() => setIsExportModalOpen(true)}
        />
      </div>
      <div className={styles.mobileHeader}>
        <h1>{isActiveOnly ? 'Активные заявки' : 'Заявки'}</h1>
      </div>
      <div className={styles.mobileTabsContainer}>
        <button 
          className={`${styles.tabButton} ${isActiveOnly ? styles.active : ''}`}
          onClick={() => navigate('/admin/active-applications')}
        >
          Активные <span className={styles.count}>3</span>
        </button>
        <button 
          className={`${styles.tabButton} ${!isActiveOnly ? styles.active : ''}`}
          onClick={() => navigate('/admin/applications')}
        >
          Все
        </button>
      </div>

      <SelectGroup
        onDateChange={handleDateChange}
        onFilterChange={handleFilterChange}
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      <ActiveTable
        data={applications}
        initialData={applications}
        onDateChange={handleDateChange}
        onFilterChange={handleFilterChange}
        onSumChange={handleSumChange}
        isLoading={isLoading}
        showSearch={showSearch}
        onExport={() => setIsExportModalOpen(true)}
        setShowSearch={setShowSearch}
      />
      
      {!isLoading && pagination && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
        />
      )}

      <ApplicationsSearchBottomSheet
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        searchQuery={filters.search || ''}
        onSearchChange={handleSearchChange}
        applications={applications}
      />

      <ExportModal
        isOpened={isExportModalOpen}
        setOpen={setIsExportModalOpen}
        onExport={handleExport}
        data={applications}
        initialData={applications}
      />
    </div>
  );
};

export default ActiveApplications;
