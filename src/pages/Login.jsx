import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { User, LogIn, GraduationCap, School, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState('student');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (!email || !name) return;

        login(email, role, name);

        // Redirect based on role
        if (role === 'student') navigate('/student-dashboard');
        else if (role === 'faculty') navigate('/faculty-dashboard');
        else if (role === 'admin') navigate('/admin-dashboard');
        else navigate('/');
    };

    const RoleButton = ({ id, icon: Icon, label }) => (
        <button
            type="button"
            onClick={() => setRole(id)}
            className={clsx(
                'flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 gap-2',
                role === id
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
                {/* Decorative background glow */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-center mb-2 text-white">Welcome Back</h1>
                    <p className="text-center text-slate-400 mb-8">Sign in to your digital portfolio</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <RoleButton id="student" icon={GraduationCap} label="Student" />
                            <RoleButton id="faculty" icon={School} label="Faculty" />
                            <RoleButton id="admin" icon={ShieldCheck} label="Admin" />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        required
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
                                    <LogIn className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>

            <p className="mt-8 text-slate-500 text-sm">
                Prototype Mode: No password required. Data persists in browser.
            </p>
        </div>
    );
};

export default Login;
