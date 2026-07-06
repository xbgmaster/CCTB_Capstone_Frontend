import { Link } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-CA');
}

export default function NotificationsPage() {
  const { currentUser } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();

  const myList = notifications
    .filter((n) => n.userId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const unread = myList.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900">Notifications</h1>
          <p className="text-sm text-ink-500">
            {unread > 0 ? `${unread} unread notification${unread === 1 ? '' : 's'}` : 'All caught up'}
          </p>
        </div>
        {unread > 0 && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => markAllNotificationsRead(currentUser.id)}
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {myList.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications yet" description="Updates about your jobs and applications will appear here." />
      ) : (
        <div className="card divide-y divide-ink-100">
          {myList.map((n) => (
            <Link
              key={n.id}
              to={n.link || '#'}
              onClick={() => markNotificationRead(n.id)}
              className={`block px-5 py-4 transition-colors hover:bg-ink-50 ${
                n.read ? '' : 'bg-brand-50/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-900">{n.title}</p>
                  <p className="mt-0.5 text-sm text-ink-600">{n.message}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!n.read && <span className="h-2 w-2 rounded-full bg-brand-600" />}
                  <span className="text-xs text-ink-400">{timeAgo(n.createdAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
