import { Injectable, signal, Signal } from '@angular/core';
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
  private readonly quarterbacks_ = signal<PlayerCategory>({ position: Position.qb, players: quarterbacks });
  private readonly recievers_ = signal<PlayerCategory>({ position: Position.wr, players: receivers });
  private readonly tightEnds_ = signal<PlayerCategory>({ position: Position.te, players: tightEnds });
  private readonly runningBacks_ = signal<PlayerCategory>({ position: Position.rb, players: runningBacks });
  private readonly all_ = signal<PlayerCategory>({ position: Position.all, players: [...quarterbacks, ...runningBacks, ...receivers, ...tightEnds] });

  get quarterbacks(): Signal<PlayerCategory> {
    return this.quarterbacks_.asReadonly();
  }

  get runningBacks(): Signal<PlayerCategory> {
    return this.runningBacks_.asReadonly();
  }

  get recievers(): Signal<PlayerCategory> {
    return this.recievers_.asReadonly();
  }

  get tightEnds(): Signal<PlayerCategory> {
    return this.tightEnds_.asReadonly();
  }

  get all(): Signal<PlayerCategory> {
    return this.all_.asReadonly();
  }
}
