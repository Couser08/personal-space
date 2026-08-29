import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-medium text-[#4F5D75] dark:text-[#9CA3AF] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={`w-full appearance-none bg-white dark:bg-[#1A1F21] text-[#1F2937] dark:text-[#F3F4F6] text-sm rounded-xl border ${
              error
                ? 'border-[#E05656] focus:ring-[#E05656]'
                : 'border-[#E5E7EB] dark:border-[#2E373A] focus:border-[#6BAA7A] focus:ring-2 focus:ring-[#6BAA7A]/20'
            } pl-3.5 pr-10 py-2.5 transition-all outline-none shadow-xs cursor-pointer ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#1A1F21] text-[#1F2937] dark:text-[#F3F4F6]">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 pointer-events-none text-[#9CA3AF]">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="text-xs text-[#E05656] mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
