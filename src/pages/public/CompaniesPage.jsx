import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, CheckCircle2, MapPin, Search } from 'lucide-react';
import { useData } from '../../contexts/DataContext.jsx';
import StarRating from '../../components/ui/StarRating.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function CompaniesPage() {
  const { companies, jobs } = useData();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return companies
      .filter((c) =>
        query.trim()
          ? c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.industry.toLowerCase().includes(query.toLowerCase())
          : true,
      )
      .sort((a, b) => b.rating - a.rating);
  }, [companies, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900">Companies</h1>
          <p className="text-sm text-ink-500">{filtered.length} verified employers hiring on Jobnet.</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            className="input pl-9"
            placeholder="Search companies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => {
          const openJobs = jobs.filter((j) => j.companyId === c.id && j.status === 'open').length;
          return (
            <Link
              key={c.id}
              to={`/companies/${c.id}`}
              className="card p-5 transition-shadow hover:shadow-cardHover"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-ink-900">{c.name}</h3>
                  <p className="text-xs text-ink-500">{c.industry}</p>
                </div>
                {c.verified && (
                  <span className="badge-blue">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <StarRating value={c.rating} size={14} />
                <span className="text-xs text-ink-500">
                  {c.rating.toFixed(1)} ({c.reviewCount} reviews)
                </span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-ink-600">{c.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-ink-500">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} />
                  {c.city}, {c.province}
                </span>
                <span className="font-semibold text-brand-700">
                  {openJobs} open {openJobs === 1 ? 'job' : 'jobs'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="mt-6">
          <EmptyState icon={Building2} title="No companies match your search" />
        </div>
      )}
    </div>
  );
}
