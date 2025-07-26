import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerInfo } from '../../api/player-info';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-player-list',
  imports: [
    CdkDropList,
    CdkDrag,
    NgClass
  ],
  templateUrl: './player-list.html',
  styleUrl: './player-list.scss'
})
export class PlayerList {
  @Input() players: PlayerInfo[] = [];
  @Input() listId: string = '';
  @Input() connectedListIds: string[] = [];
  @Output() itemDropped = new EventEmitter<CdkDragDrop<string[]>>();
  @Output() playerDrop = new EventEmitter<CdkDragDrop<PlayerInfo[]>>();

  drop(event: CdkDragDrop<PlayerInfo[]>) {
    this.playerDrop.emit(event);
  }


}
