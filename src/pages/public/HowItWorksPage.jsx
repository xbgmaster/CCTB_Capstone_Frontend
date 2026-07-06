import { Link } from 'react-router-dom';
import { Building2, ClipboardList, HardHat, MessageSquare, Search, ShieldCheck, UserPlus, Workflow } from 'lucide-react';

const EMPLOYER_STEPS = [
  { icon: Building2, title: 'Create your company profile', body: 'Add your business details, contact info, and team size.' },
  { icon: ClipboardList, title: 'Post a job', body: 'Describe the work, required skills, location, schedule, and offer.' },
  { icon: Search, title: 'Review applicants', body: 'See profiles, ratings, certifications, and cover letters.' },
  { icon: MessageSquare, title: 'Select and notify', body: 'Pick the best candidate. Everyone gets notified automatically.' },
];

const WORKER_STEPS = [
  { icon: UserPlus, title: 'Build your profile', body: 'Showcase your trade, skills, certifications, and experience.' },
  { icon: Workflow, title: 'Browse live jobs', body: 'Filter by trade, location, schedule, and pay - in real time.' },
  { icon: HardHat, title: 'Apply in seconds', body: 'Send a quick cover letter and your expected rate.' },
  { icon: ShieldCheck, title: 'Get hired', body: 'Receive notifications when employers shortlist or select you.' },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">How Jobnet works</h1>
        <p className="mx-auto mt-2 max-w-2xl text-ink-600">
          Two simple flows - one for hiring teams, one for workers. Built to remove friction so projects start sooner.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="text-lg font-bold text-ink-900">For Employers</h2>
          <ol className="mt-4 space-y-4">
            {EMPLOYER_STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <s.icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    {i + 1}. {s.title}
                  </p>
                  <p className="text-sm text-ink-600">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link to="/register?role=employer" className="btn-primary mt-6">
            Create employer account
          </Link>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-bold text-ink-900">For Workers</h2>
          <ol className="mt-4 space-y-4">
            {WORKER_STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <s.icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    {i + 1}. {s.title}
                  </p>
                  <p className="text-sm text-ink-600">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link to="/register?role=worker" className="btn-primary mt-6">
            Create worker account
          </Link>
        </section>
      </div>
    </div>
  );
}
