import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, CalendarClock, CheckCircle2, MapPin } from 'lucide-react';
import { useData } from '../../contexts/DataContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/NotificationContext.jsx';
import Modal from '../../components/ui/Modal.jsx';
import StarRating from '../../components/ui/StarRating.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';

export default function JobDetailPage() {
  const { id } = useParams();
  const { jobs, companies, applications, addApplication, addNotification, ROLES } = useData();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [expectedRate, setExpectedRate] = useState('');

  const job = jobs.find((j) => j.id === id);
  const company = job ? companies.find((c) => c.id === job.companyId) : null;

  const alreadyApplied = useMemo(() => {
    if (!currentUser || currentUser.role !== ROLES.WORKER || !job) return false;
    return applications.some((a) => a.jobId === job.id && a.workerId === currentUser.id);
  }, [applications, currentUser, job, ROLES]);

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-ink-900">Job not found</h1>
        <Link to="/jobs" className="btn-primary mt-4 inline-flex">
          Back to jobs
        </Link>
      </div>
    );
  }

  const handleApplyClick = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: { pathname: `/jobs/${job.id}` } } });
      return;
    }
    if (currentUser.role !== ROLES.WORKER) {
      toast({ type: 'warning', title: 'Only workers can apply', message: 'Switch to a worker account to apply for this job.' });
      return;
    }
    setExpectedRate(job.paymentType === 'hourly' ? String(job.paymentAmount) : '');
    setApplyOpen(true);
  };

  const submitApplication = (e) => {
    e.preventDefault();
    if (!coverLetter.trim()) {
      toast({ type: 'error', title: 'Cover letter required', message: 'Tell the employer why you are a good fit.' });
      return;
    }
    addApplication({
      jobId: job.id,
      workerId: currentUser.id,
      coverLetter: coverLetter.trim(),
      expectedRate: Number(expectedRate) || job.paymentAmount,
    });
    addNotification({
      userId: company.ownerId,
      type: 'application',
      title: 'New application',
      message: `${currentUser.firstName} ${currentUser.lastName} applied to "${job.title}".`,
      link: `/employer/jobs/${job.id}`,
    });
    setApplyOpen(false);
    setCoverLetter('');
    toast({ type: 'success', title: 'Application submitted', message: 'The employer has been notified.' });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-900">
        <ArrowLeft size={14} /> Back to all jobs
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{job.category}</p>
              <h1 className="mt-1 text-2xl font-bold text-ink-900">{job.title}</h1>
              {company && (
                <Link to={`/companies/${company.id}`} className="mt-1 inline-block text-sm font-medium text-ink-600 hover:underline">
                  {company.name}
                </Link>
              )}
            </div>
            <StatusBadge value={job.status} kind="job" />
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-600">
            <span className="inline-flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
            <span className="inline-flex items-center gap-1"><Briefcase size={14} /> {job.paymentType}</span>
            <span className="inline-flex items-center gap-1"><CalendarClock size={14} /> Due {new Date(job.dueDate).toLocaleDateString('en-CA')}</span>
          </div>

          <hr className="my-6 border-ink-100" />

          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">Description</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-ink-700">{job.description}</p>

          <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink-500">Activity</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-ink-700">{job.activity}</p>

          <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink-500">Required skills</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {job.skillsRequired.map((s) => (
              <span key={s} className="badge-brand">{s}</span>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card p-6">
            <p className="text-xs uppercase tracking-wide text-ink-500">Offer</p>
            <p className="mt-1 text-2xl font-bold text-ink-900">
              ${Number(job.paymentAmount).toLocaleString('en-CA')}{' '}
              <span className="text-sm font-medium text-ink-500">
                {job.paymentType === 'hourly' ? '/ hour CAD' : 'CAD (fixed)'}
              </span>
            </p>

            <button
              type="button"
              onClick={handleApplyClick}
              disabled={job.status !== 'open' || alreadyApplied}
              className="btn-primary mt-4 w-full"
            >
              {alreadyApplied ? 'You already applied' : job.status === 'open' ? 'Apply now' : 'Job closed'}
            </button>
            <p className="mt-2 text-center text-xs text-ink-500">
              Posted {new Date(job.postedAt).toLocaleDateString('en-CA')}
            </p>
          </div>

          {company && (
            <div className="card p-6">
              <p className="text-xs uppercase tracking-wide text-ink-500">About the employer</p>
              <h3 className="mt-1 font-bold text-ink-900">{company.name}</h3>
              <div className="mt-2 flex items-center gap-2">
                <StarRating value={company.rating} size={14} />
                <span className="text-xs text-ink-500">{company.rating.toFixed(1)} ({company.reviewCount})</span>
                {company.verified && <span className="badge-blue"><CheckCircle2 size={12} /> Verified</span>}
              </div>
              <p className="mt-2 line-clamp-3 text-xs text-ink-600">{company.description}</p>
              <Link to={`/companies/${company.id}`} className="btn-secondary mt-3 w-full">
                View company
              </Link>
            </div>
          )}
        </aside>
      </div>

      <Modal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        title={`Apply to: ${job.title}`}
        footer={(
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setApplyOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="apply-form" className="btn-primary">
              Submit application
            </button>
          </div>
        )}
      >
        <form id="apply-form" onSubmit={submitApplication} className="space-y-4">
          <div>
            <label className="label" htmlFor="cover">Cover letter</label>
            <textarea
              id="cover"
              className="input min-h-[120px] resize-y"
              placeholder="Tell the employer why you are a great fit..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="rate">
              Expected rate ({job.paymentType === 'hourly' ? 'per hour CAD' : 'total CAD'})
            </label>
            <input
              id="rate"
              type="number"
              min="0"
              className="input"
              value={expectedRate}
              onChange={(e) => setExpectedRate(e.target.value)}
              placeholder={String(job.paymentAmount)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
