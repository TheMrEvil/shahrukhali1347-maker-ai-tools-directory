'use client';

import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  count?: number;
  className?: string;
}

export default function Rating({
  value,
  max = 5,
  size = 'md',
  showValue = true,
  count,
  className,
}: RatingProps) {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={cn(sizes[size], 'text-yellow-400 fill-yellow-400')} />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className={cn(sizes[size], 'text-gray-300 dark:text-gray-600')} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={cn(sizes[size], 'text-yellow-400 fill-yellow-400')} />
            </div>
          </div>
        )}

        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={cn(sizes[size], 'text-gray-300 dark:text-gray-600')} />
        ))}
      </div>

      {showValue && (
        <span className={cn('font-semibold text-[var(--ink)]', textSizes[size])}>
          {value.toFixed(1)}
        </span>
      )}

      {count !== undefined && (
        <span className={cn('text-[var(--ink-faint)]', textSizes[size])}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
