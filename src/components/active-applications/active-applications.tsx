import React, { useState, useCallback, useMemo } from 'react';
import styles from './active-applications.module.scss';
import { FilterState } from '../../types/filter-state';
import SelectGroup from '../select-group/select-group';
import FilterBottomSheet from '../modals/filter-bottom-sheet/filter-bottom-sheet';
import ActiveTable from '../tables/active-table/active-table';
import { ApplicationStatus, statusLabels } from '../../constants/statuses';
import AppliedFilters from '../ui/applied-filters/applied-filters';
import { useNavigate } from 'react-router-dom';
import { DownloadSvg } from '../svgs/svgs';
import Button from '../ui/button/button';

export interface TableData {
  id: string;
  statuses: ApplicationStatus[];
  company: string;
  seller: string;
  checksCount: number;
  client: {
    id: string;
    name: string;
    inn: string;
  };
  sum: string;
  date: {
    start: string;
    end: string;
  };
}

const initialData: TableData[] = [
  { 
    id: "#01", 
    statuses: ["created", "issued"],
    company: "ООО Компания 1",
    seller: "Продавец 1",
    checksCount: 5,
    client: {
      id: "1",
      name: "Клиент 1",
      inn: "1234567890"
    },
    sum: "100 000 ₽",
    date: {
      start: "01.12.24",
      end: "31.12.24"
    }
  },
  { 
    id: "#02", 
    statuses: ["client_paid", "us_paid"],
    company: "ООО Компания 2",
    seller: "Продавец 2",
    checksCount: 8,
    client: {
      id: "2",
      name: "Клиент 2",
      inn: "9876543210"
    },
    sum: "150 000 ₽",
    date: {
      start: "02.12.24",
      end: "28.12.24"
    }
  },
  { 
    id: "#03", 
    statuses: ["client_paid"],
    company: "ООО Компания 3",
    seller: "Продавец 1",
    checksCount: 3,
    client: {
      id: "3",
      name: "Клиент 3",
      inn: "5432109876"
    },
    sum: "80 000 ₽",
    date: {
      start: "05.12.24",
      end: "25.12.24"
    }
  },
  { 
    id: "#04", 
    statuses: ["us_paid"],
    company: "ООО Компания 1",
    seller: "Продавец 3",
    checksCount: 12,
    client: {
      id: "4",
      name: "Клиент 4",
      inn: "6789054321"
    },
    sum: "200 000 ₽",
    date: {
      start: "10.12.24",
      end: "20.12.24"
    }
  },
  { 
    id: "#05", 
    statuses: ["created"],
    company: "ООО Компания 4",
    seller: "Продавец 2",
    checksCount: 6,
    client: {
      id: "5",
      name: "Клиент 5",
      inn: "3456789012"
    },
    sum: "120 000 ₽",
    date: {
      start: "15.12.24",
      end: "31.12.24"
    }
  }
];

interface Filters {
  clients: string[];
  companies: string[];
  sellers: string[];
  statuses: ApplicationStatus[];
  sum?: { from: string; to: string };
}

const parseSumToNumber = (sum: string): number => {
  return parseFloat(sum.replace(/[^\d.]/g, ''));
};

interface ActiveApplicationsProps {
  isActiveOnly?: boolean;
}

