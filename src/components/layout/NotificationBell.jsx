import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function NotificationBell() {
  const { currentUser } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const list = useMemo(() => {
    if (!currentUser) return [];
    return notifications
      .filter((n) => n.userId === currentUser.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8);
  }, [notifications, currentUser]);

  const unread = list.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!currentUser) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-full p-2 text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 animate-slide-up overflow-hidden rounded-xl border border-ink-200 bg-white shadow-cardHover">
          <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
            <p className="text-sm font-semibold text-ink-900">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => markAllNotificationsRead(currentUser.id)}
                className="text-xs font-medium text-brand-600 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto scrollbar-thin">
            {list.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-ink-500">You're all caught up.</p>
            )}
            {list.map((n) => (
              <Link
                key={n.id}
                to={n.link || '#'}
                onClick={() => {
                  markNotificationRead(n.id);
                  setOpen(false);
                }}
                className={`block border-b border-ink-100 px-4 py-3 transition-colors last:border-0 hover:bg-ink-50 ${
                  n.read ? '' : 'bg-brand-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-ink-900">{n.title}</p>
                  <span className="shrink-0 text-[10px] text-ink-400">{timeAgo(n.createdAt)}</span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-ink-600">{n.message}</p>
              </Link>
            ))}
          </div>
          <div className="border-t border-ink-100 px-4 py-2 text-center">
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-brand-600 hover:underline"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
