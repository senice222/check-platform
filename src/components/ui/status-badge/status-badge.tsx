import React from 'react';
import { ApplicationStatus, STATUS_LABELS, STATUS_STYLES } from '../../../constants/statuses';
import s from './status-badge.module.scss';

interface StatusBadgeProps {
  status: ApplicationStatus;
  bordered?: boolean;
  big? : boolean
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, bordered, big }) => {
  const borderClass = bordered ? s.bordered : '';
  const styleClass = STATUS_STYLES[status];

  return (
    <div className={`${s.status} ${s[styleClass]} ${borderClass} ${big ? s.big : ""}`}>
      <p>{STATUS_LABELS[status]}</p>
    </div>
  );
};

export default StatusBadge; 
