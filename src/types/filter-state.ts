import { ApplicationStatus } from '../constants/statuses';

export interface FilterState {
  date: {
    start: string;
    end: string;
  };
  clients: Array<{
    id: string;
    name: string;
  }>;
  companies: string[];
  sellers: string[];
  status: string;
  statuses: ApplicationStatus[];
  sum: {
    from: string;
    to: string;
  };
  search?: string;
} 