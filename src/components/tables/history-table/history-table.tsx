import styles from "./history-table.module.scss";
import StatusBadge from "../../ui/status-badge/status-badge";
import { ApplicationStatus } from "../../../constants/statuses";

interface HistoryRow {
  date: string;
  action: string;
  status?: string;
  statusType?: ApplicationStatus;
  isUser?: boolean;
}

const HistoryTable = () => {
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

  return (
    <div className={styles.container}>
      <table className={styles.table}>
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
    </div>
  );
};

export default HistoryTable; 