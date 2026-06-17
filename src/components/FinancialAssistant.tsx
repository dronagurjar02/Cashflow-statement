import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage } from "../types";
import { 
  Send, 
  Sparkles, 
  User, 
  HelpCircle, 
  Loader2,
  Terminal,
  Cpu,
  BrainCircuit
} from "lucide-react";

interface FinancialAssistantProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isProcessing: boolean;
  currencySymbol?: string;
}

export default function FinancialAssistant({ 
  chatHistory = [], 
  onSendMessage, 
  isProcessing,
  currencySymbol = "₹"
}: FinancialAssistantProps) {
  const [userInput, setUserInput] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const promptPills = [
    { label: "💰 Gross Income", prompt: "What is my income summary?" },
    { label: "🏡 Overheads & Rent", prompt: "How much did I spend on rent or housing?" },
    { label: "💳 Singular Hits", prompt: "Show my top 5 expenses" },
    { label: "📈 Assets Built", prompt: "Show investment summary" },
    { label: "⚡ Tech Overhead", prompt: "How much did I spend on tech utilities?" },
    { label: "🔮 Investment Strategy", prompt: "Give financial advice to compound my wealth" }
  ];

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isProcessing) return;

    onSendMessage(userInput.trim());
    setUserInput("");
  };

  const handlePillClick = (promptText: string) => {
    if (isProcessing) return;
    onSendMessage(promptText);
  };

  return (
    <div id="financial-assistant-card" className="glass-panel rounded-3xl flex flex-col h-[525px] relative overflow-hidden shadow-premium">
      
      {/* CARD HEADER */}
      <div className="p-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/55 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-50 text-teal-600 border border-teal-100 rounded-xl shadow-3xs">
            <BrainCircuit className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-display">
              AI Financial Chat Assistant
            </h3>
            <p className="text-[9.5px] text-teal-600 font-mono flex items-center gap-1.5 font-bold mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse shrink-0" />
              Online & Ready
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[9.5px] font-mono text-slate-450 font-bold bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
          <Terminal className="w-3 h-3 text-teal-500" />
          <span>Gemini AI</span>
        </div>
      </div>

      {/* CHAT FEED LIST */}
      <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <Sparkles className="w-8 h-8 text-teal-400 mb-3 animate-pulse" />
            <p className="text-xs font-bold text-slate-700">How can I assist you today?</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[240px]">Ask questions about your transactions, income leaks, and investment advisory.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {chatHistory.map((msg, index) => {
              const isUser = msg.sender === "user";
              return (
                <motion.div 
                  key={msg.id} 
                  id={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14 }}
                  className={`flex items-start gap-2.5 max-w-[85%] ${
                    isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 shadow-3xs ${
                    isUser 
                      ? "bg-slate-100 text-slate-600 border border-slate-200" 
                      : "bg-teal-50 text-teal-650 border border-teal-100"
                  }`}>
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  </div>
                  
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed font-sans shadow-3xs ${
                    isUser 
                      ? "bg-teal-500 text-white font-extrabold rounded-tr-none" 
                      : "bg-slate-50 text-slate-755 border border-slate-100 rounded-tl-none font-medium"
                  }`}>
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap font-sans text-xs">
                      {msg.text}
                    </div>
                    <span className={`block text-[8px] mt-2 text-right font-mono font-bold ${isUser ? "text-teal-100" : "text-slate-400"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {/* PROCESSING LOADER */}
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-2.5 max-w-[85%] mr-auto"
          >
            <div className="p-2 bg-teal-50 text-teal-650 border border-teal-100 rounded-xl shrink-0 mt-0.5 shadow-3xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 rounded-tl-none shadow-3xs">
              <div className="flex items-center gap-1 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* SUGGESTED PILLS */}
      <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-1.5 mb-1.5">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Suggested Questions</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
          {promptPills.map((p, idx) => (
            <motion.button
              key={idx}
              type="button"
              whileHover={{ scale: 1.02, y: -0.5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePillClick(p.prompt)}
              disabled={isProcessing}
              className="px-3 py-2 text-[10px] font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 rounded-xl shrink-0 transition-all duration-200 cursor-pointer shadow-3xs"
            >
              {p.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* INPUT FORM CONTAINER */}
      <div className="p-3 bg-white border-t border-slate-100 shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            id="chat-user-input"
            type="text"
            placeholder={isProcessing ? "Synthesizing answer, please wait..." : "Ask your AI co-pilot about this statement..."}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isProcessing}
            className="flex-1 bg-slate-50 text-xs text-slate-800 px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-300 shadow-inner font-sans"
          />
          <motion.button
            id="btn-send-chat"
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!userInput.trim() || isProcessing}
            className="p-3 bg-teal-500 hover:bg-teal-650 text-white rounded-xl transition cursor-pointer shadow-2xs shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </motion.button>
        </form>
      </div>

    </div>
  );
}
