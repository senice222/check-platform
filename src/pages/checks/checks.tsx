import React, { useState, useCallback, useMemo } from 'react';
import styles from './checks.module.scss';
import { FilterState } from '../../types/filter-state';
import SelectGroup from '../../components/select-group/select-group';
import FilterBottomSheet from '../../components/modals/filter-bottom-sheet/filter-bottom-sheet';
import NewChecksTable from '../../components/tables/checks-table/new-checks-table';
import Button from '../../components/ui/button/button';
import { DownloadSvg } from '../../components/svgs/svgs';
import { ApplicationStatus } from '../../constants/statuses';

interface CheckData {
  id: string;
  date: string;
  company: {
    name: string;
    inn: string;
  };
  seller: {
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

const initialData: CheckData[] = [
  {
    id: "#01",
    date: "25/10/24",
    company: {
      name: "ЗАО 'ТЕХНОЛОГИЯ'",
      inn: "987654321"
    },
    seller: {
      name: "ООО 'Инновации 2023'",
      inn: "123456789",
      isElite: true
    },
    product: "Игровая мышь",
    unit: "шт.",
    quantity: "1.000",
    priceForOne: "91,316.00",
    fullPrice: "91,316.00",
    vat: "91,316.00"
  },
  // Добавим еще данных из скриншота
  {
    id: "#02",
    date: "25/10/24",
    company: {
      name: "ЗАО 'ИННОВАЦИИ'",
      inn: "123456789"
    },
    seller: {
      name: "ООО 'Технологии Будущего'",
      inn: "987654321"
    },
    product: "Экшн-камера",
    unit: "шт.",
    quantity: "1.000",
    priceForOne: "91,316.00",
    fullPrice: "91,316.00",
    vat: "91,316.00"
  },
  // ... добавим остальные данные из скриншота
];

interface Filters {
  companies: string[];
  sellers: string[];
  sum?: { from: string; to: string };
  date?: { start: string; end: string };
}

const Checks = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    date: { start: '', end: '' },
    users: [], // Оставляем для совместимости с типом
    status: '', // Оставляем для совместимости с типом
    companies: [],
    sellers: []
  });
  const [sumRange, setSumRange] = useState<{ from: number | null; to: number | null }>({
    from: null,
    to: null
  });

  const handleDesktopFilterChange = useCallback((filters: Filters) => {
    setFilters(prev => ({
      ...prev,
      companies: filters.companies,
      sellers: filters.sellers,
    }));

    if (filters.sum) {
      setSumRange({
        from: filters.sum.from ? parseFloat(filters.sum.from) : null,
        to: filters.sum.to ? parseFloat(filters.sum.to) : null
      });
    } else {
      setSumRange({ from: null, to: null });
    }
  }, []);

  const handleDateChange = useCallback((start: string, end: string) => {
    setFilters(prev => ({
      ...prev,
      date: { start, end }
    }));
  }, []);

  const handleSumChange = useCallback((from: number | null, to: number | null) => {
    setSumRange({ from, to });
  }, []);

  const handleMobileFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleExport = () => {
    // Логика экспорта в XLS
    console.log('Exporting to XLS...');
  };

  const adaptedData = useMemo(() => {
    return initialData.map(item => ({
      id: item.id,
      status: 'created' as ApplicationStatus,
      company: item.company.name,
      seller: item.seller.name,
      checksCount: 0,
      client: {
        id: '',
        name: '',
        inn: ''
      },
      sum: item.fullPrice,
      date: {
        start: item.date,
        end: item.date
      }
    }));
  }, [initialData]);

  const filteredData = useMemo(() => {
    let result = [...initialData];
    
    // Фильтрация по дате
    if (filters.date?.start || filters.date?.end) {
      result = result.filter(item => {
        const itemDate = new Date(item.date.split('/').reverse().join('-'));
        const filterStart = filters.date?.start ? new Date(filters.date.start.split('.').reverse().join('-')) : null;
        const filterEnd = filters.date?.end ? new Date(filters.date.end.split('.').reverse().join('-')) : null;

        if (filterStart && filterEnd) {
          return itemDate >= filterStart && itemDate <= filterEnd;
        } else if (filterStart) {
          return itemDate >= filterStart;
        } else if (filterEnd) {
          return itemDate <= filterEnd;
        }
        return true;
      });
    }

    // Фильтрация по компаниям
    if (filters.companies && filters.companies.length > 0) {
      result = result.filter(item => filters.companies?.includes(item.company.name));
    }

    // Фильтрация по продавцам
    if (filters.sellers && filters.sellers.length > 0) {
      result = result.filter(item => filters.sellers?.includes(item.seller.name));
    }

    // Фильтрация по сумме
    if (sumRange.from !== null || sumRange.to !== null) {
      result = result.filter(item => {
        const itemSum = parseFloat(item.fullPrice.replace(/[^\d.]/g, ''));
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
  }, [filters, sumRange, initialData]);

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
        />
      </div>
      <div className={styles.mobileHeader}>
        <h1>Чеки</h1>
      </div>
      <SelectGroup 
        data={adaptedData}
        initialData={adaptedData}
        onDateChange={handleDateChange}
        onFilterChange={handleDesktopFilterChange}
        hideClientFilter={true}
        hideStatusFilter={true}
      />
      <NewChecksTable 
        data={filteredData}
        onFilterOpen={() => setIsFilterOpen(true)} 
      />
      <div className={styles.mobileFilterContainer}>
        <FilterBottomSheet
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          onFiltersChange={handleMobileFilterChange}
          onDateChange={handleDateChange}
          onSumChange={handleSumChange}
          data={adaptedData}
          initialData={adaptedData}
          sumRange={sumRange}
          hideClientFilter={true}
          hideStatusFilter={true}
        />
      </div>
    </div>
  );
};

export default Checks; 