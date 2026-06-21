import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import ScoreBanner from '../components/ScoreBanner';
import CategoryCard from '../components/CategoryCard';
import BreakdownPanel from '../components/BreakdownPanel';
import InsightCard from '../components/InsightCard';
import { api } from '../utils/api';
import { CATEGORY_KEYS } from '../utils/emissionFactors';

export default function Dashboard() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [currentWeek, setCurrentWeek] = useState({ totals: {}, total: 0 });
  const [prevWeek, setPrevWeek] = useState({ totals: {}, total: 0 });

  useEffect(() => {
    api.getWeekly(6).then((data) => {
      const weeks = data.weeks || [];
      // Generate labels for each week
      const labeled = weeks.map((w) => {
        const d = new Date(w.weekStart + 'T00:00:00');
        const month = d.toLocaleString('en', { month: 'short' });
        const day = d.getDate();
        return { ...w, weekLabel: `${month} ${day}` };
      });
      setWeeklyData(labeled);
      setCurrentWeek(labeled[labeled.length - 1] || { totals: {}, total: 0 });
      setPrevWeek(labeled[labeled.length - 2] || { totals: {}, total: 0 });
    }).catch(() => {
      // Fallback to empty
    });
  }, []);

  const getDelta = (cat) => {
    const cur = currentWeek.totals[cat] || 0;
    const prev = prevWeek.totals[cat] || 0;
    if (prev === 0) return cur > 0 ? 100 : 0;
    return +(((cur - prev) / prev) * 100).toFixed(1);
  };

  const trendData = weeklyData.map((w) => ({
    week: w.weekLabel,
    ...w.totals,
    total: w.total,
  }));

  const sampleInsights = [
    'Your transport emissions dropped 12% this week — great job! Try carpooling twice a week to save ~8.4 kg CO₂e.',
    'Switching one beef meal to vegetarian saves ~5.5 kg CO₂e per meal. You had 3 beef meals this week.',
    'Your electricity usage is 15% above average. Unplugging devices when not in use could save ~3.2 kg CO₂e weekly.',
    'Consider buying second-hand or local products to reduce shopping-related emissions by up to 20%.',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-stone-800">Dashboard</h1>
        <p className="text-sm text-stone-500 mt-0.5">Your weekly carbon snapshot</p>
      </div>

      <ScoreBanner weeklyTotal={currentWeek.total} weeklyData={weeklyData} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORY_KEYS.map((cat) => (
          <CategoryCard
            key={cat}
            category={cat}
            value={currentWeek.totals[cat] || 0}
            delta={getDelta(cat)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BreakdownPanel totals={currentWeek.totals} />

        <div className="bg-[#FDFAF4] rounded-xl p-5 shadow-sm border border-stone-200">
          <h3 className="text-sm font-semibold text-stone-700 mb-4">6-Week Trend</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
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
                <Line type="monotone" dataKey="total" stroke="#2D4A2D" strokeWidth={2} dot={{ fill: '#2D4A2D', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-stone-700 mb-3">AI Insights</h3>
        <div className="space-y-3">
          {sampleInsights.map((tip, i) => (
            <InsightCard key={i} insight={tip} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}