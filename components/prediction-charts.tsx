'use client';

import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Prediction {
  id: number;
  username: string;
  question: string;
  prediction_value: number;
  created_at: string;
  resolved: boolean;
  upvotes: number;
  downvotes: number;
  total_votes: number;
}

export function PredictionCharts() {
  const { data: predictions = [] } = useQuery<Prediction[]>({
    queryKey: ['predictions'],
    queryFn: async () => {
      const res = await fetch('/api/predictions');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const getConfidence = (pred: Prediction) => {
    if (pred.total_votes === 0) return pred.prediction_value;
    const upvoteRatio = pred.upvotes / pred.total_votes;
    return Math.round(pred.prediction_value * (0.5 + upvoteRatio * 0.5));
  };

  const safeP = Array.isArray(predictions) ? predictions : [];
  const confidenceData = safeP.slice(0, 10).map((pred, idx) => ({
    name: `P${pred.id}`,
    confidence: getConfidence(pred),
    initial: pred.prediction_value,
  }));

  const activityData = safeP.slice(0, 10).map((pred) => ({
    name: `P${pred.id}`,
    votes: pred.total_votes,
  }));

  return (
    <div className="h-full overflow-y-auto p-4 bg-[#0a0a0a] space-y-6">
      <div className="bg-[#151515] p-4 rounded border border-[#252525]">
        <h3 className="text-[#e0e0e0] text-sm font-medium mb-4">Confidence Levels</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={confidenceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#252525" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{ backgroundColor: '#151515', border: '1px solid #252525' }}
              labelStyle={{ color: '#e0e0e0' }}
            />
            <Line type="monotone" dataKey="confidence" stroke="#00d9ff" strokeWidth={2} />
            <Line type="monotone" dataKey="initial" stroke="#666" strokeWidth={1} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#151515] p-4 rounded border border-[#252525]">
        <h3 className="text-[#e0e0e0] text-sm font-medium mb-4">Voting Activity</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#252525" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{ backgroundColor: '#151515', border: '1px solid #252525' }}
              labelStyle={{ color: '#e0e0e0' }}
            />
            <Bar dataKey="votes" fill="#00d9ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#151515] p-4 rounded border border-[#252525]">
        <h3 className="text-[#e0e0e0] text-sm font-medium mb-3">Recent Predictions</h3>
        <div className="space-y-2">
          {safeP.slice(0, 5).map((pred) => (
            <div key={pred.id} className="bg-[#0a0a0a] p-3 rounded">
              <p className="text-[#e0e0e0] text-sm mb-1">{pred.question}</p>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-[#00d9ff]">{getConfidence(pred)}% confidence</span>
                <span className="text-[#666]">•</span>
                <span className="text-[#666]">{pred.total_votes} votes</span>
                <span className="text-[#666]">•</span>
                <span className="text-[#999]">{pred.username}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
