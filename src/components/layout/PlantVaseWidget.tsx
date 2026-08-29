import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export const PlantVaseWidget: React.FC = () => {
  return (
    <div className="relative rounded-2xl p-4 bg-gradient-to-b from-[#F2F7F4] to-[#FAFBF9] dark:from-[#1A261F] dark:to-[#161D19] border border-[#E2EBE5] dark:border-[#27392E] overflow-hidden group">
      {/* Decorative Botanical Leaves Graphic */}
      <div className="relative flex justify-center mb-3">
        <svg viewBox="0 0 120 130" className="w-24 h-28 drop-shadow-xs transition-transform duration-500 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Vase */}
          <path d="M50 78 C50 72 54 68 56 62 C58 56 58 50 60 50 C62 50 62 56 64 62 C66 68 70 72 70 78 C70 92 68 114 60 114 C52 114 50 92 50 78 Z" fill="#FFFFFF" stroke="#E2EBE5" strokeWidth="1.5" />
          <ellipse cx="60" cy="114" rx="10" ry="2" fill="#D4E4D8" opacity="0.6"/>
          
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
      </div>

      <p className="text-xs font-medium text-[#4F5D75] dark:text-[#CBD2DC] text-center leading-relaxed">
        Small steps every day. <br />
        <span className="text-[#1F2937] dark:text-white font-semibold">Big changes over time.</span>
      </p>

      <div className="flex justify-center mt-2.5">
        <motion.div
          whileHover={{ scale: 1.25 }}
          className="w-5 h-5 rounded-full bg-[#6BAA7A]/15 text-[#6BAA7A] flex items-center justify-center cursor-pointer"
        >
          <Heart className="w-3 h-3 fill-current" />
        </motion.div>
      </div>
    </div>
  );
};
