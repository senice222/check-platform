import React, { useState, useCallback, useMemo, useEffect } from 'react'
import s from './detailed-client.module.scss'
import PageTitle from '../../components/ui/page-title/page-title'
import ActiveTable from '../../components/tables/active-table/active-table'
import SelectGroup from '../../components/select-group/select-group'
import { ApplicationStatus } from '../../constants/statuses'
import { FilterState } from '../../types/filter-state'
import Button from '../../components/ui/button/button'
import { DownloadSvg } from '../../components/svgs/svgs'
import ChangeUserInfoModal from '../../components/modals/change-user-info-modal/change-user-info-modal'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { fetchUserInfo, fetchUserApplications } from '../../store/slices/clientSlice'
import Pagination from '../../components/ui/pagination/pagination'

const DetailedClient = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const { 
    userInfo, 
    userInfoLoading,
    userApplications,
    userApplicationsLoading,
    pagination
  } = useSelector((state: RootState) => state.client)

  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    date: { start: '', end: '' },
    users: [],
    companies: [],
    sellers: [],
    status: '',
    statuses: [] as ApplicationStatus[],
    sum: { from: '', to: '' },
    search: ''
  })
  // console.log(filters, 21)
  const [sumRange, setSumRange] = useState<{ from: number | null; to: number | null }>({
    from: null,
    to: null
  })
  const [showSearch, setShowSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (id) {
      dispatch(fetchUserInfo(id));
      // При первой загрузке не отправляем пустые фильтры
      if (!userApplications.length) {
        dispatch(fetchUserApplications({ 
          userId: id,
          filters: {},
          pagination: { page: 1, limit: 10 }
        }));
      }
    }
  }, [id]);

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
          ...(start ? { dateStart: start } : {}),
          ...(end ? { dateEnd: end } : {}),
          ...(updatedFilters.sum?.from ? { sumFrom: updatedFilters.sum.from } : {}),
          ...(updatedFilters.sum?.to ? { sumTo: updatedFilters.sum.to } : {})
        };

        // Отправляем запрос внутри setFilters callback, чтобы использовать актуальные данные
        if (start || end || updatedFilters.companies.length || updatedFilters.sellers.length || 
            updatedFilters.statuses.length || updatedFilters.sum?.from || updatedFilters.sum?.to) {
          dispatch(fetchUserApplications({
            userId: id,
            filters: apiFilters,
            pagination: { page: 1, limit: 10 }
          }));
        }

        return updatedFilters;
      });
    }
  }, [dispatch, id]); // Убираем filters из зависимостей
  // console.log(filters, 'filters')
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

      // Отправляем запрос только если есть фильтры
      if (from || to || filters.companies.length || filters.sellers.length || filters.statuses.length || filters.date?.start || filters.date?.end) {
        dispatch(fetchUserApplications({
          userId: id,
          filters: apiFilters,
          pagination: { page: 1, limit: 10 }
        }));
      }
    }
  }, [dispatch, id, filters]);

  const handleFilterChange = useCallback((newFilters: {
    clients: string[];
    companies: string[];
    sellers: string[];
    statuses: ApplicationStatus[];
    sum?: { from: string; to: string };
  }) => {
    console.log('handleFilterChange newFilters:', newFilters);
    
    // Обновляем локальное состояние фильтров в том же формате, что и в ActiveApplications
    setFilters(prev => ({
      ...prev,
      users: prev.users, // Оставляем текущего пользователя
      companies: newFilters.companies,
      sellers: newFilters.sellers,
      status: newFilters.statuses.join(','),
      statuses: newFilters.statuses,
      sum: newFilters.sum || { from: '', to: '' }
    }));

    // Формируем фильтры для API
    const apiFilters = {
      companies: newFilters.companies,
      sellers: newFilters.sellers,
      statuses: newFilters.statuses,
      dateStart: filters.date.start || undefined,
      dateEnd: filters.date.end || undefined,
      sumFrom: newFilters.sum?.from || undefined,
      sumTo: newFilters.sum?.to || undefined
    };

    dispatch(fetchUserApplications({
      userId: id as string,
      filters: apiFilters,
      pagination: {
        page: 1,
        limit: 10
      }
    }));
  }, [dispatch, id, filters.date]);

  // Обработчик мобильных фильтров
  const handleMobileFiltersChange = useCallback((updatedFilters: FilterState) => {
    console.log('DetailedClient handleMobileFiltersChange:', updatedFilters);
    
    // Сначала обновляем состояние
    setFilters(prev => ({
      ...prev,
      ...updatedFilters,
      users: prev.users, // Сохраняем текущего пользователя
      date: updatedFilters.date || { start: '', end: '' },
      companies: updatedFilters.companies || [],
      sellers: updatedFilters.sellers || [],
      status: Array.isArray(updatedFilters.statuses) && updatedFilters.statuses.length > 0 
        ? updatedFilters.statuses.join(',') 
        : '',
      statuses: Array.isArray(updatedFilters.statuses) ? updatedFilters.statuses : [],
      sum: updatedFilters.sum || { from: '', to: '' }
    }));

    // Формируем API фильтры, включая пустые значения для сброса
    const apiFilters = {
      companies: updatedFilters.companies || [],
      sellers: updatedFilters.sellers || [],
      statuses: updatedFilters.statuses || [],
      dateStart: updatedFilters.date?.start || '',
      dateEnd: updatedFilters.date?.end || '',
      sumFrom: updatedFilters.sum?.from || '',
      sumTo: updatedFilters.sum?.to || ''
    };

    // Всегда отправляем запрос, даже если фильтры пустые
    dispatch(fetchUserApplications({
      userId: id as string,
      filters: apiFilters,
      pagination: {
        page: 1,
        limit: 10
      }
    }));
  }, [dispatch, id]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    dispatch(fetchUserApplications({
      userId: id as string,
      filters: {
        clients: [],
        companies: filters.companies,
        sellers: filters.sellers,
        statuses: filters.statuses,
        dateStart: filters.date.start,
        dateEnd: filters.date.end,
        sumFrom: filters.sum?.from,
        sumTo: filters.sum?.to
      },
      pagination: {
        page,
        limit: 10
      }
    }));
  };

  // Также добавим проверку обновления фильтров
  useEffect(() => {
    console.log('DetailedClient filters changed:', filters);
  }, [filters]);

  if (userInfoLoading) {
    return (
      <div className={s.loadingContainer}>
        <div className={s.spinner}></div>
        <p>Загрузка данных...</p>
      </div>
    )
  }
  
  if (!userInfo) {
    return null
  }
  console.log(userInfo, 'userInfo')
  return (
    <div> 
      <ChangeUserInfoModal 
        isOpened={isOpen} 
        setOpen={setIsOpen} 
        defaultValue={userInfo.user.name}
        clientId={userInfo.user._id}
        canSave={userInfo.user.canSave}
        isBlocked={userInfo.user.isBlocked}
      />
      <PageTitle 
        title={userInfo.user.name} 
        isUser={true} 
        userDeskr='Профиль клиента' 
        setOpen={() => setIsOpen(true)}
      />
      <h1 className={s.title}>Основная информация</h1>
      <div className={s.doubleInfo}>
        <div className={s.infoDiv}>
          <p className={s.label}>Активных заявок</p>
          <p className={s.value}>{userInfo.statistics.activeApplications}</p>
        </div>
        <div className={s.infoDiv}>
          <p className={s.label}>Всего заявок</p>
          <p className={s.value}>{userInfo.statistics.totalApplications}</p>
        </div>
      </div>

      <div className={s.applicationsBlock}>
        <div className={s.header}>
          <h2>Заявки клиента</h2>
          {/* <Button
            icon={<DownloadSvg />}
            variant="purple"
            styleLabel={{ fontSize: "14px" }}
            label="Экспортировать в XLS"
            style={{ width: "200px", height: "32px" }}
          /> */}
        </div>
        <SelectGroup 
          data={userApplications || []}
          initialData={userApplications || []}
          onDateChange={handleDateChange}
          onFilterChange={handleFilterChange}
          hideClientFilter={true}
          filters={filters}
          onFiltersChange={handleFilterChange}
        />
        <ActiveTable 
          data={userApplications || []}
          initialData={userApplications || []}
          onDateChange={handleDateChange}
          onFilterChange={handleFilterChange}
          onSumChange={handleSumChange}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          isLoading={userApplicationsLoading}
          hideClientFilter={true}
          onMobileFiltersChange={handleMobileFiltersChange}
          filters={filters}
          hideClientColumn={true}
        />
        
        {pagination && pagination.total > 0 && (
          <div className={s.pagination}>
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default DetailedClient
