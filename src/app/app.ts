import { Component, computed, DestroyRef, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
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
import { LocalStorage } from './api/local-storage';
import { Position } from './api/position';

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
  private readonly localStorageService = inject(LocalStorage);
  readonly playerCategories: WritableSignal<PlayerCategory[]> = signal([]);
  readonly activeCategoryControl = new FormControl<PlayerCategory | null>(null);
  private readonly destroyRef$ = inject(DestroyRef);
  readonly activeCategorySignal: WritableSignal<PlayerCategory | null> = signal(this.activeCategoryControl.value);
  readonly playerPool: Signal<PlayerInfo[]> = computed(() => {
    const activeCategory = this.activeCategorySignal();
    if (!activeCategory) {
      return [];
    }
    const usedPlayers = this.localStorageService.savedTiers()?.filter(t => t.position === activeCategory.position)
      .map(g => g.tiers.map(t => t.players).flat()).flat().map(p => p.name);
    if (!usedPlayers) {
      return activeCategory.players;
    } else {
      return activeCategory.players.filter(p => !usedPlayers.includes(p.name));
    }
  });

  private readonly players = inject(Players);

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
        this.activeCategorySignal.set(cat);
        this.loadTiers(cat?.position);
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

  private loadTiers(category: Position): void {
    if (this.localStorageService.savedTiers() === null) {
      this.setDefaultTiers();
      return;
    }
    if (this.localStorageService.savedTiers()?.some(v => v.position === category && v.tiers.length)) {
      this.tiers = this.localStorageService.savedTiers()?.filter(tg => tg.position === category).map(g => g.tiers).flat() ?? [];
    } else {
      this.setDefaultTiers();
    }
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