const ActiveApplications: React.FC<ActiveApplicationsProps> = ({ isActiveOnly = true }) => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    date: { start: '', end: '' },
    users: [],
    status: '',
    companies: [],
    sellers: []
  });
  const [sumRange, setSumRange] = useState<{ from: number | null; to: number | null }>({
    from: null,
    to: null
  });
  console.log(sumRange, 12);
  // console.log(filters, 12);
  const handleDesktopFilterChange = useCallback((filters: Filters) => {
    setFilters(prev => ({
      ...prev,
      users: filters.clients.map((id: string) => {
        const client = initialData.find(item => item.client.id === id)?.client;
        return client ? { id: client.id, name: client.name } : { id, name: id };
      }),
      companies: filters.companies,
      sellers: filters.sellers,
      status: filters.statuses.join(','),
      statuses: filters.statuses
    }));

    if (filters.sum) {
      setSumRange({
        from: filters.sum.from ? parseSumToNumber(filters.sum.from) : null,
        to: filters.sum.to ? parseSumToNumber(filters.sum.to) : null
      });
    } else {
      setSumRange({ from: null, to: null });
    }
  }, [initialData]);

  const filteredByStatusData = useMemo(() => {
    if (!isActiveOnly) return initialData;
    return initialData.filter(item => !item.statuses.includes('us_paid'));
  }, [initialData, isActiveOnly]);

  const filteredData = useMemo(() => {
    let result = [...filteredByStatusData];
    
    // Фильтрация по дате
    if (filters.date?.start || filters.date?.end) {
      result = result.filter(item => {
        // Преобразуем строки дат в объекты Date
        const [startDay, startMonth, startYear] = item.date.start.split('.');
        const [endDay, endMonth, endYear] = item.date.end.split('.');
        
        const itemStart = new Date(
          parseInt(`20${startYear}`), 
          parseInt(startMonth) - 1, 
          parseInt(startDay)
        );
        const itemEnd = new Date(
          parseInt(`20${endYear}`), 
          parseInt(endMonth) - 1, 
          parseInt(endDay)
        );

        // Преобразуем даты фильтра
        const [filterStartDay, filterStartMonth, filterStartYear] = (filters.date?.start || '').split('.');
        const [filterEndDay, filterEndMonth, filterEndYear] = (filters.date?.end || '').split('.');

        const filterStart = filters.date?.start ? new Date(
          parseInt(`20${filterStartYear}`),
          parseInt(filterStartMonth) - 1,
          parseInt(filterStartDay)
        ) : null;

        const filterEnd = filters.date?.end ? new Date(
          parseInt(`20${filterEndYear}`),
          parseInt(filterEndMonth) - 1,
          parseInt(filterEndDay)
        ) : null;

        console.log('Dates comparison:', {
          itemStart,
          itemEnd,
          filterStart,
          filterEnd
        });

        if (filterStart && filterEnd) {
          return itemStart >= filterStart && itemEnd <= filterEnd;
        } else if (filterStart) {
          return itemStart >= filterStart;
        } else if (filterEnd) {
          return itemEnd <= filterEnd;
        }
        return true;
      });
    }

    // Фильтрация по пользователям
    if (filters.users?.length > 0) {
      result = result.filter(item => 
        filters.users.some(user => user.id === item.client.id)
      );
    }

    // Фильтрация по статусам
    if (filters.status) {
      const selectedStatuses = filters.status.split(',').filter(Boolean);
      if (selectedStatuses.length > 0) {
        result = result.filter(item => 
          selectedStatuses.some(status => item.statuses.includes(status as ApplicationStatus))
        );
      }
    }

    // Фильтрация по компаниям
    if (filters.companies && filters.companies.length > 0) {
      result = result.filter(item => filters.companies?.includes(item.company));
    }

    // Фильтрация по проавцам
    if (filters.sellers && filters.sellers.length > 0) {
      result = result.filter(item => filters.sellers?.includes(item.seller));
    }

    // Фильтрация по сумме
    if (sumRange.from !== null || sumRange.to !== null) {
      result = result.filter(item => {
        const itemSum = parseSumToNumber(item.sum);
        if (sumRange.from !== null && sumRange.to !== null) {
          return itemSum >= sumRange.from && itemSum <= sumRange.to;
        } else if (sumRange.from !== null) {
          return itemSum >= sumRange.from;
        } else if (sumRange.to !== null) {
          return itemSum <= sumRange.to;
        }
        return true;
      });
    }

    return result;
  }, [filters, sumRange, filteredByStatusData]);

  const handleDateChange = useCallback((start: string, end: string) => {
    setFilters(prev => ({
      ...prev,
      date: { start, end }
    }));
  }, []);

  const handleSumChange = useCallback((from: number | null, to: number | null) => {
    console.log('handleSumChange called with:', from, to);
    setSumRange({ from, to });
  }, []);

  const handleMobileFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleRemoveFilter = useCallback((type: string) => {
    switch (type) {
      case 'date':
        setFilters(prev => ({
          ...prev,
          date: { start: '', end: '' }
        }));
        handleDateChange('', '');
        break;
      case 'client':
        setFilters(prev => ({
          ...prev,
          users: []
        }));
        handleDesktopFilterChange({
          clients: [],
          companies: filters.companies || [],
          sellers: filters.sellers || [],
          statuses: filters.status ? [filters.status as ApplicationStatus] : [],
          sum: sumRange.from || sumRange.to ? {
            from: sumRange.from?.toString() || '',
            to: sumRange.to?.toString() || ''
          } : undefined
        });
        break;
      case 'status':
        setFilters(prev => ({
          ...prev,
          status: ''
        }));
        handleDesktopFilterChange({
          clients: filters.users.map(user => user.id),
          companies: filters.companies || [],
          sellers: filters.sellers || [],
          statuses: [],
          sum: sumRange.from || sumRange.to ? {
            from: sumRange.from?.toString() || '',
            to: sumRange.to?.toString() || ''
          } : undefined
        });
        break;
      case 'company':
        setFilters(prev => ({
          ...prev,
          companies: []
        }));
        handleDesktopFilterChange({
          clients: filters.users.map(user => user.id),
          companies: [],
          sellers: filters.sellers || [],
          statuses: filters.status ? [filters.status as ApplicationStatus] : [],
          sum: sumRange.from || sumRange.to ? {
            from: sumRange.from?.toString() || '',
            to: sumRange.to?.toString() || ''
          } : undefined
        });
        break;
      case 'seller':
        setFilters(prev => ({
          ...prev,
          sellers: []
        }));
        handleDesktopFilterChange({
          clients: filters.users.map(user => user.id),
          companies: filters.companies || [],
          sellers: [],
          statuses: filters.status ? [filters.status as ApplicationStatus] : [],
          sum: sumRange.from || sumRange.to ? {
            from: sumRange.from?.toString() || '',
            to: sumRange.to?.toString() || ''
          } : undefined
        });
        break;
      case 'sum':
        setSumRange({ from: null, to: null });
        handleDesktopFilterChange({
          clients: filters.users.map(user => user.id),
          companies: filters.companies || [],
          sellers: filters.sellers || [],
          statuses: filters.status ? [filters.status as ApplicationStatus] : [],
          sum: undefined
        });
        break;
    }
  }, [filters, handleDesktopFilterChange, handleDateChange, sumRange]);

  const getAppliedFilters = useMemo(() => {
    return {
      dateFilter: filters.date.start && filters.date.end ? `${filters.date.start} – ${filters.date.end}` : undefined,
      clientFilters: filters.users.map(user => user.name),
      companyFilters: filters.companies || [],
      sellerFilters: filters.sellers || [],
      statusFilters: filters.status ? [filters.status] : [],
      sumFilter: sumRange.from || sumRange.to ? {
        from: sumRange.from?.toString() || '',
        to: sumRange.to?.toString() || ''
      } : undefined,
      onRemoveDateFilter: () => handleRemoveFilter('date')
    };
  }, [filters, sumRange, handleRemoveFilter]);

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
        data={filteredData}
        initialData={initialData}
        onDateChange={handleDateChange}
        onFilterChange={handleDesktopFilterChange}
      />
      <ActiveTable 
        data={filteredData}
        onSumChange={handleSumChange}
        initialData={initialData}
        onDateChange={handleDateChange}
        onFilterChange={handleDesktopFilterChange}
      />
      <div className={styles.mobileFilterContainer}>
        <FilterBottomSheet
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          onFiltersChange={handleMobileFilterChange}
          onDateChange={handleDateChange}
          onSumChange={handleSumChange}
          data={filteredData}
          initialData={initialData}
          sumRange={sumRange}
        />
      </div>
    </div>
  );
};

export default ActiveApplications;
