'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send } from 'lucide-react';

interface Message {
  id: number;
  username: string;
  content: string;
  created_at: string;
}

export function ChatRoom({ username }: { username: string }) {
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: async () => {
      const res = await fetch('/api/messages');
      return res.json();
    },
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, content }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setMessage('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage.mutate(message);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.slice().reverse().map((msg) => (
          <div key={msg.id} className="bg-[#151515] p-3 rounded">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[#00d9ff] text-sm font-medium">{msg.username}</span>
              <span className="text-[#666] text-xs">
                {new Date(msg.created_at).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-[#e0e0e0]">{msg.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-[#151515] border-t border-[#252525]">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[#0a0a0a] border border-[#252525] rounded px-3 py-2 text-[#e0e0e0] placeholder-[#666] focus:outline-none focus:border-[#00d9ff]"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="bg-[#00d9ff] text-[#0a0a0a] px-4 py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00b8d9] transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
