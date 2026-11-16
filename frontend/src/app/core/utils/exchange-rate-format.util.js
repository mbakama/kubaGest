/** Affichage lisible du taux : `2850.5` → `2 850`. */
export function formatCdfPerUsdForDisplay(cdfPerUsd) {
    if (cdfPerUsd == null || !String(cdfPerUsd).trim()) {
        return null;
    }
    const value = Number(cdfPerUsd);
    if (!Number.isFinite(value) || value <= 0) {
        return null;
    }
    return new Intl.NumberFormat('fr-FR', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    }).format(Math.round(value));
}
