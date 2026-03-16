import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import clsx from 'clsx';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    try {
      const result = await login(email.trim(), password);
      const role = result?.user?.user_metadata?.role || 'student';

      if (role !== selectedRole) {
        setError(`This account is registered as ${role}. Please choose ${role} sign in.`);
        return;
      }

      if (role === 'student') navigate('/student-dashboard', { replace: true });
      else if (role === 'faculty') navigate('/faculty-dashboard', { replace: true });
      else if (role === 'admin') navigate('/admin-dashboard', { replace: true });
      else navigate('/', { replace: true });
    } catch (err) {
      const msg = err?.message || 'Failed to sign in';
      if (msg.toLowerCase().includes('email not confirmed')) {
        setError('Email confirmation is enabled in Supabase. Disable it in Authentication > Providers > Email > Confirm email.');
      } else {
        setError(msg);
      }
    }
  };

  // Redirect after profile (user) is loaded from Supabase
  useEffect(() => {
    if (!user) return;

    if (user.role === 'student') navigate('/student-dashboard');
    else if (user.role === 'faculty') navigate('/faculty-dashboard');
    else if (user.role === 'admin') navigate('/admin-dashboard');
    else navigate('/');
  }, [user, navigate]);

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
                type="password"
                required
                name="login_password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
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
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Sign In
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
