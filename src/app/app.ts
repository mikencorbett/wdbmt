import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { Players } from './api/players';
import { filter, forkJoin } from 'rxjs';
import { PlayerCategory } from './api/player-category';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlayerList } from './components/player-list/player-list';
import { PlayerInfo } from './api/player-info';
import { TierManager } from './components/tier-manager/tier-manager';
import { Tier } from './components/tier';

@Component({
  selector: 'app-root',
  imports: [
    MatSidenavModule,
    MatButtonToggle,
    MatButtonToggleGroup,
    ReactiveFormsModule,
    PlayerList,
    TierManager
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  tiers: Tier[] = [];
  connectedListIds: string[] = [];
  readonly playerCategories: WritableSignal<PlayerCategory[]> = signal([]);
  readonly activePlayerPool: WritableSignal<PlayerInfo[]> = signal([]);
  readonly activeCategoryControl = new FormControl<PlayerCategory | null>(null);
  private readonly players = inject(Players);
  private readonly destroyRef$ = inject(DestroyRef);

  ngOnInit(): void {
    this.subscribeToActivePositionChanges();
    this.initPlayerData();
  }

  private subscribeToActivePositionChanges(): void {
    this.activeCategoryControl
      .valueChanges
      .pipe(
        filter(cat => cat !== null),
        takeUntilDestroyed(this.destroyRef$)
      )
      .subscribe(cat => {
        this.activePlayerPool.set(cat.players);
        this.loadTiers();
      })
  }

  private initPlayerData(): void {
    forkJoin([
      this.players.getQuarterbacks(),
      this.players.getReceivers(),
      this.players.getRunningBacks(),
      this.players.getTightEnds()
    ]).subscribe(playerCategories => {
      this.playerCategories.set(playerCategories);
      this.activeCategoryControl.setValue(playerCategories[0]);
    })
  }

  private loadTiers(): void {
    //TODO: load from localstorage, default values if unavailable
    this.setDefaultTiers();
    this.setConnectedListIds();
  }

  private setConnectedListIds(): void {
    this.connectedListIds = ['primary-list', ...this.tiers.map((_, index) => `tier-${index}`)]
  }

  private setDefaultTiers(): void {
    this.tiers = [];
    for (let i: number = 0; i < 7; i++) {
      this.tiers.push({ players: [] })
    }
  }
}
