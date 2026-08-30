import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckSquare, BookOpen, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { openTaskModal, openNoteModal } from '../../store/slices/uiSlice';
import { sound } from '../../lib/sound';

export const QuickAddFAB: React.FC = () => {
  const dispatch = useAppDispatch();
  const isMusicActive = useAppSelector((state) => state.music.isPlaying || state.music.isPlayerOpen);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    sound.playClick();
    setIsOpen((prev) => !prev);
  };

  const handleCreateTask = () => {
    sound.playClick();
    setIsOpen(false);
    dispatch(openTaskModal());
  };

  const handleCreateNote = () => {
    sound.playClick();
    setIsOpen(false);
    dispatch(openNoteModal());
  };

  return (
    <motion.div
      animate={{ bottom: isMusicActive ? '5rem' : '4.5rem' }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className="fixed right-3.5 z-40 md:hidden select-none"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className="flex flex-col gap-2.5 mb-3 items-end"
          >
            {/* New Note Option */}
            <button
              onClick={handleCreateNote}
              className="flex items-center gap-2.5 pl-3.5 pr-4 py-2 rounded-2xl bg-white dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#273033] shadow-float text-xs font-semibold text-[#1F2937] dark:text-[#F3F4F6] cursor-pointer hover:bg-black/5"
            >
              <div className="w-7 h-7 rounded-xl bg-[#ECEEFB] dark:bg-[#20233B] text-[#7B7FD4] flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span>New Note</span>
            </button>

            {/* New Task Option */}
            <button
              onClick={handleCreateTask}
              className="flex items-center gap-2.5 pl-3.5 pr-4 py-2 rounded-2xl bg-white dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#273033] shadow-float text-xs font-semibold text-[#1F2937] dark:text-[#F3F4F6] cursor-pointer hover:bg-black/5"
            >
              <div className="w-7 h-7 rounded-xl bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#6BAA7A] flex items-center justify-center">
                <CheckSquare className="w-3.5 h-3.5" />
              </div>
              <span>New Task</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Circular Floating Action Button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={toggleOpen}
        title="Quick Create"
        className="w-12 h-12 rounded-full bg-[#6BAA7A] hover:bg-[#558E63] text-white flex items-center justify-center shadow-float cursor-pointer"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5 stroke-[2.5]" />}
        </motion.div>
      </motion.button>
    </motion.div>
  );
};
