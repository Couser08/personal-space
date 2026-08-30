import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, RefreshCw } from 'lucide-react';
import { getDailyQuote, DAILY_QUOTES, DailyQuote } from '../../utils/quoteData';
import { sound } from '../../lib/sound';

export const PlantVaseWidget: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<DailyQuote>(() => getDailyQuote());
  const [liked, setLiked] = useState(false);
  const [showHinglish, setShowHinglish] = useState(true);

  const handleNextQuote = () => {
    sound.playClick();
    const currentIndex = DAILY_QUOTES.findIndex((q) => q.id === currentQuote.id);
    const nextIndex = (currentIndex + 1) % DAILY_QUOTES.length;
    setCurrentQuote(DAILY_QUOTES[nextIndex]);
  };

  const handleLike = () => {
    sound.playComplete();
    setLiked(!liked);
  };

  return (
    <div className="relative rounded-2xl p-4 bg-gradient-to-b from-[#F2F7F4] to-[#FAFBF9] dark:from-[#1A261F] dark:to-[#161D19] border border-[#E2EBE5] dark:border-[#27392E] overflow-hidden group select-none">
      {/* Decorative Botanical Leaves Graphic */}
      <div className="relative flex justify-center mb-2">
        <svg
          viewBox="0 0 120 130"
          className="w-20 h-24 drop-shadow-xs transition-transform duration-500 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vase */}
          <path
            d="M50 78 C50 72 54 68 56 62 C58 56 58 50 60 50 C62 50 62 56 64 62 C66 68 70 72 70 78 C70 92 68 114 60 114 C52 114 50 92 50 78 Z"
            fill="#FFFFFF"
            stroke="#E2EBE5"
            strokeWidth="1.5"
          />
          <ellipse cx="60" cy="114" rx="10" ry="2" fill="#D4E4D8" opacity="0.6" />

          {/* Main Stem */}
          <path d="M60 50 Q60 25 58 10" stroke="#558E63" strokeWidth="2" strokeLinecap="round" />
          <path d="M60 45 Q50 30 42 22" stroke="#558E63" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M60 40 Q70 28 78 18" stroke="#558E63" strokeWidth="1.5" strokeLinecap="round" />

          {/* Leaves */}
          <path d="M58 10 C54 10 50 14 58 20 C64 14 62 10 58 10 Z" fill="#6BAA7A" />
          <path d="M42 22 C40 18 44 14 48 20 C46 25 43 25 42 22 Z" fill="#78B687" />
          <path d="M78 18 C80 14 84 18 80 23 C76 25 76 20 78 18 Z" fill="#6BAA7A" />
          <path d="M52 28 C46 26 48 20 54 24 C56 28 54 30 52 28 Z" fill="#88C496" />
          <path d="M68 26 C74 24 72 18 66 22 C64 26 66 28 68 26 Z" fill="#78B687" />
          <path d="M55 38 C50 36 52 30 57 34 C58 38 57 40 55 38 Z" fill="#6BAA7A" />
          <path d="M65 36 C70 34 68 28 63 32 C62 36 63 38 65 36 Z" fill="#88C496" />
        </svg>

        {/* Daily badge */}
        <span className="absolute top-0 right-1 text-[10px] uppercase tracking-wider font-bold text-[#6BAA7A] bg-[#EAF2EC] dark:bg-[#1E2E23] px-2 py-0.5 rounded-full flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          Daily
        </span>
      </div>

      {/* Quote Display with Smooth Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuote.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="text-center space-y-1.5"
        >
          <p className="text-xs font-semibold text-[#1F2937] dark:text-[#F3F4F6] leading-relaxed">
            "{currentQuote.text}"
          </p>

          <p className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] italic">
            — {currentQuote.author}
          </p>

          {/* Hinglish Meaning Pill */}
          {showHinglish && (
            <div className="mt-2 pt-1.5 border-t border-[#E2EBE5] dark:border-[#27392E] text-[11px] text-[#4F5D75] dark:text-[#CBD2DC] leading-snug bg-white/60 dark:bg-black/20 p-2 rounded-xl">
              <span className="text-[#6BAA7A] font-semibold text-[10px] uppercase tracking-wider block mb-0.5">
                Meaning (Hinglish):
              </span>
              <span>{currentQuote.hinglishMeaning}</span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Controls: Like, Toggle Meaning, Shuffle */}
      <div className="flex items-center justify-center gap-3 mt-3 pt-1">
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          title={liked ? 'Liked' : 'Like quote'}
          className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
            liked
              ? 'bg-rose-100 text-rose-500 dark:bg-rose-950/50'
              : 'bg-[#6BAA7A]/15 text-[#6BAA7A] hover:bg-[#6BAA7A]/25'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNextQuote}
          title="Next Quote"
          className="w-6 h-6 rounded-full bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#4F5D75] dark:text-[#CBD2DC] hover:text-[#1F2937] dark:hover:text-white flex items-center justify-center cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
        </motion.button>
      </div>
    </div>
  );
};
