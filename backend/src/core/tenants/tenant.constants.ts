/**
 * Durée de la période d'essai accordée à l'activation d'un établissement
 * (F07 : affichage de l'échéance et du statut essai/actif/suspendu).
 */
export const TRIAL_PERIOD_DAYS = 30;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Échéance d'essai : maintenant + 30 jours. */
export function computeTrialEnd(from: Date = new Date()): Date {
  return new Date(from.getTime() + TRIAL_PERIOD_DAYS * MS_PER_DAY);
}
