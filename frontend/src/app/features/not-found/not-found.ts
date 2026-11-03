import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `<p class="eyebrow">ERREUR 404</p>
    <h1>Page introuvable</h1>
    <p class="page-intro">Cette adresse ne correspond à aucune page de Kubagest.</p>
    <a class="button primary" routerLink="/accueil">Revenir à l’accueil</a>`,
})
export class NotFound {}
