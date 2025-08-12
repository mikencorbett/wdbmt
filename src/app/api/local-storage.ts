import { Injectable, signal, WritableSignal } from '@angular/core';
import { Tier, TierGroup } from '../components/tier';
import { Position } from './position';

@Injectable({
  providedIn: 'root'
})
export class LocalStorage {
  private readonly WDBMT_LOCAL_STORAGE_KEY = 'wdbmt-tier-';
  private readonly positions = Position;
  readonly savedTiers: WritableSignal<TierGroup[] | null> = signal(null);

  saveTier(position: Position, tiers: Tier[]): void {
    localStorage.setItem(`${this.WDBMT_LOCAL_STORAGE_KEY}-${position}`, JSON.stringify(tiers));
    this.setSavedTiers();
  }

  setSavedTiers(): void {
    this.savedTiers.set(Object.values(this.positions).map((position) => {
      const savedTierJson = localStorage.getItem(`${this.WDBMT_LOCAL_STORAGE_KEY}-${position}`);
      return {
        position,
        tiers: savedTierJson ? JSON.parse(savedTierJson) as Tier[] : []
      }
    }));
  }
}
