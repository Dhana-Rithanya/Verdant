import { Car, UtensilsCrossed, Zap, ShoppingBag } from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/emissionFactors';

const iconMap = { Car, UtensilsCrossed: UtensilsCrossed, Zap, ShoppingBag };

export default function CategoryCard({ category, value = 0, delta = 0 }) {
  const Icon = iconMap[category === 'transport' ? 'Car' : category === 'food' ? 'UtensilsCrossed' : category === 'energy' ? 'Zap' : 'ShoppingBag'] || ShoppingBag;
  const color = CATEGORY_COLORS[category] || '#6B8F5E';
  const label = CATEGORY_LABELS[category] || category;

  const deltaAbs = Math.abs(delta);
  const isUp = delta > 0;

  return (
    <div className="bg-[#FDFAF4] rounded-xl p-4 shadow-sm border border-stone-200 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <span className="text-sm font-medium text-stone-700">{label}</span>
        </div>
        {delta !== 0 && (
          <span
            className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
              isUp ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'
            }`}
          >
            {isUp ? '↑' : '↓'} {deltaAbs.toFixed(1)}%
          </span>
        )}
      </div>
      <p className="text-xl font-bold text-stone-800">{value.toFixed(1)} <span className="text-xs font-normal text-stone-400">kg</span></p>
    </div>
  );
}