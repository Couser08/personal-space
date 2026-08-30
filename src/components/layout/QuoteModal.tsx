import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RotateCw, Sparkles, BookOpen, Quote as QuoteIcon } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeQuoteModal, showToast } from '../../store/slices/uiSlice';
import { DAILY_QUOTES, getDailyQuote, DailyQuote } from '../../utils/quoteData';
import { sound } from '../../lib/sound';

export const QuoteModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isQuoteModalOpen);

  const [currentQuote, setCurrentQuote] = useState<DailyQuote>(getDailyQuote());
  const [likes, setLikes] = useState<number>(12);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  const handleNextQuote = () => {
    sound.playClick();
    const currentIndex = DAILY_QUOTES.findIndex((q) => q.id === currentQuote.id);
    const nextIndex = (currentIndex + 1) % DAILY_QUOTES.length;
    setCurrentQuote(DAILY_QUOTES[nextIndex]);
    setHasLiked(false);
  };

  const handleLike = () => {
    sound.playClick();
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      dispatch(showToast({ message: 'Quote liked! 🌿', type: 'success' }));
    } else {
      setLikes((prev) => Math.max(0, prev - 1));
      setHasLiked(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeQuoteModal())}
      title="Daily Inspiration"
      subtitle="Mindful quote and Hinglish reflection for your day."
      maxWidth="sm"
    >
      <div className="space-y-5 select-none py-1">
        {/* Botanical Plant Centerpiece */}
        <div className="flex justify-center py-2">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-3xl bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#6BAA7A] flex items-center justify-center shadow-xs border border-[#D4E4D8] dark:border-[#2E4735]"
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>
        </div>

        {/* English Quote Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="text-center space-y-2 px-2"
          >
            <QuoteIcon className="w-6 h-6 text-[#6BAA7A] mx-auto opacity-70" />
            <blockquote className="font-serif text-lg sm:text-xl font-bold text-[#1F2937] dark:text-[#F3F4F6] leading-relaxed">
              "{currentQuote.text}"
            </blockquote>
            <p className="text-xs text-[#6BAA7A] dark:text-[#82C291] font-semibold tracking-wide">
              — {currentQuote.author}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Hinglish Meaning Box */}
        <div className="p-4 rounded-2xl bg-[#FAFBF9] dark:bg-[#121516] border border-[#EEF0EC] dark:border-[#273033] space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#7B7FD4] uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Meaning (Hinglish):</span>
          </div>
          <p className="text-xs text-[#4F5D75] dark:text-[#CBD2DC] leading-relaxed italic">
            "{currentQuote.hinglishMeaning}"
          </p>
        </div>

        {/* Action Controls (Like + Next Quote) */}
        <div className="flex items-center justify-between pt-2 border-t border-[#EEF0EC] dark:border-[#273033]">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              hasLiked
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'bg-[#FAFBF9] dark:bg-[#121516] border border-[#EEF0EC] dark:border-[#273033] text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937]'
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
            <span>{likes} Likes</span>
          </button>

          <button
            onClick={handleNextQuote}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6BAA7A] hover:bg-[#558E63] text-white text-xs font-semibold shadow-xs cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Next Quote</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
