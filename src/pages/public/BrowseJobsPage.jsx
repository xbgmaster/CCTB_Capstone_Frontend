import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useData } from '../../contexts/DataContext.jsx';
import JobCard from '../../components/jobs/JobCard.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

const CATEGORIES = ['All', 'Electrical', 'Painting', 'HVAC', 'Supervision', 'General Labour', 'Plumbing', 'Carpentry'];
const PROVINCES = ['All', 'ON', 'QC', 'BC', 'AB', 'NS', 'MB', 'SK'];

export default function BrowseJobsPage() {
  const { jobs, companies } = useData();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [province, setProvince] = useState('All');
  const [onlyOpen, setOnlyOpen] = useState(true);

  const filtered = useMemo(() => {
    return jobs
      .filter((j) => (onlyOpen ? j.status === 'open' : true))
      .filter((j) => (category === 'All' ? true : j.category === category))
      .filter((j) => (province === 'All' ? true : j.location.endsWith(province)))
      .filter((j) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.skillsRequired.some((s) => s.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
  }, [jobs, query, category, province, onlyOpen]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900">Browse jobs</h1>
          <p className="text-sm text-ink-500">
            Showing {filtered.length} of {jobs.length} listings.
          </p>
        </div>
      </div>

      <div className="card mt-4 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              className="input pl-9"
              placeholder="Search by title, skill, or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select className="input w-auto" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All categories' : c}
              </option>
            ))}
          </select>
          <select className="input w-auto" value={province} onChange={(e) => setProvince(e.target.value)}>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p === 'All' ? 'All provinces' : p}
              </option>
            ))}
          </select>
          <label className="inline-flex select-none items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
              checked={onlyOpen}
              onChange={(e) => setOnlyOpen(e.target.checked)}
            />
            Only open
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {filtered.map((j) => {
          const company = companies.find((c) => c.id === j.companyId);
          return <JobCard key={j.id} job={j} companyName={company?.name} />;
        })}
      </div>

      {filtered.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={SlidersHorizontal}
            title="No jobs match your filters"
            description="Try clearing the search or broadening categories and provinces."
          />
        </div>
      )}
    </div>
  );
}
