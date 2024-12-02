import { useState, useEffect } from "react";
import styles from "./active-table.module.scss";
import { ClientAvatar, SearchIcon, TableIcon, CardIcon } from "../../svgs/svgs";
import { TableData } from "../../active-applications/active-applications";
import StatusBadge from "../../ui/status-badge/status-badge";
import { ApplicationStatus } from "../../../constants/statuses";

interface ActiveTableProps {
  data: TableData[];
}

const ActiveTable: React.FC<ActiveTableProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isMobile, setIsMobile] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const filtered = data.filter(item => 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  const renderCard = (row: TableData) => (
    <div className={styles.card} key={row.id}>
      <div className={styles.cardHeader}>
        <span className={styles.cardId}>{row.id}</span>
        <StatusBadge status={row.status as ApplicationStatus} />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Компания:</span>
          <div className={styles.companyDiv}>
            <span className={styles.companyName}>{row.company}</span>
            <span className={styles.inn}>ИНН {row.client.inn}</span>
          </div>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Продавец:</span>
          <div className={styles.companyDiv}>
            <span className={styles.sellerName}>{row.seller}</span>
            <span className={styles.inn}>ИНН {row.client.inn}</span>
          </div>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Чеки:</span>
          <div className={styles.companyDiv}>
            <span className={styles.checks}>{row.checks}</span>
            <span className={styles.inn}>{row.checksCount} чеков</span>
          </div>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Клиент:</span>
          <div className={styles.clientDiv}>
            <ClientAvatar />
            <span className={styles.clientName}>{row.client.name}</span>
          </div>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Сумма:</span>
          <span className={styles.sum}>{row.sum}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isMobile && (
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
      )}
      <div className={styles.container} data-view-mode={viewMode}>
        <div className={styles.searchWrapper}>
          <span className={styles.icon}>
            <SearchIcon />
          </span>
          <input 
            className={styles.search} 
            type="text" 
            placeholder="Поиск по заявкам"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <table className={styles.table} data-view-mode={viewMode}>
          <thead>
            <tr>
              <th>№</th>
              <th>Статус</th>
              <th>Компания</th>
              <th>Продавец</th>
              <th>Чеки</th>
              <th>Клиент</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>
                  <StatusBadge status={row.status as ApplicationStatus} />
                </td>
                <td>
                  <div className={styles.companyDiv}>
                    <span className={styles.companyName}>{row.company}</span>
                    <span className={styles.inn}>ИНН {row.client.inn}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.companyDiv}>
                    <span className={styles.sellerName}>{row.seller}</span>
                    <span className={styles.inn}>ИНН {row.client.inn}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.companyDiv}>
                    <span className={styles.checks}>{row.checks}</span>
                    <span className={styles.inn}>{row.checksCount} чеков</span>
                  </div>
                </td>
                <td>
                  <div className={styles.clientDiv}>
                    <ClientAvatar />
                    <span className={styles.clientName}>{row.client.name}</span>
                  </div>
                </td>
                <td className={styles.sum}>{row.sum}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.cardsContainer} data-view-mode={viewMode}>
          {filteredData.map((row) => renderCard(row))}
        </div>
      </div>
    </>
  );
};

export default ActiveTable;
