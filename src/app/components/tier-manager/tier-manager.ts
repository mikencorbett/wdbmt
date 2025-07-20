import { Component, OnInit } from '@angular/core';
import { Tier } from '../tier';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
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
export class TierManager implements OnInit {
  tiers: Tier[] = [];
  connectedListIds: string[] = [];

  //TODO: load saved data from localstorage (if available)
  ngOnInit() {
    this.setDefaultTiers();
    this.setConnectedListIds();
  }

  private setDefaultTiers(): void {
    for (let i: number = 0; i < 7; i++) {
      this.tiers.push({ players: [] })
    }
    //TODO: remove fake data when done.
    this.tiers[0].players.push({ name: 'test', byeWeek: 7, team: 'BUF', portrait_url: '' })
    this.tiers[0].players.push({ name: '2', byeWeek: 7, team: 'DEN', portrait_url: '' })
    this.tiers[0].players.push({ name: '4', byeWeek: 7, team: 'SF', portrait_url: '' })
  }

  drop(event: CdkDragDrop<Tier[]>) {
    console.log(event);
    moveItemInArray(this.tiers, event.previousIndex, event.currentIndex);
  }

  private setConnectedListIds(): void {
    this.connectedListIds = this.tiers.map((_, index) => `tier-${index}`)
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
