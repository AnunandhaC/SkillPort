import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, GraduationCap, Building2 } from 'lucide-react';
import clsx from 'clsx';

const Signup = () => {
    const { signupStudent } = useAuth();
    const navigate = useNavigate();
    const [program, setProgram] = useState(''); // 'barch' | 'btech'
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !name || !program) return;
        if (!password) {
            setError('Password is required.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            await signupStudent({ email, password, name, program });
            navigate('/', { replace: true });
        } catch (signupError) {
            setError(signupError.message || 'Failed to create account.');
        }
    };

    const ProgramButton = ({ id, icon: Icon, label }) => (
        <button
            type="button"
            onClick={() => setProgram(id)}
            className={clsx(
                'flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 gap-2 flex-1',
                program === id
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'
            )}
        >
            <Icon size={24} />
            <span className="text-sm font-medium">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md glass-panel p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-center mb-2 text-white">Student Sign Up</h1>
                    <p className="text-center text-slate-400 mb-8">Create your student account</p>

                    <form onSubmit={handleSignup} className="space-y-6" autoComplete="off">
                        <div>
                            <label className="block text-sm text-slate-400 mb-3">Program</label>
                            <div className="flex gap-3">
                                <ProgramButton id="btech" icon={GraduationCap} label="BTech" />
                                <ProgramButton id="barch" icon={Building2} label="BArch" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        required
                                        name="signup_full_name"
                                        autoComplete="off"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="email"
                                        required
                                        name="signup_email"
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
                                        name="signup_password"
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="password"
                                        name="signup_confirm_password"
                                        autoComplete="new-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {password && confirmPassword && password !== confirmPassword && (
                                    <p className="mt-1 text-sm text-red-400">Passwords do not match</p>
                                )}
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-400">{error}</p>}
                        <button
                            type="submit"
                            disabled={!program || password !== confirmPassword}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-500 disabled:transform-none text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            Create Account
                        </button>
                    </form>

                    <p className="mt-6 text-center text-slate-500 text-sm">
                        Already have an account?{' '}
                        <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

        </div>
    );
};

export default Signup;
