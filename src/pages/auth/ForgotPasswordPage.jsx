import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthShell from './AuthShell.jsx';
import { useToast } from '../../contexts/NotificationContext.jsx';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    toast({
      type: 'info',
      title: 'Reset link sent',
      message: 'If an account exists, a reset link has been emailed (demo only).',
    });
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email tied to your account and we'll send you a link."
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          If <span className="font-semibold">{email}</span> is registered, a reset link is on its way.
          <p className="mt-2 text-xs text-emerald-700">
            This is a demo - no email is actually sent. Use the demo accounts to sign in.
          </p>
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
