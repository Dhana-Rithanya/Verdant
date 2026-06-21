import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';
import { TreesIcon as Tree } from 'lucide-react';
import { toTreeEquivalent } from '../utils/calcCarbon';

export default function ScoreBanner({ weeklyTotal = 0, weeklyData = [] }) {
  const trees = toTreeEquivalent(weeklyTotal);

  // Build mini bar chart data from weeklyData (array of { weekLabel, total })
  const chartData = weeklyData.map((w) => ({
    name: w.weekLabel,
    value: w.total || 0,
  }));

  return (
    <div className="bg-[#2D4A2D] rounded-xl p-6 text-[#FDFAF4] shadow-sm border border-[#3D6B3D]">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm font-medium text-[#C4956A]/80">This Week</p>
          <p className="text-3xl font-bold mt-1">{weeklyTotal.toFixed(1)} <span className="text-lg font-normal text-[#FDFAF4]/70">kg CO₂e</span></p>
          <div className="flex items-center gap-2 mt-2 text-sm text-[#FDFAF4]/60">
            <Tree className="w-4 h-4 text-[#6B8F5E]" />
            <span>≈ {trees} tree{trees !== 1 ? 's' : ''} needed to offset</span>
          </div>
        </div>

        {/* Mini bar chart — tree-grove visual */}
        <div className="w-40 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis dataKey="name" hide />
              <Bar
                dataKey="value"
                fill="#6B8F5E"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tree-grove dots */}
      <div className="flex gap-1.5 mt-4">
        {Array.from({ length: Math.min(Math.round(trees), 12) }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-[#6B8F5E] opacity-80"
            title={`${trees} trees equivalent`}
          />
        ))}
      </div>
    </div>
  );
}