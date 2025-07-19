import { Component, Input } from '@angular/core';
import { PlayerInfo } from '../../api/player-info';

@Component({
  selector: 'app-player-list',
  imports: [],
  templateUrl: './player-list.html',
  styleUrl: './player-list.scss'
})
export class PlayerList {
  @Input() players: PlayerInfo[] = [];
}
