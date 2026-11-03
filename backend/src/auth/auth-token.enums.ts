/** Client à l'origine d'une session (§28.5). */
export enum AuthClientType {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  WEB = 'web',
}

/** Usage d'un jeton à consommation unique. */
export enum AccessTokenPurpose {
  INVITATION = 'invitation',
  PASSWORD_RESET = 'password_reset',
}
