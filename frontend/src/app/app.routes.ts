import { Routes } from '@angular/router';
import {
  guestAtHomeCanMatch,
  guestGuard,
  platformSessionCanMatch,
  platformSessionGuard,
  tenantSessionCanMatch,
  tenantSessionGuard,
  tenantOwnerGuard,
} from './core/auth/auth.guards';

export const routes: Routes = [
  {
    path: '',
    canMatch: [platformSessionCanMatch],
    canActivate: [platformSessionGuard],
    loadComponent: () =>
      import('./core/layouts/platform/layout/platform-layout').then((m) => m.PlatformLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Administration plateforme · KubaGest',
        loadComponent: () =>
          import('./features/platform/dashboard/platform-dashboard').then(
            (m) => m.PlatformDashboard,
          ),
      },
      {
        path: 'profil',
        title: 'Mon profil · KubaGest',
        loadComponent: () =>
          import('./features/platform/profile/platform-profile').then((m) => m.PlatformProfile),
      },
      {
        path: 'journal-activite',
        title: 'Journal d’audit · KubaGest',
        loadComponent: () =>
          import('./features/platform/activity/platform-activity').then(
            (m) => m.PlatformActivity,
          ),
      },
      {
        path: 'parametres',
        title: 'Paramètres · KubaGest',
        loadComponent: () =>
          import('./features/platform/settings/platform-settings').then((m) => m.PlatformSettings),
      },
    ],
  },
  {
    path: '',
    canMatch: [tenantSessionCanMatch],
    canActivate: [tenantSessionGuard],
    loadComponent: () =>
      import('./core/layouts/tenant/layout/tenant-layout').then((m) => m.TenantLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Tableau de bord · KubaGest',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'utilisateurs-roles',
        pathMatch: 'full',
        canActivate: [tenantOwnerGuard],
        title: 'Utilisateurs & Rôles · KubaGest',
        loadComponent: () =>
          import('./features/tenant/utilisateurs-droits/utilisateurs-droits').then(
            (m) => m.UtilisateursDroits,
          ),
      },
      {
        path: 'settings',
        pathMatch: 'full',
        title: 'Paramètres établissement · KubaGest',
        loadComponent: () => import('./features/tenant/settings/settings').then((m) => m.Settings),
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    canMatch: [guestAtHomeCanMatch],
    loadComponent: () =>
      import('./features/auth/guest-home-redirect').then((m) => m.GuestHomeRedirect),
  },
  { path: 'accueil', pathMatch: 'full', redirectTo: '' },
  { path: 'plateforme', pathMatch: 'full', redirectTo: '' },
  { path: 'app', pathMatch: 'prefix', redirectTo: '' },
  {
    path: 'authentification',
    title: 'Authentification · KubaGest',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  { path: 'connexion', pathMatch: 'full', redirectTo: 'authentification' },
  {
    path: 'invitation',
    title: 'Activer mon compte · KubaGest',
    loadComponent: () =>
      import('./features/auth/update-password/update-password').then((m) => m.UpdatePassword),
  },
  {
    path: 'mot-de-passe-oublie',
    title: 'Mot de passe oublié · KubaGest',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password').then((m) => m.ForgotPassword),
    data: { forgotStep: 'email' },
  },
  {
    path: 'mot-de-passe-oublie/verification',
    title: 'Code de vérification · KubaGest',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password').then((m) => m.ForgotPassword),
    data: { forgotStep: 'verify' },
  },
  {
    path: 'mot-de-passe-oublie/nouveau',
    title: 'Nouveau mot de passe · KubaGest',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password').then((m) => m.ForgotPassword),
    data: { forgotStep: 'reset' },
  },
  {
    path: 'authentification/mot-de-passe-oublie',
    pathMatch: 'full',
    redirectTo: 'mot-de-passe-oublie',
  },
  {
    path: 'authentification/mot-de-passe-oublie/verification',
    pathMatch: 'full',
    redirectTo: 'mot-de-passe-oublie/verification',
  },
  {
    path: 'authentification/mot-de-passe-oublie/nouveau',
    pathMatch: 'full',
    redirectTo: 'mot-de-passe-oublie/nouveau',
  },
  {
    path: 'connexion/mot-de-passe-oublie',
    pathMatch: 'full',
    redirectTo: 'mot-de-passe-oublie',
  },
  {
    path: 'connexion/mot-de-passe-oublie/verification',
    pathMatch: 'full',
    redirectTo: 'mot-de-passe-oublie/verification',
  },
  {
    path: 'connexion/mot-de-passe-oublie/nouveau',
    pathMatch: 'full',
    redirectTo: 'mot-de-passe-oublie/nouveau',
  },
  {
    path: 'inscription',
    title: 'Créer un espace · KubaGest',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'confidentialite',
    title: 'Politique de confidentialité · KubaGest',
    loadComponent: () => import('./features/legal/privacy-policy').then((m) => m.PrivacyPolicy),
  },
  {
    path: 'conditions-utilisation',
    title: 'Conditions d’utilisation · KubaGest',
    loadComponent: () => import('./features/legal/terms-of-use').then((m) => m.TermsOfUse),
  },
  {
    path: '**',
    title: 'Page introuvable · KubaGest',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
