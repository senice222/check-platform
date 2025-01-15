import React, { useState, useEffect, useMemo } from 'react';
import styles from "./active-table.module.scss";
import { ClientAvatar, SearchIcon, TableIcon, CardIcon, FilterButton, ExportButton, ClientIcon, ExportIcon } from "../../svgs/svgs";
import { TableData } from "../../active-applications/active-applications";
import StatusBadge from "../../ui/status-badge/status-badge";
import { ApplicationStatus, STATUS_LABELS } from "../../../constants/statuses";
import RowMenu from "../../ui/row-menu/row-menu";
import FilterBottomSheet from "../../modals/filter-bottom-sheet/filter-bottom-sheet";
import { FilterState } from '../../../types/filter-state';
import ApplicationsSearchBottomSheet from '../../modals/applications-search-bottom-sheet/applications-search-bottom-sheet';
import { useNavigate } from 'react-router-dom';
import LoadingSlider from '../../ui/loading-slider/loading-slider';
import ExportModal from '../../modals/export-modal/export-modal';
//
interface ActiveTableProps {
  data: TableData[];
  initialData: TableData[];
  onDateChange: (start: string, end: string) => void;
  onFilterChange: (filters: any) => void;
  onSumChange: (from: number | null, to: number | null) => void;
  isLoading?: boolean;
  onExport?: () => void;
  showSearch?: boolean;
  setShowSearch: (value: boolean) => void;
  hideClientFilter?: boolean;
  hideCompanyFilter?: boolean;
  onMobileFiltersChange?: (filters: FilterState) => void;
  filters?: FilterState;
  hideCompanyColumn?: boolean;
  hideClientColumn?: boolean;
}

interface TableData {
  id?: string;
  status?: ApplicationStatus[];
  company?: {
    id?: string;
    name?: string;
    inn?: string;
  };
  seller?: {
    id?: string;
    name?: string;
    inn?: string;
  };
  user?: {
    id?: string;
    name?: string;
    inn?: string;
  };
  checksCount?: number;
  totalAmount?: number;
  date?: {
    start?: string;
    end?: string;
  };
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';

  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    }).replace(/\./g, '/');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr;
  }
};

