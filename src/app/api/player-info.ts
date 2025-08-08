import { Position } from './position';

export interface PlayerInfo {
  name: string;
  team: string;
  byeWeek: number;
  position: Position;
}
