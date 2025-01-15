import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
import s from './companies.module.scss'
import Button from '../../components/ui/button/button'
import { Plus, DetailedAvatar, SearchIcon, TableIcon, CardIcon, ClientAvatar } from '../../components/svgs/svgs'
import { clientsData } from '../../mock/clients'
import RowMenu from '../../components/ui/row-menu/row-menu'
import AddClientModal from '../../components/modals/add-client-modal/add-client-modal';
import ChangeUserInfoModal from '../../components/modals/change-user-info-modal/change-user-info-modal';
import DeleteUserModal from '../../components/modals/delete-user-modal/delete-user-modal';
import SearchBottomSheet from '../../components/modals/search-bottom-sheet/search-bottom-sheet';
import { companiesData } from '../../mock/companies';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchCompanies } from '../../store/slices/companySlice';
import Pagination from '../../components/ui/pagination/pagination';
import { useDebounce } from '../../hooks/useDebounce';
import Loading from '../../components/ui/loading/loading';
import LoadingSlider from '../../components/ui/loading-slider/loading-slider';

const Companies = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { companies, isLoading, pagination } = useAppSelector(state => state.company);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [isChangeUserInfo, setIsChangeUserInfo] = useState(false);
  const [currentUser, setCurrentUser] = useState<typeof clientsData[0] | null>(null);
  const [isDeleteUser, setIsDeleteUser] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isMobile, setIsMobile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const filteredData = companies;
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const debouncedSearch = useDebounce((value: string) => {
    setDebouncedSearchQuery(value);
  }, 300);

  useEffect(() => {
    dispatch(fetchCompanies({
      page: currentPage,
      limit: 10,
      search: debouncedSearchQuery
    }));
  }, [dispatch, currentPage, debouncedSearchQuery]);

  useEffect(() => {
    debouncedSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    setIsMobile(window.innerWidth <= 600);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getRowMenuOptions = (row: Company) => [
    {
      id: 'profile',
      label: 'Профиль компании',
      onClick: () => navigate(`/admin/detailed-company/${row.id}`)
    },
    {
      id: 'applications',
      label: 'Заявки компании',
      onClick: () => navigate(`/admin/detailed-company/${row.id}`)
    }
  ];

  const renderCard = (row: typeof companiesData[0]) => (
    <div  className={s.card} key={row.id}>
      <div className={s.cardBody}>
        <div className={s.header_clients}>
          <div onClick={() => navigate(`/admin/detailed-company/${111}`)} className={s.companyCell}>
            <span className={s.companyName}>{row.name}</span>
            <span className={s.companyInn}>ИНН {row.inn}</span>
          </div>
          <div className={s.cardActions}>
            <RowMenu options={getRowMenuOptions(row)} />
          </div>
        </div>
        <div className={s.cardInfo}>
          <div className={s.top}>
            <div className={s.infoRow}>
              <span className={s.label}>Активных заявок:</span>
              <span className={s.value}>{row.activeApplications}</span>
            </div>
            <div className={s.infoRow}>
              <span className={s.label}>Всего заявок:</span>
              <span className={s.value}>{row.totalApplications}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleMobileSearch = useCallback((value: string) => {
    setSearchQuery(value);
    // setIsSearchOpen(false);
  }, []);

  return (
    <div className={s.clients}>
      <div className={s.clients_header}>
        <h1>Компании</h1>
        {/* <Button
          variant='purple'
          label='Зарегистрировать нового клиента'
          icon={<Plus />}
          onClick={() => setIsCreating(true)}
          style={{ width: '285px', height: '32px' }}
          styleLabel={{ fontSize: '14px' }}
        /> */}
      </div>

      <SearchBottomSheet<typeof companiesData[0]>
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={handleMobileSearch}
        data={companies}
        renderCard={renderCard}
        filterFunction={(item, query) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.inn.toLowerCase().includes(query.toLowerCase())
        }
        emptyStateText={{
          title: 'Это поиск компаний',
          description: 'Здесь можно искать компании по названию или ИНН.',
          searchTitle: 'Ничего не найдено',
          searchDescription: 'Компаний с такими параметрами нет. Проверьте ваш запрос.'
        }}
      />

      <div className={s.tableContainer} data-view-mode={viewMode}>
        {!isMobile && (
          <div className={s.searchWrapper}>
            <span className={s.icon}>
              <SearchIcon />
            </span>
            <input
              className={s.search}
              type="text"
              placeholder="Поиск по названию или ИНН"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        )}

        {isMobile && (
          <div className={s.mobileControls}>
            <div className={s.leftControls}>
              <button onClick={() => setIsSearchOpen(true)}>
                <SearchIcon />
              </button>
            </div>
            <div className={s.viewToggle}>
              <button
                className={`${s.toggleButton} ${viewMode === 'table' ? s.active : ''}`}
                onClick={() => setViewMode('table')}
              >
                <TableIcon />
              </button>
              <button
                className={`${s.toggleButton} ${viewMode === 'cards' ? s.active : ''}`}
                onClick={() => setViewMode('cards')}
              >
                <CardIcon />
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <LoadingSlider />
        ) : (
          <>
            <table className={s.table} data-view-mode={viewMode}>
              <thead>
                <tr>
                  <th style={{ width: '60%' }}>Компания</th>
                  <th>Активных заявок</th>
                  <th>Всего заявок</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <div onClick={() => navigate(`/admin/detailed-company/${row.id}`)} className={s.companyCell}>
                        <span className={s.companyName}>{row.name}</span>
                        <span className={s.companyInn}>ИНН {row.inn}</span>
                      </div>
                    </td>
                    <td>{row.activeApplications}</td>
                    <td>{row.totalApplications}</td>
                    <td>
                      <RowMenu options={getRowMenuOptions(row)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={s.cardsContainer} data-view-mode={viewMode}>
              {filteredData.map(row => renderCard(row))}
            </div>
          </>
        )}
      </div>

      {!isLoading && pagination.pages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.pages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}

export default Companies
