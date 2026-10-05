import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface FloatingAiButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const FloatingAiButton: React.FC<FloatingAiButtonProps> = ({ onClick, isOpen }) => {
  if (isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onClick}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs shadow-xl shadow-blue-600/30 transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/20"
        aria-label="Ask DCI AI Assistant"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
        </span>

        <Bot className="w-4 h-4 text-white" />
        <span className="tracking-wide">Ask DCI Assistant</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};
