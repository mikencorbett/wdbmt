import { Component, Input, OnInit } from '@angular/core';
import { Tier } from '../tier';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  moveItemInArray, transferArrayItem
} from '@angular/cdk/drag-drop';
import { PlayerList } from '../player-list/player-list';
import { PlayerInfo } from '../../api/player-info';

@Component({
  selector: 'app-tier-manager',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    PlayerList,
    CdkDragHandle,
    CdkDrag
  ],
  templateUrl: './tier-manager.html',
  styleUrl: './tier-manager.scss'
})
export class TierManager {
  @Input({ required: true }) tiers: Tier[] = [];
  @Input({ required: true }) connectedListIds: string[] = [];

  drop(event: CdkDragDrop<Tier[]>) {
    console.log(event);
    moveItemInArray(this.tiers, event.previousIndex, event.currentIndex);
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
  }

}
