import { Link } from 'react-router-dom';
import { ArrowRight, Award, Briefcase, ClipboardList, Search, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import JobCard from '../../components/jobs/JobCard.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function WorkerDashboard() {
  const { currentUser } = useAuth();
  const { applications, jobs, companies, workerProfiles } = useData();

  const profile = workerProfiles.find((p) => p.userId === currentUser.id);
  const myApps = applications.filter((a) => a.workerId === currentUser.id);
  const matchSkills = new Set((profile?.skills || []).map((s) => s.toLowerCase()));

  const recommended = jobs
    .filter((j) => j.status === 'open')
    .filter((j) => !myApps.some((a) => a.jobId === j.id))
    .map((j) => {
      const overlap = j.skillsRequired.filter((s) => matchSkills.has(s.toLowerCase())).length;
      return { job: j, overlap };
    })
    .sort((a, b) => b.overlap - a.overlap || new Date(b.job.postedAt) - new Date(a.job.postedAt))
    .slice(0, 4);

  const stats = [
    { label: 'Active applications', value: myApps.filter((a) => ['submitted', 'shortlisted'].includes(a.status)).length, icon: ClipboardList, tone: 'bg-brand-50 text-brand-700' },
    { label: 'Shortlisted', value: myApps.filter((a) => a.status === 'shortlisted').length, icon: Award, tone: 'bg-amber-50 text-amber-700' },
    { label: 'Selected', value: myApps.filter((a) => a.status === 'selected').length, icon: Star, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Profile rating', value: profile?.rating ? profile.rating.toFixed(1) : '-', icon: Star, tone: 'bg-blue-50 text-blue-700' },
  ];

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

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink-900">Recommended for you</h2>
            <Link to="/worker/jobs" className="text-xs font-semibold text-brand-700 hover:underline">
              Browse all <ArrowRight size={12} className="ml-0.5 inline" />
            </Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {recommended.length === 0 && (
              <EmptyState
                icon={Search}
                title="No matches yet"
                description="Add more skills to your profile to get better matches."
                action={<Link to="/worker/profile" className="btn-primary">Update profile</Link>}
              />
            )}
            {recommended.map(({ job }) => (
              <JobCard
                key={job.id}
                job={job}
                companyName={companies.find((c) => c.id === job.companyId)?.name}
                showStatus={false}
              />
            ))}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-base font-bold text-ink-900">Recent activity</h2>
          <div className="mt-3 divide-y divide-ink-100">
            {myApps.length === 0 && (
              <EmptyState
                icon={Briefcase}
                title="No applications yet"
                description="Apply to a job to see updates here."
              />
            )}
            {myApps.slice(0, 6).map((a) => {
              const job = jobs.find((j) => j.id === a.jobId);
              return (
                <Link
                  key={a.id}
                  to="/worker/applications"
                  className="flex items-center justify-between py-3 transition-colors hover:bg-ink-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-900">{job?.title}</p>
                    <p className="text-xs text-ink-500">
                      {new Date(a.submittedAt).toLocaleDateString('en-CA')}
                    </p>
                  </div>
                  <StatusBadge value={a.status} />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
