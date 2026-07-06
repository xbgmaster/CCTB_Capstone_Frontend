import { useMemo, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext.jsx';
import { useToast } from '../../contexts/NotificationContext.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';

const STATUSES = ['all', 'open', 'paused', 'closed', 'filled'];

export default function AdminJobsPage() {
  const { jobs, companies, deleteJob, updateJob } = useData();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(
    () =>
      jobs
        .filter((j) => (status === 'all' ? true : j.status === status))
        .filter((j) => (query ? j.title.toLowerCase().includes(query.toLowerCase()) : true))
        .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt)),
    [jobs, query, status],
  );

  const handleClose = (j) => {
    updateJob(j.id, { status: 'closed' });
    toast({ type: 'info', title: 'Job closed by admin' });
  };

  const handleDelete = (j) => {
    if (!window.confirm(`Permanently delete "${j.title}"?`)) return;
    deleteJob(j.id);
    toast({ type: 'warning', title: 'Job deleted' });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-64">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input className="input pl-9" placeholder="Search jobs..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select className="input w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'All statuses' : s[0].toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <p className="ml-auto text-xs text-ink-500">{filtered.length} jobs</p>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-ink-100 bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Job</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Apps</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Posted</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {filtered.map((j) => {
              const company = companies.find((c) => c.id === j.companyId);
              const apps = j.applicationCount ?? 0;
              return (
                <tr key={j.id} className="transition-colors hover:bg-ink-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ink-900">{j.title}</p>
                    <p className="text-xs text-ink-500">{j.location} - {j.category}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-600">{company?.name || '-'}</td>
                  <td className="px-4 py-3"><span className="badge-gray">{apps}</span></td>
                  <td className="px-4 py-3"><StatusBadge value={j.status} kind="job" /></td>
                  <td className="px-4 py-3 text-xs text-ink-500">{new Date(j.postedAt).toLocaleDateString('en-CA')}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {j.status === 'open' && (
                        <button type="button" onClick={() => handleClose(j)} className="text-xs font-semibold text-amber-700 hover:underline">
                          Close
                        </button>
                      )}
                      <button type="button" onClick={() => handleDelete(j)} className="text-xs font-semibold text-red-600 hover:underline">
                        <Trash2 size={12} className="mr-1 inline" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-ink-500">
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
