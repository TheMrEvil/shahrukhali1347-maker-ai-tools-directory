'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, ...props }, ref) => {
    return (
      <div className="min-w-[160px]">
        {label && (
          <label className="block text-sm font-medium text-[var(--ink-soft)] mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full h-11 px-4 pr-10 rounded-xl',
              'border-2 border-[var(--rule)]',
              'bg-[var(--surface)]',
              'text-gray-700 dark:text-gray-200 text-sm font-medium',
              'hover:border-gray-300 dark:hover:border-gray-600',
              'focus:outline-none focus:border-purple-500 focus:ring-0',
              'appearance-none cursor-pointer',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-colors duration-200',
              error && 'border-red-500 focus:border-red-500',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
