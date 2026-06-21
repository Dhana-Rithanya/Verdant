import { useState, useEffect } from 'react';
import ActivityLogger from '../components/ActivityLogger';
import { api } from '../utils/api';
import { Clock } from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/emissionFactors';

export default function LogActivity() {
  const [logs, setLogs] = useState([]);
  const [saved, setSaved] = useState(false);

  const loadLogs = () => {
    api.getActivities(4).then((data) => {
      setLogs(data.activities?.slice(0, 20) || []);
    }).catch(() => {});
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleSave = async (entry) => {
    try {
      await api.createActivity(entry);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      loadLogs();
    } catch (err) {
      console.error('Failed to save activity:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-stone-800">Log Activity</h1>
        <p className="text-sm text-stone-500 mt-0.5">Record your daily carbon-emitting activities</p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-sm text-green-700">
          Activity logged successfully! ✦
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityLogger onSave={handleSave} />

        <div className="bg-[#FDFAF4] rounded-xl p-5 shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-stone-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-stone-400" />
              Recent Activity
            </h3>
          </div>

          {logs.length === 0 ? (
            <p className="text-sm text-stone-400 text-center py-8">No activities logged yet. Start tracking above!</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#F5F0E8] text-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[log.category] || '#6B8F5E' }}
                    />
                    <div className="min-w-0">
                      <span className="text-stone-700 font-medium">{CATEGORY_LABELS[log.category] || log.category}</span>
                      <span className="text-stone-400 ml-1.5 text-xs">{log.details || ''}</span>
                    </div>
                  </div>
                  <span className="font-semibold text-stone-800 shrink-0 ml-2">{log.co2e?.toFixed(1)} kg</span>
                </div>
              ))}
            </div>
          )}

          {logs.length > 0 && (
            <p className="text-xs text-stone-400 mt-3 text-center">{logs.length} recent entries</p>
          )}
        </div>
      </div>
    </div>
  );
}