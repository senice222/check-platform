import styles from './select-group.module.scss'
import Select from '../ui/select/select';
import { Company, Dollar, Flag, Seller, User } from '../svgs/svgs';
import DateSelector from '../ui/date-selector/date-selector';
import { useState, useEffect, useMemo } from 'react';
import { TableData } from '../active-applications/active-applications';
import SumSelect from '../ui/sum-select/sum-select';
import AppliedFilters from '../ui/applied-filters/applied-filters';
import { ApplicationStatus, getAllStatuses, STATUS_LABELS } from '../../constants/statuses';
import { FilterState } from '../../types/filter-state';

interface Filters {
  clients: string[];
  companies: string[];
  sellers: string[];
  statuses: ApplicationStatus[];
  sum?: { from: string; to: string };
}

interface SelectGroupProps {
  onDateChange: (start: string, end: string) => void;
  className?: string;
  data?: TableData[];
  initialData?: TableData[];
  onFilterChange?: (filters: Filters) => void;
  filters?: FilterState;
  onFiltersChange?: (filters: FilterState) => void;
  hideClientFilter?: boolean;
  hideStatusFilter?: boolean;
}

interface SelectOption {
  id: string;
  label: string;
  checked: boolean;
}

interface SelectOptions {
  client: SelectOption[];
  company: SelectOption[];
  seller: SelectOption[];
  status: SelectOption[];
}

interface Option {
  key: 'client' | 'company' | 'seller' | 'status';
  type: string;
  icon: JSX.Element;
  label: string;
  options: SelectOption[];
}

