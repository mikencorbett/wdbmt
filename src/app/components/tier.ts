import { PlayerInfo } from '../api/player-info';

export interface Tier {
  players: PlayerInfo[];
}

interface TierGroup {
  position: string;
  tiers: Tier[];
}
