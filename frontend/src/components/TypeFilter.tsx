import { DOCUMENT_TYPES, classNames } from '@/utils/format.js';
import { FileText, BookOpen, Boxes, Feather, Image as ImageIcon, LayoutGrid } from 'lucide-react';

const ICONS = {
  FileText,
  BookOpen,
  Boxes,
  Feather,
  Image: ImageIcon,
};

export default function TypeFilter({ value, onChange }) {
  const options = [{ key: 'all', label: 'All', icon: 'LayoutGrid' }, ...DOCUMENT_TYPES];
  return (
    <div
      role="tablist"
      data-testid="type-filter"
      className="flex flex-wrap gap-2"
    >
      {options.map((opt) => {
        const Icon = opt.icon === 'LayoutGrid' ? LayoutGrid : ICONS[opt.icon];
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.key)}
            data-testid={`type-filter-${opt.key}`}
            className={classNames('paper-chip', active && 'paper-chip-active')}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
