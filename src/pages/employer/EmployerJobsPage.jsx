import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, PlusCircle, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

const STATUSES = ['all', 'open', 'paused', 'closed', 'filled'];

export default function EmployerJobsPage() {
  const { currentUser } = useAuth();
  const { jobs } = useData();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  const myJobs = useMemo(
    () =>
      jobs
        .filter((j) => j.companyId === currentUser.companyId)
        .filter((j) => (status === 'all' ? true : j.status === status))
        .filter((j) => (query ? j.title.toLowerCase().includes(query.toLowerCase()) : true))
        .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt)),
    [jobs, currentUser, status, query],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-64">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              className="input pl-9"
              placeholder="Search your jobs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select className="input w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All statuses' : s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <Link to="/employer/post" className="btn-primary">
          <PlusCircle size={14} /> Post a job
        </Link>
      </div>

      {myJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs match your filters"
          description={status === 'all' ? 'Post your first job to start receiving applicants.' : 'Try changing the status filter.'}
          action={
            <Link to="/employer/post" className="btn-primary">
              <PlusCircle size={14} /> Post a job
            </Link>
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-ink-100 bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Applicants</th>
                <th className="px-4 py-3">Posted</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {myJobs.map((j) => {
                const appCount = j.applicationCount ?? 0;
                return (
                  <tr key={j.id} className="transition-colors hover:bg-ink-50">
                    <td className="px-4 py-3">
                      <Link to={`/employer/jobs/${j.id}`} className="font-semibold text-ink-900 hover:text-brand-700">
                        {j.title}
                      </Link>
                      <p className="text-xs text-ink-500">{j.location}</p>
                    </td>
                    <td className="px-4 py-3 text-ink-600">{j.category}</td>
                    <td className="px-4 py-3"><span className="badge-gray">{appCount}</span></td>
                    <td className="px-4 py-3 text-xs text-ink-500">{new Date(j.postedAt).toLocaleDateString('en-CA')}</td>
                    <td className="px-4 py-3"><StatusBadge value={j.status} kind="job" /></td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/employer/jobs/${j.id}`} className="text-xs font-semibold text-brand-700 hover:underline">
                        Manage
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
