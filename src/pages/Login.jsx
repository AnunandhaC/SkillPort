import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';

const Login = () => {
  const { login, logout, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState('student');
  const [pendingRole, setPendingRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const nextMessage = location.state?.successMessage;
    if (!nextMessage) return;

    setSuccessMessage(nextMessage);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setPendingRole(selectedRole);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setPendingRole(null);
      const msg = err?.message || 'Failed to sign in';
      if (msg.toLowerCase().includes('email not confirmed')) {
        setError('Email confirmation is enabled in Supabase. Disable it in Authentication > Providers > Email > Confirm email.');
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (loading || !user) return;
    navigateToRole(user.role);
  }, [user, loading, navigate]);

    if (pendingRole && user.role !== pendingRole) {
      logout().catch((logoutError) => {
        console.error('Logout after role mismatch failed:', logoutError);
      });
      setError(`This account is registered as ${user.role}. Please choose ${user.role} sign in.`);
      setPendingRole(null);
      return;
    }

    setPendingRole(null);
    if (user.role === 'student') navigate('/student-dashboard');
    else if (user.role === 'faculty') navigate('/faculty-dashboard');
    else if (user.role === 'admin') navigate('/admin-dashboard');
    else navigate('/');
  }, [logout, navigate, pendingRole, user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Sign In As</label>
          <div className="grid grid-cols-3 gap-2">
            {['student', 'faculty', 'admin'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={clsx(
                  'rounded-lg border px-3 py-2 text-sm capitalize transition-all',
                  selectedRole === role
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                )}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                required
                name="login_email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                name="login_password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-12 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="mt-1 text-right">
              <Link
                to="/forgot-password"
                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                Forgot password?
              </Link>
            </p>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {successMessage && <p className="text-green-400 text-sm">{successMessage}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      {selectedRole === 'student' ? (
        <p className="mt-6 text-center text-slate-500 text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign up
          </Link>
        </p>
      ) : (
        <p className="mt-6 text-center text-slate-500 text-sm">
          {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} accounts are created by admin.
        </p>
      )}
    </div>
  );
};

export default Login;
