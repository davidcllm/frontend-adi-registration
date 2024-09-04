import { User } from './user';
import { Event } from './event';

export interface Registration {
  id: number;
  user: User;
  event: Event;
  photos: string;
  scan: boolean;
  aprobado: string;
}
