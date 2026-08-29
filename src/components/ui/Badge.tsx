import React from 'react';

export type BadgeVariant = 'sage' | 'lavender' | 'sand' | 'slate' | 'rose' | 'charcoal';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'sage',
  size = 'sm',
  icon,
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    sage: 'bg-[#EAF2EC] text-[#3D6B47] dark:bg-[#1E2E23] dark:text-[#A7CFAF]',
    lavender: 'bg-[#ECEEFB] text-[#4A4E9E] dark:bg-[#20233B] dark:text-[#C7C9F5]',
    sand: 'bg-[#FAF5EB] text-[#7A5B2E] dark:bg-[#2C271E] dark:text-[#E4D3B4]',
    slate: 'bg-[#F1F3F6] text-[#4F5D75] dark:bg-[#22282C] dark:text-[#CBD2DC]',
    rose: 'bg-[#FDE8E8] text-[#9B2C2C] dark:bg-[#361A1A] dark:text-[#F8B4B4]',
    charcoal: 'bg-[#1F2937] text-white dark:bg-[#374151]',
  };

  const sizeStyles: Record<string, string> = {
    sm: 'text-[11px] px-2.5 py-0.5 font-medium rounded-full',
    md: 'text-xs px-3 py-1 font-medium rounded-full',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
