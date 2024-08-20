import type { LonLat } from '../../services/types';

export type File = {
  filepath: string;
  name: string;
  location: LonLat | null;
  date: Date;
};
