import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthShell from './AuthShell.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/NotificationContext.jsx';

const DEMO = [
  { role: 'Admin', email: 'admin@jobnet.ca', password: 'admin123' },
  { role: 'Employer', email: 'david@northbuild.ca', password: 'employer123' },
  { role: 'Worker', email: 'marcus@example.com', password: 'worker123' },
];

function dashboardPath(role) {
  if (role === 'employer') return '/employer';
  if (role === 'worker') return '/worker';
  if (role === 'admin') return '/admin';
  return '/';
}

export default function LoginPage() {
  const { login, isAuthenticated, currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    const fallback = dashboardPath(currentUser.role);
    return <Navigate to={location.state?.from?.pathname || fallback} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.ok) {
        toast({ type: 'success', title: `Welcome back, ${result.user.firstName}!` });
        const next = location.state?.from?.pathname || dashboardPath(result.user.role);
        navigate(next, { replace: true });
      } else {
        toast({ type: 'error', title: 'Sign-in failed', message: result.error });
      }
    } finally {
      setLoading(false);
    }
  };

  const useDemo = (d) => {
    setEmail(d.email);
    setPassword(d.password);
  };

  return (
    <AuthShell
      title="Sign in to Jobnet"
      subtitle="Welcome back - enter your credentials to continue."
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-700 hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.ca"
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="label mb-0" htmlFor="password">Password</label>
            <Link to="/forgot-password" className="text-xs font-medium text-brand-700 hover:underline">
              Forgot?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 rounded-lg border border-dashed border-ink-200 bg-ink-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Demo accounts</p>
        <div className="mt-2 grid gap-1.5">
          {DEMO.map((d) => (
            <button
              key={d.email}
              type="button"
              onClick={() => useDemo(d)}
              className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-xs text-ink-700 shadow-sm transition-colors hover:bg-brand-50"
            >
              <span className="font-semibold">{d.role}</span>
              <span className="font-mono text-ink-500">{d.email}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-ink-500">Click a row to autofill, then press Sign in.</p>
      </div>
    </AuthShell>
  );
}
