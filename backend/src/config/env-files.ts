import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

/**
 * Charge d'abord le fichier propre à l'environnement actif, puis `.env`.
 * Le chemin absolu évite que le résultat dépende du dossier de lancement.
 */
export function environmentFilePaths(nodeEnv = process.env.NODE_ENV ?? 'development'): string[] {
  return [resolve(backendRoot, `.env.${nodeEnv}`), resolve(backendRoot, '.env')];
}
