import { useMemo, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import JobCard from '../../components/jobs/JobCard.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

const CATEGORIES = ['All', 'Electrical', 'Painting', 'HVAC', 'Supervision', 'General Labour', 'Plumbing', 'Carpentry'];

export default function WorkerJobsPage() {
  const { currentUser } = useAuth();
  const { jobs, companies, applications, workerProfiles } = useData();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [smartMatch, setSmartMatch] = useState(true);

  const myApps = applications.filter((a) => a.workerId === currentUser.id);
  const appliedIds = new Set(myApps.map((a) => a.jobId));
  const profile = workerProfiles.find((p) => p.userId === currentUser.id);
  const mySkills = new Set((profile?.skills || []).map((s) => s.toLowerCase()));

  const filtered = useMemo(() => {
    const base = jobs
      .filter((j) => j.status === 'open')
      .filter((j) => (category === 'All' ? true : j.category === category))
      .filter((j) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.skillsRequired.some((s) => s.toLowerCase().includes(q))
        );
      })
      .map((j) => {
        const overlap = j.skillsRequired.filter((s) => mySkills.has(s.toLowerCase())).length;
        return { job: j, overlap };
      });

    if (smartMatch) {
      base.sort((a, b) => b.overlap - a.overlap || new Date(b.job.postedAt) - new Date(a.job.postedAt));
    } else {
      base.sort((a, b) => new Date(b.job.postedAt) - new Date(a.job.postedAt));
    }
    return base;
  }, [jobs, query, category, smartMatch, mySkills]);

  return (
    <div className="space-y-4">
      <div className="card p-4">
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
          <label className="inline-flex select-none items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
              checked={smartMatch}
              onChange={(e) => setSmartMatch(e.target.checked)}
            />
            <Sparkles size={14} className="text-brand-600" /> Smart match
          </label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map(({ job, overlap }) => (
          <div key={job.id} className="relative">
            {overlap > 0 && smartMatch && (
              <span className="absolute right-3 top-3 z-10 badge-brand">
                <Sparkles size={10} /> {overlap} skill match{overlap === 1 ? '' : 'es'}
              </span>
            )}
            <JobCard
              job={job}
              companyName={companies.find((c) => c.id === job.companyId)?.name}
              showStatus={false}
            />
            {appliedIds.has(job.id) && (
              <p className="mt-1 text-xs text-emerald-700">You already applied to this job.</p>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyState
          icon={Search}
          title="No jobs match your filters"
          description="Try clearing the search or selecting a different category."
        />
      )}
    </div>
  );
}
