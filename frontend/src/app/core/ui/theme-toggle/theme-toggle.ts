import { Component, inject } from '@angular/core';
import { ThemeService } from '../theme.service';

/** Segmented Jour / Nuit (maquette stitch 13-11). */
@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  templateUrl: './theme-toggle.html',
})
export class ThemeToggleComponent {
  readonly theme = inject(ThemeService);

  setLight(): void {
    if (!this.theme.dark()) return;
    this.theme.setLight();
  }

  setDark(): void {
    if (this.theme.dark()) return;
    this.theme.setDark();
  }
}
