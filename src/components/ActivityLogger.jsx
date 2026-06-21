import { useState, useMemo } from 'react';
import { EMISSION_FACTORS } from '../utils/emissionFactors';
import { computeCarbon } from '../utils/calcCarbon';

const CATEGORY_OPTIONS = [
  { value: 'transport', label: 'Transport' },
  { value: 'food', label: 'Food' },
  { value: 'energy', label: 'Energy' },
  { value: 'shopping', label: 'Shopping' },
];

export default function ActivityLogger({ onSave }) {
  const [category, setCategory] = useState('transport');
  const [type, setType] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  // Derive available types for selected category
  const typeOptions = useMemo(() => {
    const factors = EMISSION_FACTORS[category];
    if (!factors) return [];
    return Object.entries(factors).map(([key, f]) => ({
      value: key,
      label: f.label,
    }));
  }, [category]);

  // Auto-select first type when category changes
  useMemo(() => {
    if (typeOptions.length > 0 && !typeOptions.find((t) => t.value === type)) {
      setType(typeOptions[0].value);
    }
  }, [typeOptions, type]);

  // Live CO₂ preview
  const preview = useMemo(() => {
    if (!value || isNaN(parseFloat(value))) return null;
    return computeCarbon({ category, type, value: parseFloat(value) });
  }, [category, type, value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value || isNaN(parseFloat(value)) || parseFloat(value) <= 0) return;
    const result = computeCarbon({ category, type, value: parseFloat(value) });
    onSave({
      category,
      type,
      value: parseFloat(value),
      co2e: result.co2e,
      details: result.details,
      date,
    });
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#FDFAF4] rounded-xl p-5 shadow-sm border border-stone-200 space-y-4">
      <h3 className="text-sm font-semibold text-stone-700">Log New Activity</h3>

      {/* Date */}
      <div>
        <label className="block text-xs font-medium text-stone-500 mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#6B8F5E]/30"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-medium text-stone-500 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#6B8F5E]/30"
        >
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Type */}
      <div>
        <label className="block text-xs font-medium text-stone-500 mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#6B8F5E]/30"
        >
          {typeOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Value */}
      <div>
        <label className="block text-xs font-medium text-stone-500 mb-1">
          {category === 'transport' ? 'Distance (km)' : category === 'food' ? 'Number of meals' : category === 'energy' ? 'Energy used (kWh)' : 'Estimated kg CO₂e'}
        </label>
        <input
          type="number"
          min="0"
          step="0.1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0"
          className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#6B8F5E]/30"
        />
      </div>

      {/* Live preview */}
      {preview && (
        <div className="bg-[#F5F0E8] rounded-lg px-3 py-2 text-sm">
          <span className="text-stone-500">Estimated CO₂e: </span>
          <span className="font-semibold text-stone-800">{preview.co2e} kg</span>
          <span className="text-stone-400 text-xs ml-2">{preview.details}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!value || isNaN(parseFloat(value)) || parseFloat(value) <= 0}
        className="w-full py-2.5 rounded-lg bg-[#2D4A2D] text-white text-sm font-medium hover:bg-[#3D6B3D] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Log Activity
      </button>
    </form>
  );
}