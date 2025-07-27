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

  drop(event: CdkDragDrop<Tier[]>) {
    moveItemInArray(this.tiers, event.previousIndex, event.currentIndex);
    this.saveTiers();
  }

  handlePlayerDrop(event: CdkDragDrop<PlayerInfo[]>) {
    const fromList = event.previousContainer.data;
    const toList = event.container.data;

    if (event.previousContainer !== event.container) {
      transferArrayItem(
        fromList,
        toList,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      moveItemInArray(toList, event.previousIndex, event.currentIndex);
    }
    this.saveTiers();
  }

  private saveTiers(): void {
    this.localStorageService.saveTier(this.activeCategory, this.tiers);
  }
}
