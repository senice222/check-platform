export type ApplicationStatus = 'created' | 'issued' | 'client_paid' | 'us_paid' | 'elit';

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  created: 'Создана',
  issued: 'Выдана СФ',
  client_paid: 'Оплачено клиентом',
  us_paid: 'Оплачено нами',
  elit: 'Элитная'
};

export const STATUS_STYLES: Record<ApplicationStatus, string> = {
  created: 'purple',
  issued: 'orange',
  client_paid: 'blue',
  us_paid: 'green',
  elit: 'elit'
}; 