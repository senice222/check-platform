import { useState, useEffect } from "react";
import styles from "./history-table.module.scss";
import StatusBadge from "../../ui/status-badge/status-badge";
import { ApplicationStatus } from "../../../constants/statuses";
import { TableIcon, CardIcon } from "../../svgs/svgs";

interface HistoryRow {
  date: string;
  action: string;
  status?: string;
  statusType?: ApplicationStatus;
  isUser?: boolean;
}

const HistoryTable = () => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const data: HistoryRow[] = [
    { 
      date: "01/11/24 в 21:33 мск", 
      action: "Заявка создана пользователем ", 
      status: "Георгий",
      isUser: true 
    },
    { 
      date: "01/11/24 в 21:33 мск", 
      action: "Заявка изменена администратором ", 
      status: "Виктория",
      isUser: true 
    },
    { 
      date: "01/11/24 в 21:33 мск", 
      action: "Добавлен статус ", 
      status: "Выдана СФ",
      statusType: "issued" 
    },
    { 
      date: "01/11/24 в 21:33 мск", 
      action: "Удалён статус ", 
      status: "Создана",
      statusType: "created" 
    },
  ];

  const renderCard = (row: HistoryRow, index: number) => (
    <div className={styles.card} key={index}>
      <div className={styles.cardHeader}>
        <span className={styles.cardDate}>{row.date}</span>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardAction}>
          {row.action}
          {row.isUser ? (
            <span className={styles.userLink}>{row.status}</span>
          ) : row.statusType ? (
            <span className={styles.statusContainer}>
              <StatusBadge status={row.statusType} bordered />
            </span>
          ) : null}
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
        <table className={styles.table} data-view-mode={viewMode}>
          <thead>
            <tr>
              <th>Дата и время</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.date}</td>
                <td>
                  {row.action}
                  {row.isUser ? (
                    <span className={styles.userLink}>{row.status}</span>
                  ) : row.statusType ? (
                    <span className={styles.statusContainer}>
                      <StatusBadge status={row.statusType} bordered />
                    </span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.cardsContainer} data-view-mode={viewMode}>
          {data.map((row, index) => renderCard(row, index))}
        </div>
      </div>
    </>
  );
};

export default HistoryTable; 