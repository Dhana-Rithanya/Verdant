// Emission factors in kg CO₂e per unit
export const EMISSION_FACTORS = {
  transport: {
    car_petrol: { label: 'Car (Petrol)', kgPerKm: 0.21 },
    bus: { label: 'Bus', kgPerKm: 0.089 },
    flight_domestic: { label: 'Flight (Domestic)', kgPerKm: 0.255 },
  },
  food: {
    beef_meal: { label: 'Beef Meal', kgPerMeal: 6.6 },
    vegetarian_meal: { label: 'Vegetarian Meal', kgPerMeal: 1.1 },
  },
  energy: {
    electricity: { label: 'Electricity (India Grid)', kgPerKwh: 0.82 },
  },
  shopping: {
    // Generic placeholder — user enters estimated kg
    other: { label: 'Other Purchases', kgPerItem: 1.0 },
  },
};

export const CATEGORY_KEYS = ['transport', 'food', 'energy', 'shopping'];
export const CATEGORY_LABELS = {
  transport: 'Transport',
  food: 'Food',
  energy: 'Energy',
  shopping: 'Shopping',
};
export const CATEGORY_ICONS = {
  transport: 'Car',
  food: 'UtensilsCrossed',
  energy: 'Zap',
  shopping: 'ShoppingBag',
};
export const CATEGORY_COLORS = {
  transport: '#6B8F5E',
  food: '#C4956A',
  energy: '#8B6F47',
  shopping: '#4A7C59',
};