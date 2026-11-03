import { Injectable } from '@nestjs/common';
import type { EntityManager } from 'typeorm';
import { DocumentCounter } from './document-counter.entity.js';

export type DocumentKind = 'sale' | 'credit';

const PREFIXES: Record<DocumentKind, string> = {
  sale: 'T',
  credit: 'CR',
};

/**
 * Numérotation lisible et unique par commerce.
 *
 * L'incrément est un comparaison-et-échange : la ligne est relue, puis mise à
 * jour uniquement si sa valeur n'a pas changé. Deux ventes simultanées ne
 * peuvent donc pas obtenir le même numéro ; la seconde réessaie. Le procédé
 * fonctionne aussi bien en PostgreSQL qu'en SQLite, contrairement à
 * `ON CONFLICT ... RETURNING` dont les paramètres diffèrent.
 */
@Injectable()
export class DocumentNumberService {
  async next(
    manager: EntityManager,
    tenantId: string,
    kind: DocumentKind,
    period: string,
    attempts = 8,
  ): Promise<string> {
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const counter = await manager.findOne(DocumentCounter, {
        where: { tenantId, documentKind: kind, period },
      });

      if (!counter) {
        try {
          await manager.insert(DocumentCounter, {
            tenantId,
            documentKind: kind,
            period,
            lastValue: 1,
          });
          return this.format(kind, 1);
        } catch {
          // Une autre opération a créé le compteur : on relit et on réessaie.
          continue;
        }
      }

      const result = await manager.update(
        DocumentCounter,
        { id: counter.id, lastValue: counter.lastValue },
        { lastValue: counter.lastValue + 1 },
      );

      if (result.affected === 1) {
        return this.format(kind, counter.lastValue + 1);
      }
    }

    throw new Error('Numérotation impossible : compteur très sollicité');
  }

  private format(kind: DocumentKind, value: number): string {
    return `${PREFIXES[kind]}-${value.toString().padStart(6, '0')}`;
  }
}
