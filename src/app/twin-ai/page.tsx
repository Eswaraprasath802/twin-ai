"use client";
/**
 * TWIN AI — AI Climate Copilot Chat
 * Intelligent multilingual assistant for climate, agriculture, disaster queries
 */
import { useState, useRef, useEffect } from "react";
import TopNav from "@/components/TopNav";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const SUGGESTIONS = [
  "Will it rain tomorrow?",
  "Can I grow cotton here?",
  "Flood probability in Kerala?",
  "What crop should I grow?",
  "What fertilizer should I use?",
  "Government schemes for farmers",
  "Drought risk in Rajasthan",
  "Cyclone prediction Bay of Bengal",
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "ta", name: "தமிழ்" },
  { code: "te", name: "తెలుగు" },
  { code: "kn", name: "ಕನ್ನಡ" },
  { code: "ml", name: "മലയാളം" },
  { code: "mr", name: "मराठी" },
  { code: "gu", name: "ગુજરાતી" },
  { code: "pa", name: "ਪੰਜਾਬੀ" },
  { code: "bn", name: "বাংলা" },
  { code: "ur", name: "اردو" },
];

export default function TwinAIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "🤖 **Welcome to TWIN AI — Your Climate Intelligence Copilot**\n\nI can help you with:\n\n🌤️ Weather forecasts & predictions\n🌾 Crop recommendations & agriculture advisory\n🌊 Disaster risk assessment & alerts\n📊 Climate data analysis\n🏛 Government schemes & policies\n\nAsk me anything about India's climate, agriculture, or disaster management!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(1);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const nextMessageId = () => `msg-${messageIdRef.current++}`;

  const sendMessage = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;

    const userMsg: Message = {
      id: nextMessageId(),
      role: "user",
      content: msg,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, language }),
      });
      const data = await res.json();

      const aiMsg: Message = {
        id: nextMessageId(),
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: nextMessageId(),
          role: "assistant",
          content: "I apologize, I encountered an error. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="theme-shell grid-bg flex flex-col">
      <TopNav />

      <div className="flex-1 flex flex-col pt-14 max-w-5xl mx-auto w-full px-4">
        {/* Header */}
        <div className="py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-bold theme-title flex items-center gap-2">
              🤖 <span className="holo-text">TWIN AI</span> <span className="theme-subtitle text-sm font-normal">Climate Copilot</span>
            </h1>
            <p className="text-[10px] theme-subtitle mt-0.5">
              Powered by LSTM + XGBoost + GPT • Sources: IMD, ISRO, ICAR
            </p>
          </div>
          <select value={language} onChange={e => setLanguage(e.target.value)}
            className="px-3 py-1.5 rounded-md text-xs bg-space-800 border border-space-700 text-slate-300 outline-none">
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] md:max-w-[70%] ${msg.role === "user"
                ? "bg-cyan-500/10 border border-cyan-500/20 rounded-2xl rounded-br-md"
                : "glass-card rounded-2xl rounded-bl-md"
              } p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-sm ${msg.role === "user" ? "" : "animate-pulse"}`}>
                    {msg.role === "user" ? "👤" : "🤖"}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {msg.role === "user" ? "You" : "TWIN AI"} •{" "}
                    {new Date(msg.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {msg.content.split("\n").map((line, i) => {
                    const boldMatch = line.match(/\*\*(.*?)\*\*/g);
                    if (boldMatch) {
                      const parts = line.split(/\*\*(.*?)\*\*/);
                      return (
                        <p key={i} className="mb-1">
                          {parts.map((part, j) =>
                            j % 2 === 1
                              ? <strong key={j} className="text-cyan-400 font-semibold">{part}</strong>
                              : <span key={j}>{part}</span>
                          )}
                        </p>
                      );
                    }
                    return <p key={i} className={line === "" ? "h-2" : "mb-1"}>{line}</p>;
                  })}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="glass-card rounded-2xl rounded-bl-md p-4">
                <div className="flex items-center gap-2">
                  <span className="animate-pulse">🤖</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[10px] text-slate-500">Analyzing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="pb-3 shrink-0">
            <div className="text-[10px] text-slate-500 mb-2">Try asking:</div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)}
                  className="px-3 py-1.5 rounded-full text-xs text-slate-400 bg-space-800/50 border border-space-700 hover:border-cyan-500/30 hover:text-cyan-400 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="pb-4 shrink-0">
          <div className="glass-card p-2 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask TWIN AI about climate, crops, disasters..."
              className="flex-1 bg-transparent outline-none text-sm text-slate-200 placeholder-slate-600 px-3 py-2"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="btn-cyber px-4 py-2 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Send ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
