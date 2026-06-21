import { CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_KEYS } from '../utils/emissionFactors';

export default function BreakdownPanel({ totals = {} }) {
  const total = Object.values(totals).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="bg-[#FDFAF4] rounded-xl p-5 shadow-sm border border-stone-200">
      <h3 className="text-sm font-semibold text-stone-700 mb-4">Category Breakdown</h3>
      <div className="space-y-3">
        {CATEGORY_KEYS.map((key) => {
          const val = totals[key] || 0;
          const pct = (val / total) * 100;
          return (
            <div key={key}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-stone-600">{CATEGORY_LABELS[key]}</span>
                <span className="font-medium text-stone-800">{val.toFixed(1)} kg <span className="text-xs text-stone-400">({pct.toFixed(0)}%)</span></span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[key] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}