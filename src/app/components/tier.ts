import { PlayerInfo } from '../api/player-info';

export interface Tier {
  players: PlayerInfo[];
}

export interface TierGroup {
  position: string;
  tiers: Tier[];
}
