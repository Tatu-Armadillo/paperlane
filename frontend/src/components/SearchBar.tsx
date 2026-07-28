import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder, testId = 'search-input' }) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Search documents by title…'}
        data-testid={testId}
        className="paper-input pl-11"
      />
    </div>
  );
}