const ActiveTable: React.FC<ActiveTableProps> = ({
  data = [],
  initialData = [],
  onDateChange,
  onFilterChange,
  onSumChange,
  isLoading = false,
  showSearch = false,
  setShowSearch,
  hideClientFilter = false,
  hideCompanyFilter = false,
  onMobileFiltersChange,
  onExport,
  filters: externalFilters,
  hideCompanyColumn = false,
  hideClientColumn = false
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>({
    date: { start: '', end: '' },
    users: [],
    status: '',
  });
  const navigate = useNavigate();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  // console.log(data, 22)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    setIsMobile(window.innerWidth <= 600);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const safeData = Array.isArray(data) ? data : [];
  
  const filteredData = useMemo(() => {
    return safeData.filter(item => {
      if (!item) return false;
      
      const searchLower = searchQuery.toLowerCase();
      return (
        (item.id?.toString() || '').toLowerCase().includes(searchLower) ||
        (item.company?.name?.toLowerCase() || '').includes(searchLower) ||
        (item.user?.name?.toLowerCase() || '').includes(searchLower)
      );
    }).map(item => ({
      ...item,
      status: item.status || []
    }));
  }, [safeData, searchQuery]);
  // console.log(filteredData, 222)
  const getRowMenuOptions = (row: TableData) => [
    {
      id: '1',
      label: 'Перейти к клиенту',
      onClick: () => {
        if (row.user?._id) {
          navigate(`/admin/detailed-client/${row.user._id}`);
        }
      },
    },
    {
      id: '2',
      label: 'Перейти к компании',
      onClick: () => {
        if (row.company?.id) {
          navigate(`/admin/detailed-company/${row.company.id}`);
        }
      },
    },
    {
      id: '3',
      label: 'Перейти к чекам',
      onClick: () => {
        if (row.id) {
          navigate(`/admin/detailed-company/${row.company.id}`);
        }
      },
    }
  ];

  const handleFilterApply = (filters: any) => {
    onFilterChange(filters);
    setIsFilterOpen(false);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    if (onMobileFiltersChange) {
      onMobileFiltersChange(newFilters);
      return;
    }

    setLocalFilters(newFilters);
    const desktopFilters = {
      clients: newFilters.users?.map(user => user.id) || [],
      companies: newFilters.companies || [],
      sellers: newFilters.sellers || [],
      statuses: newFilters.statuses || [],
      sum: newFilters.sum
    };

    onFilterChange(desktopFilters);
  };

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
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

  const renderCard = (row: TableData, index: number) => (
    <div onClick={() => navigate(`/admin/application/${row.id}`)} className={styles.card} key={row.id}>
      <div className={styles.cardHeader}>
        <div className={styles.topElement}>
          <div className={styles.left}>
            <span className={styles.cardId}>№{index + 1}</span>
            <div className={styles.statuses}>
              {(row.status || []).map((status, i) => (
                <StatusBadge key={i} status={status} />
              ))}
            </div>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <RowMenu options={getRowMenuOptions(row)} variant="card" />
          </div>
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.buyerSellerRow}>
          <div className={styles.buyerBlock}>
            <span className={styles.cardLabel}>Покупатель</span>
            <span className={styles.companyName}>{row.company?.name || ''}</span>
            <span className={styles.inn}>ИНН {row.user?.inn || ''}</span>
          </div>
          <div className={styles.sellerBlock}>
            <span className={styles.cardLabel}>Продавец</span>
            <span className={styles.sellerName}>{row.seller?.name || ''}</span>
            <span className={styles.inn}>ИНН {row.seller?.inn || ''}</span>
          </div>
        </div>
        <div className={styles.dateChecksRow}>
          <span className={styles.date}>
            {`${formatDate(row.date?.start || '')} → ${formatDate(row.date?.end || '')}`}
          </span>
          <span className={styles.checksCount}>{row.checksCount || 0} чеков</span>
        </div>
        <div className={styles.userSumRow}>
          <div className={styles.userBlock}>
            <ClientIcon />
            <span className={styles.userName}>{row.user?.name || ''}</span>
          </div>
          <div className={styles.sumBlock}>
            <span className={styles.sumLabel}>Сумма:</span>
            <span className={styles.sumValue}>{formatAmount(row.totalAmount || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStatusCell = (statuses: ApplicationStatus[]) => {
    if (!statuses?.length) return null;

    // Показываем все статусы, если их 2 или меньше
    if (statuses.length <= 2) {
      return statuses.map((status, index) => (
        <StatusBadge
          key={`${status}-${index}`}
          status={status}
        />
      ));
    }

    // Если статусов больше 2, показываем первые 2 и счетчик
    return (
      <>
        {statuses.slice(0, 2).map((status, index) => (
          <StatusBadge
            key={`${status}-${index}`}
            status={status}
          />
        ))}
        <div className={`${styles.badge} ${styles.more}`}>
          +{statuses.length - 2}
        </div>
      </>
    );
  };

  const renderContent = () => {
    if (isLoading) {
        return <LoadingSlider />;
    }

    return (
        <>
            <table className={styles.table} data-view-mode={viewMode}>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Статус</th>
                        {!hideCompanyColumn && <th>Компания</th>}
                        <th>Продавец</th>
                        <th>Чеки</th>
                        {!hideClientColumn && <th>Клиент</th>}
                        <th>Сумма</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((row, index) => (
                        <tr 
                            onClick={() => row.id && navigate(`/admin/application/${row.id}`)} 
                            key={row.id || index}
                        >
                            <td>{index + 1}</td>
                            <td>
                                <div className={styles.statusGroup}>
                                    {renderStatusCell(row.status || [])}
                                </div>
                            </td>
                            {!hideCompanyColumn && (
                                <td>
                                    <div className={styles.companyDiv}>
                                        <span className={styles.companyName}>{row.company?.name || ''}</span>
                                        <span className={styles.inn}>ИНН {row.company?.inn || ''}</span>
                                    </div>
                                </td>
                            )}
                            <td>
                                <div className={styles.companyDiv}>
                                    <span className={styles.sellerName}>{row.seller?.name || ''}</span>
                                    <span className={styles.inn}>ИНН {row.seller?.inn || ''}</span>
                                </div>
                            </td>
                            <td>
                                <div className={styles.companyDiv}>
                                    <span className={styles.checks}>
                                        {`${formatDate(row.date?.start || '')} – ${formatDate(row.date?.end || '')}`}
                                    </span>
                                    <span className={styles.inn}>{row.checksCount || 0} чеков</span>
                                </div>
                            </td>
                            {!hideClientColumn && (
                                <td>
                                    <div className={styles.clientDiv}>
                                        <ClientAvatar />
                                        <span className={styles.clientName}>{row.user?.name || ''}</span>
                                    </div>
                                </td>
                            )}
                            <td className={styles.sum}>{formatAmount(row.totalAmount || 0)}</td>
                            <td onClick={(e) => e.stopPropagation()}>
                                <RowMenu options={getRowMenuOptions(row)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.cardsContainer} data-view-mode={viewMode}>
                {filteredData.map((row, index) => renderCard(row, index))}
            </div>
        </>
    );
  };

  const currentFilters = externalFilters || localFilters;

  const handleExport = (type: 'table' | 'text') => {
    console.log('Exporting as:', type);
    // Здесь будет логика экспорта
  };

  return (
    <>
        {renderMobileHeader()}
        {isMobile && (
            <div className={styles.mobileControls}>
                <div className={styles.leftControls}>
                    <button onClick={() => setIsFilterOpen(true)}>
                        <FilterButton />
                    </button>
                    {onExport && <button onClick={onExport}>
                        <ExportIcon />
                    </button>}
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

            {renderContent()}
        </div>

        <FilterBottomSheet
            onSumChange={onSumChange}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={currentFilters}
            onFiltersChange={handleFilterChange}
            data={data}
            initialData={initialData}
            onDateChange={onDateChange}
            hideClientFilter={hideClientFilter}
            hideCompanyFilter={hideCompanyFilter}
        />

        <ApplicationsSearchBottomSheet
            isOpen={showSearch}
            onClose={() => setShowSearch(false)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            applications={data || []}
        />

        <ExportModal
            isOpened={isExportModalOpen}
            setOpen={setIsExportModalOpen}
            onExport={handleExport}
        />
    </>
  );
};

export default ActiveTable;
