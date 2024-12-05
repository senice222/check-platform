import { ApplicationStatus } from '../constants/statuses';

export interface FilterState {
  date: {
    start: string;
    end: string;
  };
  users: Array<{
    id: string;
    name: string;
  }>;
  status: string;
  statuses?: ApplicationStatus[];
  companies?: string[];
  sellers?: string[];
} 