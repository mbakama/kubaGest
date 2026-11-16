import { ConflictException, Injectable } from '@nestjs/common';
import type { EntityManager } from 'typeorm';
import { multiplyMoney } from '../common/money.js';
import { computeWeightedAverageCost } from './cump.js';
import { ProductValuation } from './product-valuation.entity.js';

export type ValuationSnapshot = {
  averageCost: string;
  totalValue: string;
  quantity: number;
};

@Injectable()
export class ProductValuationService {
  async recordReceipt(
    manager: EntityManager,
    input: {
      tenantId: string;
      warehouseId: string;
      physicalProductId: string;
      quantity: number;
      unitCost: string;
    },
  ): Promise<ValuationSnapshot> {
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const row = await manager.findOne(ProductValuation, {
        where: {
          tenantId: input.tenantId,
          warehouseId: input.warehouseId,
          physicalProductId: input.physicalProductId,
        },
      });
      if (!row) {
        try {
          const totalValue = multiplyMoney(input.unitCost, input.quantity);
          await manager.insert(ProductValuation, {
            tenantId: input.tenantId,
            warehouseId: input.warehouseId,
            physicalProductId: input.physicalProductId,
            quantity: input.quantity,
            averageCost: input.unitCost,
            totalValue,
            version: 0,
          });
          return {
            averageCost: input.unitCost,
            totalValue,
            quantity: input.quantity,
          };
        } catch {
          continue;
        }
      }

      const newQuantity = row.quantity + input.quantity;
      const averageCost = computeWeightedAverageCost(
        row.quantity,
        row.averageCost,
        input.quantity,
        input.unitCost,
      );
      const totalValue = multiplyMoney(averageCost, newQuantity);
      const updated = await manager.update(
        ProductValuation,
        { id: row.id, version: row.version },
        {
          quantity: newQuantity,
          averageCost,
          totalValue,
          version: row.version + 1,
        },
      );
      if (updated.affected === 1) {
        return { averageCost, totalValue, quantity: newQuantity };
      }
    }

    throw new ConflictException(
      'La valorisation a changé pendant la réception. Réessayez.',
    );
  }

  /** Aligner les quantités valorisées quand le stock bouge sans nouveau coût. */
  async adjustQuantity(
    manager: EntityManager,
    input: {
      tenantId: string;
      warehouseId: string;
      physicalProductId: string;
      quantityDelta: number;
    },
  ): Promise<ValuationSnapshot | null> {
    if (input.quantityDelta === 0) {
      return null;
    }

    for (let attempt = 0; attempt < 4; attempt += 1) {
      const row = await manager.findOne(ProductValuation, {
        where: {
          tenantId: input.tenantId,
          warehouseId: input.warehouseId,
          physicalProductId: input.physicalProductId,
        },
      });
      if (!row) {
        return null;
      }

      const newQuantity = row.quantity + input.quantityDelta;
      if (newQuantity < 0) {
        throw new ConflictException(
          'La quantité valorisée ne peut pas devenir négative',
        );
      }

      const totalValue = multiplyMoney(row.averageCost, newQuantity);
      const updated = await manager.update(
        ProductValuation,
        { id: row.id, version: row.version },
        {
          quantity: newQuantity,
          totalValue,
          version: row.version + 1,
        },
      );
      if (updated.affected === 1) {
        return {
          averageCost: row.averageCost,
          totalValue,
          quantity: newQuantity,
        };
      }
    }

    throw new ConflictException(
      'La valorisation a changé pendant le mouvement. Réessayez.',
    );
  }

  async findForProducts(
    manager: EntityManager,
    input: {
      tenantId: string;
      warehouseId: string;
      physicalProductIds: string[];
    },
  ): Promise<Map<string, ValuationSnapshot>> {
    if (input.physicalProductIds.length === 0) {
      return new Map();
    }

    const rows = await manager
      .createQueryBuilder(ProductValuation, 'pv')
      .where('pv.tenant_id = :tenantId', { tenantId: input.tenantId })
      .andWhere('pv.warehouse_id = :warehouseId', {
        warehouseId: input.warehouseId,
      })
      .andWhere('pv.physical_product_id IN (:...ids)', {
        ids: input.physicalProductIds,
      })
      .getMany();

    return new Map(
      rows.map((row) => [
        row.physicalProductId,
        {
          averageCost: row.averageCost,
          totalValue: row.totalValue,
          quantity: row.quantity,
        },
      ]),
    );
  }
}
