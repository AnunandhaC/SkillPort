import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabaseClient';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const ensureRecoverySession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setHasRecoverySession(true);
      } else {
        setError('Reset link is invalid or expired. Request a new one.');
      }
      setCheckingSession(false);
    };

    ensureRecoverySession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess('Password updated successfully. Redirecting to sign in...');
      setTimeout(() => navigate('/', { replace: true }), 1200);
    } catch (err) {
      setError(err?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-white">Reset Password</h1>
        <p className="mt-1 text-sm text-slate-400">Set a new password for your account.</p>

        {checkingSession ? (
          <p className="mt-6 text-slate-300">Checking reset link...</p>
        ) : hasRecoverySession ? (
          <>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}
              {success && <p className="text-sm text-green-400">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-70 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-500/25 transition-all duration-300"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>

            <p className="mt-4 text-sm text-slate-400 text-center">
              <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium">
                Back to sign in
              </Link>
            </p>
          </>
        ) : (
          <>
            {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
            <p className="mt-4 text-sm text-slate-400 text-center">
              <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300 font-medium">
                Request new reset link
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
