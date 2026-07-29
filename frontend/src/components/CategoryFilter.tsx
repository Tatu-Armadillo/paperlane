import { ChevronDown } from 'lucide-react';
import { Category } from '@/types/Category';

interface CategoryFilterProps {
  value: number | null;
  onChange: (value: number | null) => void;
  categories: Category[];
  loading?: boolean;
}

export default function CategoryFilter({
  value,
  onChange,
  categories,
  loading = false,
}: CategoryFilterProps) {
  return (
    <div className="relative w-full sm:w-64">
      <select
        value={value ?? ''}
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : null)
        }
        disabled={loading}
        data-testid="category-filter"
        className="paper-input appearance-none pr-10"
      >
        <option value="">All categories</option>

        {categories.map((c) => (
          <option key={c.key} value={c.id}>  
            {c.value}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}