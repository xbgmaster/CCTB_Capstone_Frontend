import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import AuthShell from './AuthShell.jsx';
import { useToast } from '../../contexts/NotificationContext.jsx';
import { ROLES } from '../../data/seed.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

function dashboardPath(role) {
  if (role === ROLES.EMPLOYER) return '/employer';
  if (role === ROLES.WORKER) return '/worker';
  return '/';
}

export default function ForgotPasswordPage() {
  const { forgot, isAuthenticated, currentUser } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);


  if (isAuthenticated) {
    console.log(currentUser.role)
    const fallback = dashboardPath(currentUser.role);
    return <Navigate to={location.state?.from?.pathname || fallback} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await forgot(email);
      if (result.ok) {
        setSent(true);
        toast({
          type: 'success',
          title: 'If an account exists, a reset link has been emailed.',
        });
      } else {
        toast({ type: 'error', title: 'Restore password failed', message: result.error });
      }
    } finally {
      setLoading(false);
    }
  };

  
    //setSent(true);
    //toast({
    //  type: 'info',
    //  title: 'Reset link sent',
    //  message: 'If an account exists, a reset link has been emailed (demo only).',
    //});



  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email tied to your account and we'll send you a link."
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-brand-400 hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          If <span className="font-semibold">{email}</span> is registered, a reset link is on its way.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Send reset link
          </button>
        </form>
      )}
    </AuthShell>
  );
}
