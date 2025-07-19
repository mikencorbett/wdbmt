import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { quarterbacks } from './data/quarterbacks';
import { runningBacks } from './data/running-backs';
import { receivers } from './data/receivers';
import { tightEnds } from './data/tight-ends';
import { PlayerCategory } from './player-category';
import { Position } from './position';

@Injectable({
  providedIn: 'root'
})
export class Players {
  getQuarterbacks(): Observable<PlayerCategory> {
    return of({ position: Position.qb, players: quarterbacks });
  }

  getRunningBacks(): Observable<PlayerCategory> {
    return of({ position: Position.rb, players: runningBacks });
  }

  getReceivers(): Observable<PlayerCategory> {
    return of({ position: Position.wr, players: receivers });
  }

  getTightEnds(): Observable<PlayerCategory> {
    return of({ position: Position.te, players: tightEnds });
  }
}
