import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import { reviewsApi } from '../../services/endpoints.js';
import StarRating from '../../components/ui/StarRating.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function EmployerReviewsPage() {
  const { currentUser } = useAuth();
  const { companies } = useData();

  const company = companies.find((c) => c.id === currentUser.companyId);
  const [received, setReceived] = useState([]);
  const [left, setLeft] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const promises = [reviewsApi.authoredBy(currentUser.id)];
        if (company) promises.push(reviewsApi.forCompany(company.id));
        const results = await Promise.all(promises);
        if (cancelled) return;
        setLeft(results[0] || []);
        setReceived(results[1] || []);
      } catch (err) {
        console.error('Failed to load reviews', err);
      }
    })();
    return () => { cancelled = true; };
  }, [currentUser.id, company?.id]);

  return (
    <div className="space-y-6">
      <div className="card flex items-center justify-between p-5">
        <div>
          <p className="text-sm font-semibold text-ink-500">Company rating</p>
          <p className="mt-1 text-3xl font-bold text-ink-900">
            {company ? Number(company.rating).toFixed(1) : '-'} <span className="text-base font-medium text-ink-400">/ 5</span>
          </p>
        </div>
        <div className="text-right">
          <StarRating value={company?.rating || 0} size={20} />
          <p className="mt-1 text-xs text-ink-500">{received.length} reviews</p>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-base font-bold text-ink-900">Reviews about your company</h2>
        <div className="space-y-3">
          {received.length === 0 && (
            <EmptyState icon={Star} title="No reviews yet" description="Workers can review you after a completed job." />
          )}
          {received.map((r) => (
            <div key={r.id} className="card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink-900">{r.fromUserName || 'Worker'}</p>
                <StarRating value={r.rating} size={14} />
              </div>
              {r.jobTitle && <p className="text-xs text-ink-500">On: {r.jobTitle}</p>}
              <p className="mt-2 text-sm text-ink-700">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-base font-bold text-ink-900">Reviews you've left for workers</h2>
        <div className="space-y-3">
          {left.length === 0 && <EmptyState icon={Star} title="You haven't left any reviews yet" />}
          {left.map((r) => (
            <div key={r.id} className="card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink-900">Worker review</p>
                <StarRating value={r.rating} size={14} />
              </div>
              {r.jobTitle && <p className="text-xs text-ink-500">On: {r.jobTitle}</p>}
              <p className="mt-2 text-sm text-ink-700">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
