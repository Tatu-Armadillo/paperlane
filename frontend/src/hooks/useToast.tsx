import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface Toast extends Required<Omit<ToastOptions, 'duration'>> {
  id: number;
}

interface ToastContextType {
  push: (toast: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType>({
  push: () => { },
});

let idCounter = 0;

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback(
    ({
      title,
      description,
      variant = 'info',
      duration = 4000,
    }: ToastOptions) => {
      idCounter += 1;
      const id = idCounter;

      setToasts((prev) => [
        ...prev,
        {
          id,
          title: title ?? '',
          description: description ?? '',
          variant,
        },
      ]);

      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    [],
  );

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div
        data-testid="toast-region"
        className="fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2"
      >
        {toasts.map((t) => {
          const Icon =
            t.variant === 'success'
              ? CheckCircle2
              : t.variant === 'error'
                ? AlertTriangle
                : Info;
          const tone =
            t.variant === 'success'
              ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-100'
              : t.variant === 'error'
                ? 'border-red-400/50 bg-red-500/10 text-red-100'
                : 'border-border bg-card text-foreground';
          return (
            <div
              key={t.id}
              data-testid={`toast-${t.variant}`}
              className={`flex items-start gap-3 rounded-2xl border ${tone} px-4 py-3 shadow-lg backdrop-blur animate-fade-up`}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1">
                {t.title && (
                  <p className="text-sm font-semibold">{t.title}</p>
                )}
                {t.description && (
                  <p className="text-xs opacity-80">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="opacity-60 transition hover:opacity-100"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
