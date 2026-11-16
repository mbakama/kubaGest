import { Injectable, inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

export type AppDialogConfirmOptions = {
  header?: string;
  message: string;
  acceptLabel?: string;
  rejectLabel?: string;
  icon?: string;
};

/** Façade Promise autour de `ConfirmationService` + `p-confirmDialog`. */
@Injectable({ providedIn: 'root' })
export class AppDialogService {
  private readonly confirmation = inject(ConfirmationService);

  confirm(options: AppDialogConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmation.confirm({
        header: options.header ?? 'Confirmation',
        message: options.message,
        icon: options.icon ?? 'pi pi-question-circle',
        acceptLabel: options.acceptLabel ?? 'Confirmer',
        rejectLabel: options.rejectLabel ?? 'Annuler',
        closable: false,
        accept: () => resolve(true),
        reject: () => resolve(false),
      });
    });
  }

  alert(options: {
    header?: string;
    message: string;
    acceptLabel?: string;
    icon?: string;
  }): Promise<void> {
    return new Promise((resolve) => {
      this.confirmation.confirm({
        header: options.header ?? 'Information',
        message: options.message,
        icon: options.icon ?? 'pi pi-info-circle',
        acceptLabel: options.acceptLabel ?? 'Fermer',
        rejectVisible: false,
        closable: false,
        dismissableMask: true,
        accept: () => resolve(),
        reject: () => resolve(),
      });
    });
  }
}
