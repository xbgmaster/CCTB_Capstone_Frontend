import { useEffect, useState } from 'react';
import { adminApi } from '../../services/endpoints.js';

function BarRow({ label, value, max, tone = 'bg-brand-500' }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-ink-700">{label}</span>
        <span className="text-ink-500">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink-100">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AdminReportsPage() {
  const [overview, setOverview] = useState(null);
  const [funnel, setFunnel] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([adminApi.overview(), adminApi.funnel()])
      .then(([o, f]) => { setOverview(o); setFunnel(f); })
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div className="card p-5 text-sm text-red-600">Failed to load reports: {error}</div>;
  }
  if (!overview || !funnel) {
    return <div className="card p-5 text-sm text-ink-500">Loading reports...</div>;
  }

  const summary = [
    { label: 'Workers',                    value: overview.workers },
    { label: 'Employers',                  value: overview.employers },
    { label: 'Companies',                  value: overview.companies },
    { label: 'Conversion (apps -> hires)', value: `${funnel.conversionPercent}%` },
  ];

  const maxCat  = Math.max(1, ...funnel.jobsByCategory.map((s) => s.value));
  const maxProv = Math.max(1, ...funnel.jobsByProvince.map((s) => s.value));
  const maxStat = Math.max(1, ...funnel.applicationFunnel.map((s) => s.value));

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-xs uppercase tracking-wide text-ink-500">{s.label}</p>
            <p className="mt-2 text-2xl font-bold text-ink-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-base font-bold text-ink-900">Jobs by category</h2>
          <div className="mt-4 space-y-3">
            {funnel.jobsByCategory.map((s) => (
              <BarRow key={s.label} label={s.label} value={s.value} max={maxCat} />
            ))}
          </div>
        </section>
        <section className="card p-5">
          <h2 className="text-base font-bold text-ink-900">Jobs by province</h2>
          <div className="mt-4 space-y-3">
            {funnel.jobsByProvince.map((s) => (
              <BarRow key={s.label} label={s.label} value={s.value} max={maxProv} tone="bg-blue-500" />
            ))}
          </div>
        </section>
      </div>

      <section className="card p-5">
        <h2 className="text-base font-bold text-ink-900">Application funnel</h2>
        <div className="mt-4 space-y-3">
          {funnel.applicationFunnel.map((s) => (
            <BarRow key={s.label} label={s.label} value={s.value} max={maxStat} tone="bg-emerald-500" />
          ))}
        </div>
      </section>
    </div>
  );
}
