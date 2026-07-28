import { ChevronLeft, ChevronRight } from 'lucide-react';
import { classNames } from '../utils/format.js';

export default function Pagination({ page, totalPages, onChange, testId = 'pagination' }) {
  if (!totalPages || totalPages <= 1) return null;
  const numbers = [];
  const push = (n) => !numbers.includes(n) && n >= 1 && n <= totalPages && numbers.push(n);
  push(1);
  push(page - 1);
  push(page);
  push(page + 1);
  push(totalPages);
  numbers.sort((a, b) => a - b);

  const items = [];
  numbers.forEach((n, i) => {
    if (i > 0 && n - numbers[i - 1] > 1) items.push('…');
    items.push(n);
  });

  return (
    <nav
      data-testid={testId}
      className="mt-10 flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        data-testid={`${testId}-prev`}
        className="paper-btn-ghost !px-3"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {items.map((it, idx) =>
        it === '…' ? (
          <span key={`e-${idx}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={it}
            type="button"
            onClick={() => onChange(it)}
            data-testid={`${testId}-page-${it}`}
            className={classNames(
              'h-9 min-w-9 rounded-full px-3 text-sm transition',
              it === page
                ? 'bg-foreground text-background'
                : 'text-foreground/70 hover:bg-secondary',
            )}
          >
            {it}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        data-testid={`${testId}-next`}
        className="paper-btn-ghost !px-3"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
