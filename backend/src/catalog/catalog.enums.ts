/** Mode de suivi des quantités d'un article (F02, F08). */
export enum TrackingMode {
  /** Aucun suivi de lot : un lot technique suffira plus tard. */
  NONE = 'none',
  /** Suivi par lot, sans date de péremption. */
  BATCH = 'batch',
  /** Suivi par lot avec date de péremption (obligatoire en pharmacie). */
  BATCH_EXPIRY = 'batch_expiry',
}

/** Ordre d'allocation des lots lors d'une sortie de stock. */
export enum AllocationPolicy {
  FIFO = 'fifo',
  FEFO = 'fefo',
}
