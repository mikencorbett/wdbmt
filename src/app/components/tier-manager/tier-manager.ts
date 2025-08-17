import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Tier } from '../tier';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { PlayerList } from '../player-list/player-list';
import { PlayerInfo } from '../../api/player-info';
import { MatIcon } from '@angular/material/icon';
import { LocalStorage } from '../../api/local-storage';
import { Position } from '../../api/position';
import { DragDropService } from '../../api/drag-drop';
import { MatFabButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

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
    MatIcon,
    MatFabButton,
    MatTooltip
  ],
  templateUrl: './tier-manager.html',
  styleUrl: './tier-manager.scss'
})
export class TierManager {
  @Input({ required: true }) tiers: Tier[] = [];
  @Input({ required: true }) connectedListIds: string[] = [];
  @Input({ required: true }) activeCategory: Position = Position.qb;
  @Input({ required: true }) isDraftModeEnabled = false;
  @Output() add = new EventEmitter<void>();
  @Output() delete = new EventEmitter<number>();
  private readonly localStorageService = inject(LocalStorage);
  private readonly dragDropService = inject(DragDropService);

  drop(event: CdkDragDrop<Tier[]>) {
    if (this.isDraftModeEnabled) {
      return;
    }
    moveItemInArray(this.tiers, event.previousIndex, event.currentIndex);
    if (this.activeCategory === Position.all) {
      Object.values(Position).forEach((item) => {
        if (item === Position.all) return;
        this.saveTiers(item);
      })
    } else {
      this.saveTiers();
    }
  }

  handlePlayerDrop(event: CdkDragDrop<PlayerInfo[]>) {
    if (this.isDraftModeEnabled) {
      return;
    }
    this.dragDropService.handleDragDrop(event);
    const position: Position = event.item.data.position;
    this.saveTiers(position);
  }

  saveTiers(position: Position | null = null): void {
    const tiersToSave = position
      ? this.tiers
        .map(tier => ({
          players: tier.players.filter(p => p.position === position)
        }))
        .filter(tier => tier.players.length > 0 || this.isEmptyTier(tier))
      : this.tiers;
    this.localStorageService.saveTier(position || this.activeCategory, tiersToSave);
  }

  isEmptyTier(tier: Tier): boolean {
    return !tier.players.length;
  }


  addTier(): void {
    this.add.emit();
  }

  deleteTier(index: number): void {
    this.delete.emit(index);
  }
}
