import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AUTHENTICATION_PATH } from '../../core/auth/auth.paths';

/** Redirection `/` → connexion lorsqu’aucune session n’est active. */
@Component({
  selector: 'app-guest-home-redirect',
  template: '',
})
export class GuestHomeRedirect implements OnInit {
  private readonly router = inject(Router);

  ngOnInit(): void {
    void this.router.navigateByUrl(AUTHENTICATION_PATH, { replaceUrl: true });
  }
}
