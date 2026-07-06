import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, ClipboardList, PlusCircle, Star, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import { jobsApi } from '../../services/endpoints.js';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function EmployerDashboard() {
  const { currentUser } = useAuth();
  const { jobs, companies } = useData();
  const [appsByJob, setAppsByJob] = useState({}); // jobId -> ApplicationDto[]

  const company = companies.find((c) => c.id === currentUser.companyId);
  const myJobs = useMemo(
    () => jobs.filter((j) => j.companyId === currentUser.companyId),
    [jobs, currentUser.companyId],
  );

  // Pull applications for my jobs in parallel so we can render recent activity
  // and a "Awaiting review" count without a dedicated /me endpoint.
  useEffect(() => {
    let cancelled = false;
    if (myJobs.length === 0) { setAppsByJob({}); return; }
    Promise.all(
      myJobs.map(async (j) => [j.id, await jobsApi.applications(j.id).catch(() => [])]),
    ).then((pairs) => {
      if (!cancelled) setAppsByJob(Object.fromEntries(pairs));
    });
    return () => { cancelled = true; };
  }, [myJobs]);

  const myApps = useMemo(() => Object.values(appsByJob).flat(), [appsByJob]);

  const stats = [
    { label: 'Active jobs',     value: myJobs.filter((j) => j.status === 'open').length, icon: Briefcase,     tone: 'bg-brand-50 text-brand-700' },
    { label: 'Total applicants',value: myApps.length,                                   icon: Users,         tone: 'bg-blue-50 text-blue-700' },
    { label: 'Awaiting review', value: myApps.filter((a) => a.status === 'submitted').length, icon: ClipboardList, tone: 'bg-amber-50 text-amber-700' },
    { label: 'Company rating',  value: company ? Number(company.rating).toFixed(1) : '-', icon: Star,        tone: 'bg-emerald-50 text-emerald-700' },
  ];

  const recentApps = [...myApps]
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 5);

  const activeJobs = myJobs.filter((j) => j.status === 'open').slice(0, 5);

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
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink-900">Active jobs</h2>
            <Link to="/employer/jobs" className="text-xs font-semibold text-brand-700 hover:underline">
              View all <ArrowRight size={12} className="ml-0.5 inline" />
            </Link>
          </div>
          <div className="mt-3 divide-y divide-ink-100">
            {activeJobs.length === 0 && (
              <EmptyState
                icon={Briefcase}
                title="No active jobs yet"
                description="Post your first job to start receiving applicants."
                action={
                  <Link to="/employer/post" className="btn-primary">
                    <PlusCircle size={14} /> Post a job
                  </Link>
                }
              />
            )}
            {activeJobs.map((j) => {
              const apps = j.applicationCount ?? (appsByJob[j.id]?.length || 0);
              return (
                <Link
                  key={j.id}
                  to={`/employer/jobs/${j.id}`}
                  className="flex items-center justify-between py-3 transition-colors hover:bg-ink-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-900">{j.title}</p>
                    <p className="text-xs text-ink-500">{j.location}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="badge-gray">{apps} applicant{apps === 1 ? '' : 's'}</span>
                    <StatusBadge value={j.status} kind="job" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink-900">Recent applications</h2>
          </div>
          <div className="mt-3 divide-y divide-ink-100">
            {recentApps.length === 0 && (
              <EmptyState icon={Users} title="No applicants yet" description="They'll appear here as soon as workers apply." />
            )}
            {recentApps.map((a) => (
              <Link
                key={a.id}
                to={`/employer/jobs/${a.jobId}`}
                className="flex items-center justify-between py-3 transition-colors hover:bg-ink-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">
                    {a.workerFirstName} {a.workerLastName}
                  </p>
                  <p className="truncate text-xs text-ink-500">{a.jobTitle}</p>
                </div>
                <StatusBadge value={a.status} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
