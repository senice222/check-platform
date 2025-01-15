import { useState, useEffect } from "react";
import styles from "./history-table.module.scss";
import StatusBadge from "../../ui/status-badge/status-badge";
import { formatDate } from "../../../utils/date";
import Loader from "../../ui/loader/loader";

interface HistoryRecord {
  id: string;
  type: 'status' | 'change';
  message: string;
  status?: string;
  action?: 'add' | 'remove';
  userId?: string;
  userName?: string;
  createdAt: string;
}

interface Props {
  history: HistoryRecord[];
  isLoading: boolean;
}

const HistoryTable: React.FC<Props> = ({ history, isLoading }) => {
  const renderMessage = (record: HistoryRecord) => {
    if (record.type === 'change') {
      return (
        <div className={styles.messageContainer}>
          <span>Заявка изменена пользователем</span>
          {record.userName && (
            <span className={styles.userLink}>{record.userName}</span>
          )}
        </div>
      );
    }

    if (record.type === 'status') {
      return (
        <div className={styles.messageContainer}>
          <span>{record.message}</span>
          {record.status && (
            <StatusBadge status={record.status as any} />
          )}
        </div>
      );
    }

    return record.message;
  };

  const renderCard = (record: HistoryRecord, index: number) => (
    <div key={record.id || index} className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.date}>{formatDate(new Date(record.createdAt))}</span>
      </div>
      <div className={styles.cardContent}>
        {renderMessage(record)}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.desktop}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record, index) => (
              <tr key={record.id || index}>
                <td>{formatDate(new Date(record.createdAt))}</td>
                <td>{renderMessage(record)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.mobile}>
        {history.map((record, index) => renderCard(record, index))}
      </div>
    </div>
  );
};

export default HistoryTable; 