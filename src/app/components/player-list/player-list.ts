import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { PlayerInfo } from '../../api/player-info';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import { DragDropService } from '../../api/drag-drop';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-player-list',
  imports: [
    CdkDropList,
    CdkDrag,
    NgClass,
    MatCheckbox
  ],
  templateUrl: './player-list.html',
  styleUrl: './player-list.scss'
})
export class PlayerList {
  @Input() players: PlayerInfo[] = [];
  @Input() listId: string = '';
  @Input() connectedListIds: string[] = [];
  @Input() isDraftModeEnabled = false;
  @Output() playerDrop = new EventEmitter<CdkDragDrop<PlayerInfo[]>>();
  @Output() playerDrafted = new EventEmitter<PlayerInfo>();

  drop(event: CdkDragDrop<PlayerInfo[]>) {
    this.playerDrop.emit(event);
  }

  markPlayerAsDrafted(player: PlayerInfo): void {
    player.wasDrafted = !player.wasDrafted;
    this.playerDrafted.emit(player);
  }
}
