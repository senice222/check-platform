import React from 'react';
import styles from './applied-filters.module.scss';
import { Cross as Close } from '../../svgs/svgs';
import { ApplicationStatus, STATUS_LABELS } from '../../../constants/statuses';

interface AppliedFiltersProps {
  dateFilter?: string;
  clientFilters: string[];
  companyFilters: string[];
  sellerFilters: string[];
  statusFilters: string[];
  sumFilter?: { from: string; to: string };
  onRemoveFilter: (type: string) => void;
  onRemoveDateFilter?: () => void;
  hideCompanyFilterDisplay?: boolean;
}

const AppliedFilters: React.FC<AppliedFiltersProps> = ({
  dateFilter,
  clientFilters,
  companyFilters,
  sellerFilters,
  statusFilters,
  sumFilter,
  onRemoveFilter,
  onRemoveDateFilter,
  hideCompanyFilterDisplay = false
}) => {
  const truncateText = (text: string, maxLength: number = 15) => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  };

  const formatNumber = (num: string) => {
    return new Intl.NumberFormat('ru-RU').format(Number(num));
  };

  const renderFilterItem = (type: string, values: string[]) => {
    if (type === 'company' && hideCompanyFilterDisplay) return null;
    if (values.length === 0) return null;

    let label = '';
    switch (type) {
      case 'client':
        label = 'По клиенту: ';
        break;
      case 'company':
        label = 'По компании: ';
        break;
      case 'seller':
        label = 'По продавцу: ';
        break;
      case 'status':
        label = 'По статусу: ';
        break;
    }

    const displayText = values.length > 1 
      ? `${values.length} выбрано`
      : type === 'status' 
        ? STATUS_LABELS[values[0] as ApplicationStatus]
        : truncateText(values[0]);

    return (
      <div className={styles.filterItem}>
        <span>{label}{displayText}</span>
        <button onClick={() => onRemoveFilter(type)}>
          <Close />
        </button>
      </div>
    );
  };

  const renderSumFilter = () => {
    if (!sumFilter) return null;
    const { from, to } = sumFilter;

    let displayText = '';
    if (from && to) {
      displayText = `По сумме: от ${formatNumber(from)} до ${formatNumber(to)} ₽`;
    } else if (from) {
      displayText = `По сумме: от ${formatNumber(from)} ₽`;
    } else if (to) {
      displayText = `По сумме: до ${formatNumber(to)} ₽`;
    }

    return (
      <div className={styles.filterItem}>
        <span>{displayText}</span>
        <button onClick={() => onRemoveFilter('sum')}>
          <Close />
        </button>
      </div>
    );
  };

  const renderDateFilter = () => {
    if (!dateFilter) return null;

    const [start, end] = dateFilter.split(' – ');
    let displayText = '';

    if (start && end) {
      displayText = `${start} – ${end}`;
    } else if (start) {
      displayText = `от ${start}`;
    }

    return (
      <div className={styles.filterItem}>
        <span>По дате: {displayText}</span>
        <button onClick={onRemoveDateFilter}>
          <Close />
        </button>
      </div>
    );
  };

  if (!dateFilter && 
      clientFilters.length === 0 && 
      companyFilters.length === 0 && 
      sellerFilters.length === 0 && 
      statusFilters.length === 0 && 
      !sumFilter) return null;

  return (
    <div className={styles.appliedFilters}>
      {renderDateFilter()}
      {renderFilterItem('client', clientFilters)}
      {renderFilterItem('company', companyFilters)}
      {renderFilterItem('seller', sellerFilters)}
      {renderFilterItem('status', statusFilters)}
      {renderSumFilter()}
    </div>
  );
};

export default AppliedFilters; 