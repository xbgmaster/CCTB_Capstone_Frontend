import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, MessageSquare, PauseCircle, PlayCircle, Star, Trash2, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import { useToast } from '../../contexts/NotificationContext.jsx';
import { applicationsApi, jobsApi, reviewsApi } from '../../services/endpoints.js';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import StarRating from '../../components/ui/StarRating.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Modal from '../../components/ui/Modal.jsx';

const TABS = ['all', 'submitted', 'shortlisted', 'selected', 'rejected'];

export default function EmployerJobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    jobs,
    workerProfiles,
    ensureWorkerProfile,
    updateJob,
    deleteJob,
    addReview,
    refreshJobs,
  } = useData();
  const { toast } = useToast();

  const [job, setJob] = useState(() => jobs.find((j) => j.id === id) || null);
  const [jobApps, setJobApps] = useState([]);
  const [authoredReviews, setAuthoredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [reviewing, setReviewing] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [fresh, apps, mine] = await Promise.all([
        jobsApi.get(id),
        jobsApi.applications(id),
        reviewsApi.authoredBy(currentUser.id),
      ]);
      setJob(fresh);
      setJobApps(apps || []);
      setAuthoredReviews(mine || []);
      // Lazy-load full worker profiles so we can show skill chips per applicant.
      (apps || []).forEach((a) => { ensureWorkerProfile(a.workerId); });
    } catch (err) {
      console.error(err);
      toast({ type: 'error', title: "Couldn't load this job", message: err.message });
    } finally {
      setLoading(false);
    }
  }, [id, currentUser.id, ensureWorkerProfile, toast]);

  useEffect(() => { reload(); }, [reload]);

  useEffect(() => {
    // Keep the cached job in the global list in sync when this page mutates it.
    const cached = jobs.find((j) => j.id === id);
    if (cached && (!job || cached.status !== job.status)) setJob(cached);
  }, [jobs, id, job]);

  const filteredApps = useMemo(
    () => (tab === 'all' ? jobApps : jobApps.filter((a) => a.status === tab)),
    [jobApps, tab],
  );

  if (!job && !loading) {
    return (
      <div className="card p-6 text-center">
        <p className="text-sm text-ink-600">Job not found.</p>
        <Link to="/employer/jobs" className="btn-primary mt-3 inline-flex">Back to jobs</Link>
      </div>
    );
  }
  if (job && job.companyId !== currentUser.companyId) {
    return (
      <div className="card p-6 text-center">
        <p className="text-sm text-ink-600">You don't have access to this job.</p>
      </div>
    );
  }
  if (!job) {
    return <div className="card p-6 text-sm text-ink-500">Loading...</div>;
  }

  // Backend handles all notifications and cascades (auto-reject + Filled
  // status) when status === 'selected', so the client just sends the change.
  const setStatus = async (app, status) => {
    try {
      await applicationsApi.changeStatus(app.id, status);
      toast({ type: 'success', title: `${app.workerFirstName || 'Applicant'} marked as ${status}` });
      await Promise.all([reload(), refreshJobs()]);
    } catch (err) {
      toast({ type: 'error', title: 'Update failed', message: err.message });
    }
  };

  const selectCandidate = async (app) => {
    try {
      await applicationsApi.changeStatus(app.id, 'selected');
      toast({
        type: 'success',
        title: 'Candidate selected',
        message: `${app.workerFirstName || 'The candidate'} has been notified. Other applicants were informed.`,
      });
      await Promise.all([reload(), refreshJobs()]);
    } catch (err) {
      toast({ type: 'error', title: 'Selection failed', message: err.message });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this job and all its applications?')) return;
    try {
      await deleteJob(job.id);
      toast({ type: 'info', title: 'Job deleted' });
      navigate('/employer/jobs');
    } catch (err) {
      toast({ type: 'error', title: 'Delete failed', message: err.message });
    }
  };

  const openReview = (app) => {
    setReviewing(app);
    setReviewRating(5);
    setReviewComment('');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast({ type: 'error', title: 'Add a comment for the review.' });
      return;
    }
    try {
      await addReview({
        toUserId: reviewing.workerId,
        jobId: job.id,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviewing(null);
      toast({ type: 'success', title: 'Review submitted' });
      await reload();
    } catch (err) {
      toast({ type: 'error', title: 'Review failed', message: err.message });
    }
  };

  const hasReviewed = (workerId) =>
    authoredReviews.some((r) => r.toUserId === workerId && r.jobId === job.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link to="/employer/jobs" className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-900">
          <ArrowLeft size={14} /> Back to jobs
        </Link>
        <div className="flex items-center gap-2">
          {job.status === 'open' ? (
            <button
              type="button"
              onClick={async () => {
                await updateJob(job.id, { status: 'paused' });
                toast({ type: 'info', title: 'Job paused' });
                await reload();
              }}
              className="btn-secondary"
            >
              <PauseCircle size={14} /> Pause
            </button>
          ) : (
            <button
              type="button"
              onClick={async () => {
                await updateJob(job.id, { status: 'open' });
                toast({ type: 'success', title: 'Job reopened' });
                await reload();
              }}
              className="btn-secondary"
            >
              <PlayCircle size={14} /> Reopen
            </button>
          )}
          <button type="button" onClick={handleDelete} className="btn-secondary text-red-600 hover:bg-red-50">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{job.category}</p>
            <h1 className="mt-1 text-xl font-bold text-ink-900">{job.title}</h1>
            <p className="text-sm text-ink-500">{job.location}</p>
          </div>
          <StatusBadge value={job.status} kind="job" />
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-ink-600">{job.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(job.skillsRequired || []).map((s) => (
            <span key={s} className="badge-gray">{s}</span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-ink-200">
        {TABS.map((t) => {
          const count = t === 'all' ? jobApps.length : jobApps.filter((a) => a.status === t).length;
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

      {loading ? (
        <div className="card p-6 text-sm text-ink-500">Loading applicants...</div>
      ) : filteredApps.length === 0 ? (
        <EmptyState
          icon={Users}
          title={tab === 'all' ? 'No applicants yet' : `No ${tab} applicants`}
          description="Applications will appear here as workers apply."
        />
      ) : (
        <div className="space-y-3">
          {filteredApps.map((a) => {
            const profile = workerProfiles.find((p) => p.userId === a.workerId);
            const initials = ((a.workerFirstName?.[0] || '?') + (a.workerLastName?.[0] || '?')).toUpperCase();
            return (
              <div key={a.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Avatar initials={initials} seed={a.workerId} size="md" />
                    <div>
                      <p className="font-semibold text-ink-900">
                        {a.workerFirstName} {a.workerLastName}
                      </p>
                      <p className="text-xs text-ink-500">{a.workerHeadline || 'Worker'}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <StarRating value={a.workerRating || 0} size={12} />
                        <span className="text-xs text-ink-500">
                          {a.workerRating ? `${a.workerRating.toFixed(1)}` : 'No reviews yet'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge value={a.status} />
                    <span className="text-xs text-ink-400">
                      Applied {new Date(a.submittedAt).toLocaleDateString('en-CA')}
                    </span>
                  </div>
                </div>

                <div className="mt-3 rounded-lg bg-ink-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-ink-500">Cover letter</p>
                  <p className="mt-1 text-sm text-ink-700">{a.coverLetter}</p>
                  <p className="mt-2 text-xs text-ink-500">
                    Expected rate: <span className="font-semibold text-ink-800">
                      ${Number(a.expectedRate).toLocaleString('en-CA')}
                      {job.paymentType === 'hourly' ? ' / hr' : ''}
                    </span>
                  </p>
                </div>

                {profile?.skills?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {profile.skills.slice(0, 6).map((s) => (
                      <span key={s} className="badge-gray">{s}</span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {a.status !== 'shortlisted' && a.status !== 'selected' && (
                      <button type="button" className="btn-secondary" onClick={() => setStatus(a, 'shortlisted')}>
                        Shortlist
                      </button>
                    )}
                    {a.status !== 'rejected' && a.status !== 'selected' && (
                      <button
                        type="button"
                        className="btn-secondary text-red-600 hover:bg-red-50"
                        onClick={() => setStatus(a, 'rejected')}
                      >
                        Not a fit
                      </button>
                    )}
                    {a.status !== 'selected' && job.status !== 'filled' && (
                      <button type="button" className="btn-primary" onClick={() => selectCandidate(a)}>
                        <CheckCircle2 size={14} /> Select candidate
                      </button>
                    )}
                    {a.status === 'selected' && !hasReviewed(a.workerId) && (
                      <button type="button" className="btn-secondary" onClick={() => openReview(a)}>
                        <Star size={14} /> Leave review
                      </button>
                    )}
                    {hasReviewed(a.workerId) && (
                      <span className="badge-green">
                        <CheckCircle2 size={12} /> Reviewed
                      </span>
                    )}
                  </div>
                  <button type="button" className="btn-ghost" disabled title="Messaging will be available in a future phase">
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
        title={reviewing ? `Review ${reviewing.workerFirstName || 'worker'}` : ''}
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setReviewing(null)}>Cancel</button>
            <button type="submit" form="review-form" className="btn-primary">Submit review</button>
          </div>
        }
      >
        <form id="review-form" onSubmit={submitReview} className="space-y-4">
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
              placeholder="Share what went well and any feedback..."
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
