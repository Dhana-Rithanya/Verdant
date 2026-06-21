import { Lightbulb } from 'lucide-react';

const dotColors = ['#6B8F5E', '#C4956A', '#8B6F47', '#4A7C59'];

export default function InsightCard({ insight, index = 0 }) {
  const dotColor = dotColors[index % dotColors.length];

  // Try to extract a savings estimate (e.g. "5.2 kg CO₂e")
  const savingsMatch = insight.match(/([\d.,]+)\s*kg\s*CO₂e/i);
  const hasSavings = savingsMatch && parseFloat(savingsMatch[1]) > 0;

  return (
    <div className="bg-[#FDFAF4] rounded-xl p-4 shadow-sm border border-stone-200 flex items-start gap-3">
      <div className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ backgroundColor: dotColor }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-stone-700 leading-relaxed">{insight}</p>
        {hasSavings && (
          <div className="flex items-center gap-1.5 mt-2">
            <Lightbulb className="w-3.5 h-3.5 text-[#C4956A]" />
            <span className="text-xs font-medium text-[#6B8F5E]">
              Potential saving: {savingsMatch[0]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}