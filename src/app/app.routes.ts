import { Routes } from '@angular/router';
import { TierManager } from './components/tier-manager/tier-manager';
import { Position } from './api/position';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: Position.qb
  },
  {
    path: Position.qb,
    component: TierManager
  },
  {
    path: Position.wr,
    component: TierManager
  },
  {
    path: Position.rb,
    component: TierManager
  },
  {
    path: Position.te,
    component: TierManager
  },
];
