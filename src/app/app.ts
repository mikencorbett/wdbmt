import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { Players } from './api/players';
import { filter, forkJoin } from 'rxjs';
import { PlayerCategory } from './api/player-category';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlayerList } from './components/player-list/player-list';
import { PlayerInfo } from './api/player-info';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatButtonToggle,
    MatButtonToggleGroup,
    ReactiveFormsModule,
    PlayerList
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  readonly playerCategories: WritableSignal<PlayerCategory[]> = signal([]);
  readonly activePlayerPool: WritableSignal<PlayerInfo[]> = signal([]);
  readonly activeCategoryControl = new FormControl<PlayerCategory | null>(null);
  private readonly players = inject(Players);
  private readonly router = inject(Router);
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
        this.router.navigate([`/${cat.position}`]);
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
}
