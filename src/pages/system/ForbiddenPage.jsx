import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <div className="rounded-full bg-red-50 p-4 text-red-600">
        <ShieldAlert size={28} />
      </div>
      <h1 className="mt-4 text-2xl font-bold text-ink-900">Access denied</h1>
      <p className="mt-2 text-sm text-ink-500">
        Your account role doesn't have permission to view this page.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
