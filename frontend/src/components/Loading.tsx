import { Loader2 } from 'lucide-react';

export default function Loading({ label = 'Loading…', testId = 'loading-indicator' }) {
  return (
    <div
      data-testid={testId}
      className="flex flex-col items-center justify-center gap-3 py-14 text-muted-foreground"
    >
      <Loader2 className="h-5 w-5 animate-spin text-accent" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
