import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { sound } from '../../lib/sound';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disableSound?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      onClick,
      disabled,
      disableSound = false,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !isLoading) {
        if (!disableSound) sound.playClick();
        if (onClick) onClick(e);
      }
    };

    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

    const variantStyles: Record<ButtonVariant, string> = {
      primary: 'bg-[#6BAA7A] hover:bg-[#558E63] text-white shadow-sm focus-visible:ring-[#6BAA7A] active:scale-[0.98]',
      secondary: 'bg-[#C7C9F5] hover:bg-[#B3B6F0] text-[#333878] dark:bg-[#4F54A8] dark:text-[#E8EAFF] shadow-sm focus-visible:ring-[#C7C9F5] active:scale-[0.98]',
      outline: 'bg-white dark:bg-[#1E2325] border border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#252B2E] text-[#1F2937] dark:text-[#F3F4F6] shadow-xs active:scale-[0.98]',
      text: 'text-[#6BAA7A] hover:text-[#558E63] hover:bg-[#6BAA7A]/10 p-0 shadow-none font-medium',
      ghost: 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-[#4F5D75] dark:text-[#9CA3AF] active:scale-[0.98]',
      danger: 'bg-[#E05656] hover:bg-[#C93B3B] text-white shadow-sm focus-visible:ring-[#E05656] active:scale-[0.98]',
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-6 py-2.5 gap-2.5',
      icon: 'p-2 aspect-square',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${variant !== 'text' ? sizeStyles[size] : ''} ${className}`}
        {...(props as HTMLMotionProps<'button'>)}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        
        {children}
        
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
