import React, { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import s from './detailed-company.module.scss'
import PageTitle from '../../components/ui/page-title/page-title'
import ActiveTable from '../../components/tables/active-table/active-table'
import SelectGroup from '../../components/select-group/select-group'
import { FilterState } from '../../types/filter-state'
import Button from '../../components/ui/button/button'
import { DownloadSvg } from '../../components/svgs/svgs'
import NewChecksTable from '../../components/tables/checks-table/new-checks-table'
import ChangeUserInfoModal from '../../components/modals/change-user-info-modal/change-user-info-modal'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchCompanyDetails, fetchCompanyApplications, updateCompany } from '../../store/slices/companySlice'
import { fetchChecks } from '../../store/slices/checkSlice'
import LoadingSlider from '../../components/ui/loading-slider/loading-slider'
import FilterBottomSheet from '../../components/modals/filter-bottom-sheet/filter-bottom-sheet'
import SearchBottomSheet from '../../components/modals/search-bottom-sheet/search-bottom-sheet'
import RowMenu from '../../components/ui/row-menu/row-menu'
import { useNotification } from '../../contexts/NotificationContext/NotificationContext'

const DetailedCompany = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { companyDetails, companyApplications, isLoading, isLoadingApplications } = useAppSelector(state => state.company);
  const { checks, isLoading: isLoadingChecks, pagination: checksPagination } = useAppSelector(state => state.check);
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [checksCurrentPage, setChecksCurrentPage] = useState(1);
  
  const [filters, setFilters] = useState<FilterState>({
    date: { start: '', end: '' },
    clients: [],
    companies: [],
    sellers: [],
    status: '',
    statuses: [] as ApplicationStatus[],
    sum: { from: '', to: '' },
    search: ''
  });

  const [checksFilters, setChecksFilters] = useState<FilterState>({
    date: { start: '', end: '' },
    users: [],
    status: '',
    companies: [],
    sellers: []
  });

  const [applicationSumRange, setApplicationSumRange] = useState<{ from: number | null; to: number | null }>({
    from: null,
    to: null
  });

  const [checksSumRange, setChecksSumRange] = useState<{ from: number | null; to: number | null }>({
    from: null,
    to: null
  });

  const [showSearch, setShowSearch] = useState(false);

  // Добавляем состояния для мобильных фильтров и поиска
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Первая загрузка
  useEffect(() => {
    if (id) {
      // Получаем детали компании
      dispatch(fetchCompanyDetails(id));
      
      // Получаем заявки компании
      dispatch(fetchCompanyApplications({ 
        companyId: id,
        filters: {},
        pagination: { page: 1, limit: 10 }
      }));

      // Получаем чеки компании с начальными фильтрами
      dispatch(fetchChecks({ 
        filters: { 
          companies: [id],
          dateStart: '',
          dateEnd: '',
          sumFrom: '',
          sumTo: ''
        },
        pagination: { 
          page: 1, 
          limit: 10 
        }
      }));

      // Устанавливаем флаг после первой загрузки
      setIsInitialLoad(false);
    }
  }, [id]);

  // Обновление при изменении фильтров
  useEffect(() => {
    // Пропускаем первый рендер
    if (!isInitialLoad && id) {
      dispatch(fetchChecks({ 
        filters: { 
          ...checksFilters,
          companies: [id],
          dateStart: checksFilters.date?.start,
          dateEnd: checksFilters.date?.end,
          sumFrom: checksFilters.sum?.from,
          sumTo: checksFilters.sum?.to
        },
        pagination: { 
          page: checksCurrentPage, 
          limit: 10 
        }
      }));
    }
  }, [id, checksCurrentPage, checksFilters, isInitialLoad]);

  const handleDateChange = useCallback((start: string, end: string) => {
    if (id) {
      // Сначала обновляем локальное состояние
      setFilters(prev => {
        // Создаем обновленные фильтры
        const updatedFilters = {
      ...prev,
      date: { start, end }
        };

        // Формируем API фильтры, используя актуальные данные
        const apiFilters = {
          companies: updatedFilters.companies,
          sellers: updatedFilters.sellers,
          statuses: updatedFilters.statuses,
          clients: updatedFilters.clients.map(client => client.id), // Преобразуем clients для API
          ...(start ? { dateStart: start } : {}),
          ...(end ? { dateEnd: end } : {})
        };

        // Отправляем запрос с обновленными фильтрами
        dispatch(fetchCompanyApplications({
          companyId: id,
          filters: apiFilters,
          pagination: { page: 1, limit: 10 }
        }));

        return updatedFilters;
      });
    }
  }, [dispatch, id]);

  const handleSumChange = useCallback((from: number | null, to: number | null) => {
    if (id) {
      // Обновляем локальное состояние
      setFilters(prev => ({
      ...prev,
        sum: from || to ? { 
          from: from?.toString() || '', 
          to: to?.toString() || '' 
        } : { from: '', to: '' }
      }));

      // Формируем API фильтры
      const apiFilters = {
        companies: filters.companies,
        sellers: filters.sellers,
        statuses: filters.statuses,
        ...(filters.date?.start ? { dateStart: filters.date.start } : {}),
        ...(filters.date?.end ? { dateEnd: filters.date.end } : {}),
        ...(from ? { sumFrom: from.toString() } : {}),
        ...(to ? { sumTo: to.toString() } : {})
      };

      dispatch(fetchCompanyApplications({
        companyId: id,
        filters: apiFilters,
        pagination: { page: 1, limit: 10 }
      }));
    }
  }, [dispatch, id, filters]);
  // console.log('filters', filters);
  const handleMobileFiltersChange = useCallback((updatedFilters: FilterState) => {
    // console.log('DetailedCompany handleMobileFiltersChange:', updatedFilters);
    
    // Обновляем состояние фильтров
    setFilters(prev => ({
      ...prev,
      ...updatedFilters,
      clients: updatedFilters.users ? updatedFilters.users : updatedFilters.clients.map((item) => ({
        _id: item,
        id: item,
        name: item
      })) ,
      users: updatedFilters.users ? updatedFilters.users : updatedFilters.clients.map((item) => ({
        _id: item,
        id: item,
        name: item
      })) , // Меняем users на clients
      date: updatedFilters.date || { start: '', end: '' },
      companies: updatedFilters.companies || [],
      sellers: updatedFilters.sellers || [],
      status: Array.isArray(updatedFilters.statuses) && updatedFilters.statuses.length > 0 
        ? updatedFilters.statuses.join(',') 
        : '',
      statuses: Array.isArray(updatedFilters.statuses) ? updatedFilters.statuses : [],
      sum: updatedFilters.sum || { from: '', to: '' }
    }));

    // Формируем API фильтры
    const apiFilters = {
      dateStart: updatedFilters.date?.start || '',
      dateEnd: updatedFilters.date?.end || '',
      statuses: updatedFilters.statuses || [],
      sellers: updatedFilters.sellers || [],
      clients: updatedFilters.users ? updatedFilters.users.map(user => user.id) : updatedFilters.clients, // Преобразуем users в clients для API
      sumFrom: updatedFilters.sum?.from || '',
      sumTo: updatedFilters.sum?.to || ''
    };

    dispatch(fetchCompanyApplications({
      companyId: id as string,
      filters: apiFilters,
      pagination: {
        page: 1,
        limit: 10
      }
    }));
  }, [dispatch, id]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    
    // Отправляем запрос с обновленной страницей
    dispatch(fetchChecks({
      filters: {
        companies: [id as string],
        sellers: checksFilters.sellers,
        dateStart: checksFilters.date?.start || '',
        dateEnd: checksFilters.date?.end || '',
        sumFrom: checksFilters.sum?.from || '',
        sumTo: checksFilters.sum?.to || ''
      },
      pagination: {
        page,
        limit: pagination.limit
      }
    }));
  };

  // Обновляем setPagination при получении данных из Redux
  useEffect(() => {
    if (checksPagination) {
      setPagination(checksPagination);
    }
  }, [checksPagination]);

  // Обработчик изменения даты для чеков
  const handleChecksDateChange = useCallback((start: string, end: string) => {
    if (id) {
      setChecksFilters(prev => {
        const updatedFilters = {
          ...prev,
          date: { start, end }
        };

        // Отправляем запрос с обновленными фильтрами и сохраненными значениями
        dispatch(fetchChecks({
          filters: {
            companies: [id],
            sellers: updatedFilters.sellers,
            dateStart: start || '',
            dateEnd: end || '',
            sumFrom: updatedFilters.sum?.from || '',
            sumTo: updatedFilters.sum?.to || ''
          },
          pagination: {
            page: 1,
            limit: 10
          }
        }));

        return updatedFilters;
      });
    }
  }, [dispatch, id]);
  // console.log(checksFilters, 'checksFilters')
  // Обработчик изменения фильтров для чеков
  const handleChecksFilterChange = useCallback((updatedFilters: FilterState) => {
    if (id) {
      setChecksFilters(prev => {
        const newFilters = {
          ...prev,
          ...updatedFilters,
          companies: [id],
          date: updatedFilters.date || prev.date,
          sum: updatedFilters.sum || { from: '', to: '' },
          sellers: updatedFilters.sellers || prev.sellers
        };

        dispatch(fetchChecks({
          filters: {
            companies: [id],
            sellers: newFilters.sellers,
            dateStart: newFilters.date?.start || '',
            dateEnd: newFilters.date?.end || '',
            sumFrom: newFilters.sum?.from || '',
            sumTo: newFilters.sum?.to || ''
          },
          pagination: {
            page: 1,
            limit: 10
          }
        }));

        return newFilters;
      });
    }
  }, [dispatch, id]);

  // Обработчик изменения суммы для чеков
  const handleChecksSumChange = useCallback((from: number | null, to: number | null) => {
    if (id) {
      setChecksFilters(prev => {
        const newFilters = {
          ...prev,
          companies: [id],
          sum: { 
            from: from === null ? '' : from.toString(),
            to: to === null ? '' : to.toString()
          }
        };

        dispatch(fetchChecks({
          filters: {
            companies: [id],
            sellers: newFilters.sellers,
            dateStart: newFilters.date?.start || '',
            dateEnd: newFilters.date?.end || '',
            sumFrom: from === null ? '' : from.toString(),
            sumTo: to === null ? '' : to.toString()
          },
          pagination: {
            page: 1,
            limit: 10
          }
        }));

        return newFilters;
      });
    }
  }, [dispatch, id]);

  // Добавляем функцию форматирования цены
  const formatPrice = (price: number | undefined) => {
    if (typeof price !== 'number') return '0.00';
    
    return price.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Добавляем функцию для опций меню
  const getRowMenuOptions = (item: any) => [
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

  // Добавляем функцию для рендера карточки в поиске
  const renderSearchCard = (item: any, index: number) => {
    const totalPrice = item.quantity * item.pricePerUnit;
    const vat = totalPrice * 0.2;

    return (
      <div className={s.card} key={item.id}>
        <div className={s.cardHeader}>
          <div className={s.topElement}>
            <div className={s.leftSide}>
              <span className={s.cardId}>№{index + 1}</span>
              <span className={s.date}>
                {new Date(item.date).toLocaleDateString('ru-RU', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </span>
            </div>
            <RowMenu options={getRowMenuOptions(item)} variant="card" />
          </div>
        </div>

        <div className={s.cardBody}>
          <div className={s.buyerSellerRow}>
            <div className={s.buyerBlock}>
              <span className={s.cardLabel}>Покупатель</span>
              <span className={s.companyName}>
                {item.application?.company?.name || 'Н/Д'}
              </span>
              <span className={s.inn}>
                ИНН {item.application?.company?.inn || 'Н/Д'}
              </span>
            </div>
            <div className={s.sellerBlock}>
              <span className={s.cardLabel}>Продавец</span>
              <span className={`${s.sellerName} ${
                item.application?.seller?.type === 'elite' ? s.elite : s.regular
              }`}>
                {item.application?.seller?.name || 'Н/Д'}
              </span>
              <span className={s.inn}>
                ИНН {item.application?.seller?.inn || 'Н/Д'}
              </span>
            </div>
          </div>

          <div className={s.productRow}>
            <span className={s.productName}>{item.product}</span>
            <div className={s.quantityBlock}>
              <span className={s.quantity}>{item.quantity || 0}</span>
              <span className={s.unit}>{item.unit}</span>
            </div>
          </div>

          <div className={s.priceRows}>
            <div className={s.priceRow}>
              <span className={s.priceLabel}>Цена за ед. с НДС:</span>
              <span className={s.priceValue}>{formatPrice(item.pricePerUnit)}</span>
            </div>
            <div className={s.priceRow}>
              <span className={s.priceLabel}>Стоимость с НДС:</span>
              <span className={s.priceValue}>
                {formatPrice(totalPrice)}
              </span>
            </div>
            <div className={s.priceRow}>
              <span className={s.priceLabel}>НДС 20%:</span>
              <span className={s.priceValue}>
                {formatPrice(vat)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleUpdateCompanyName = async (newName: string) => {
    try {
      await dispatch(updateCompany({
        companyId: id,
        data: {
          name: newName
        }
      })).unwrap();
      
      // Обновляем данные компании после изменения
      await dispatch(fetchCompanyDetails(id));
      addNotification('Название компании успешно обновлено', 'success');
    } catch (error: any) {
      addNotification(
        error.message || 'Произошла ошибка при обновлении названия компании',
        'error'
      );
    }
  };

  if (isLoading) {
    return <LoadingSlider />;
  }

  if (!companyDetails) {
    return null;
  }

  return (
    <div> 
      <ChangeUserInfoModal 
        isOpened={isOpen} 
        setOpen={setIsOpen} 
        defaultValue={companyDetails.name}
        handleUpdate={handleUpdateCompanyName}
        isCompany={true}
      />
      <PageTitle 
        title={companyDetails.name}
        isUser={true} 
        userDeskr='Профиль компании' 
        setOpen={() => setIsOpen(true)}
      />
      
      <h1 className={s.title}>Основная информация</h1>
      <div className={s.doubleInfo}>
        <div className={s.infoDiv}>
          <p className={s.label}>Активных заявок</p>
          <p className={s.value}>{companyDetails.activeApplications}</p>
        </div>
        <div className={s.infoDiv}>
          <p className={s.label}>Всего заявок</p>
          <p className={s.value}>{companyDetails.totalApplications}</p>
        </div>
      </div>

      {/* Блок заявок */}
      <div className={s.applicationsBlock}>
        <div className={s.header}>
          <h2>Заявки компании</h2>
          {/* <Button
            icon={<DownloadSvg />}
            variant="purple"
            styleLabel={{ fontSize: "14px" }}
            label="Экспортировать в XLS"
            style={{ width: "200px", height: "32px" }}
          /> */}
        </div>
        <SelectGroup 
          data={companyApplications}
          initialData={companyApplications}
          onDateChange={handleDateChange}
          onFilterChange={handleMobileFiltersChange}
          hideClientFilter={false}
          hideCompanyFilter={true}
          filters={filters}
          onFiltersChange={handleMobileFiltersChange}
        />
        <ActiveTable 
          data={companyApplications || []}
          initialData={companyApplications || []}
          onDateChange={handleDateChange}
          onFilterChange={handleMobileFiltersChange}
          onSumChange={handleSumChange}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          isLoading={isLoadingApplications}
          hideClientFilter={false}
          hideCompanyFilter={true}
          onMobileFiltersChange={handleMobileFiltersChange}
          filters={filters}
          hideCompanyColumn={true}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Блок чеков */}
      <div className={s.checksBlock}>
        <div className={s.header}>
          <h2>Чеки компании</h2>
          {/* <Button
            icon={<DownloadSvg />}
            variant="purple"
            styleLabel={{ fontSize: "14px" }}
            label="Экспортировать в XLS"
            style={{ width: "200px", height: "32px" }}
          /> */}
        </div>
        <SelectGroup 
          data={checks}
          initialData={checks}
          onDateChange={handleChecksDateChange}
          onFilterChange={handleChecksFilterChange}
          hideClientFilter={true}
          hideStatusFilter={true}
          hideCompanyFilterDisplay={true}
          filters={checksFilters}
          onFiltersChange={handleChecksFilterChange}
        />
        <NewChecksTable 
          data={checks}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={handlePageChange}
          hideCompanyColumn={true}
        />

        {/* Добавляем мобильные компоненты */}
        <FilterBottomSheet
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={checksFilters}
          onFiltersChange={handleChecksFilterChange}
          data={checks}
          initialData={checks}
          onDateChange={handleChecksDateChange}
          onSumChange={handleChecksSumChange}
          hideClientFilter={true}
          hideCompanyFilter={true}
          hideStatusFilter={true}
        />

        <SearchBottomSheet
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          data={checks}
          renderCard={(item, index) => renderSearchCard(item, index)}
          filterFunction={(item, query) => {
            const searchQuery = query.toLowerCase();
            return (
              (item.application?.company?.name?.toLowerCase().includes(searchQuery) || false) ||
              (item.application?.seller?.name?.toLowerCase().includes(searchQuery) || false) ||
              (item.id?.toLowerCase().includes(searchQuery) || false)
            );
          }}
          emptyStateText={{
            title: 'Это поиск чеков',
            description: 'Здесь можно искать чеки по номеру, компании или продавцу.',
            searchTitle: 'Ничего не найдено',
            searchDescription: 'Чеков с такими параметрами нет. Проверьте ваш запрос.'
          }}
        />
      </div>
    </div>
  );
};

export default DetailedCompany; 