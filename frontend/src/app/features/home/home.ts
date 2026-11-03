import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <p class="eyebrow">BIENVENUE SUR KUBAGEST</p>
    <h1>Votre espace prend forme.</h1>
    <p class="page-intro">Le point de départ de votre travail au quotidien.</p>
    <section class="welcome-panel" aria-labelledby="welcome-title">
      <div class="welcome-copy">
        <span class="tag">Premiers pas</span>
        <h2 id="welcome-title">Une base prête pour la suite.</h2>
        <p>
          L’interface se prépare pendant la construction du serveur. Les fonctionnalités métier
          seront ajoutées à mesure que leurs parcours seront définis.
        </p>
        <a class="button primary" routerLink="/connexion"
          >Vérifier la connexion <span aria-hidden="true">↗</span></a
        >
      </div>
      <div class="brand-art" aria-hidden="true">K</div>
    </section>
    <section class="next-section" aria-labelledby="next-title">
      <p class="eyebrow">LA SUITE</p>
      <h2 id="next-title">Construire votre espace de travail</h2>
      <div class="step-row">
        <span class="step-number">01</span>
        <div>
          <h3>Relier le serveur</h3>
          <p>Vérifier la communication avec l’API.</p>
        </div>
        <a routerLink="/connexion">Vérifier →</a>
      </div>
      <div class="step-row">
        <span class="step-number">02</span>
        <div>
          <h3>Définir les premiers parcours</h3>
          <p>Préciser les écrans utiles à votre activité.</p>
        </div>
        <span class="muted">À définir</span>
      </div>
      <div class="step-row">
        <span class="step-number">03</span>
        <div>
          <h3>Connecter les fonctionnalités</h3>
          <p>Afficher les données réelles dès leur disponibilité.</p>
        </div>
        <span class="muted">À venir</span>
      </div>
    </section>
  `,
})
export class Home {}
