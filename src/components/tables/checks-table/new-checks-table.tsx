import React, { useState, useEffect } from 'react';
import styles from './new-checks-table.module.scss';
import { Calendar, TableIcon, CardIcon, FilterButton, SearchIcon, ExportIcon, DotsIcon } from '../../svgs/svgs';
import RowMenu from '../../ui/row-menu/row-menu';
import { useNavigate } from 'react-router-dom';
import LoadingSlider from '../../ui/loading-slider/loading-slider';
import Pagination from '../../ui/pagination/pagination';

interface CheckData {
  id: string;
  date: string;
  application: {
    id: string;
    company: {
      id: string;
      name: string;
      inn: string;
    } | null;
    seller: {
      id: string;
      name: string;
      inn: string;
      type: 'white' | 'elite';
    } | null;
    user: {
      id: string;
      name: string;
      inn: string;
    } | null;
    totalAmount?: number;
    checksCount?: number;
  } | null;
  product: string;
  unit: string;
  quantity?: number;
  pricePerUnit?: number;
}

interface NewChecksTableProps {
  data: CheckData[];
  onFilterOpen: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (value: boolean) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: 'table' | 'cards';
  setViewMode: (mode: 'table' | 'cards') => void;
  isLoading: boolean;
  onExport: () => void;
  hideCompanyColumn?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  onPageChange?: (page: number) => void;
}

const NewChecksTable: React.FC<NewChecksTableProps> = ({ 
  data, 
  onFilterOpen,
  isSearchOpen,
  setIsSearchOpen,
  searchQuery,
  onSearchChange,
  viewMode,
  setViewMode,
  isLoading,
  onExport,
  hideCompanyColumn,
  pagination,
  onPageChange
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getRowMenuOptions = (item: CheckData) => [
    {
      id: '1',
      label: 'Перейти к заявке',
      onClick: () => navigate(`/admin/application/${item.application?.id}`),
    },
    {
      id: '2',
      label: 'Перейти к компании',
      onClick: () => navigate(`/admin/detailed-company/${item.application?.company?.id}`),
    },
    {
      id: '3',
      label: 'Перейти к клиенту',
      onClick: () => navigate(`/admin/detailed-client/${item.application?.user?.id}`),
    }
  ];

  const renderMobileHeader = () => {
    if (!isMobile) return null;

    return (
      <div className={styles.mobileHeader}>
        <h1>Чеки</h1>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderCard = (item: CheckData, index: number) => {
    const totalPrice = calculateTotalPrice(item);
    const vat = calculateVAT(totalPrice);

    return (
      <div className={styles.card} key={item.id}>
        <div className={styles.cardHeader}>
          <div className={styles.topElement}>
            <div className={styles.leftSide}>
              <span className={styles.cardId}>№{index + 1}</span>
              <span className={styles.date}>{formatDate(item.date)}</span>
            </div>
            <RowMenu options={getRowMenuOptions(item)} variant="card" />
          </div>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.buyerSellerRow}>
            <div className={styles.buyerBlock}>
              <span className={styles.cardLabel}>Покупатель</span>
              <span className={styles.companyName}>
                {item.application?.company?.name || 'Н/Д'}
              </span>
              <span className={styles.inn}>
                ИНН {item.application?.company?.inn || 'Н/Д'}
              </span>
            </div>
            <div className={styles.sellerBlock}>
              <span className={styles.cardLabel}>Продавец</span>
              <span className={`${styles.sellerName} ${
                item.application?.seller?.type === 'elite' ? styles.elite : styles.regular
              }`}>
                {item.application?.seller?.name || 'Н/Д'}
              </span>
              <span className={styles.inn}>
                ИНН {item.application?.seller?.inn || 'Н/Д'}
              </span>
            </div>
          </div>

          <div className={styles.productRow}>
            <span className={styles.productName}>{item.product}</span>
            <div className={styles.quantityBlock}>
              <span className={styles.quantity}>{item.quantity || 0}</span>
              <span className={styles.unit}>{item.unit}</span>
            </div>
          </div>

          <div className={styles.priceRows}>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>Цена за ед. с НДС:</span>
              <span className={styles.priceValue}>{formatPrice(item.pricePerUnit)}</span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>Стоимость с НДС:</span>
              <span className={styles.priceValue}>
                {formatPrice(totalPrice)}
              </span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>НДС 20%:</span>
              <span className={styles.priceValue}>
                {formatPrice(vat)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const calculateTotalPrice = (item: CheckData) => {
    if (!item.quantity || !item.pricePerUnit) return 0;
    return item.quantity * item.pricePerUnit;
  };

  const calculateVAT = (totalPrice: number) => {
    if (!totalPrice) return 0;
    return totalPrice * 0.2;
  };

  const formatPrice = (price: number | undefined) => {
    if (typeof price !== 'number') return '0.00';
    
    return price.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
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
              <th>Дата</th>
              {!hideCompanyColumn && <th>Компания</th>}
              <th>Продавец</th>
              <th>Товар</th>
              <th>Кол-во</th>
              <th>Цена за ед.</th>
              <th>Стоимость</th>
              <th>НДС 20%</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const totalPrice = calculateTotalPrice(item);
              const vat = calculateVAT(totalPrice);
              return (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className={styles.dateContainer}>
                      <Calendar />
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </td>
                  {!hideCompanyColumn && (
                    <td>
                      <div className={styles.companyDiv}>
                        <span className={styles.companyName}>
                          {item.application?.company?.name || 'Н/Д'}
                        </span>
                        <span className={styles.inn}>
                          ИНН {item.application?.company?.inn || 'Н/Д'}
                        </span>
                      </div>
                    </td>
                  )}
                  <td>
                    <div className={styles.companyDiv}>
                      <span className={`${styles.sellerName} ${
                        item.application?.seller?.type === 'elite' ? styles.elite : styles.regular
                      }`}>
                        {item.application?.seller?.name || 'Н/Д'}
                      </span>
                      <span className={styles.inn}>
                        ИНН {item.application?.seller?.inn || 'Н/Д'}
                      </span>
                    </div>
                  </td>
                  <td>{item.product}</td>
                  <td>{item.quantity || 0} {item.unit}</td>
                  <td className={styles.price}>{formatPrice(item.pricePerUnit)}</td>
                  <td className={styles.price}>{formatPrice(totalPrice)}</td>
                  <td className={styles.vat}>{formatPrice(vat)}</td>
                  <td>
                    <RowMenu options={getRowMenuOptions(item)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={styles.cardsContainer} data-view-mode={viewMode}>
          {data.map((item, index) => renderCard(item, index))}
        </div>
      </>
    );
  };

  return (
    <>
      {renderMobileHeader()}
      {isMobile && (
        <div className={styles.mobileControls}>
          <div className={styles.leftControls}>
            <button onClick={onFilterOpen}>
              <FilterButton />
            </button>
            {onExport && <button onClick={onExport}>
              <ExportIcon />
            </button>}
            <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
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
              placeholder="Поиск по чекам"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}
        {renderContent()}
      </div>
      {pagination && onPageChange && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default NewChecksTable; 