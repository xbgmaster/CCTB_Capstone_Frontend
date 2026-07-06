import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const NotificationContext = createContext(null);

let nextId = 1;

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, message, type = 'info', duration = 4000 }) => {
      const id = nextId++;
      setToasts((list) => [...list, { id, title, message, type }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss, toasts }), [toast, dismiss, toasts]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </NotificationContext.Provider>
  );
}

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const tone = {
    info: 'border-blue-200 bg-blue-50 text-blue-900',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    error: 'border-red-200 bg-red-50 text-red-900',
  }[toast.type] || 'border-ink-200 bg-white text-ink-900';

  return (
    <div
      className={`pointer-events-auto animate-slide-up rounded-lg border px-4 py-3 shadow-cardHover ${tone}`}
      role="status"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}
          {toast.message && <p className="mt-0.5 text-sm opacity-90">{toast.message}</p>}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs font-medium opacity-60 hover:opacity-100"
          aria-label="Dismiss"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useToast must be used within a NotificationProvider');
  return ctx;
}
