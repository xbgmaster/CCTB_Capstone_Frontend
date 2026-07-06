import { useEffect, useState } from 'react';
import { Briefcase, Building2, ClipboardCheck, ClipboardList, Star, Users } from 'lucide-react';
import { useData } from '../../contexts/DataContext.jsx';
import { adminApi } from '../../services/endpoints.js';

export default function AdminOverview() {
  const { jobs, companies, users } = useData();
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    adminApi.overview().then(setOverview).catch(() => setOverview(null));
  }, []);

  const stats = [
    { label: 'Total users',  value: overview?.totalUsers   ?? users.length,        icon: Users,          tone: 'bg-blue-50 text-blue-700' },
    { label: 'Workers',      value: overview?.workers      ?? '-',                  icon: Users,          tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Employers',    value: overview?.employers    ?? '-',                  icon: Building2,      tone: 'bg-brand-50 text-brand-700' },
    { label: 'Companies',    value: overview?.companies    ?? companies.length,     icon: Building2,      tone: 'bg-violet-50 text-violet-700' },
    { label: 'Active jobs',  value: overview?.openJobs     ?? jobs.filter((j) => j.status === 'open').length, icon: Briefcase, tone: 'bg-amber-50 text-amber-700' },
    { label: 'Applications', value: overview?.applications ?? '-',                  icon: ClipboardList,  tone: 'bg-cyan-50 text-cyan-700' },
    { label: 'Selected hires', value: overview?.selectedHires ?? '-',               icon: ClipboardCheck, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Reviews',      value: overview?.reviews      ?? '-',                  icon: Star,           tone: 'bg-pink-50 text-pink-700' },
  ];

  const recentJobs = [...jobs].sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt)).slice(0, 5);
  const recentUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-ink-500">{s.label}</p>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.tone}`}>
                <s.icon size={14} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-ink-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-base font-bold text-ink-900">Recent jobs</h2>
          <ul className="mt-3 divide-y divide-ink-100">
            {recentJobs.map((j) => (
              <li key={j.id} className="flex items-center justify-between py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink-900">{j.title}</p>
                  <p className="text-xs text-ink-500">{j.location} - {j.category}</p>
                </div>
                <span className="text-xs text-ink-400">{new Date(j.postedAt).toLocaleDateString('en-CA')}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-5">
          <h2 className="text-base font-bold text-ink-900">New users</h2>
          <ul className="mt-3 divide-y divide-ink-100">
            {recentUsers.map((u) => (
              <li key={u.id} className="flex items-center justify-between py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink-900">{u.firstName} {u.lastName}</p>
                  <p className="text-xs uppercase tracking-wide text-ink-500">{u.role}</p>
                </div>
                <span className="text-xs text-ink-400">{new Date(u.createdAt).toLocaleDateString('en-CA')}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
