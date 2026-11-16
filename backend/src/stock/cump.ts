import { addMoney, fromUnits, multiplyMoney, toUnits } from '../common/money.js';

/** Coût unitaire moyen pondéré après une entrée valorisée. */
export function computeWeightedAverageCost(
  oldQuantity: number,
  oldAverageCost: string,
  incomingQuantity: number,
  incomingUnitCost: string,
): string {
  if (incomingQuantity <= 0) {
    throw new Error('La quantité entrante doit être strictement positive');
  }

  const newQuantity = oldQuantity + incomingQuantity;
  if (oldQuantity <= 0) {
    return divideMoneyByQuantity(
      multiplyMoney(incomingUnitCost, incomingQuantity),
      newQuantity,
    );
  }

  const priorTotal = multiplyMoney(oldAverageCost, oldQuantity);
  const incomingTotal = multiplyMoney(incomingUnitCost, incomingQuantity);
  const newTotal = addMoney(priorTotal, incomingTotal);
  return divideMoneyByQuantity(newTotal, newQuantity);
}

export function divideMoneyByQuantity(total: string, quantity: number): string {
  if (quantity <= 0) {
    throw new Error('La quantité doit être strictement positive');
  }
  const totalUnits = toUnits(total);
  const rounded =
    (totalUnits * 2n + BigInt(quantity)) / (BigInt(quantity) * 2n);
  return fromUnits(rounded);
}
