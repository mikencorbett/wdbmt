import { Component, computed, effect, inject, Signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { Players } from './api/players';
import { PlayerCategory } from './api/player-category';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { PlayerList } from './components/player-list/player-list';
import { PlayerInfo } from './api/player-info';
import { TierManager } from './components/tier-manager/tier-manager';
import { Tier } from './components/tier';
import { LocalStorage } from './api/local-storage';
import { Position } from './api/position';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DragDropService } from './api/drag-drop';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  imports: [
    MatSidenavModule,
    MatButtonToggle,
    MatButtonToggleGroup,
    ReactiveFormsModule,
    PlayerList,
    TierManager,
    MatSlideToggleModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  tiers: Tier[] = [];
  connectedListIds: string[] = [];
  private readonly localStorageService = inject(LocalStorage);
  private readonly dragDropService = inject(DragDropService);
  private readonly players = inject(Players);
  readonly playerCategories = computed(() => {
    return [this.players.quarterbacks(), this.players.recievers(), this.players.runningBacks(), this.players.tightEnds(), this.players.all()]
  })
  readonly activeCategoryControl = new FormControl<PlayerCategory>(this.playerCategories()[0], { nonNullable: true });
  readonly draftModeControl = new FormControl(false, { nonNullable: true });
  readonly activeCategory = toSignal(this.activeCategoryControl.valueChanges, { initialValue: this.playerCategories()[0] });

  readonly playerPool: Signal<PlayerInfo[]> = computed(() => {
    const activeCategory = this.activeCategory();
    if (!activeCategory) {
      return [];
    }
    const positionsToFilterOn = activeCategory.position === Position.all ? [Position.qb, Position.rb, Position.wr, Position.te] : [activeCategory.position];
    const usedPlayers = this.localStorageService.savedTiers()?.filter(t => positionsToFilterOn.includes(t.position))
      .map(g => g.tiers.map(t => t.players).flat()).flat().map(p => p.name);
    if (!usedPlayers) {
      return activeCategory.players;
    } else {
      return activeCategory.players.filter(p => !usedPlayers.includes(p.name));
    }
  });

  constructor() {
    this.subscribeToActivePositionChanges();
  }

  handlePlayerDrop(event: CdkDragDrop<PlayerInfo[]>) {
    this.dragDropService.handleDragDrop(event)
    this.saveTiers();
  }

  private saveTiers(): void {
    const position = this.activeCategory().position;
    this.localStorageService.saveTier(position, this.tiers);
  }

  private subscribeToActivePositionChanges(): void {
    effect(_ => this.loadTiers(this.activeCategory().position))
  }

  private loadTiers(category: Position): void {
    const saved = this.localStorageService.savedTiers();
    if (!saved) {
      this.setDefaultTiers();
      return;
    }
    const positionsToFilterOn =
      category === Position.all
        ? [Position.qb, Position.rb, Position.wr, Position.te]
        : [category];

    const filtered = saved.filter(tg => positionsToFilterOn.includes(tg.position) && tg.tiers.length);

    if (filtered.length) {
      const maxTiers = Math.max(...filtered.map(p => p.tiers.length));
      const combined: Tier[][] = Array.from({ length: maxTiers }, () => []);
      filtered.forEach(({ tiers }) => {
        tiers.forEach((tier, index) => {
          combined[index].push({ players: [...tier.players] });
        });
      });
      this.tiers = combined.map(group => ({
        players: group.flatMap(t => t.players)
      }));

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
      this.tiers.push({players: []})
    }
  }
}
