import { PlayerInfo } from '../api/player-info';
import { Position } from '../api/position';

export interface Tier {
  players: PlayerInfo[];
}

export interface TierGroup {
  position: Position;
  tiers: Tier[];
}
