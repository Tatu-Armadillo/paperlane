import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext({ push: () => {} });

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback(
    ({ title, description, variant = 'info', duration = 4000 }) => {
      idCounter += 1;
      const id = idCounter;
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    [],
  );

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

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
