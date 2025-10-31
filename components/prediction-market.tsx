'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, Plus } from 'lucide-react';

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

export function PredictionMarket({ username }: { username: string }) {
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [predictionValue, setPredictionValue] = useState(50);
  const queryClient = useQueryClient();

  const { data: predictions = [] } = useQuery<Prediction[]>({
    queryKey: ['predictions'],
    queryFn: async () => {
      const res = await fetch('/api/predictions');
      return res.json();
    },
  });

  const createPrediction = useMutation({
    mutationFn: async (data: { question: string; prediction_value: number }) => {
      await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, ...data }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      setQuestion('');
      setPredictionValue(50);
      setShowForm(false);
    },
  });

  const vote = useMutation({
    mutationFn: async (data: { prediction_id: number; vote_type: 'up' | 'down' }) => {
      await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, ...data }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      createPrediction.mutate({ question, prediction_value: predictionValue });
    }
  };

  const getConfidence = (pred: Prediction) => {
    if (pred.total_votes === 0) return pred.prediction_value;
    const upvoteRatio = pred.upvotes / pred.total_votes;
    return Math.round(pred.prediction_value * (0.5 + upvoteRatio * 0.5));
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {predictions.map((pred) => {
          const confidence = getConfidence(pred);
          return (
            <div key={pred.id} className="bg-[#151515] p-4 rounded border border-[#252525]">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[#00d9ff] text-sm font-medium">{pred.username}</span>
                    <span className="text-[#666] text-xs">
                      {new Date(pred.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-[#e0e0e0] mb-2">{pred.question}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#00d9ff]">{confidence}%</div>
                  <div className="text-xs text-[#666]">confidence</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => vote.mutate({ prediction_id: pred.id, vote_type: 'up' })}
                  className="flex items-center gap-1 px-3 py-1 bg-[#0a0a0a] border border-[#252525] rounded text-sm hover:border-[#00ff88] transition-colors"
                >
                  <TrendingUp size={14} className="text-[#00ff88]" />
                  <span className="text-[#e0e0e0]">{pred.upvotes}</span>
                </button>
                <button
                  onClick={() => vote.mutate({ prediction_id: pred.id, vote_type: 'down' })}
                  className="flex items-center gap-1 px-3 py-1 bg-[#0a0a0a] border border-[#252525] rounded text-sm hover:border-[#ff4444] transition-colors"
                >
                  <TrendingDown size={14} className="text-[#ff4444]" />
                  <span className="text-[#e0e0e0]">{pred.downvotes}</span>
                </button>
                <span className="text-xs text-[#666] ml-auto">
                  Initial: {pred.prediction_value}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="p-4 bg-[#151515] border-t border-[#252525] space-y-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What do you predict?"
            className="w-full bg-[#0a0a0a] border border-[#252525] rounded px-3 py-2 text-[#e0e0e0] placeholder-[#666] focus:outline-none focus:border-[#00d9ff]"
            autoFocus
          />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#999]">Initial confidence</span>
              <span className="text-[#00d9ff] font-medium">{predictionValue}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={predictionValue}
              onChange={(e) => setPredictionValue(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!question.trim()}
              className="flex-1 bg-[#00d9ff] text-[#0a0a0a] px-4 py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00b8d9] transition-colors"
            >
              Create Prediction
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-[#0a0a0a] border border-[#252525] rounded text-[#e0e0e0] hover:border-[#666] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="m-4 flex items-center justify-center gap-2 bg-[#151515] border border-[#252525] text-[#e0e0e0] px-4 py-3 rounded font-medium hover:border-[#00d9ff] hover:text-[#00d9ff] transition-colors"
        >
          <Plus size={18} />
          New Prediction
        </button>
      )}
    </div>
  );
}
