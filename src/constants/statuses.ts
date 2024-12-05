export type ApplicationStatus = 'created' | 'issued' | 'client_paid' | 'us_paid';

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  created: 'Создана',
  issued: 'В работе',
  client_paid: 'Оплачено клиентом',
  us_paid: 'Оплачено нами'
};

export const STATUS_STYLES: Record<ApplicationStatus, string> = {
  created: 'purple',
  issued: 'orange',
  client_paid: 'green',
  us_paid: 'blue'
};

export const getStatusColor = (status: ApplicationStatus): string => {
  switch (status) {
    case 'created':
      return '#E6F2FF';
    case 'issued':
      return '#FFF3E6';
    case 'client_paid':
      return '#E6FFE6';
    case 'us_paid':
      return '#FFE6E6';
    default:
      return '#F4F5F6';
  }
};

export const getAllStatuses = (): ApplicationStatus[] => {
  return ['created', 'issued', 'client_paid', 'us_paid'];
}; 