import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 animate-fade-in bg-ink-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative z-10 w-full animate-slide-up rounded-xl bg-white shadow-cardHover ${sizes[size] || sizes.md}`}
      >
        <div className="flex items-start justify-between border-b border-ink-100 px-5 py-4">
          <h2 id="modal-title" className="text-base font-semibold text-ink-900">
            {title}
          </h2>
          <button
            type="button"
            className="text-ink-400 transition-colors hover:text-ink-700"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4 scrollbar-thin">{children}</div>
        {footer && <div className="border-t border-ink-100 px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}
