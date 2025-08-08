import { Component, inject, Input, OnInit } from '@angular/core';
import { Tier } from '../tier';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle, CdkDropList, CdkDropListGroup,
  moveItemInArray, transferArrayItem
} from '@angular/cdk/drag-drop';
import { PlayerList } from '../player-list/player-list';
import { PlayerInfo } from '../../api/player-info';
import { MatIcon } from '@angular/material/icon';
import { LocalStorage } from '../../api/local-storage';
import { PlayerCategory } from '../../api/player-category';
import { Position } from '../../api/position';
import { DragDropService } from '../../api/drag-drop';

@Component({
  selector: 'app-tier-manager',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    PlayerList,
    CdkDragHandle,
    CdkDrag,
    CdkDropList,
    MatIcon
  ],
  templateUrl: './tier-manager.html',
  styleUrl: './tier-manager.scss'
})
export class TierManager {
  @Input({ required: true }) tiers: Tier[] = [];
  @Input({ required: true }) connectedListIds: string[] = [];
  @Input({ required: true }) activeCategory: Position = Position.qb;

  private readonly localStorageService = inject(LocalStorage);
  private readonly dragDropService = inject(DragDropService);

  drop(event: CdkDragDrop<Tier[]>) {
    moveItemInArray(this.tiers, event.previousIndex, event.currentIndex);
    this.saveTiers();
  }

  handlePlayerDrop(event: CdkDragDrop<PlayerInfo[]>) {
    this.dragDropService.handleDragDrop(event);
    const position: Position = event.item.data.position;
    this.saveTiers(position);
  }

  private saveTiers(position: Position | null = null): void {
    const tiersToSave = position
      ? this.tiers
        .map(tier => ({
          players: tier.players.filter(p => p.position === position)
        }))
        .filter(tier => tier.players.length > 0 || this.isEmptyTier(tier))
      : this.tiers;
    this.localStorageService.saveTier(position || this.activeCategory, tiersToSave);
  }

  private isEmptyTier(tier: Tier): boolean {
    return tier.players.length === 0;
  }


}
