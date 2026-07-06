import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl font-bold text-brand-600">404</p>
      <h1 className="mt-3 text-2xl font-bold text-ink-900">Page not found</h1>
      <p className="mt-2 text-sm text-ink-500">
        The page you are looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
