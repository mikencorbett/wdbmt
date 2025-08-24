import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerInfo } from '../../api/player-info';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import { MatCheckbox } from '@angular/material/checkbox';
import { Position } from '../../api/position';

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
  @Input() activeView: Position = Position.qb;
  @Output() playerDrop = new EventEmitter<CdkDragDrop<PlayerInfo[]>>();
  @Output() playerDrafted = new EventEmitter<PlayerInfo>();

  drop(event: CdkDragDrop<PlayerInfo[]>) {
    this.playerDrop.emit(event);
  }

  markPlayerAsDrafted(player: PlayerInfo): void {
    player.wasDrafted = !player.wasDrafted;
    this.playerDrafted.emit(player);
  }

  protected readonly Position = Position;
}
