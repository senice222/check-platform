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
import { useSelector, useDispatch } from 'react-redux';
import { fetchSelectors } from '../../store/slices/selectorsSlice';
import { RootState, AppDispatch } from '../../store/store';

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
  hideCompanyFilter?: boolean;
  hideCompanyFilterDisplay?: boolean;
  useMobileView?: boolean;
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
  hideStatusFilter = false,
  hideCompanyFilter = false,
  hideCompanyFilterDisplay = false,
  useMobileView = false
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { companies, sellers, users, isLoading } = useSelector((state: RootState) => state.selectors);

  // Загружаем селекторы только один раз при монтировании
  useEffect(() => {
    if (!companies.length && !sellers.length && !users.length) {
      dispatch(fetchSelectors());
    }
  }, [dispatch, companies.length, sellers.length, users.length]);

  const isMobile = useMobileView || className?.includes('mobileView');

  // Состояния для фильтров
  const [sumFilter, setSumFilter] = useState<{ from: string; to: string } | undefined>();
  const [dateFilter, setDateFilter] = useState<string>('');

  // Мемоизируем опции селектов
  const selectOptions = useMemo(() => ({
    client: users.map(user => ({
      id: user.id,
      label: user.name,
      checked: filters?.users?.some(u => u.id === user.id) || false
    })),
    company: companies.map(company => ({
      id: company.id,
      label: company.name,
      checked: filters?.companies?.includes(company.id) || false
    })),
    seller: sellers.map(seller => ({
      id: seller.id,
      label: seller.name,
      checked: filters?.sellers?.includes(seller.id) || false
    })),
    status: getAllStatuses().map(status => ({
      id: status,
      label: STATUS_LABELS[status],
      checked: filters?.statuses?.includes(status) || false
    }))
  }), [users, companies, sellers, filters]);

  const handleOptionChange = (key: keyof SelectOptions, newOptions: Array<{ id: string; label: string; checked: boolean }>) => {
    // console.log('SelectGroup handleOptionChange:', key, newOptions);
    
    if (isMobile && onFiltersChange && filters) {
      const updatedFilters = {
        ...filters,
        users: key === 'client' 
          ? newOptions.filter(opt => opt.checked).map(opt => ({ id: opt.id, name: opt.label }))
          : filters.users,
        companies: key === 'company' 
          ? newOptions.filter(opt => opt.checked).map(opt => opt.id) 
          : filters.companies,
        sellers: key === 'seller' 
          ? newOptions.filter(opt => opt.checked).map(opt => opt.id) 
          : filters.sellers,
        status: key === 'status' 
          ? newOptions.filter(opt => opt.checked).map(opt => opt.id).join(',')
          : filters.status,
        statuses: key === 'status'
          ? newOptions.filter(opt => opt.checked).map(opt => opt.id) as ApplicationStatus[]
          : filters.statuses
      };
      
      // console.log('SelectGroup updating filters:', updatedFilters);
      onFiltersChange(updatedFilters);
    } else if (onFilterChange) {
      // Для десктопной версии
      const desktopFilters = {
        clients: key === 'client' 
          ? newOptions.filter(opt => opt.checked).map(opt => opt.id)
          : selectOptions.client.filter(opt => opt.checked).map(opt => opt.id),
        companies: key === 'company' 
          ? newOptions.filter(opt => opt.checked).map(opt => opt.id)
          : selectOptions.company.filter(opt => opt.checked).map(opt => opt.id),
        sellers: key === 'seller' 
          ? newOptions.filter(opt => opt.checked).map(opt => opt.id)
          : selectOptions.seller.filter(opt => opt.checked).map(opt => opt.id),
        statuses: key === 'status' 
          ? newOptions.filter(opt => opt.checked).map(opt => opt.id) as ApplicationStatus[]
          : selectOptions.status.filter(opt => opt.checked).map(opt => opt.id) as ApplicationStatus[],
        sum: sumFilter
      };

      onFilterChange(desktopFilters);
    }
  };

  const handleSumFilterApply = (from: string, to: string) => {
    // console.log('Sum filter values:', { from, to });
    
    const newSumFilter = from || to ? { from, to } : undefined;
    setSumFilter(newSumFilter);
    
    const newFilters: Filters = {
        clients: selectOptions.client.filter(opt => opt.checked).map(opt => opt.id),
        companies: selectOptions.company.filter(opt => opt.checked).map(opt => opt.id),
        sellers: selectOptions.seller.filter(opt => opt.checked).map(opt => opt.id),
        statuses: selectOptions.status.filter(opt => opt.checked).map(opt => opt.id) as ApplicationStatus[],
        sum: newSumFilter
    };

    if (isMobile && onFiltersChange && filters) {
        onFiltersChange({
            ...filters,
            users: newFilters.clients.map(id => {
                const client = initialData?.find(item => item.user._id === id)?.client;
                return client ? { id: client.id, name: client.name } : { id, name: id };
            }),
            status: newFilters.statuses.length === 1 ? newFilters.statuses[0] as ApplicationStatus : '',
            sum: newSumFilter
        });
    } else if (onFilterChange) {
        onFilterChange(newFilters);
    }
  };

  const handleDateChange = (start: string, end: string) => {
    setDateFilter(start && end ? `${start} – ${end}` : '');
    onDateChange(start, end);
  };

  const handleRemoveDateFilter = () => {
    setDateFilter('');
    onDateChange('', '');
  };

  const handleRemoveFilter = (type: string) => {
    // Формируем новые фильтры в зависимости от типа
    const newFilters = {
      clients: type === 'client' ? [] : selectOptions.client.filter(opt => opt.checked).map(opt => opt.id),
      companies: type === 'company' ? [] : selectOptions.company.filter(opt => opt.checked).map(opt => opt.id),
      sellers: type === 'seller' ? [] : selectOptions.seller.filter(opt => opt.checked).map(opt => opt.id),
      statuses: type === 'status' ? [] : selectOptions.status.filter(opt => opt.checked).map(opt => opt.id) as ApplicationStatus[],
      sum: type === 'sum' ? undefined : sumFilter
    };

    // Если это фильтр суммы, обновляем состояние суммы
    if (type === 'sum') {
      setSumFilter(undefined);
    }

    if (isMobile && onFiltersChange && filters) {
      // console.log('filters231', filters.users);
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

  const options: Option[] = useMemo(() => {
    const allOptions = [
      !hideClientFilter && {
        key: 'client',
        type: isMobile ? 'mobile' : 'multiple',
        icon: <User />,
        label: 'Клиент',
        options: selectOptions.client
      },
      !hideCompanyFilter && !hideCompanyFilterDisplay && {
        key: 'company',
        type: isMobile ? 'mobile-company' : 'company',
        icon: <Company />,
        label: 'Компания',
        options: selectOptions.company
      },
      {
        key: 'seller',
        type: isMobile ? 'mobile' : 'multiple',
        icon: <Seller />,
        label: 'Продавец',
        options: selectOptions.seller
      },
      !hideStatusFilter && {
        key: 'status',
        type: isMobile ? 'mobile-status' : 'status',
        icon: <Flag />,
        label: 'Статус',
        options: selectOptions.status
      }
    ].filter(Boolean) as Option[];

    return allOptions;
  }, [selectOptions, hideClientFilter, hideStatusFilter, hideCompanyFilter, hideCompanyFilterDisplay, isMobile]);

  return (
    <div className={`${styles.filterContainer} ${className || ''}`}>
      <div className={styles.selectGroup}>
        {!isMobile && (
          <DateSelector
            onDateChange={handleDateChange}
            defaultStartDate={filters.date?.start}
            defaultEndDate={filters.date?.end}
            type={isMobile ? 'mobile' : undefined}
          />
        )}
        {!isLoading && options.map((option) => (
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
          hideCompanyFilterDisplay={hideCompanyFilterDisplay}
        />
      )}
    </div>
  );
};

export default SelectGroup;
