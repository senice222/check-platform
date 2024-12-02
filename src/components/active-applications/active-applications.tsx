import { useState } from 'react';
import SelectGroup from '../select-group/select-group';
import { DownloadSvg } from '../svgs/svgs';
import ActiveTable from '../tables/active-table/active-table';
import Button from '../ui/button/button';
import style from './active-applications.module.scss';
import { ApplicationStatus } from '../../constants/statuses';

export interface TableData {
  id: string;
  status: ApplicationStatus;
  company: string;
  seller: string;
  checks: string;
  checksCount: number;
  client: {
    name: string;
    avatar?: JSX.Element;
    inn: string;
  };
  sum: string;
  date: {
    start: string;
    end: string;
  };
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(2);
  return `${day}/${month}/${year}`;
};

const initialData: TableData[] = [
  { 
    id: "#01", 
    status: "created",
    company: "ЗАО 'ТЕХНОЛОГИЯ'", 
    seller: "ООО 'Инновации 2023'", 
    checksCount: 15,
    client: { 
      name: "Григорий", 
      inn: "9876543210" 
    }, 
    sum: "₽63,000",
    date: {
      start: "2024-02-01",
      end: "2024-02-15"
    }
  },
  { 
    id: "#02", 
    status: "issued",
    company: "ЗАО 'ИННОВАЦИИ'", 
    seller: "ООО 'Технологии Будущего'", 
    checksCount: 15,
    client: { 
      name: "Михаил", 
      inn: "9876543210" 
    }, 
    sum: "₽120,000",
    date: {
      start: "2024-02-10",
      end: "2024-02-25"
    }
  },
  { 
    id: "#03", 
    status: "client_paid",
    company: "ООО 'ПРОГРЕСС'", 
    seller: "ИП Иванов", 
    checksCount: 8,
    client: { 
      name: "Иван", 
      inn: "1234567890" 
    }, 
    sum: "₽45,000",
    date: {
      start: "2024-03-01",
      end: "2024-03-15"
    }
  },
  { 
    id: "#04", 
    status: "us_paid",
    company: "ЗАО 'ТЕХНОЛОГИЯ'", 
    seller: "ООО 'Инновации 2023'", 
    checksCount: 12,
    client: { 
      name: "Даниил", 
      inn: "5678901234" 
    }, 
    sum: "₽89,000",
    date: {
      start: "2024-03-10",
      end: "2024-03-25"
    }
  },
  { 
    id: "#05", 
    status: "elit",
    company: "ООО 'ПРОГРЕСС'", 
    seller: "ООО 'Технологии Будущего'", 
    checksCount: 20,
    client: { 
      name: "Андрей", 
      inn: "3456789012" 
    }, 
    sum: "₽150,000",
    date: {
      start: "2024-04-01",
      end: "2024-04-15"
    }
  }
].map(item => ({
  ...item,
  checks: `${formatDate(item.date.start)} → ${formatDate(item.date.end)}`
}));

const ActiveApplications = () => {
  const [filteredData, setFilteredData] = useState<TableData[]>(initialData);
  const [dateRange, setDateRange] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null
  });
  const [filters, setFilters] = useState({
    clients: [] as string[],
    companies: [] as string[],
    sellers: [] as string[],
    statuses: [] as ApplicationStatus[],
  });

  const handleDateChange = (start: string, end: string) => {
    setDateRange({ start, end });
    filterData({ start, end }, filters);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    filterData(dateRange, newFilters);
  };

  const filterData = (dates: { start: string | null; end: string | null }, currentFilters: typeof filters) => {
    let newData = [...initialData];

    // Фильтрация по дате
    if (dates.start) {
      const filterStartDate = new Date(dates.start);
      if (dates.end) {
        const filterEndDate = new Date(dates.end);
        newData = newData.filter(item => {
          const itemStartDate = new Date(item.date.start);
          const itemEndDate = new Date(item.date.end);
          return itemStartDate <= filterEndDate && itemEndDate >= filterStartDate;
        });
      }
    }

    // Фильтрация по выбранным опциям
    if (currentFilters.clients.length > 0) {
      newData = newData.filter(item => currentFilters.clients.includes(item.client.name));
    }
    if (currentFilters.companies.length > 0) {
      newData = newData.filter(item => currentFilters.companies.includes(item.company));
    }
    if (currentFilters.sellers.length > 0) {
      newData = newData.filter(item => currentFilters.sellers.includes(item.seller));
    }
    if (currentFilters.statuses.length > 0) {
      newData = newData.filter(item => currentFilters.statuses.includes(item.status));
    }

    // Фильтрация по сумме
    if (currentFilters.sum) {
      const { from, to } = currentFilters.sum;
      if (from) {
        newData = newData.filter(item => {
          const itemSum = parseInt(item.sum.replace(/[^\d]/g, ''));
          return itemSum >= parseInt(from);
        });
      }
      if (to) {
        newData = newData.filter(item => {
          const itemSum = parseInt(item.sum.replace(/[^\d]/g, ''));
          return itemSum <= parseInt(to);
        });
      }
    }

    setFilteredData(newData);
  };

  return (
    <div className={style.pageContainer}>
      <div className={style.wrapper}>
        <div className={style.topic}>
          <h2>Активные заявки</h2>
          <Button
            icon={<DownloadSvg />}
            label="Экспортировать в XLS"
            onClick={() => console.log('click')}
            style={{ width: 200, height: 32, borderRadius: 10 }}
            styleLabel={{ fontSize: 14, fontWeight: 500 }}
          />
        </div>
        <SelectGroup 
          onDateChange={handleDateChange} 
          data={initialData}
          onFilterChange={handleFilterChange}
        />
        <ActiveTable data={filteredData} />
      </div>
    </div>
  );
};

export default ActiveApplications;
