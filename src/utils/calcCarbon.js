import { EMISSION_FACTORS } from './emissionFactors';

/**
 * Compute the CO₂e for a single activity log entry.
 * Returns { co2e, category, details }
 */
export function computeCarbon(formData) {
  const { category, type, value } = formData;
  const num = parseFloat(value) || 0;

  switch (category) {
    case 'transport': {
      const factor = EMISSION_FACTORS.transport[type];
      if (!factor) return { co2e: 0, category, details: 'Unknown transport' };
      return {
        co2e: +(num * factor.kgPerKm).toFixed(2),
        category,
        details: `${factor.label} — ${num} km`,
      };
    }
    case 'food': {
      const factor = EMISSION_FACTORS.food[type];
      if (!factor) return { co2e: 0, category, details: 'Unknown meal' };
      const co2e = +(num * factor.kgPerMeal).toFixed(2);
      return {
        co2e,
        category,
        details: `${factor.label} × ${num}`,
      };
    }
    case 'energy': {
      const factor = EMISSION_FACTORS.energy[type];
      if (!factor) return { co2e: 0, category, details: 'Unknown energy' };
      return {
        co2e: +(num * factor.kgPerKwh).toFixed(2),
        category,
        details: `${factor.label} — ${num} kWh`,
      };
    }
    case 'shopping': {
      // user enters estimated kg CO₂ directly
      return {
        co2e: +num.toFixed(2),
        category,
        details: `Other purchases — estimated ${num} kg CO₂e`,
      };
    }
    default:
      return { co2e: 0, category, details: 'Unknown category' };
  }
}

/**
 * kg CO₂e → tree-equivalent visual (1 tree ≈ 22 kg CO₂e/year)
 */
export function toTreeEquivalent(kgCo2e) {
  return +(kgCo2e / 22).toFixed(1);
}