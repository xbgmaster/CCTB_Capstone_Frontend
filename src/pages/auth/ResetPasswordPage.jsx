import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthShell from './AuthShell.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/NotificationContext.jsx';

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const invalidLink = !email || !token;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast({ type: 'error', title: 'Password too short', message: 'Use at least 6 characters.' });
      return;
    }
    if (newPassword !== confirm) {
      toast({ type: 'error', title: 'Passwords do not match', message: 'Please re-enter them.' });
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword({ email, token, newPassword });
      if (result.ok) {
        toast({ type: 'success', title: 'Password updated', message: 'You can now sign in with your new password.' });
        navigate('/login', { replace: true });
      } else {
        toast({ type: 'error', title: 'Reset failed', message: result.error });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Enter a new password for your account."
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-brand-400 hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      {invalidLink ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          This reset link is invalid or incomplete. Please request a new one from the{' '}
          <Link to="/forgot-password" className="font-semibold underline">
            forgot password
          </Link>{' '}
          page.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" value={email} readOnly disabled />
          </div>
          <div>
            <label className="label" htmlFor="newPassword">New password</label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              required
              className="input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>
          <div>
            <label className="label" htmlFor="confirm">Confirm new password</label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              className="input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter your password"
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Reset password'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
