import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSidenavModule, MatDivider],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('wdbmt');
}
