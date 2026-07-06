import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, CheckCircle2, Globe, Mail, MapPin, Phone, Users } from 'lucide-react';
import { useData } from '../../contexts/DataContext.jsx';
import { reviewsApi } from '../../services/endpoints.js';
import StarRating from '../../components/ui/StarRating.jsx';
import JobCard from '../../components/jobs/JobCard.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const { companies, jobs } = useData();
  const [companyReviews, setCompanyReviews] = useState([]);

  useEffect(() => {
    let cancelled = false;
    reviewsApi.forCompany(id)
      .then((rows) => { if (!cancelled) setCompanyReviews(rows || []); })
      .catch(() => { if (!cancelled) setCompanyReviews([]); });
    return () => { cancelled = true; };
  }, [id]);

  const company = companies.find((c) => c.id === id);
  if (!company) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-ink-900">Company not found</h1>
        <Link to="/companies" className="btn-primary mt-4 inline-flex">
          Back to companies
        </Link>
      </div>
    );
  }

  const companyJobs = jobs.filter((j) => j.companyId === company.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/companies" className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-900">
        <ArrowLeft size={14} /> All companies
      </Link>

      <div className="card mt-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Building2 size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink-900">{company.name}</h1>
              <p className="text-sm text-ink-500">{company.industry}</p>
              <div className="mt-2 flex items-center gap-2">
                <StarRating value={company.rating} size={14} />
                <span className="text-xs text-ink-500">
                  {company.rating.toFixed(1)} ({company.reviewCount} reviews)
                </span>
                {company.verified && (
                  <span className="badge-blue">
                    <CheckCircle2 size={12} /> Verified business
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-5 text-sm text-ink-700">{company.description || 'No description provided.'}</p>

        <div className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <Info icon={MapPin} label="Location" value={`${company.address || `${company.city}, ${company.province}`}`} />
          <Info icon={Phone} label="Phone" value={company.phone || '-'} />
          <Info icon={Mail} label="Email" value={company.email || '-'} />
          <Info icon={Globe} label="Website" value={company.website || '-'} link={company.website} />
          <Info icon={Users} label="Team size" value={company.employeeCount || '-'} />
          <Info icon={Building2} label="Founded" value={company.foundedYear || '-'} />
        </div>
      </div>

      <h2 className="mt-8 text-lg font-bold text-ink-900">Open positions</h2>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {companyJobs.filter((j) => j.status === 'open').map((j) => (
          <JobCard key={j.id} job={j} />
        ))}
      </div>
      {companyJobs.filter((j) => j.status === 'open').length === 0 && (
        <EmptyState icon={Building2} title="No open positions right now" description="Check back soon for new opportunities." />
      )}

      <h2 className="mt-10 text-lg font-bold text-ink-900">Worker reviews</h2>
      <div className="mt-3 space-y-3">
        {companyReviews.length === 0 && (
          <EmptyState icon={Building2} title="No reviews yet" />
        )}
        {companyReviews.map((r) => (
          <div key={r.id} className="card p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink-900">{r.fromUserName || 'Worker'}</p>
              <StarRating value={r.rating} size={14} />
            </div>
            <p className="mt-1 text-sm text-ink-700">{r.comment}</p>
            <p className="mt-1 text-xs text-ink-400">{new Date(r.createdAt).toLocaleDateString('en-CA')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value, link }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-ink-400">
        <Icon size={14} />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-ink-500">{label}</p>
        {link ? (
          <a href={link} target="_blank" rel="noreferrer" className="truncate text-sm font-medium text-brand-700 hover:underline">
            {value}
          </a>
        ) : (
          <p className="truncate text-sm font-medium text-ink-800">{value}</p>
        )}
      </div>
    </div>
  );
}
