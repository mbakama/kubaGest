import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'accueil' },
  {
    path: 'accueil',
    title: 'Accueil · Kubagest',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'connexion',
    title: 'Connexion au serveur · Kubagest',
    loadComponent: () => import('./features/connection/connection').then((m) => m.Connection),
  },
  {
    path: '**',
    title: 'Page introuvable · Kubagest',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
