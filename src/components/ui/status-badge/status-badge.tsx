import React from 'react';
import styles from './status-badge.module.scss';
import { ApplicationStatus, STATUS_LABELS } from '../../../constants/statuses';

interface StatusBadgeProps {
  status?: ApplicationStatus;
  statuses?: ApplicationStatus[];
  customStatus?: {
    label: string;
    type: string;
  };
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, statuses, customStatus }) => {
  if (customStatus) {
    return (
      <div className={`${styles.badge} ${styles[customStatus.type]}`}>
        {customStatus.label}
      </div>
    );
  }

  if (statuses?.length) {
    // Показываем только первые 2 статуса, если их больше 2
    const displayStatuses = statuses.slice(0, 2);
    const remainingCount = statuses.length - 2;

    return (
      <div className={styles.statusGroup}>
        {displayStatuses.map((stat, index) => (
          <div key={index} className={`${styles.badge} ${styles[stat]}`}>
            {STATUS_LABELS[stat]}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className={`${styles.badge} ${styles.more}`}>
            +{remainingCount}
          </div>
        )}
      </div>
    );
  }

  return status ? (
    <div className={`${styles.badge} ${styles[status]}`}>
      {STATUS_LABELS[status]}
    </div>
  ) : null;
};

export default StatusBadge; 
