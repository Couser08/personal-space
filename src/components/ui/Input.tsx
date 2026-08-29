import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[#4F5D75] dark:text-[#9CA3AF] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#9CA3AF] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-white dark:bg-[#1A1F21] text-[#1F2937] dark:text-[#F3F4F6] placeholder-[#9CA3AF] text-sm rounded-xl border ${
              error
                ? 'border-[#E05656] focus:ring-[#E05656]'
                : 'border-[#E5E7EB] dark:border-[#2E373A] focus:border-[#6BAA7A] focus:ring-2 focus:ring-[#6BAA7A]/20'
            } ${leftIcon ? 'pl-9' : 'pl-3.5'} ${rightIcon ? 'pr-9' : 'pr-3.5'} py-2.5 transition-all outline-none shadow-xs disabled:opacity-60 disabled:bg-gray-50 ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[#9CA3AF] flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-[#E05656] mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#9CA3AF] mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
