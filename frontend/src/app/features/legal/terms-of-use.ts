import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { safeLegalReturnUrl } from '../../core/utils/legal-return.util';

@Component({
  selector: 'app-terms-of-use',
  imports: [RouterLink],
  templateUrl: './terms-of-use.html',
  styleUrl: './legal-document.scss',
})
export class TermsOfUse {
  private readonly route = inject(ActivatedRoute);

  readonly backPath = toSignal(
    this.route.queryParamMap.pipe(map((params) => safeLegalReturnUrl(params.get('retour')))),
    { initialValue: safeLegalReturnUrl(null) },
  );
}
