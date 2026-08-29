import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { sound } from '../../lib/sound';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  variant?: 'circle' | 'square';
  color?: 'sage' | 'lavender';
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  variant = 'circle',
  color = 'lavender',
  disabled = false,
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      if (!checked) sound.playComplete();
      else sound.playClick();
      onChange(!checked);
    }
  };

  const isCircle = variant === 'circle';
  const colorBg = color === 'sage' ? 'bg-[#6BAA7A] border-[#6BAA7A]' : 'bg-[#C7C9F5] border-[#B2B5EE] text-[#333878]';

  return (
    <label
      onClick={handleClick}
      className={`inline-flex items-center gap-3 select-none cursor-pointer group ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <motion.div
        whileHover={disabled ? {} : { scale: 1.1 }}
        whileTap={disabled ? {} : { scale: 0.9 }}
        className={`w-5 h-5 flex items-center justify-center transition-colors border ${
          isCircle ? 'rounded-full' : 'rounded-md'
        } ${
          checked
            ? colorBg
            : 'border-[#CBD2DC] dark:border-[#4B5563] bg-transparent group-hover:border-[#6BAA7A]'
        }`}
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Check className={`w-3.5 h-3.5 stroke-[3] ${color === 'sage' ? 'text-white' : 'text-[#3B3F8C]'}`} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {label && <span className="text-sm text-[#1F2937] dark:text-[#F3F4F6]">{label}</span>}
    </label>
  );
};
