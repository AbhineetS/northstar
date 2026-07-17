'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Navigation, Send, User } from 'lucide-react';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { aiService } from '@/services';
import { useAppStore } from '@/store/useAppStore';
import { useTelemetryStore } from '@/store/useTelemetryStore';

interface MatchdayAssistantWidgetProps {
  recommendation?: {
    title: string;
    text: string;
    action: string | null;
  };
}

export function MatchdayAssistantWidget({ recommendation }: MatchdayAssistantWidgetProps) {
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isTyping) return;
    
    const newMessages = [...messages, { role: 'user' as const, content: query }];
    setMessages(newMessages);
    setQuery('');
    setIsTyping(true);

    try {
      const appState = useAppStore.getState();
      const telemetry = useTelemetryStore.getState();
      const context = {
        role: 'Fan',
        weather: appState.weather.data,
        match: appState.match.data,
        location: appState.location,
        incidents: telemetry.incidents,
        transportHubs: telemetry.transportHubs
      };
      
      const response = await aiService.chat(newMessages, context);
      setMessages([...newMessages, { role: 'assistant', content: response }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, I'm experiencing interference. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-8 rounded-[40px] bg-[#F3E5F5] relative overflow-hidden group">
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-[#111] flex items-center justify-center shrink-0 shadow-lg">
          <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="font-display font-black text-xl text-black tracking-tight">AI Matchday Assistant</h3>
          <p className="text-xs text-black/50 font-medium mt-0.5">Powered by Gemini OS</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar relative mb-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {recommendation && messages.length === 0 && (
            <motion.div 
              key="rec"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="bg-white shadow-sm rounded-[32px] p-6 backdrop-blur-md rounded-tl-sm w-full"
            >
              <h4 className="font-bold text-black text-[13px] mb-1.5 tracking-tight">
                {recommendation.title}
              </h4>
              <p className="text-xs text-black/60 font-medium leading-relaxed mb-3">
                {recommendation.text}
              </p>
              {recommendation.action && (
                <MagneticButton variant="primary" size="sm" className="w-full text-xs font-bold py-2 group/btn">
                  <span>{recommendation.action}</span>
                  <Navigation className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </MagneticButton>
              )}
            </motion.div>
          )}

          {messages.map((msg, i) => (
            <motion.div 
              key={`msg-${i}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-text-main text-white' : 'bg-primary text-white'}`}>
                {msg.role === 'user' ? <User className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm font-medium ${msg.role === 'user' ? 'bg-white shadow-sm text-text-main rounded-tr-sm' : 'bg-white/60 text-text-main rounded-tl-sm shadow-sm backdrop-blur-md'} max-w-[80%]`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2"
            >
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-text-muted font-medium">Gemini is analyzing live data...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="relative mt-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything about the match or stadium..."
          className="w-full bg-white border-none shadow-sm rounded-full pl-6 pr-14 py-4 text-[13px] font-bold text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
        />
        <button 
          type="submit" 
          aria-label="Send message"
          disabled={!query.trim() || isTyping}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center disabled:opacity-50 transition-opacity"
        >
          <Send className="w-3.5 h-3.5 text-white ml-0.5" />
        </button>
      </form>
    </div>
  );
}
