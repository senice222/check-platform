import React, { useState, useEffect, useMemo } from 'react';
import styles from "./active-table.module.scss";
import { ClientAvatar, SearchIcon, TableIcon, CardIcon, FilterButton, ExportButton, ClientIcon } from "../../svgs/svgs";
import { TableData } from "../../active-applications/active-applications";
import StatusBadge from "../../ui/status-badge/status-badge";
import { ApplicationStatus, STATUS_LABELS } from "../../../constants/statuses";
import RowMenu from "../../ui/row-menu/row-menu";
import FilterBottomSheet from "../../modals/filter-bottom-sheet/filter-bottom-sheet";
import { FilterState } from '../../../types/filter-state';
import ApplicationsSearchBottomSheet from '../../modals/applications-search-bottom-sheet/applications-search-bottom-sheet';
import { useNavigate } from 'react-router-dom';
//
interface ActiveTableProps {
  data: TableData[];
  initialData: TableData[];
  onDateChange: (start: string, end: string) => void;
  onSumChange: (from: number | null, to: number | null) => void;
  onFilterChange: (filters: {
    clients: string[];
    companies: string[];
    sellers: string[];
    statuses: ApplicationStatus[];
    sum?: { from: string; to: string };
  }) => void;
}

const formatDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split('.');
  return `${day}.${month}.${year.length === 2 ? '20' + year : year}`;
};

const ActiveTable: React.FC<ActiveTableProps> = ({
  data,
  initialData,
  onDateChange,
  onFilterChange,
  onSumChange
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    date: { start: '', end: '' },
    users: [],
    status: '',
  });
  const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    setIsMobile(window.innerWidth <= 600);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

  const getRowMenuOptions = (row: TableData) => [
    {
      id: 'profile',
      label: 'Перейти к заявке',
      onClick: () => console.log('Переход к заявке', row.id)
    },
    {
      id: 'company',
      label: 'Профиль компании',
      onClick: () => console.log('Переход к профилю компании', row.company)
    },
    {
      id: 'client',
      label: 'Профиль клиента',
      onClick: () => console.log('Переход к профилю клиента', row.client.name)
    }
  ];

  const handleFilterApply = (filters: any) => {
    onFilterChange(filters);
    setIsFilterOpen(false);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // Преобразуем мобильные фильтры в десктопный формат
    const desktopFilters = {
      clients: newFilters.users.map(user => user.id),
      companies: newFilters.companies || [],
      sellers: newFilters.sellers || [],
      statuses: newFilters.status ? [newFilters.status as ApplicationStatus] : [],
    };
    onFilterChange(desktopFilters);
  };

  const renderMobileHeader = () => {
    if (!isMobile) return null;

    return (
      null
      // <div className={styles.mobileHeader}>
      //   <div className={styles.mobileSearch}>
      //     {showSearch && (
      //       <input
      //         className={styles.search}
      //         type="text"
      //         placeholder="Поиск по заявкам"
      //         value={searchQuery}
      //         onChange={(e) => setSearchQuery(e.target.value)}
      //       />
      //     )}
      //   </div>
      // </div>
    );
  };

  const renderCard = (row: TableData) => (
    <div onClick={() => navigate(`/admin/application/${213}`)} className={styles.card} key={row.id}>
      <div className={styles.cardHeader}>
        <div className={styles.topElement}>
          <span className={styles.cardId}>{row.id}</span>
          <div className={styles.statuses}>
            {row.statuses.map((status, i) => (
              <StatusBadge key={i} status={status} />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.buyerSellerRow}>
          <div className={styles.buyerBlock}>
            <span className={styles.cardLabel}>Покупатель</span>
            <span className={styles.companyName}>{row.company}</span>
            <span className={styles.inn}>ИНН {row.client.inn}</span>
          </div>
          <div className={styles.sellerBlock}>
            <span className={styles.cardLabel}>Продавец</span>
            <span className={styles.sellerName}>{row.seller}</span>
            <span className={styles.inn}>ИНН {row.client.inn}</span>
          </div>
        </div>
        <div className={styles.dateChecksRow}>
          <span className={styles.date}>{`${formatDate(row.date.start)} → ${formatDate(row.date.end)}`}</span>
          <span className={styles.checksCount}>{row.checksCount} чеков</span>
        </div>
        <div className={styles.userSumRow}>
          <div className={styles.userBlock}>
            <ClientIcon />
            <span className={styles.userName}>{row.client.name}</span>
          </div>
          <div className={styles.sumBlock}>
            <span className={styles.sumLabel}>Сумма:</span>
            <span className={styles.sumValue}>${row.sum}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {renderMobileHeader()}
      {isMobile && (
        <div className={styles.mobileControls}>
          <div className={styles.leftControls}>
            <button onClick={() => setIsFilterOpen(true)}>
              <FilterButton />
            </button>
            <button onClick={() => setShowSearch(!showSearch)}>
              <SearchIcon />
            </button>
          </div>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.toggleButton} ${viewMode === 'table' ? styles.active : ''}`}
              onClick={() => setViewMode('table')}
            >
              <TableIcon />
            </button>
            <button
              className={`${styles.toggleButton} ${viewMode === 'cards' ? styles.active : ''}`}
              onClick={() => setViewMode('cards')}
            >
              <CardIcon />
            </button>
          </div>
        </div>
      )}
      <div className={styles.container} data-view-mode={viewMode}>
        {!isMobile && (
          <div className={styles.searchWrapper}>
            <span className={styles.icon}>
              <SearchIcon />
            </span>
            <input
              className={styles.search}
              type="text"
              placeholder="Поиск по заявкам"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <table className={styles.table} data-view-mode={viewMode}>
          <thead>
            <tr>
              <th>№</th>
              <th>Статус</th>
              <th>Компания</th>
              <th>Продавец</th>
              <th>Чеки</th>
              <th>Клиент</th>
              <th>Сума</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr onClick={() => navigate(`/admin/application/${2141}`)} key={row.id}>
                <td>{row.id}</td>
                <td>
                  <div className={styles.statusContainer}>
                    {row.statuses.map((status, index) => (
                      <StatusBadge
                        key={`${row.id}-${status}-${index}`}
                        status={status}
                      />
                    ))}
                  </div>
                </td>
                <td>
                  <div className={styles.companyDiv}>
                    <span className={styles.companyName}>{row.company}</span>
                    <span className={styles.inn}>ИНН {row.client.inn}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.companyDiv}>
                    <span className={styles.sellerName}>{row.seller}</span>
                    <span className={styles.inn}>ИНН {row.client.inn}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.companyDiv}>
                    <span className={styles.checks}>{`${formatDate(row.date.start)} – ${formatDate(row.date.end)}`}</span>
                    <span className={styles.inn}>{row.checksCount} чеков</span>
                  </div>
                </td>
                <td>
                  <div className={styles.clientDiv}>
                    <ClientAvatar />
                    <span className={styles.clientName}>{row.client.name}</span>
                  </div>
                </td>
                <td className={styles.sum}>{row.sum}</td>
                <td>
                  <RowMenu options={getRowMenuOptions(row)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.cardsContainer} data-view-mode={viewMode}>
          {filteredData.map((row) => renderCard(row))}
        </div>
      </div>

      <FilterBottomSheet
        onSumChange={onSumChange}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={handleFilterChange}
        data={data}
        initialData={initialData}
        onDateChange={onDateChange}
      />

      <ApplicationsSearchBottomSheet
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        applications={data}
      />
    </>
  );
};

export default ActiveTable;
