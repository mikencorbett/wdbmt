import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PlayerInfo } from './player-info';
import { quarterbacks } from './data/quarterbacks';
import { runningBacks } from './data/running-backs';
import { receivers } from './data/receivers';
import { tightEnds } from './data/tight-ends';

@Injectable({
  providedIn: 'root'
})
export class Players {
  getQuarterbacks(): Observable<PlayerInfo[]> {
    return of(quarterbacks);
  }

  getRunningBacks(): Observable<PlayerInfo[]> {
    return of(runningBacks);
  }

  getReceivers(): Observable<PlayerInfo[]> {
    return of(receivers);
  }

  getTightEnds(): Observable<PlayerInfo[]> {
    return of(tightEnds);
  }
}
