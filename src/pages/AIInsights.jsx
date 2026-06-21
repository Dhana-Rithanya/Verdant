import { useState, useEffect, useRef } from 'react';
import InsightCard from '../components/InsightCard';
import { getCurrentWeekLogs } from '../utils/storage';
import { Lightbulb, RefreshCw } from 'lucide-react';

// Users should set VITE_GEMINI_API_KEY in their .env file
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;

export default function AIInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [streamedText, setStreamedText] = useState('');
  const abortRef = useRef(null);
  const hasFetched = useRef(false);

  const fetchInsights = async () => {
    if (!GEMINI_API_KEY) {
      setError('Gemini API key not configured. Set VITE_GEMINI_API_KEY in your .env file.');
      return;
    }

    setLoading(true);
    setError('');
    setInsights([]);
    setStreamedText('');

    const currentWeek = getCurrentWeekLogs();
    const activityData = {
      total: currentWeek.total,
      categories: currentWeek.totals,
      logs: currentWeek.logs.slice(0, 20),
    };

    const prompt = `You are a carbon footprint advisor. Given this user's activity data: ${JSON.stringify(activityData)}, generate 4 highly specific, actionable insights with exact CO₂ savings estimates. Be conversational and encouraging.`;

    try {
      abortRef.current = new AbortController();

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1024,
          },
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited — use static fallback insights
          setStreamedText('');
          setLoading(false);
          useFallbackInsights();
          return;
        }
        const errBody = await response.text();
        throw new Error(`API error ${response.status}: ${errBody}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6).trim();
            if (!jsonStr || jsonStr === '[DONE]') continue;
            try {
              const chunk = JSON.parse(jsonStr);
              // Gemini SSE format: { candidates: [{ content: { parts: [{ text: "..." }] } }] }
              const text = chunk?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                setStreamedText((prev) => prev + text);
              }
            } catch {
              // skip parse errors on partial lines
            }
          }
        }
      }

      // Once done, split the full response into individual insights
      const finalText = streamedText;
      parseInsights(finalText);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fallbackInsights = [
    'Try replacing one beef meal per week with a vegetarian option to save ~5.5 kg CO₂e per meal — that\'s over 280 kg CO₂e a year!',
    'Switching from car to bus for your daily commute (10 km) saves ~1.2 kg CO₂e per trip. That adds up to ~300 kg CO₂e annually.',
    'Reducing your home electricity usage by 10% (about 3 kWh/week) can save ~2.5 kg CO₂e weekly. Try unplugging idle electronics.',
    'Consider buying second-hand or locally-made products to reduce shopping-related carbon footprint by up to 40%.',
  ];

  const useFallbackInsights = () => {
    setInsights(fallbackInsights);
    setError('');
  };

  const parseInsights = (text) => {
    if (!text) return;
    // Split by numbered list or bullet points
    const parts = text
      .split(/\n(?=\d+[\.\)]|\*|\-)/)
      .map((s) => s.replace(/^\d+[\.\)]\s*|\*\s*|\-\s*/, '').trim())
      .filter((s) => s.length > 20);

    // If splitting didn't work well, try to split by double newlines
    if (parts.length < 2) {
      const alt = text
        .split(/\n\n+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 20);
      setInsights(alt.length >= 2 ? alt.slice(0, 4) : [text]);
    } else {
      setInsights(parts.slice(0, 4));
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchInsights();
    }
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-800">AI Insights</h1>
          <p className="text-sm text-stone-500 mt-0.5">Personalised recommendations powered by Gemini</p>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F0E8] text-sm text-stone-600 hover:bg-[#E4DCD0] transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {GEMINI_API_KEY && !loading && insights.length === 0 && !streamedText && error && (
        <div className="space-y-3">
          <p className="text-xs text-stone-500">Showing general insights while API is unavailable. Click Refresh to try again.</p>
          {fallbackInsights.map((tip, i) => (
            <InsightCard key={i} insight={tip} index={i} />
          ))}
        </div>
      )}

      {!GEMINI_API_KEY && (
        <div className="bg-[#FDFAF4] rounded-xl p-8 shadow-sm border border-stone-200 text-center">
          <Lightbulb className="w-10 h-10 text-[#C4956A] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-stone-700 mb-1">Gemini API Key Required</h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            Create a <code className="text-xs bg-[#F5F0E8] px-1.5 py-0.5 rounded">.env</code> file in the project root with:
          </p>
          <code className="inline-block mt-2 px-3 py-1.5 bg-[#F5F0E8] rounded text-sm font-mono text-[#2D4A2D]">
            VITE_GEMINI_API_KEY=your-api-key-here
          </code>
        </div>
      )}

      {GEMINI_API_KEY && loading && (
        <div className="bg-[#FDFAF4] rounded-xl p-6 shadow-sm border border-stone-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 rounded-full bg-[#6B8F5E] animate-pulse" />
            <span className="text-sm text-stone-500">Gemini is analysing your data...</span>
          </div>
          {streamedText && (
            <p className="text-sm text-stone-600 whitespace-pre-wrap">{streamedText}</p>
          )}
        </div>
      )}

      {GEMINI_API_KEY && !loading && insights.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-700">Your Personalised Insights</h3>
          {insights.map((tip, i) => (
            <InsightCard key={i} insight={tip} index={i} />
          ))}
        </div>
      )}

      {GEMINI_API_KEY && !loading && !error && insights.length === 0 && !streamedText && (
        <div className="bg-[#FDFAF4] rounded-xl p-8 shadow-sm border border-stone-200 text-center">
          <p className="text-sm text-stone-400">No data to analyse yet. Log some activities first!</p>
        </div>
      )}
    </div>
  );
}