import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'kubagest-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly dark = signal(false);

  constructor() {
    this.apply(this.readInitial(), false);
  }

  toggle(): void {
    this.apply(!this.dark());
  }

  setLight(): void {
    this.apply(false);
  }

  setDark(): void {
    this.apply(true);
  }

  private readInitial(): boolean {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
    } catch {
      /* quota / mode privé */
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private apply(dark: boolean, persist = true): void {
    this.dark.set(dark);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
      } catch {
        /* ignore */
      }
    }
  }
}
