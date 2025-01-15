import React, { useState, useEffect, memo } from 'react';
import styles from './access-table.module.scss';
import { TableIcon, CardIcon, SearchIcon } from '../../svgs/svgs';
import SearchBottomSheet from '../../modals/search-bottom-sheet/search-bottom-sheet';
import { DetailedAvatar } from '../../svgs/svgs';
import RowMenu from '../../ui/row-menu/row-menu';

interface AccessTableProps {
  data: Array<{
    id: string | number;
    name: string;
    login: string;
    password: string;
    registrationDate: string;
  }>;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  getRowMenuOptions: (row: any) => Array<{
    id: string;
    label: string;
    onClick: () => void;
    color?: string;
  }>;
}

interface TableRowProps {
  item: {
    id: string | number;
    name: string;
    login: string;
    password: string;
    registrationDate: string;
  };
  getRowMenuOptions: (row: any) => Array<{
    id: string;
    label: string;
    onClick: () => void;
    color?: string;
  }>;
}

const TableRow = memo(({ item, getRowMenuOptions }: TableRowProps) => {
  return (
    <tr>
      <td>
        <div className={styles.userCell}>
          <DetailedAvatar />
          <div className={styles.userInfo}>
            <span className={styles.userName}>{item.name}</span>
            <span className={styles.userLogin}>{item.login}</span>
          </div>
        </div>
      </td>
      <td>{item.registrationDate}</td>
      <td>
        <RowMenu options={getRowMenuOptions(item)} />
      </td>
    </tr>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.item.name === nextProps.item.name &&
    prevProps.item.login === nextProps.item.login &&
    prevProps.item.registrationDate === nextProps.item.registrationDate
  );
});

const CardItem = memo(({ item, getRowMenuOptions }: TableRowProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.userInfo}>
          <DetailedAvatar />
          <div className={styles.userDetails}>
            <span className={styles.userName}>{item.name}</span>
            <span className={styles.userLogin}>{item.login}</span>
          </div>
        </div>
        <div className={styles.cardActions}>
          <RowMenu options={getRowMenuOptions(item)} />
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Дата регистрации:</span>
          <span className={styles.value}>{item.registrationDate}</span>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.item.name === nextProps.item.name &&
    prevProps.item.login === nextProps.item.login &&
    prevProps.item.registrationDate === nextProps.item.registrationDate
  );
});

const AccessTable: React.FC<AccessTableProps> = memo(({ data, searchQuery, onSearchChange, getRowMenuOptions }) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderCard = (item: typeof data[0]) => (
    <div className={styles.card} key={item.id}>
      <div className={styles.cardHeader}>
        <div className={styles.userInfo}>
          <DetailedAvatar />
          <div className={styles.userDetails}>
            <span className={styles.userName}>{item.name}</span>
            <span className={styles.userLogin}>{item.login}</span>
          </div>
        </div>
        <div className={styles.cardActions}>
          <RowMenu options={getRowMenuOptions(item)} />
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Дата регистрации:</span>
          <span className={styles.value}>{item.registrationDate}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isMobile && (
        <div className={styles.mobileControls}>
          <div className={styles.leftControls}>
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
              placeholder="Поиск"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}

        <table className={styles.table} data-view-mode={viewMode}>
          <thead>
            <tr>
              <th style={{ width: '90%' }}>Пользователь</th>
              <th>Дата регистрации</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <TableRow 
                key={item.id} 
                item={item} 
                getRowMenuOptions={getRowMenuOptions}
              />
            ))}
          </tbody>
        </table>

        <div className={styles.cardsContainer} data-view-mode={viewMode}>
          {data.map((item) => (
            <CardItem 
              key={item.id} 
              item={item} 
              getRowMenuOptions={getRowMenuOptions}
            />
          ))}
        </div>
      </div>

      <SearchBottomSheet
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        data={data}
        renderCard={renderCard}
        filterFunction={(item, query) => 
          item.name.toLowerCase().includes(query.toLowerCase())
        }
        emptyStateText={{
          title: 'Это поиск пользователей',
          description: 'Здесь можно искать пользователей по имени',
          searchTitle: 'Пользователи не найдены',
          searchDescription: 'Пользователей с таким именем нет. Проверьте ваш запрос.'
        }}
      />
    </>
  );
});

export default AccessTable; 