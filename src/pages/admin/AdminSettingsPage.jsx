import { AlertTriangle, RotateCcw } from 'lucide-react';
import { useData } from '../../contexts/DataContext.jsx';
import { useToast } from '../../contexts/NotificationContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function AdminSettingsPage() {
  const { resetData } = useData();
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleReset = () => {
    if (!window.confirm('Reset all marketplace data to the original seed? This will sign you out.')) return;
    resetData();
    logout();
    toast({ type: 'info', title: 'Demo data reset', message: 'You have been signed out.' });
  };

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h2 className="text-base font-bold text-ink-900">Platform settings</h2>
        <p className="mt-1 text-sm text-ink-500">
          These settings would normally live on the backend. They are placeholders for the MVP.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Setting label="Platform name" value="Jobnet" />
          <Setting label="Region" value="Canada" />
          <Setting label="Default currency" value="CAD" />
          <Setting label="Auto-notify other applicants on hire" value="Enabled" />
          <Setting label="Email notifications" value="Demo mode" />
          <Setting label="Audit logs" value="Backed by MongoDB (planned)" />
        </div>
      </div>

      <div className="card border-red-200 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-red-100 p-2 text-red-700">
            <AlertTriangle size={16} />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-ink-900">Reset demo data</h2>
            <p className="mt-1 text-sm text-ink-600">
              Restores all users, companies, jobs, applications, reviews, and notifications to the original
              seed. Useful when demoing the application from scratch.
            </p>
            <button type="button" className="btn-danger mt-3" onClick={handleReset}>
              <RotateCcw size={14} /> Reset all data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Setting({ label, value }) {
  return (
    <div className="rounded-lg border border-ink-200 bg-ink-50 px-3 py-2">
      <p className="text-xs uppercase tracking-wide text-ink-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-ink-900">{value}</p>
    </div>
  );
}
