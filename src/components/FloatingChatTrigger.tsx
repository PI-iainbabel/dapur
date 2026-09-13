import React, { useState, useEffect } from 'react';
import { ChefHat, Radio, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingChatTriggerProps {
  onOpenChat: () => void;
}

const FUNNY_SNIPPETS = [
  'Otak lagi mager? Sini diobatin!',
  'Awas kena jebakan Decoy Effect!',
  'Mau debat rasionalitas manusia? Sini!',
  'Lapar wawasan? Loket 1 buka 24/7!',
  'Pernah boncos pas flash sale? Curhat yuk!',
];

export const FloatingChatTrigger: React.FC<FloatingChatTriggerProps> = ({ onOpenChat }) => {
  const [currentSnippetIdx, setCurrentSnippetIdx] = useState(0);
  const [showSnippet, setShowSnippet] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowSnippet(false);
      setTimeout(() => {
        setCurrentSnippetIdx((prev) => (prev + 1) % FUNNY_SNIPPETS.length);
        setShowSnippet(true);
      }, 400);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-end gap-2.5">
      {/* Humorous speech bubble popping up periodically */}
      <AnimatePresence>
        {showSnippet && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            onClick={onOpenChat}
            className="hidden sm:flex items-center gap-1.5 bg-white text-slate-800 px-3.5 py-2 rounded-2xl shadow-xl border-2 border-amber-400 text-xs font-bold cursor-pointer hover:bg-amber-50 transition-all select-none"
          >
            <span className="text-amber-600">🍟</span>
            <span className="text-slate-700">{FUNNY_SNIPPETS[currentSnippetIdx]}</span>
            <span className="text-[10px] text-red-700 font-mono font-black ml-1 uppercase">
              (Tanya Kasir)
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Circular Walkie-Talkie Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onOpenChat}
        className="relative group flex items-center gap-2.5 bg-gradient-to-r from-[#DA291C] via-[#B91C1C] to-[#881337] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl border-3 border-amber-400 transition-all"
        title="Buka Chat Intercom Drive-Thru bersama Kang Nudge (Kasir Nyentrik MBE)"
      >
        {/* Pulsing online indicator */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-400 border-2 border-white flex items-center justify-center text-[8px] font-black text-red-950">
            💬
          </span>
        </span>

        {/* Chef icon with golden glow */}
        <div className="w-8 h-8 rounded-full bg-amber-400 text-red-950 flex items-center justify-center font-black shrink-0 shadow-inner">
          <ChefHat className="w-4 h-4" />
        </div>

        <div className="text-left hidden md:block">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono font-black text-amber-300 uppercase leading-none">
              LOKET 1 INTERCOM
            </span>
          </div>
          <span className="text-xs font-black font-['Space_Grotesk'] text-white block leading-tight">
            Tanya Kang Nudge
          </span>
        </div>
      </motion.button>
    </div>
  );
};
