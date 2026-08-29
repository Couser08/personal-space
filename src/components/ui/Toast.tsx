import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { hideToast } from '../../store/slices/uiSlice';

export const Toast: React.FC = () => {
  const dispatch = useAppDispatch();
  const toast = useAppSelector((state) => state.ui.toast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      dispatch(hideToast());
    }, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-4 h-4 text-[#6BAA7A] shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-[#E05656] shrink-0" />,
    info: <Info className="w-4 h-4 text-[#7B7FD4] shrink-0" />,
  };

  const bgMap = {
    success: 'bg-white dark:bg-[#1A1F21] border-[#D2E4D6] dark:border-[#2A4232]',
    error: 'bg-white dark:bg-[#1A1F21] border-[#F8B4B4] dark:border-[#4E2424]',
    info: 'bg-white dark:bg-[#1A1F21] border-[#D6DAF7] dark:border-[#2D3153]',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-float ${
            bgMap[toast.type || 'success']
          } max-w-sm`}
        >
          {iconMap[toast.type || 'success']}
          <span className="text-xs font-medium text-[#1F2937] dark:text-[#F3F4F6] flex-1">
            {toast.message}
          </span>
          <button
            onClick={() => dispatch(hideToast())}
            className="text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
