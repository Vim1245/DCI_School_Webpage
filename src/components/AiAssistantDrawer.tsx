import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  User,
  RefreshCw,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Navigation,
  MapPin,
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: "Hello! Welcome to DCI AI School. I am your 24/7 AI Virtual Concierge powered by Gemini.\n\nI can help you with:\n• Admissions process & 2026-27 dates\n• Grade-wise fee structure & scholarships\n• CBSE & IB World School curriculum\n• Campus tour & directions from your location\n• AI & Robotics labs and sports facilities\n\nHow can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locRequested, setLocRequested] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Request browser location for map grounding & distance calculation
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      return;
    }
    setLocRequested(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        const locMsg: ChatMessage = {
          id: 'sys-loc-' + Date.now(),
          sender: 'assistant',
          text: `📍 Location detected! I can now give you precise distance, bus route recommendations, and directions to DCI AI School.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, locMsg]);
      },
      (err) => {
        console.warn('Geolocation prompt dismissed or unavailable:', err);
      },
      { timeout: 8000 }
    );
  };

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const userMsgText = (textToSend || input).trim();
    if (!userMsgText || loading) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || '';
      const res = await fetch(`${apiBase}/api/ai/assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsgText,
          conversationHistory: messages,
          userLocation: userLocation,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data && data.reply) {
        const aiMsg: ChatMessage = {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const fallbackText =
          data?.reply ||
          "Admissions for 2026-2027 are currently open at DCI AI School! You can submit an online application in the Admissions section, or contact admissions@dci-school.edu / +1 (800) 555-DCI-AI.";
        const fallbackMsg: ChatMessage = {
          id: 'ai-err-' + Date.now(),
          sender: 'assistant',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } catch (err: any) {
      console.error('Error querying AI assistant:', err);
      const networkMsg: ChatMessage = {
        id: 'ai-net-' + Date.now(),
        sender: 'assistant',
        text: "Thank you for reaching out! Admissions for the 2026-2027 session are open. You can apply directly through our Admissions Application form, or reach out to admissions@dci-school.edu | +1 (800) 555-DCI-AI.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, networkMsg]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'What is the annual fee structure for each grade?',
    'How do I apply for 2026-27 admission?',
    'Tell me about CBSE and IB curriculum pathways.',
    'What are the campus facilities and robotics labs?',
    'How far is the campus from my location?',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm flex items-center gap-1.5">
              <span>DCI AI Virtual Concierge</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <div className="text-[11px] text-blue-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Gemini AI • 24/7 School Support</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {!userLocation && !locRequested && (
            <button
              onClick={handleRequestLocation}
              title="Use current location for map directions"
              className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-medium flex items-center gap-1 transition-colors"
            >
              <MapPin className="w-3 h-3 text-sky-300" />
              <span>My Location</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="p-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto flex items-center gap-2 text-xs no-scrollbar">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Ask:
        </span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 shrink-0 transition-colors shadow-2xs font-medium text-[11px]"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-br-none font-medium'
                    : 'bg-white text-slate-800 rounded-bl-none border border-slate-200/80 whitespace-pre-wrap'
                }`}
              >
                <div>{msg.text}</div>
                <div
                  className={`text-[9px] mt-1 text-right ${
                    isUser ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 border border-slate-200/80 shadow-2xs flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px] text-slate-400">Consulting school directory...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3.5 bg-white border-t border-slate-200 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type your question about admissions, fees, curriculum..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-all shadow-md shadow-blue-500/20"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Official DCI AI School Virtual Assistant</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onNavigate('admission');
            }}
            className="text-blue-600 hover:underline font-semibold"
          >
            Online Admission Form &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
