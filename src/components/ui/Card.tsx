import React, { HTMLAttributes } from 'react';

export type CardVariant = 'simple' | 'highlight' | 'info' | 'sand' | 'dark';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'simple',
  hoverable = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-200 border';

  const variantStyles: Record<CardVariant, string> = {
    simple: 'bg-white dark:bg-[#1A1F21] border-[#EEF0EC] dark:border-[#273033] shadow-card text-[#1F2937] dark:text-[#F3F4F6]',
    highlight: 'bg-[#EAF2EC] dark:bg-[#1E2E23] border-[#D2E4D6] dark:border-[#2A4232] text-[#24422B] dark:text-[#D1EBD6] shadow-xs',
    info: 'bg-[#ECEEFB] dark:bg-[#20233B] border-[#D6DAF7] dark:border-[#2D3153] text-[#2D3169] dark:text-[#E0E2FD] shadow-xs',
    sand: 'bg-[#FAF5EB] dark:bg-[#2C271E] border-[#F2E8D5] dark:border-[#423A2B] text-[#523F21] dark:text-[#F7ECD8] shadow-xs',
    dark: 'bg-[#4F5D75] text-white border-transparent shadow-card',
  };

  const hoverStyles = hoverable
    ? 'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer'
    : '';

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};
