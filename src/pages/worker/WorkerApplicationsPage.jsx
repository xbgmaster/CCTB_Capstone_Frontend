import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, ClipboardList, MapPin, MessageSquare, Star, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import { useToast } from '../../contexts/NotificationContext.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import StarRating from '../../components/ui/StarRating.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Modal from '../../components/ui/Modal.jsx';

const TABS = ['all', 'submitted', 'shortlisted', 'selected', 'rejected'];

export default function WorkerApplicationsPage() {
  const { currentUser } = useAuth();
  const { applications, jobs, companies, updateApplication, addReview, addNotification, reviews } = useData();
  const { toast } = useToast();
  const [tab, setTab] = useState('all');
  const [reviewing, setReviewing] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const myApps = useMemo(
    () =>
      applications
        .filter((a) => a.workerId === currentUser.id)
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)),
    [applications, currentUser],
  );

  const filtered = tab === 'all' ? myApps : myApps.filter((a) => a.status === tab);

  const withdraw = (app) => {
    if (!window.confirm('Withdraw this application?')) return;
    updateApplication(app.id, { status: 'withdrawn' });
    const job = jobs.find((j) => j.id === app.jobId);
    const company = job ? companies.find((c) => c.id === job.companyId) : null;
    if (company) {
      addNotification({
        userId: company.ownerId,
        type: 'status',
        title: 'Application withdrawn',
        message: `${currentUser.firstName} ${currentUser.lastName} withdrew from "${job.title}".`,
        link: `/employer/jobs/${job.id}`,
      });
    }
    toast({ type: 'info', title: 'Application withdrawn' });
  };

  const openReview = (app) => {
    setReviewing(app);
    setReviewRating(5);
    setReviewComment('');
  };

  const submitReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast({ type: 'error', title: 'Add a comment for the review.' });
      return;
    }
    const job = jobs.find((j) => j.id === reviewing.jobId);
    const company = job ? companies.find((c) => c.id === job.companyId) : null;
    if (!company) return;

    addReview({
      fromUserId: currentUser.id,
      toCompanyId: company.id,
      jobId: job.id,
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    addNotification({
      userId: company.ownerId,
      type: 'review',
      title: 'New review on your company',
      message: `${currentUser.firstName} ${currentUser.lastName} left a ${reviewRating}-star review.`,
      link: '/employer/reviews',
    });
    setReviewing(null);
    toast({ type: 'success', title: 'Review submitted' });
  };

  const hasReviewedCompany = (companyId, jobId) =>
    reviews.some(
      (r) => r.fromUserId === currentUser.id && r.toCompanyId === companyId && r.jobId === jobId,
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 border-b border-ink-200">
        {TABS.map((t) => {
          const count = t === 'all' ? myApps.length : myApps.filter((a) => a.status === t).length;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold transition-colors ${
                tab === t
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-ink-500 hover:text-ink-900'
              }`}
            >
              {t[0].toUpperCase() + t.slice(1)} <span className="ml-1 text-xs text-ink-400">({count})</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={tab === 'all' ? 'No applications yet' : `No ${tab} applications`}
          description="Apply to jobs from the Find Jobs page to see them here."
          action={
            <Link to="/worker/jobs" className="btn-primary">
              Find jobs
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => {
            const job = jobs.find((j) => j.id === a.jobId);
            const company = job ? companies.find((c) => c.id === job.companyId) : null;
            if (!job) return null;
            return (
              <div key={a.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link to={`/jobs/${job.id}`} className="text-base font-bold text-ink-900 hover:text-brand-700">
                      {job.title}
                    </Link>
                    {company && (
                      <Link to={`/companies/${company.id}`} className="ml-2 text-sm text-ink-500 hover:underline">
                        - {company.name}
                      </Link>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} /> {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarClock size={12} /> Due {new Date(job.dueDate).toLocaleDateString('en-CA')}
                      </span>
                      <span>Applied {new Date(a.submittedAt).toLocaleDateString('en-CA')}</span>
                    </div>
                  </div>
                  <StatusBadge value={a.status} />
                </div>
                <div className="mt-3 rounded-lg bg-ink-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-ink-500">Your cover letter</p>
                  <p className="mt-1 text-sm text-ink-700">{a.coverLetter}</p>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                  {(a.status === 'submitted' || a.status === 'shortlisted') && (
                    <button type="button" className="btn-secondary text-red-600 hover:bg-red-50" onClick={() => withdraw(a)}>
                      <XCircle size={14} /> Withdraw
                    </button>
                  )}
                  {a.status === 'selected' && company && !hasReviewedCompany(company.id, job.id) && (
                    <button type="button" className="btn-secondary" onClick={() => openReview(a)}>
                      <Star size={14} /> Review employer
                    </button>
                  )}
                  <button type="button" className="btn-ghost" disabled title="Messaging arrives in a future phase">
                    <MessageSquare size={14} /> Message
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={!!reviewing}
        onClose={() => setReviewing(null)}
        title="Review employer"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setReviewing(null)}>
              Cancel
            </button>
            <button type="submit" form="worker-review-form" className="btn-primary">
              Submit review
            </button>
          </div>
        }
      >
        <form id="worker-review-form" onSubmit={submitReview} className="space-y-4">
          <div>
            <p className="label">Rating</p>
            <StarRating value={reviewRating} onChange={setReviewRating} size={28} />
          </div>
          <div>
            <label className="label">Comment</label>
            <textarea
              className="input min-h-[100px] resize-y"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="How was your experience working with this employer?"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
