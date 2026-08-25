"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Lock, Sparkles, Bot, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Message { role: "user" | "assistant"; content: string; }

const SUGGESTED_PROMPTS = [
  "💡 How to close my top skill gap?",
  "🛠️ Recommend 3 portfolio project ideas",
  "📋 Technical interview preparation guide",
  "💼 Salary & career growth expectations",
  "📅 Daily 90-minute study schedule",
];

export default function CareerCoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am your AI Career Coach. I have full context of your skill gap analysis and target career role.\n\nAsk me anything — such as how to learn Python, React, System Design, portfolio project ideas, interview prep, or your study schedule!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (customText?: string) => {
    const textToSend = customText ?? input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!customText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/career-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history: updatedMessages }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.status === 403) { setLocked(true); return; }
      if (data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setLoading(false);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I had trouble connecting. Please try again." }]);
    }
  };

  if (locked) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto border border-purple-100">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">AI Career Coach (Pro Feature)</h2>
          <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
            Upgrade to Pro to unlock 24/7 access to your personalized AI Career Coach.
          </p>
          <button
            onClick={() => router.push("/settings/billing")}
            className="px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition-all shadow-md shadow-purple-500/25 cursor-pointer"
          >
            Upgrade to Pro Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" /> AI Career Coach
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Context-aware guidance powered by your skill gap profile.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-100 text-xs font-extrabold text-purple-700">
          <Bot className="w-4 h-4" /> AI Active
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={["flex gap-3", msg.role === "user" ? "justify-end" : "justify-start"].join(" ")}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-black shadow-sm mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={["max-w-[85%] sm:max-w-[75%] px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap shadow-2xs",
                  msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-none" : "bg-slate-50 text-slate-800 border border-slate-200/90 rounded-tl-none"
                ].join(" ")}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 text-xs font-black shadow-sm mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-black shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs text-slate-500 font-semibold">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> Thinking & generating response...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="px-4 py-2 bg-slate-50/60 border-t border-slate-100 flex gap-2 overflow-x-auto text-xs whitespace-nowrap scrollbar-none">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => send(prompt.replace(/^[^a-zA-Z0-9]+/, "").trim())}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:border-indigo-300 hover:text-indigo-600 transition-all cursor-pointer shadow-2xs shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 flex gap-3 bg-white">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Ask about Python, project ideas, interviews, or study schedule..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm disabled:opacity-50 transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}