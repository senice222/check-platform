import React, { useState, useCallback, useMemo } from 'react'
import s from './detailed-client.module.scss'
import PageTitle from '../../components/ui/page-title/page-title'
import ActiveTable from '../../components/tables/active-table/active-table'
import SelectGroup from '../../components/select-group/select-group'
import { ApplicationStatus } from '../../constants/statuses'
import { TableData } from '../../components/active-applications/active-applications'
import { FilterState } from '../../types/filter-state'
import Button from '../../components/ui/button/button'
import { DownloadSvg } from '../../components/svgs/svgs'
import ChangeUserInfoModal from '../../components/modals/change-user-info-modal/change-user-info-modal'

const DetailedClient = () => {
  // Моковые данные для клиента
  const clientData: TableData[] = [
    { 
      id: "#01", 
      statuses: ["created", "issued"],
      company: "ООО Компания 1",
      seller: "Продавец 1",
      checksCount: 5,
      client: {
        id: "1",
        name: "Евгений",
        inn: "1234567890"
      },
      sum: "100 000 ₽",
      date: {
        start: "01.12.24",
        end: "31.12.24"
      }
    },
    { 
      id: "#02", 
      statuses: ["client_paid"],
      company: "ООО Компания 2",
      seller: "Продавец 2",
      checksCount: 3,
      client: {
        id: "1",
        name: "Евгений",
        inn: "1234567890"
      },
      sum: "150 000 ₽",
      date: {
        start: "15.12.24",
        end: "25.12.24"
      }
    },
  ]
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    date: { start: '', end: '' },
    users: [],
    status: '',
    companies: [],
    sellers: []
  });

  const [sumRange, setSumRange] = useState<{ from: number | null; to: number | null }>({
    from: null,
    to: null
  });

  const parseSumToNumber = (sum: string): number => {
    return parseFloat(sum.replace(/[^\d.]/g, ''));
  };

  const filteredData = useMemo(() => {
    let result = [...clientData];
    
    // Фильтрация по дате
    if (filters.date?.start || filters.date?.end) {
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

        const [filterStartDay, filterStartMonth, filterStartYear] = (filters.date?.start || '').split('.');
        const [filterEndDay, filterEndMonth, filterEndYear] = (filters.date?.end || '').split('.');

        const filterStart = filters.date?.start ? new Date(
          parseInt(`20${filterStartYear}`),
          parseInt(filterStartMonth) - 1,
          parseInt(filterStartDay)
        ) : null;

        const filterEnd = filters.date?.end ? new Date(
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

    // Фильтрация по компаниям
    if (filters.companies && filters.companies.length > 0) {
      result = result.filter(item => filters.companies?.includes(item.company));
    }

    // Фильтрация по продавцам
    if (filters.sellers && filters.sellers.length > 0) {
      result = result.filter(item => filters.sellers?.includes(item.seller));
    }

    // Фильтрация по статусам
    if (filters.status) {
      const selectedStatuses = filters.status.split(',').filter(Boolean);
      if (selectedStatuses.length > 0) {
        result = result.filter(item => 
          selectedStatuses.some(status => item.statuses.includes(status as ApplicationStatus))
        );
      }
    }

    // Фильтрация по сумме
    if (sumRange.from !== null || sumRange.to !== null) {
      result = result.filter(item => {
        const itemSum = parseSumToNumber(item.sum);
        if (sumRange.from !== null && sumRange.to !== null) {
          return itemSum >= sumRange.from && itemSum <= sumRange.to;
        } else if (sumRange.from !== null) {
          return itemSum >= sumRange.from;
        } else if (sumRange.to !== null) {
          return itemSum <= sumRange.to;
        }
        return true;
      });
    }

    return result;
  }, [filters, sumRange, clientData]);

  const handleDateChange = useCallback((start: string, end: string) => {
    setFilters(prev => ({
      ...prev,
      date: { start, end }
    }));
  }, []);

  const handleSumChange = useCallback((from: number | null, to: number | null) => {
    setSumRange({ from, to });
  }, []);

  const handleFilterChange = useCallback((newFilters: {
    clients: string[];
    companies: string[];
    sellers: string[];
    statuses: ApplicationStatus[];
    sum?: { from: string; to: string };
  }) => {
    setFilters(prev => ({
      ...prev,
      companies: newFilters.companies,
      sellers: newFilters.sellers,
      status: newFilters.statuses.join(','),
    }));

    // Обновляем диапазон суммы, учитывая возможность его удаления
    if (newFilters.sum) {
      setSumRange({
        from: newFilters.sum.from ? parseSumToNumber(newFilters.sum.from) : null,
        to: newFilters.sum.to ? parseSumToNumber(newFilters.sum.to) : null
      });
    } else {
      // Если sum не определен, сбрасываем диапазон
      setSumRange({ from: null, to: null });
    }
  }, []);

  return (
    <div> 
      <ChangeUserInfoModal isOpened={isOpen} setOpen={setIsOpen} handleUpdate={(str: string) => {console.log(str)}} defaultValue='Евгений'/>
      <PageTitle title='Евгений' isUser={true} userDeskr='Профиль клиента' setOpen={() => setIsOpen(true)}/>
      <h1 className={s.title}>Основная информация</h1>
      <div className={s.doubleInfo}>
        <div className={s.infoDiv}>
          <p className={s.label}>Активных заявок</p>
          <p className={s.value}>
            {clientData.filter(item => !item.statuses.includes('us_paid')).length}
          </p>
        </div>
        <div className={s.infoDiv}>
          <p className={s.label}>Всего заявок</p>
          <p className={s.value}>{clientData.length}</p>
        </div>
      </div>

      <div className={s.applicationsBlock}>
        <div className={s.header}>
          <h2>Заявки клиента</h2>
          <Button
            icon={<DownloadSvg />}
            variant="purple"
            styleLabel={{ fontSize: "14px" }}
            label="Экспортировать в XLS"
            style={{ width: "200px", height: "32px" }}
          />
        </div>
        <SelectGroup 
          data={filteredData}
          initialData={clientData}
          onDateChange={handleDateChange}
          onFilterChange={handleFilterChange}
          hideClientFilter={true}
          filters={filters}
          onFiltersChange={setFilters}
        />
        <ActiveTable 
          data={filteredData}
          initialData={clientData}
          onDateChange={handleDateChange}
          onFilterChange={handleFilterChange}
          onSumChange={handleSumChange}
        />
      </div>
    </div>
  )
}

export default DetailedClient
