import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useData } from '../../contexts/DataContext.jsx';
import { useToast } from '../../contexts/NotificationContext.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';

const ROLE_FILTERS = ['all', 'worker', 'employer', 'admin'];

export default function AdminUsersPage() {
  const { users, updateUser } = useData();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = useMemo(() => {
    return users
      .filter((u) => (roleFilter === 'all' ? true : u.role === roleFilter))
      .filter((u) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [users, roleFilter, query]);

  const toggleStatus = (u) => {
    const next = u.status === 'suspended' ? 'active' : 'suspended';
    updateUser(u.id, { status: next });
    toast({
      type: next === 'suspended' ? 'warning' : 'success',
      title: next === 'suspended' ? 'User suspended' : 'User reactivated',
      message: `${u.firstName} ${u.lastName} is now ${next}.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-64">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input className="input pl-9" placeholder="Search users..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select className="input w-auto" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          {ROLE_FILTERS.map((r) => (
            <option key={r} value={r}>
              {r === 'all' ? 'All roles' : r[0].toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>
        <p className="ml-auto text-xs text-ink-500">{filtered.length} users</p>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-ink-100 bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {filtered.map((u) => (
              <tr key={u.id} className="transition-colors hover:bg-ink-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar initials={u.avatar} seed={u.id} size="sm" />
                    <div>
                      <p className="font-semibold text-ink-900">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-ink-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs uppercase tracking-wide text-ink-600">{u.role}</td>
                <td className="px-4 py-3 text-ink-600">{u.city ? `${u.city}, ${u.province}` : '-'}</td>
                <td className="px-4 py-3"><StatusBadge value={u.status} kind="user" /></td>
                <td className="px-4 py-3 text-xs text-ink-500">{new Date(u.createdAt).toLocaleDateString('en-CA')}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => toggleStatus(u)}
                    className={`text-xs font-semibold ${u.status === 'suspended' ? 'text-emerald-700' : 'text-red-600'} hover:underline`}
                  >
                    {u.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-ink-500">
                  No users match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
