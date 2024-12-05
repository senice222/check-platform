import React from 'react';
import styles from './status-badge.module.scss';
import { ApplicationStatus, STATUS_LABELS } from '../../../constants/statuses';

interface StatusBadgeProps {
  status: ApplicationStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <div className={`${styles.badge} ${styles[status]}`}>
      {STATUS_LABELS[status]}
    </div>
  );
};

export default StatusBadge; 
