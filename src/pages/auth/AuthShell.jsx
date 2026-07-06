import { Link } from 'react-router-dom';
import { HardHat } from 'lucide-react';

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="text-center">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
            <HardHat size={18} />
          </span>
          <span className="text-lg font-bold text-ink-900">Jobnet</span>
        </Link>
      </div>
      <div className="card mt-6 p-7">
        <h1 className="text-xl font-bold text-ink-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
        <div className="mt-5">{children}</div>
      </div>
      {footer && <div className="mt-5 text-center text-sm text-ink-600">{footer}</div>}
    </div>
  );
}
