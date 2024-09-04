import { User } from './user';

export interface Total {
  id: number;
  user: User;
  sportEvents: number;
  academicEvents: number;
  culturalEvents: number;
  sociedadEvents: number;
  asuaEvents: number;
  penalty: number;
  totalEvents: number;
}
