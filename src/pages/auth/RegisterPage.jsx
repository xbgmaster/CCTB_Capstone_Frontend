import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, HardHat } from 'lucide-react';
import AuthShell from './AuthShell.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/NotificationContext.jsx';
import { ROLES } from '../../data/seed.js';

const PROVINCES = ['', 'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];

function dashboardPath(role) {
  if (role === ROLES.EMPLOYER) return '/employer';
  if (role === ROLES.WORKER) return '/worker';
  return '/';
}

export default function RegisterPage() {
  const { register, isAuthenticated, currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [role, setRole] = useState(ROLES.WORKER);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    province: '',
    companyName: '',
    industry: '',
    headline: '',
  });

  useEffect(() => {
    const requested = params.get('role');
    if (requested === ROLES.EMPLOYER || requested === ROLES.WORKER) setRole(requested);
  }, [params]);

  if (isAuthenticated) return <Navigate to={dashboardPath(currentUser.role)} replace />;

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      toast({ type: 'error', title: 'Weak password', message: 'Use at least 6 characters.' });
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast({ type: 'error', title: 'Passwords do not match' });
      return;
    }
    if (role === ROLES.EMPLOYER && !form.companyName.trim()) {
      toast({ type: 'error', title: 'Company name required' });
      return;
    }

    const result = await register({ ...form, role });
    if (result.ok) {
      toast({
        type: 'success',
        title: 'Account created',
        message:
          role === ROLES.EMPLOYER
            ? 'Complete your company profile to start posting jobs.'
            : 'Welcome to Jobnet! Browse jobs and start applying.',
      });
      navigate(dashboardPath(role), { replace: true });
    } else {
      toast({ type: 'error', title: 'Registration failed', message: result.error });
    }
  };

  return (
    <AuthShell
      title="Create your Jobnet account"
      subtitle="Choose how you'll use the platform - you can always add another role later."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-ink-100 p-1">
        {[
          { id: ROLES.WORKER, label: 'I am a worker', icon: HardHat },
          { id: ROLES.EMPLOYER, label: 'I am an employer', icon: Building2 }
        ].map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setRole(opt.id)}
            className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
              role === opt.id ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-600 hover:text-ink-900'
            }`}
          >
            <opt.icon size={14} /> {opt.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">First name</label>
            <input className="input" required value={form.firstName} onChange={update('firstName')} />
          </div>
          <div>
            <label className="label">Last name</label>
            <input className="input" required value={form.lastName} onChange={update('lastName')} />
          </div>
        </div>

        <div>
          <label className="label">Email</label>
          <input className="input" type="email" required value={form.email} onChange={update('email')} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" required value={form.password} onChange={update('password')} />
          </div>
          <div>
            <label className="label">Confirm</label>
            <input className="input" type="password" required value={form.confirmPassword} onChange={update('confirmPassword')} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">City</label>
            <input className="input" value={form.city} onChange={update('city')} />
          </div>
          <div>
            <label className="label">Province</label>
            <select className="input" value={form.province} onChange={update('province')}>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p || 'Select...'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Phone (optional)</label>
          <input className="input" value={form.phone} onChange={update('phone')} placeholder="+1 (xxx) xxx-xxxx" />
        </div>

        {role === ROLES.EMPLOYER ? (
          <div className="rounded-lg border border-ink-200 bg-ink-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Company info</p>
            <div className="mt-2 grid gap-3">
              <div>
                <label className="label">Company name</label>
                <input className="input" required value={form.companyName} onChange={update('companyName')} />
              </div>
              <div>
                <label className="label">Industry</label>
                <input
                  className="input"
                  value={form.industry}
                  onChange={update('industry')}
                  placeholder="e.g., Commercial Construction"
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label className="label">Headline (optional)</label>
            <input
              className="input"
              value={form.headline}
              onChange={update('headline')}
              placeholder="e.g., Journeyman Electrician"
            />
          </div>
        )}

        <button type="submit" className="btn-primary w-full">
          Create account
        </button>
      </form>
    </AuthShell>
  );
}
