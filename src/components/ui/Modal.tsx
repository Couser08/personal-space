import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { sound } from '../../lib/sound';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const maxWidthStyles: Record<string, string> = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl',
  };

  const handleClose = () => {
    sound.playClick();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
          {/* Frosted Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          {/* Modal / Native Mobile Bottom Sheet Container */}
          <motion.div
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
            className={`relative w-full ${maxWidthStyles[maxWidth]} max-h-[88vh] sm:max-h-[92vh] flex flex-col bg-white dark:bg-[#1A1F21] rounded-t-3xl sm:rounded-3xl shadow-float border-t sm:border border-[#EEF0EC] dark:border-[#2E373A] overflow-hidden z-10`}
          >
            {/* Mobile Sheet Drag Handle Pill */}
            <div className="sm:hidden flex justify-center pt-2.5 pb-1">
              <div className="w-10 h-1.2 rounded-full bg-black/15 dark:bg-white/20" />
            </div>

            {(title || subtitle) && (
              <div className="flex items-start justify-between px-5 sm:px-6 pt-2 sm:pt-6 pb-3 sm:pb-4 border-b border-[#F0F2EE] dark:border-[#273033] shrink-0">
                <div>
                  {title && (
                    <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                      {subtitle}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}

            <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(88vh-70px)] sm:max-h-[calc(92vh-80px)]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
