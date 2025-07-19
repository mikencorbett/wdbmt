import { PlayerInfo } from './player-info';
import { Position } from './position';

export interface PlayerCategory {
  position: Position;
  players: PlayerInfo[];
}
