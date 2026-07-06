import { Star } from 'lucide-react';

export default function StarRating({ value = 0, max = 5, size = 16, showValue = false, onChange, className = '' }) {
  const interactive = typeof onChange === 'function';
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {stars.map((n) => {
          const filled = n <= Math.round(value);
          const className = `${filled ? 'fill-amber-400 text-amber-400' : 'text-ink-300'} ${
            interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''
          }`;
          return (
            <Star
              key={n}
              size={size}
              className={className}
              onClick={interactive ? () => onChange(n) : undefined}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              role={interactive ? 'button' : undefined}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-ink-600">{value ? value.toFixed(1) : '-'}</span>
      )}
    </div>
  );
}
