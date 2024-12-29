import React, { useState, useCallback, useMemo } from 'react'
import s from './detailed-company.module.scss'
import PageTitle from '../../components/ui/page-title/page-title'
import ActiveTable from '../../components/tables/active-table/active-table'
import SelectGroup from '../../components/select-group/select-group'
import { ApplicationStatus } from '../../constants/statuses'
import { TableData } from '../../components/active-applications/active-applications'
import { FilterState } from '../../types/filter-state'
import Button from '../../components/ui/button/button'
import { DownloadSvg } from '../../components/svgs/svgs'
import NewChecksTable from '../../components/tables/checks-table/new-checks-table'
import ChangeUserInfoModal from '../../components/modals/change-user-info-modal/change-user-info-modal'
import { companyApplicationsData } from '../../mock/company-applications';
import { companyChecksData } from '../../mock/company-checks';

const DetailedCompany = () => {
  // Используем импортированные данные вместо локальных
  const companyData = companyApplicationsData;
  const checksData = companyChecksData;

  const [isOpen, setIsOpen] = useState(false);
  const [applicationFilters, setApplicationFilters] = useState<FilterState>({
    date: { start: '', end: '' },
    users: [],
    status: '',
    companies: [],
    sellers: []
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

  // Адаптируем данные чеков к формату TableData
  const adaptedChecksData = useMemo(() => checksData.map(check => ({
    id: check.id,
    statuses: [] as ApplicationStatus[],  // пустой массив, так как у чеков нет статусов
    company: check.company.name,
    seller: check.seller.name,
    checksCount: 0,  // у чеков нет этого поля
    client: {
      id: '',  // у чеков нет клиента
      name: '',
      inn: ''
    },
    sum: check.fullPrice,
    date: {
      start: check.date.split('/').join('.'),  // конвертируем формат даты
      end: check.date.split('/').join('.')
    }
  })), [checksData]);

  // Обработчики для таблицы заявок
  const handleApplicationDateChange = useCallback((start: string, end: string) => {
    setApplicationFilters(prev => ({
      ...prev,
      date: { start, end }
    }));
  }, []);

  const handleApplicationSumChange = useCallback((from: number | null, to: number | null) => {
    setApplicationSumRange({ from, to });
  }, []);

  const handleApplicationFilterChange = useCallback((newFilters: {
    clients: string[];
    companies: string[];
    sellers: string[];
    statuses: ApplicationStatus[];
    sum?: { from: string; to: string };
  }) => {
    setApplicationFilters(prev => ({
      ...prev,
      users: newFilters.clients.map(id => {
        const client = companyData.find(item => item.client.id === id)?.client;
        return client ? { id: client.id, name: client.name } : { id, name: id };
      }),
      companies: newFilters.companies,
      sellers: newFilters.sellers,
      status: newFilters.statuses.join(','),
      statuses: newFilters.statuses
    }));

    if (newFilters.sum) {
      setApplicationSumRange({
        from: newFilters.sum.from ? parseFloat(newFilters.sum.from.replace(/[^\d.]/g, '')) : null,
        to: newFilters.sum.to ? parseFloat(newFilters.sum.to.replace(/[^\d.]/g, '')) : null
      });
    } else {
      setApplicationSumRange({ from: null, to: null });
    }
  }, [companyData]);

  // Обработчики для таблицы чеков
  const handleChecksDateChange = useCallback((start: string, end: string) => {
    setChecksFilters(prev => ({
      ...prev,
      date: { start, end }
    }));
  }, []);

  const handleChecksSumChange = useCallback((from: number | null, to: number | null) => {
    setChecksSumRange({ from, to });
  }, []);

  const handleChecksFilterChange = useCallback((newFilters: {
    clients: string[];
    companies: string[];
    sellers: string[];
    statuses: ApplicationStatus[];
    sum?: { from: string; to: string };
  }) => {
    setChecksFilters(prev => ({
      ...prev,
      companies: newFilters.companies,
      sellers: newFilters.sellers,
    }));

    if (newFilters.sum) {
      setChecksSumRange({
        from: newFilters.sum.from ? parseFloat(newFilters.sum.from.replace(/[^\d.]/g, '')) : null,
        to: newFilters.sum.to ? parseFloat(newFilters.sum.to.replace(/[^\d.]/g, '')) : null
      });
    } else {
      setChecksSumRange({ from: null, to: null });
    }
  }, []);

  // Фильтрация данных заявок
  const filteredApplications = useMemo(() => {
    let result = [...companyData];
    
    // Фильтрация по дате
    if (applicationFilters.date?.start || applicationFilters.date?.end) {
      result = result.filter(item => {
        const [startDay, startMonth, startYear] = item.date.start.split('.');
        const [endDay, endMonth, endYear] = item.date.end.split('.');
        
        const itemStart = new Date(
          parseInt(`20${startYear}`), 
          parseInt(startMonth) - 1, 
          parseInt(startDay)
        );
        const itemEnd = new Date(
          parseInt(`20${endYear}`), 
          parseInt(endMonth) - 1, 
          parseInt(endDay)
        );

        const [filterStartDay, filterStartMonth, filterStartYear] = (applicationFilters.date?.start || '').split('.');
        const [filterEndDay, filterEndMonth, filterEndYear] = (applicationFilters.date?.end || '').split('.');

        const filterStart = applicationFilters.date?.start ? new Date(
          parseInt(`20${filterStartYear}`),
          parseInt(filterStartMonth) - 1,
          parseInt(filterStartDay)
        ) : null;

        const filterEnd = applicationFilters.date?.end ? new Date(
          parseInt(`20${filterEndYear}`),
          parseInt(filterEndMonth) - 1,
          parseInt(filterEndDay)
        ) : null;

        if (filterStart && filterEnd) {
          return itemStart >= filterStart && itemEnd <= filterEnd;
        } else if (filterStart) {
          return itemStart >= filterStart;
        } else if (filterEnd) {
          return itemEnd <= filterEnd;
        }
        return true;
      });
    }

    // Фильтрация по пользователям
    if (applicationFilters.users?.length > 0) {
      result = result.filter(item => 
        applicationFilters.users.some(user => user.id === item.client.id)
      );
    }

    // Фильтрация по статусам
    if (applicationFilters.status) {
      const selectedStatuses = applicationFilters.status.split(',').filter(Boolean);
      if (selectedStatuses.length > 0) {
        result = result.filter(item => 
          selectedStatuses.some(status => item.statuses.includes(status as ApplicationStatus))
        );
      }
    }

    // Фильтрация по продавцам
    if (applicationFilters.sellers && applicationFilters.sellers.length > 0) {
      result = result.filter(item => applicationFilters.sellers?.includes(item.seller));
    }

    // Фильтрация по сумме
    if (applicationSumRange.from !== null || applicationSumRange.to !== null) {
      result = result.filter(item => {
        const itemSum = parseFloat(item.sum.replace(/[^\d.]/g, ''));
        if (applicationSumRange.from !== null && applicationSumRange.to !== null) {
          return itemSum >= applicationSumRange.from && itemSum <= applicationSumRange.to;
        } else if (applicationSumRange.from !== null) {
          return itemSum >= applicationSumRange.from;
        } else if (applicationSumRange.to !== null) {
          return itemSum <= applicationSumRange.to;
        }
        return true;
      });
    }

    return result;
  }, [applicationFilters, applicationSumRange, companyData]);

  // Фильтрация данных чеков
  const filteredChecks = useMemo(() => {
    let result = [...checksData];
    
    // Фильтрация по дате
    if (checksFilters.date?.start || checksFilters.date?.end) {
      result = result.filter(item => {
        const [day, month, year] = item.date.split('/');
        const itemDate = new Date(parseInt(`20${year}`), parseInt(month) - 1, parseInt(day));

        const [filterStartDay, filterStartMonth, filterStartYear] = (checksFilters.date?.start || '').split('.');
        const [filterEndDay, filterEndMonth, filterEndYear] = (checksFilters.date?.end || '').split('.');

        const filterStart = checksFilters.date?.start ? new Date(
          parseInt(`20${filterStartYear}`),
          parseInt(filterStartMonth) - 1,
          parseInt(filterStartDay)
        ) : null;

        const filterEnd = checksFilters.date?.end ? new Date(
          parseInt(`20${filterEndYear}`),
          parseInt(filterEndMonth) - 1,
          parseInt(filterEndDay)
        ) : null;

        if (filterStart && filterEnd) {
          return itemDate >= filterStart && itemDate <= filterEnd;
        } else if (filterStart) {
          return itemDate >= filterStart;
        } else if (filterEnd) {
          return itemDate <= filterEnd;
        }
        return true;
      });
    }

    // Фильтрация по продавцам
    if (checksFilters.sellers && checksFilters.sellers.length > 0) {
      result = result.filter(item => checksFilters.sellers?.includes(item.seller.name));
    }

    // Фильтрация по сумме
    if (checksSumRange.from !== null || checksSumRange.to !== null) {
      result = result.filter(item => {
        const itemSum = parseFloat(item.fullPrice.replace(/[^\d.]/g, ''));
        if (checksSumRange.from !== null && checksSumRange.to !== null) {
          return itemSum >= checksSumRange.from && itemSum <= checksSumRange.to;
        } else if (checksSumRange.from !== null) {
          return itemSum >= checksSumRange.from;
        } else if (checksSumRange.to !== null) {
          return itemSum <= checksSumRange.to;
        }
        return true;
      });
    }

    return result;
  }, [checksFilters, checksSumRange, checksData]);

  return (
    <div> 
      <ChangeUserInfoModal 
        isOpened={isOpen} 
        setOpen={setIsOpen} 
        handleUpdate={(str: string) => {console.log(str)}} 
        defaultValue='ООО Компания 1'
      />
      <PageTitle 
        title='ООО Компания 1' 
        isUser={true} 
        userDeskr='Профиль компании' 
        setOpen={() => setIsOpen(true)}
      />
      
      <h1 className={s.title}>Основная информация</h1>
      <div className={s.doubleInfo}>
        <div className={s.infoDiv}>
          <p className={s.label}>Активных заявок</p>
          <p className={s.value}>
            {companyData.filter(item => !item.statuses.includes('us_paid')).length}
          </p>
        </div>
        <div className={s.infoDiv}>
          <p className={s.label}>Всего заявок</p>
          <p className={s.value}>{companyData.length}</p>
        </div>
      </div>

      {/* Блок заявок */}
      <div className={s.applicationsBlock}>
        <div className={s.header}>
          <h2>Заявки компании</h2>
          <Button
            icon={<DownloadSvg />}
            variant="purple"
            styleLabel={{ fontSize: "14px" }}
            label="Экспортировать в XLS"
            style={{ width: "200px", height: "32px" }}
          />
        </div>
        <SelectGroup 
          data={filteredApplications}
          initialData={companyData}
          onDateChange={handleApplicationDateChange}
          onFilterChange={handleApplicationFilterChange}
          hideClientFilter={false}
          filters={applicationFilters}
          onFiltersChange={setApplicationFilters}
        />
        <ActiveTable 
          data={filteredApplications}
          initialData={companyData}
          onDateChange={handleApplicationDateChange}
          onFilterChange={handleApplicationFilterChange}
          onSumChange={handleApplicationSumChange}
        />
      </div>

      {/* Блок чеков */}
      <div className={s.checksBlock}>
        <div className={s.header}>
          <h2>Чеки компании</h2>
          <Button
            icon={<DownloadSvg />}
            variant="purple"
            styleLabel={{ fontSize: "14px" }}
            label="Экспортировать в XLS"
            style={{ width: "200px", height: "32px" }}
          />
        </div>
        <SelectGroup 
          data={adaptedChecksData}
          initialData={adaptedChecksData}
          onDateChange={handleChecksDateChange}
          onFilterChange={handleChecksFilterChange}
          hideClientFilter={true}
          hideStatusFilter={true}
          filters={checksFilters}
          onFiltersChange={setChecksFilters}
        />
        <NewChecksTable 
          data={filteredChecks}
          onFilterOpen={() => {}} 
        />
      </div>
    </div>
  )
}

export default DetailedCompany 