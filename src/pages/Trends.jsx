import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { api } from '../utils/api';
import { CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_KEYS } from '../utils/emissionFactors';
import { toTreeEquivalent } from '../utils/calcCarbon';
import { TreesIcon as Tree } from 'lucide-react';

export default function Trends() {
  const [viewMode, setViewMode] = useState('kg');
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    api.getWeekly(12).then((data) => {
      const weeks = data.weeks || [];
      const labeled = weeks.map((w) => {
        const d = new Date(w.weekStart + 'T00:00:00');
        const month = d.toLocaleString('en', { month: 'short' });
        const day = d.getDate();
        return { ...w, weekLabel: `${month} ${day}` };
      });
      setWeeklyData(labeled);
    }).catch(() => {});
  }, []);

  const chartData = weeklyData.map((w) => {
    const point = { week: w.weekLabel };
    CATEGORY_KEYS.forEach((key) => {
      const val = w.totals[key] || 0;
      point[key] = viewMode === 'trees' ? toTreeEquivalent(val) : val;
    });
    point.total = viewMode === 'trees' ? toTreeEquivalent(w.total) : w.total;
    return point;
  });

  const unit = viewMode === 'trees' ? 'trees' : 'kg CO₂e';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-800">Trends</h1>
          <p className="text-sm text-stone-500 mt-0.5">Monthly & yearly carbon trends by category</p>
        </div>

        <div className="flex bg-[#F5F0E8] rounded-lg p-0.5 border border-stone-200">
          <button
            onClick={() => setViewMode('kg')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'kg' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            kg CO₂e
          </button>
          <button
            onClick={() => setViewMode('trees')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
              viewMode === 'trees' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <Tree className="w-3.5 h-3.5" />
            Trees
          </button>
        </div>
      </div>

      <div className="bg-[#FDFAF4] rounded-xl p-5 shadow-sm border border-stone-200">
        <h3 className="text-sm font-semibold text-stone-700 mb-4">Emissions by Category ({unit})</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4DCD0" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#78716C' }} />
              <YAxis tick={{ fontSize: 11, fill: '#78716C' }} />
              <Tooltip
                contentStyle={{
                  background: '#FDFAF4',
                  border: '1px solid #E4DCD0',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              {CATEGORY_KEYS.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={CATEGORY_LABELS[key]}
                  stroke={CATEGORY_COLORS[key]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: CATEGORY_COLORS[key] }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORY_KEYS.map((key) => {
          const total = weeklyData.reduce((sum, w) => sum + (w.totals[key] || 0), 0);
          const displayVal = viewMode === 'trees' ? toTreeEquivalent(total) : total;
          return (
            <div key={key} className="bg-[#FDFAF4] rounded-xl p-4 shadow-sm border border-stone-200">
              <p className="text-xs font-medium text-stone-500">{CATEGORY_LABELS[key]}</p>
              <p className="text-lg font-bold text-stone-800 mt-1">
                {displayVal.toFixed(1)}
                <span className="text-xs font-normal text-stone-400 ml-1">{viewMode === 'trees' ? 'trees' : 'kg'}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}