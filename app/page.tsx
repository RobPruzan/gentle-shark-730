'use client';

import { useState, useEffect } from 'react';
import { ChatRoom } from '@/components/chat-room';
import { PredictionMarket } from '@/components/prediction-market';
import { PredictionCharts } from '@/components/prediction-charts';
import { MessageSquare, TrendingUp, BarChart3 } from 'lucide-react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'predictions' | 'charts'>('chat');
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    // Initialize database on mount
    fetch('/api/init')
      .then(() => setDbInitialized(true))
      .catch(console.error);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="bg-[#151515] p-6 rounded border border-[#252525] w-full max-w-md">
          <h1 className="text-2xl font-bold text-[#e0e0e0] mb-6">Prediction Market Chat</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (username.trim() && dbInitialized) {
                setIsLoggedIn(true);
              }
            }}
          >
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full bg-[#0a0a0a] border border-[#252525] rounded px-4 py-3 text-[#e0e0e0] placeholder-[#666] focus:outline-none focus:border-[#00d9ff] mb-4"
              autoFocus
            />
            <button
              type="submit"
              disabled={!username.trim() || !dbInitialized}
              className="w-full bg-[#00d9ff] text-[#0a0a0a] px-4 py-3 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00b8d9] transition-colors"
            >
              {dbInitialized ? 'Join' : 'Initializing...'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col">
      <div className="bg-[#151515] border-b border-[#252525] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-[#00d9ff] text-lg font-bold">Prediction Market Chat</div>
          <div className="text-[#666] text-sm">@{username}</div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col border-r border-[#252525]">
          <div className="bg-[#151515] border-b border-[#252525] flex">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'chat'
                  ? 'border-[#00d9ff] text-[#00d9ff]'
                  : 'border-transparent text-[#666] hover:text-[#e0e0e0]'
              }`}
            >
              <MessageSquare size={18} />
              Chat
            </button>
            <button
              onClick={() => setActiveTab('predictions')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'predictions'
                  ? 'border-[#00d9ff] text-[#00d9ff]'
                  : 'border-transparent text-[#666] hover:text-[#e0e0e0]'
              }`}
            >
              <TrendingUp size={18} />
              Predictions
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            {activeTab === 'chat' && <ChatRoom username={username} />}
            {activeTab === 'predictions' && <PredictionMarket username={username} />}
          </div>
        </div>

        <div className="w-96 bg-[#0a0a0a] flex flex-col">
          <div className="bg-[#151515] border-b border-[#252525] px-4 py-3 flex items-center gap-2 text-[#e0e0e0]">
            <BarChart3 size={18} />
            Analytics
          </div>
          <PredictionCharts />
        </div>
      </div>
    </div>
  );
}
