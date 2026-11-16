import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { safeLegalReturnUrl } from '../../core/utils/legal-return.util';

@Component({
  selector: 'app-privacy-policy',
  imports: [RouterLink],
  templateUrl: './privacy-policy.html',
  styleUrl: './legal-document.scss',
})
export class PrivacyPolicy {
  private readonly route = inject(ActivatedRoute);

  readonly backPath = toSignal(
    this.route.queryParamMap.pipe(map((params) => safeLegalReturnUrl(params.get('retour')))),
    { initialValue: safeLegalReturnUrl(null) },
  );
}
