import { Link } from 'react-router-dom';
import { CalendarClock, MapPin } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge.jsx';

function formatPay(job) {
  if (job.paymentType === 'hourly') return `$${job.paymentAmount}/hr CAD`;
  return `$${Number(job.paymentAmount).toLocaleString('en-CA')} CAD`;
}

export default function JobCard({ job, companyName, showStatus = true, to }) {
  const link = to || `/jobs/${job.id}`;
  return (
    <Link
      to={link}
      className="card group block p-5 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-cardHover"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{job.category}</p>
          <h3 className="mt-1 truncate text-base font-bold text-ink-900 group-hover:text-brand-700">
            {job.title}
          </h3>
          {companyName && <p className="mt-0.5 truncate text-xs text-ink-500">{companyName}</p>}
        </div>
        {showStatus && <StatusBadge value={job.status} kind="job" />}
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-ink-600">{job.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-600">
        <span className="inline-flex items-center gap-1">
          <MapPin size={12} />
          {job.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <CalendarClock size={12} />
          Due {new Date(job.dueDate).toLocaleDateString('en-CA')}
        </span>
        <span className="ml-auto font-semibold text-ink-900">{formatPay(job)}</span>
      </div>

      {job.skillsRequired?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {job.skillsRequired.slice(0, 4).map((s) => (
            <span key={s} className="badge-gray">{s}</span>
          ))}
        </div>
      )}
    </Link>
  );
}
