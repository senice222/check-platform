import styles from './select-group.module.scss'
import Select from '../ui/select/select';
import { Company, Dollar, Flag, Seller, User } from '../svgs/svgs';
import DateSelector from '../ui/date-selector/date-selector';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { TableData } from '../active-applications/active-applications';
import SumSelect from '../ui/sum-select/sum-select';
import AppliedFilters from '../ui/applied-filters/applied-filters';
import { ApplicationStatus } from '../../constants/statuses';

interface SelectGroupProps {
  onDateChange: (start: string, end: string) => void;
  data: TableData[];
  onFilterChange: (filters: {
    clients: string[];
    companies: string[];
    sellers: string[];
    statuses: ApplicationStatus[];
    sum?: { from: string; to: string };
  }) => void;
}

const SelectGroup: React.FC<SelectGroupProps> = ({ onDateChange, data, onFilterChange }) => {
  const [sumFilter, setSumFilter] = useState<{ from: string; to: string } | undefined>();
  const [dateFilter, setDateFilter] = useState<string>('');
  
  // Используем useMemo для уникальных значений
  const uniqueValues = useMemo(() => ({
    clients: [...new Set(data.map(item => item.client.name))],
    companies: [...new Set(data.map(item => item.company))],
    sellers: [...new Set(data.map(item => item.seller))],
    statuses: [...new Set(data.map(item => item.status))]
  }), [data]);

  // Инициализируем состояние только один раз при монтировании
  const [selectOptions, setSelectOptions] = useState(() => ({
    client: uniqueValues.clients.map(name => ({ id: name, label: name, checked: false })),
    company: uniqueValues.companies.map(name => ({ id: name, label: name, checked: false })),
    seller: uniqueValues.sellers.map(name => ({ id: name, label: name, checked: false })),
    status: uniqueValues.statuses.map(name => ({ id: name, label: name, checked: false })),
  }));

  const handleOptionChange = useCallback((key: string, newOptions: Array<{ id: string; label: string; checked: boolean }>) => {
    setSelectOptions(prev => ({
      ...prev,
      [key]: newOptions
    }));

    const selectedOptions = newOptions
      .filter(option => option.checked)
      .map(option => option.id);

    const newFilters = {
      clients: key === 'client' ? selectedOptions : selectOptions.client.filter(o => o.checked).map(o => o.id),
      companies: key === 'company' ? selectedOptions : selectOptions.company.filter(o => o.checked).map(o => o.id),
      sellers: key === 'seller' ? selectedOptions : selectOptions.seller.filter(o => o.checked).map(o => o.id),
      statuses: key === 'status' ? selectedOptions : selectOptions.status.filter(o => o.checked).map(o => o.id) as ApplicationStatus[],
    };

    onFilterChange(newFilters);
  }, [selectOptions, onFilterChange]);

  // Обновляем опции только при изменении uniqueValues
  useEffect(() => {
    const newOptions = {
      client: uniqueValues.clients.map(name => ({ id: name, label: name, checked: false })),
      company: uniqueValues.companies.map(name => ({ id: name, label: name, checked: false })),
      seller: uniqueValues.sellers.map(name => ({ id: name, label: name, checked: false })),
      status: uniqueValues.statuses.map(name => ({ id: name, label: name, checked: false })),
    };

    setSelectOptions(newOptions);
  }, [uniqueValues]);

  const options = useMemo(() => [
    { key: 'client', type: 'client', icon: <User />, label: 'По клиенту', options: selectOptions.client },
    { key: 'company', type: 'company', icon: <Company />, label: 'По компаниям', options: selectOptions.company },
    { key: 'seller', type: 'seller', icon: <Seller />, label: 'По продавцу', options: selectOptions.seller },
    { key: 'status', type: 'status', icon: <Flag />, label: 'По статусам', options: selectOptions.status },
  ], [selectOptions]);

  const handleSumFilterApply = (from: string, to: string) => {
    const newSumFilter = { from, to };
    setSumFilter(newSumFilter);
    
    onFilterChange({
      clients: selectOptions.client.filter(o => o.checked).map(o => o.id),
      companies: selectOptions.company.filter(o => o.checked).map(o => o.id),
      sellers: selectOptions.seller.filter(o => o.checked).map(o => o.id),
      statuses: selectOptions.status.filter(o => o.checked).map(o => o.id) as ApplicationStatus[],
      sum: newSumFilter
    });
  };

  const handleRemoveFilter = (type: string) => {
    const newOptions = { ...selectOptions };
    
    switch(type) {
      case 'client':
        newOptions.client = newOptions.client.map(option => ({ ...option, checked: false }));
        break;
      case 'company':
        newOptions.company = newOptions.company.map(option => ({ ...option, checked: false }));
        break;
      case 'seller':
        newOptions.seller = newOptions.seller.map(option => ({ ...option, checked: false }));
        break;
      case 'status':
        newOptions.status = newOptions.status.map(option => ({ ...option, checked: false }));
        break;
      case 'sum':
        setSumFilter(undefined);
        break;
    }

    setSelectOptions(newOptions);
    
    const newFilters = {
      clients: type === 'client' ? [] : selectOptions.client.filter(o => o.checked).map(o => o.id),
      companies: type === 'company' ? [] : selectOptions.company.filter(o => o.checked).map(o => o.id),
      sellers: type === 'seller' ? [] : selectOptions.seller.filter(o => o.checked).map(o => o.id),
      statuses: type === 'status' ? [] : selectOptions.status.filter(o => o.checked).map(o => o.id) as ApplicationStatus[],
    };

    if (type !== 'sum' && sumFilter) {
      newFilters.sum = sumFilter;
    }

    onFilterChange(newFilters);
  };

  const handleDateChange = (start: string, end: string) => {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const formattedStart = startDate.toLocaleDateString('ru-RU');
      const formattedEnd = endDate.toLocaleDateString('ru-RU');
      setDateFilter(`${formattedStart} – ${formattedEnd}`);
    } else {
      setDateFilter('');
    }
    onDateChange(start, end);
  };

  const handleRemoveDateFilter = () => {
    setDateFilter('');
    onDateChange('', '');
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.selectGroup}>
        <DateSelector onDateChange={handleDateChange} />
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
        <SumSelect onApply={handleSumFilterApply} />
      </div>
      <AppliedFilters
        dateFilter={dateFilter}
        clientFilters={selectOptions.client.filter(o => o.checked).map(o => o.label)}
        companyFilters={selectOptions.company.filter(o => o.checked).map(o => o.label)}
        sellerFilters={selectOptions.seller.filter(o => o.checked).map(o => o.label)}
        statusFilters={selectOptions.status.filter(o => o.checked).map(o => o.label)}
        sumFilter={sumFilter}
        onRemoveFilter={handleRemoveFilter}
        onRemoveDateFilter={handleRemoveDateFilter}
      />
    </div>
  );
};

export default SelectGroup;
