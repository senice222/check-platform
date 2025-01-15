import React, { useState, useEffect, useMemo } from 'react';
import styles from './sellers-table.module.scss';
import { TableIcon, CardIcon, SearchIcon, FilterButton } from '../../svgs/svgs';
import RowMenu from '../../ui/row-menu/row-menu';
import SearchBottomSheet from '../../modals/search-bottom-sheet/search-bottom-sheet';
import Select from '../../ui/select/select';
import AddSellerModal from '../../modals/add-seller-modal/add-seller-modal';
import { mockData } from '../../../pages/settings/settings';
import Loader from '../../ui/loader/loader';

interface SellerData {
  id: string;
  name: string;
  inn: string;
  type: 'white' | 'elit';
  createdAt: string;
  applicationsCount: number;
  telegram: string;
}

interface SellersTableProps {
  data: SellerData[];
  onFilterOpen: () => void;
  viewMode: 'table' | 'cards';
  setViewMode: (mode: 'table' | 'cards') => void;
  selectedTypes: ('elite' | 'white')[];
  setSelectedTypes: (types: ('elite' | 'white')[]) => void;
  openAddSellerModal: () => void;
  setIsEditing: (isEditing: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  onDeleteSeller: (seller: SellerData) => void;
}

const SellersTable: React.FC<SellersTableProps> = ({
  data,
  onFilterOpen,
  viewMode,
  setViewMode,
  selectedTypes,
  setSelectedTypes,
  openAddSellerModal,
  setIsEditing,
  searchQuery,
  setSearchQuery,
  isLoading,
  onDeleteSeller
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const typeOptions = [
    { id: 'elite', label: 'Элитная', checked: selectedTypes.includes('elite') },
    { id: 'white', label: 'Белая', checked: selectedTypes.includes('white') }
  ];

  const handleTypeChange = (newOptions: { id: string; label: string; checked: boolean }[]) => {
    setSelectedTypes(newOptions.filter(opt => opt.checked).map(opt => opt.id) as ('elite' | 'white')[]);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.inn.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.type);
      
      return matchesSearch && matchesType;
    });
  }, [data, searchQuery, selectedTypes]);

  const getRowMenuOptions = (row: SellerData) => [
    {
      id: 'applications',
      label: 'Заявки с компанией',
      onClick: () => console.log('Заявки с компанией', row.id),
      color: '#14151A'
    },
    {
      id: 'edit',
      label: 'Редактировать компанию',
      onClick: () => {
        setIsEditing(row)
        openAddSellerModal()
      },
      color: '#F48E2F'
    },
    {
      id: 'delete',
      label: 'Удалить компанию',
      onClick: () => onDeleteSeller(row),
      color: '#E6483D'
    }
  ];

  const renderCard = (item: SellerData) => (
    <div className={styles.card} key={item.id}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderLeft}>
          <div className={styles.companyDiv}>
            <span className={`${styles.companyName} ${item.type === 'elite' ? styles.elite : ''}`}>
              {item.name}
            </span>
            <span className={styles.inn}>ИНН {item.inn}</span>
          </div>
        </div>
        <RowMenu options={getRowMenuOptions(item)} />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Тип компании</span>
            <span className={`${styles.typeBadge} ${styles[item.type]}`}>
              {item.type === 'elite' ? 'Элитная' : 'Белая'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Дата добавления</span>
            <span className={styles.value}>{formatDate(item.createdAt)}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Указана в заявках</span>
            <span className={styles.value}>{item.applicationsCount}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSearchCard = (seller: SellerData) => (
    <div key={seller.id} className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderLeft}>
          <div className={styles.companyDiv}>
            <span className={`${styles.companyName} ${seller.type === 'elite' ? styles.elite : ''}`}>
              {seller.name}
            </span>
            <span className={styles.inn}>ИНН {seller.inn}</span>
          </div>
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Тип компании</span>
            <span className={`${styles.typeBadge} ${styles[seller.type]}`}>
              {seller.type === 'elite' ? 'Элитная' : 'Белая'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const filterSearchResults = (seller: SellerData, query: string) => {
    return seller.name.toLowerCase().includes(query) || 
           seller.inn.toLowerCase().includes(query);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
  };

  // if (isLoading) {
  //   return (
  //     <div className={styles.loaderContainer}>
  //       <Loader />
  //     </div>
  //   );
  // }

  return (
    <>
      {isMobile && (
        <div style={{padding: '0 16px'}} className={styles.mobileControls}>
          <div className={styles.leftControls}>
            <button onClick={() => onFilterOpen()}>
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
        {!isMobile && (
          <div className={styles.searchWrapper}>
            <span className={styles.icon}>
              <SearchIcon />
            </span>
            <input
              className={styles.search}
              type="text"
              placeholder="Поиск по продавцам"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
        <table className={styles.table} data-view-mode={viewMode}>
          <colgroup>
            <col style={{width: "65%"}} />
            <col style={{width: "15%"}} />
            <col style={{width: "10%"}} />
            <col style={{width: "10%"}} />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th>Компания</th>
              <th>Тип компании</th>
              <th>Дата добавления</th>
              <th>Указана в заявках</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5}>
                  <div className={styles.loaderContainer}>
                    <Loader />
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className={styles.companyDiv}>
                      <span className={`${styles.companyName} ${item.type === 'elite' ? styles.elite : ''}`}>
                        {item.name}
                      </span>
                      <span className={styles.inn}>ИНН {item.inn}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.typeBadge} ${styles[item.type]}`}>
                      {item.type === 'elite' ? 'Элитная' : 'Белая'}
                    </span>
                  </td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td>{item.applicationsCount}</td>
                  <td>
                    <RowMenu options={getRowMenuOptions(item)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className={styles.cardsContainer} data-view-mode={viewMode}>
          {isLoading ? (
            <div className={styles.loaderContainer}>
              <Loader />
            </div>
          ) : (
            filteredData.map(renderCard)
          )}
        </div>
      </div>

      <SearchBottomSheet
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        data={data}
        renderCard={renderSearchCard}
        filterFunction={filterSearchResults}
        emptyStateText={{
          title: 'Это поиск по продавцам',
          description: 'Здесь можно искать продавцов по названию компании или ИНН',
          searchTitle: 'Продавцы не найдены',
          searchDescription: 'Продавцов с такими параметрами нет. Проверьте ваш запрос.'
        }}
      />
    </>
  );
};

export default SellersTable; 