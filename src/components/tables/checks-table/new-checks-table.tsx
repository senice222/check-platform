import React, { useState, useEffect } from 'react';
import styles from './new-checks-table.module.scss';
import { Calendar, TableIcon, CardIcon, FilterButton, SearchIcon } from '../../svgs/svgs';

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

interface NewChecksTableProps {
  data: CheckData[];
  onFilterOpen: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (value: boolean) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: 'table' | 'cards';
  setViewMode: (mode: 'table' | 'cards') => void;
}

const NewChecksTable: React.FC<NewChecksTableProps> = ({ 
  data, 
  onFilterOpen,
  isSearchOpen,
  setIsSearchOpen,
  searchQuery,
  onSearchChange,
  viewMode,
  setViewMode
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderCard = (item: CheckData) => (
    <div className={styles.card} key={item.id}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderLeft}>
          <span className={styles.cardLabel}>Чек №</span>
          <span className={styles.cardValue}>{item.id}</span>
        </div>
        <div className={styles.cardHeaderRight}>
          <span className={styles.cardLabel}>Дата:</span>
          <span className={styles.cardValue}>{item.date}</span>
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.SellerBuyer}>
          <div className={styles.cardSection}>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Компания:</span>
              <span className={`${styles.cardValue} ${styles.buyer}`}>{item.company.name}</span>
            </div>
            <div className={styles.cardRowINN}>
              <span className={styles.cardLabel}>ИНН</span>
              <span className={styles.cardValue}>{item.company.inn}</span>
            </div>
          </div>
          <div className={styles.cardSection}>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Продавец:</span>
              <span className={`${styles.cardValue} ${styles.sellerName} ${item.seller.isElite ? styles.elite : styles.regular}`}>
                {item.seller.name}
              </span>
            </div>
            <div className={styles.cardRowINN}>
              <span className={styles.cardLabel}>ИНН</span>
              <span className={styles.cardValue}>{item.seller.inn}</span>
            </div>
          </div>
        </div>
        <div className={styles.divEnd}>
          <div className={styles.cardSection}>
            <div className={styles.cardRow2}>
              <span className={styles.cardValue}>{item.product}</span>
              <span className={styles.cardValue}>{item.quantity} {item.unit}</span>
            </div>
          </div>
          <div className={styles.cardSection}>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Цена за ед. с НДС:</span>
              <span className={styles.cardValue}>{item.priceForOne}</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Стоимость с НДС:</span>
              <span className={styles.cardValue}>{item.fullPrice}</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>НДС 20%:</span>
              <span className={styles.cardValue}>{item.vat}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isMobile && (
        <div className={styles.mobileControls}>
          <div className={styles.leftControls}>
            <button onClick={onFilterOpen}>
              <FilterButton />
            </button>
            <button onClick={() => setIsSearchOpen(true)}>
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
        <table className={styles.table} data-view-mode={viewMode}>
          <thead>
            <tr>
              <th>№</th>
              <th>Дата</th>
              <th>Компания</th>
              <th>Продавец</th>
              <th>Товар</th>
              <th>Кол-во</th>
              <th>Цена за ед.</th>
              <th>Стоимость</th>
              <th>НДС 20%</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <div className={styles.dateContainer}>
                    <Calendar />
                    <span>{item.date}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.companyDiv}>
                    <span className={styles.companyName}>{item.company.name}</span>
                    <span className={styles.inn}>ИНН {item.company.inn}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.companyDiv}>
                    <span className={`${styles.sellerName} ${item.seller.isElite ? styles.elite : styles.regular}`}>
                      {item.seller.name}
                    </span>
                    <span className={styles.inn}>ИНН {item.seller.inn}</span>
                  </div>
                </td>
                <td>{item.product}</td>
                <td>{item.quantity} {item.unit}</td>
                <td className={styles.price}>{item.priceForOne}</td>
                <td className={styles.price}>{item.fullPrice}</td>
                <td className={styles.vat}>{item.vat}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.cardsContainer} data-view-mode={viewMode}>
          {data.map(renderCard)}
        </div>
      </div>
    </>
  );
};

export default NewChecksTable; 