const SelectGroup: React.FC<SelectGroupProps> = ({ 
  onDateChange, 
  data, 
  initialData, 
  onFilterChange,
  filters,
  onFiltersChange,
  className,
  hideClientFilter = false,
  hideStatusFilter = false
}) => {
  const isMobile = className?.includes('mobileView');

  // Состояния для фильтров
  const [sumFilter, setSumFilter] = useState<{ from: string; to: string } | undefined>();
  const [dateFilter, setDateFilter] = useState<string>('');

  // Получаем все уникальные значения из исходных данных
  const allUniqueValues = useMemo(() => {
    if (!initialData?.length) {
      return {
        clients: [],
        companies: [],
        sellers: [],
        statuses: []
      };
    }

    return {
      clients: Array.from(new Set(initialData.map(item => ({ 
        id: item.client.id, 
        name: item.client.name 
      })))),
      companies: Array.from(new Set(initialData.map(item => item.company))),
      sellers: Array.from(new Set(initialData.map(item => item.seller))),
      statuses: Array.from(new Set(initialData.map(item => item.status)))
    };
  }, [initialData]);

  // Инициализируем состояние опций с учетом всех возможых значений из initialData
  const [selectOptions, setSelectOptions] = useState<SelectOptions>(() => {
    const mobileFilters = filters as FilterState | undefined;
    
    return {
      client: allUniqueValues.clients.map(client => ({
        id: client.id,
        label: client.name,
        checked: mobileFilters?.users?.some(user => user.id === client.id) || false
      })),
      company: allUniqueValues.companies.map(name => ({
        id: name,
        label: name,
        checked: mobileFilters?.companies?.includes(name) || false
      })),
      seller: allUniqueValues.sellers.map(name => ({
        id: name,
        label: name,
        checked: mobileFilters?.sellers?.includes(name) || false
      })),
      status: getAllStatuses().map(status => ({
        id: status,
        label: STATUS_LABELS[status],
        checked: mobileFilters?.status?.split(',').includes(status) || false
      }))
    };
  });

  // Обновляем опции при изменении фильтров, сохраняя все возможные значения
  useEffect(() => {
    if (!initialData?.length) return;

    const mobileFilters = filters as FilterState | undefined;
    
    setSelectOptions(prev => ({
      ...prev,
      client: allUniqueValues.clients.map(client => ({
        id: client.id,
        label: client.name,
        checked: mobileFilters?.users?.some(user => user.id === client.id) || 
                prev.client.find(opt => opt.id === client.id)?.checked || 
                false
      })),
      company: allUniqueValues.companies.map(name => ({
        id: name,
        label: name,
        checked: mobileFilters?.companies?.includes(name) || 
                prev.company.find(opt => opt.id === name)?.checked || 
                false
      })),
      seller: allUniqueValues.sellers.map(name => ({
        id: name,
        label: name,
        checked: mobileFilters?.sellers?.includes(name) || 
                prev.seller.find(opt => opt.id === name)?.checked || 
                false
      })),
      status: getAllStatuses().map(status => ({
        id: status,
        label: STATUS_LABELS[status],
        checked: mobileFilters?.status?.split(',').includes(status) || 
                prev.status.find(opt => opt.id === status)?.checked || 
                false
      }))
    }));
  }, [filters, initialData, allUniqueValues]);

  const handleOptionChange = (key: keyof SelectOptions, newOptions: Array<{ id: string; label: string; checked: boolean }>) => {
    setSelectOptions(prev => ({
      ...prev,
      [key]: newOptions
    }));

    // Формируем новые фильтры на основе всех текущих опций
    const newFilters = {
      clients: key === 'client' ? newOptions.filter(opt => opt.checked).map(opt => opt.id) : selectOptions.client.filter(opt => opt.checked).map(opt => opt.id),
      companies: key === 'company' ? newOptions.filter(opt => opt.checked).map(opt => opt.id) : selectOptions.company.filter(opt => opt.checked).map(opt => opt.id),
      sellers: key === 'seller' ? newOptions.filter(opt => opt.checked).map(opt => opt.id) : selectOptions.seller.filter(opt => opt.checked).map(opt => opt.id),
      statuses: key === 'status' ? newOptions.filter(opt => opt.checked).map(opt => opt.id) as ApplicationStatus[] : selectOptions.status.filter(opt => opt.checked).map(opt => opt.id) as ApplicationStatus[],
      sum: sumFilter
    };

    if (isMobile && onFiltersChange && filters) {
      onFiltersChange({
        ...filters,
        users: key === 'client' ? newOptions.filter(opt => opt.checked).map(id => {
          const client = initialData?.find(item => item.client.id === id.id)?.client;
          return client ? { id: client.id, name: client.name } : { id: id.id, name: id.id };
        }) : filters.users,
        companies: key === 'company' ? newFilters.companies : filters.companies,
        sellers: key === 'seller' ? newFilters.sellers : filters.sellers,
        status: key === 'status' ? newFilters.statuses.join(',') : filters.status
      });
    } else if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleSumFilterApply = (from: string, to: string) => {
    const newSumFilter = { from, to };
    setSumFilter(newSumFilter);
    
    const newFilters: Filters = {
      clients: selectOptions.client.filter(opt => opt.checked).map(opt => opt.id),
      companies: selectOptions.company.filter(opt => opt.checked).map(opt => opt.id),
      sellers: selectOptions.seller.filter(opt => opt.checked).map(opt => opt.id),
      statuses: selectOptions.status.filter(opt => opt.checked).map(opt => opt.id) as ApplicationStatus[],
      sum: from || to ? newSumFilter : undefined
    };

    if (isMobile && onFiltersChange && filters) {
      onFiltersChange({
        ...filters,
        users: newFilters.clients.map(id => {
          const client = initialData?.find(item => item.client.id === id)?.client;
          return client ? { id: client.id, name: client.name } : { id, name: id };
        }),
        status: newFilters.statuses.length === 1 ? newFilters.statuses[0] as ApplicationStatus : '',
      });
    } else if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleDateChange = (start: string, end: string) => {
    if (isMobile) {
      onDateChange(start, end);
    } else {
      setDateFilter(`${start} – ${end}`);
      onDateChange(start, end);
    }
  };

  const handleRemoveDateFilter = () => {
    setDateFilter('');
    onDateChange('', '');
  };

  const handleRemoveFilter = (type: string) => {
    const newOptions = { ...selectOptions };
    
    // Очищаем только выбранный тип фильтра
    switch(type) {
      case 'client':
        newOptions.client = newOptions.client.map(opt => ({ ...opt, checked: false }));
        break;
      case 'company':
        newOptions.company = newOptions.company.map(opt => ({ ...opt, checked: false }));
        break;
      case 'seller':
        newOptions.seller = newOptions.seller.map(opt => ({ ...opt, checked: false }));
        break;
      case 'status':
        newOptions.status = newOptions.status.map(opt => ({ ...opt, checked: false }));
        break;
      case 'sum':
        setSumFilter(undefined);
        break;
    }

    setSelectOptions(newOptions);
    
    // Формируем новые фильтры, где очищен только выбранный тип
    const newFilters = {
      clients: type === 'client' ? [] : selectOptions.client.filter(opt => opt.checked).map(opt => opt.id),
      companies: type === 'company' ? [] : selectOptions.company.filter(opt => opt.checked).map(opt => opt.id),
      sellers: type === 'seller' ? [] : selectOptions.seller.filter(opt => opt.checked).map(opt => opt.id),
      statuses: type === 'status' ? [] : selectOptions.status.filter(opt => opt.checked).map(opt => opt.id) as ApplicationStatus[],
      sum: type === 'sum' ? undefined : sumFilter
    };

    if (isMobile && onFiltersChange && filters) {
      onFiltersChange({
        ...filters,
        users: type === 'client' ? [] : filters.users,
        companies: type === 'company' ? [] : filters.companies,
        sellers: type === 'seller' ? [] : filters.sellers,
        status: type === 'status' ? '' : filters.status
      });
    } else if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const options = [
    !hideClientFilter && { 
      key: 'client' as const, 
      type: isMobile ? 'mobile-client' : 'client', 
      icon: <User />, 
      label: 'По клиенту', 
      options: selectOptions.client 
    },
    { 
      key: 'company' as const, 
      type: isMobile ? 'mobile-company' : 'company', 
      icon: <Company />, 
      label: 'По компаниям', 
      options: selectOptions.company 
    },
    { 
      key: 'seller' as const, 
      type: isMobile ? 'mobile-seller' : 'seller', 
      icon: <Seller />, 
      label: 'По продавцу', 
      options: selectOptions.seller 
    },
    !hideStatusFilter && { 
      key: 'status' as const, 
      type: isMobile ? 'mobile-status' : 'status', 
      icon: <Flag />, 
      label: 'По статусам', 
      options: selectOptions.status 
    },
  ].filter((option): option is Option => Boolean(option));

  return (
    <div className={`${styles.filterContainer} ${className || ''}`}>
      <div className={styles.selectGroup}>
        {!isMobile && (
          <DateSelector
            onDateChange={handleDateChange}
          />
        )}
        {options.map((option) => (
          <Select
            key={option.key}
            icon={option.icon}
            label={option.label}
            type={option.type}
            options={option.options}
            onOptionChange={(newOptions) => handleOptionChange(option.key, newOptions)}
          />
        ))}
        {!isMobile && <SumSelect onApply={handleSumFilterApply} />}
      </div>
      {!isMobile && (
        <AppliedFilters
          dateFilter={dateFilter}
          clientFilters={selectOptions.client.filter(opt => opt.checked).map(opt => opt.label)}
          companyFilters={selectOptions.company.filter(opt => opt.checked).map(opt => opt.label)}
          sellerFilters={selectOptions.seller.filter(opt => opt.checked).map(opt => opt.label)}
          statusFilters={selectOptions.status.filter(opt => opt.checked).map(opt => opt.label)}
          sumFilter={sumFilter}
          onRemoveFilter={handleRemoveFilter}
          onRemoveDateFilter={handleRemoveDateFilter}
        />
      )}
    </div>
  );
};

export default SelectGroup;
