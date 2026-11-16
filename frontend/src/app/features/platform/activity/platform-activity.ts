import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/api/api.service';
import type { PlatformDashboardActivity } from '../../../core/api/platform-dashboard.types';

@Component({
  selector: 'app-platform-activity',
  imports: [RouterLink],
  templateUrl: './platform-activity.html',
  styleUrl: './platform-activity.scss',
})
export class PlatformActivity implements OnInit {
  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly entries = signal<PlatformDashboardActivity[]>([]);
  readonly selectedId = signal(this.route.snapshot.queryParamMap.get('entree'));
  readonly search = signal('');
  readonly actionFilter = signal('all');

  readonly actionKinds = computed(() => [...new Set(this.entries().map((entry) => entry.kind))]);
  readonly actorCount = computed(
    () => new Set(this.entries().map((entry) => this.actor(entry))).size,
  );
  readonly todayCount = computed(() => {
    const today = new Date().toDateString();
    return this.entries().filter((entry) => new Date(entry.occurredAt).toDateString() === today)
      .length;
  });
  readonly filteredEntries = computed(() => {
    const query = this.search().trim().toLocaleLowerCase('fr');
    const kind = this.actionFilter();
    return this.entries().filter((entry) => {
      const matchesKind = kind === 'all' || entry.kind === kind;
      const haystack =
        `${entry.title} ${entry.detail} ${this.actor(entry)} ${entry.actorEmail ?? ''}`.toLocaleLowerCase(
          'fr',
        );
      return matchesKind && (!query || haystack.includes(query));
    });
  });

  ngOnInit(): void {
    this.api
      .getPlatformActivityLog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (entries) => {
          this.entries.set(entries);
          this.loading.set(false);
          setTimeout(() => this.scrollToSelected(), 0);
        },
        error: (error: unknown) => {
          this.loading.set(false);
          this.error.set(
            error instanceof HttpErrorResponse && error.status === 403
              ? 'Accès au registre refusé.'
              : 'Impossible de charger le registre d’audit.',
          );
        },
      });
  }

  actor(entry: PlatformDashboardActivity): string {
    return entry.actorName ?? entry.actorEmail ?? 'Système';
  }

  initials(entry: PlatformDashboardActivity): string {
    return this.actor(entry)
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  actionIcon(kind: string): string {
    return kind === 'tenant.registered'
      ? 'fa-building-circle-check'
      : kind === 'tenant.subscription.updated'
        ? 'fa-file-signature'
        : 'fa-shield-halved';
  }

  updateSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  updateActionFilter(event: Event): void {
    this.actionFilter.set((event.target as HTMLSelectElement).value);
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  private scrollToSelected(): void {
    const id = this.selectedId();
    if (id)
      document
        .getElementById(`audit-${id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
