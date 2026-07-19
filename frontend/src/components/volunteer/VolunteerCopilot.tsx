"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Languages, Mic } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { aiService } from "@/services";
import { useAppStore } from "@/store/useAppStore";
import { useTelemetryStore } from "@/store/useTelemetryStore";

export const VolunteerCopilot = () => {
  const [query, setQuery] = React.useState("");
  const [response, setResponse] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [messages, setMessages] = React.useState<{role: "user"|"assistant", content: string}[]>([]);
  const [isListening, setIsListening] = React.useState(false);

  const toggleListening = () => {
    if (isListening) return;
    setIsListening(true);
    // Simulate speech-to-text
    setTimeout(() => {
      setIsListening(false);
      const fakeQuery = "Onde é o banheiro mais próximo? (Where is the nearest restroom?)";
      setQuery(fakeQuery);
      setTimeout(() => {
        handleChatWithQuery(fakeQuery);
      }, 100);
    }, 2000);
  };

  const handleChatWithQuery = async (q: string) => {
    if (!q.trim() || isTyping) return;
    
    const newMessages = [...messages, { role: "user" as const, content: q }];
    setMessages(newMessages);
    setQuery("");
    setResponse("");
    setIsTyping(true);

    try {
      const appState = useAppStore.getState();
      const telemetry = useTelemetryStore.getState();
      const context = { 
        role: 'Volunteer', 
        stage: 'active', 
        weather: appState.weather.data,
        match: appState.match.data,
        location: appState.location,
        incidents: telemetry.incidents,
        transportHubs: telemetry.transportHubs
      };
      const streamText = await aiService.chat(newMessages, context);
      setResponse(streamText);
      setMessages([...newMessages, { role: "assistant", content: streamText }]);
    } catch (e) {
      console.error(e);
      const errorMsg = "Failed to connect to translation matrix.";
      setResponse(errorMsg);
      setMessages([...newMessages, { role: "assistant", content: errorMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleChat = () => handleChatWithQuery(query);

  return (
    <div className="flex flex-col h-full pb-20 relative">
      {/* Header */}
      <div className="px-4 py-6 flex items-center space-x-3 bg-surface-elevated/90 backdrop-blur-3xl border-b border-border-subtle z-10 sticky top-0">
        <div className="p-2 bg-ai/10 rounded-xl">
          <Languages className="w-5 h-5 text-ai" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-main tracking-tight">AI Copilot</h2>
          <p className="text-xs text-text-secondary font-medium">Translation & Guidance</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.length === 0 && !response && (
          <div className="h-full flex flex-col items-center justify-center text-center text-text-muted px-4">
            <Languages className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm font-medium">Ask for directions, policies, or translate live conversations.</p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`text-sm p-4 rounded-2xl max-w-[85%] font-medium ${msg.role === 'user' ? 'bg-neutral-100 text-text-main rounded-tr-sm' : 'bg-ai/10 text-ai rounded-tl-sm border border-ai/20 shadow-sm'}`}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isTyping && !response && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start">
            <div className="text-sm p-4 rounded-2xl max-w-[85%] bg-ai/10 text-ai font-medium rounded-tl-sm animate-pulse border border-ai/20">
              Translating context...
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface-elevated border-t border-border-subtle shadow-[0_-10px_20px_rgba(0,0,0,0.02)] relative z-10">
        <div className="flex space-x-2">
          <Button
            onClick={toggleListening}
            variant={isListening ? "ai" : "secondary"}
            className="shrink-0 w-12 h-12 p-0 flex items-center justify-center rounded-2xl"
          >
            {isListening ? (
              <div className="flex items-center space-x-0.5">
                <motion.div animate={{ height: ["4px", "16px", "4px"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-white rounded-full" />
                <motion.div animate={{ height: ["4px", "20px", "4px"] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 bg-white rounded-full" />
                <motion.div animate={{ height: ["4px", "12px", "4px"] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1 bg-white rounded-full" />
              </div>
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChat()}
            placeholder="Type message..."
            className="flex-1 bg-background border border-border-strong rounded-2xl px-4 py-2 text-sm text-text-main focus:outline-none focus:border-ai/50 shadow-inner"
          />
        </div>
      </div>
    </div>
  );
};
