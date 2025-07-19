import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDivider } from '@angular/material/divider';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { Players } from './api/players';
import { filter, forkJoin } from 'rxjs';
import { PlayerCategory } from './api/player-category';
import { Position } from './api/position';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatDivider,
    MatButtonToggle,
    MatButtonToggleGroup,
    ReactiveFormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('wdbmt');
  readonly playerCategories: WritableSignal<PlayerCategory[]> = signal([]);
  readonly activePositionControl = new FormControl<Position>(Position.qb);
  private readonly players = inject(Players);
  private readonly router = inject(Router);
  private readonly destroyRef$ = inject(DestroyRef);
  ngOnInit(): void {
    this.subscribeToActivePositionChanges();
    this.initPlayerData();
  }

  private subscribeToActivePositionChanges(): void {
    this.activePositionControl
      .valueChanges
      .pipe(
        filter(pos => pos !== null),
        takeUntilDestroyed(this.destroyRef$)
      )
      .subscribe(position => {
      this.router.navigate([`/${position}`]);
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
    })
  }
}
