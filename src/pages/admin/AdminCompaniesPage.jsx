import { useMemo, useState } from 'react';
import { CheckCircle2, Search, ShieldCheck } from 'lucide-react';
import { useData } from '../../contexts/DataContext.jsx';
import { useToast } from '../../contexts/NotificationContext.jsx';
import StarRating from '../../components/ui/StarRating.jsx';

export default function AdminCompaniesPage() {
  const { companies, updateCompany, jobs } = useData();
  const { toast } = useToast();
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
      companies
        .filter((c) => (query ? c.name.toLowerCase().includes(query.toLowerCase()) : true))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [companies, query],
  );

  const toggleVerified = (c) => {
    updateCompany(c.id, { verified: !c.verified });
    toast({
      type: 'success',
      title: c.verified ? 'Verification removed' : 'Company verified',
      message: c.name,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative w-64">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input className="input pl-9" placeholder="Search companies..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <p className="ml-auto text-xs text-ink-500">{filtered.length} companies</p>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-ink-100 bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Industry</th>
              <th className="px-4 py-3">Active jobs</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {filtered.map((c) => {
              const activeJobs = jobs.filter((j) => j.companyId === c.id && j.status === 'open').length;
              return (
                <tr key={c.id} className="transition-colors hover:bg-ink-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ink-900">{c.name}</p>
                    <p className="text-xs text-ink-500">{c.city}, {c.province}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-600">{c.industry || '-'}</td>
                  <td className="px-4 py-3">{activeJobs}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <StarRating value={c.rating} size={12} />
                      <span className="text-xs text-ink-500">{c.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {c.verified ? (
                      <span className="badge-blue">
                        <CheckCircle2 size={12} /> Verified
                      </span>
                    ) : (
                      <span className="badge-gray">Unverified</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => toggleVerified(c)}
                      className="text-xs font-semibold text-brand-700 hover:underline"
                    >
                      <ShieldCheck size={12} className="mr-1 inline" />
                      {c.verified ? 'Remove verification' : 'Verify'}
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-ink-500">
                  No companies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
