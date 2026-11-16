import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-dialog-host',
  imports: [ConfirmDialogModule, Button],
  template: `
    <p-confirmDialog
      [draggable]="false"
      [closable]="false"
      styleClass="!border-0 !bg-transparent !shadow-none [&_.p-dialog-content]:!p-0"
      [breakpoints]="{ '640px': '95vw' }"
    >
      <ng-template #headless let-message let-onAccept="onAccept" let-onReject="onReject">
        @if (message) {
          <div
            class="w-[min(28rem,95vw)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.12)]"
            role="alertdialog"
            [attr.aria-labelledby]="'app-dialog-title'"
            [attr.aria-describedby]="'app-dialog-message'"
          >
            <div class="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <h2 id="app-dialog-title" class="m-0 text-base font-semibold text-[#162338]">
                {{ message.header }}
              </h2>
              <button
                type="button"
                class="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                (click)="onReject()"
                aria-label="Fermer"
              >
                <i class="pi pi-times text-sm" aria-hidden="true"></i>
              </button>
            </div>

            <div class="flex items-start gap-3 px-5 py-4 text-[#31445f]">
              @if (message.icon) {
                <i [class]="message.icon + ' mt-0.5 text-xl text-primary'" aria-hidden="true"></i>
              }
              <p id="app-dialog-message" class="m-0 text-sm leading-relaxed">{{ message.message }}</p>
            </div>

            <div class="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4">
              @if (message.rejectVisible !== false) {
                <p-button
                  [label]="message.rejectLabel ?? 'Annuler'"
                  severity="secondary"
                  [outlined]="true"
                  (onClick)="onReject()"
                />
              }
              <p-button [label]="message.acceptLabel ?? 'Confirmer'" (onClick)="onAccept()" />
            </div>
          </div>
        }
      </ng-template>
    </p-confirmDialog>
  `,
})
export class AppDialogHostComponent {}
