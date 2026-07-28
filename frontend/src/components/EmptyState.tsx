import { Sparkles } from 'lucide-react';

export default function EmptyState({
  title,
  description,
  icon: Icon = Sparkles,
  action,
  testId = 'empty-state',
}) {
  return (
    <div
      data-testid={testId}
      className="paper-card flex flex-col items-center justify-center px-6 py-16 text-center animate-fade-up"
    >
      <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-accent/15 text-accent">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="font-display text-2xl font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
