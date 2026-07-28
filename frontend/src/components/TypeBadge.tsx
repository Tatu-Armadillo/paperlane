import { classNames, TYPE_LABEL_BY_KEY, TYPE_TOKEN_BY_KEY } from '@/utils/format.js';

const TOKEN_TO_CLASSES = {
  article: 'bg-type-article-bg text-type-article-fg',
  book: 'bg-type-book-bg text-type-book-fg',
  project: 'bg-type-project-bg text-type-project-fg',
  story: 'bg-type-story-bg text-type-story-fg',
  image: 'bg-type-image-bg text-type-image-fg',
};

interface TypeBadgeProps {
  type: string, 
  className?: string, 
  size?: string
}

export default function TypeBadge({ type, className = '', size = 'sm' }: TypeBadgeProps) {
  const token = TYPE_TOKEN_BY_KEY[type] || 'article';
  const label = TYPE_LABEL_BY_KEY[type] || type;
  return (
    <span
      data-testid={`type-badge-${type}`}
      className={classNames(
        'inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-wider',
        size === 'sm' ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-1.5 text-xs',
        TOKEN_TO_CLASSES[token],
        className,
      )}
    >
      {label}
    </span>
  );
}
