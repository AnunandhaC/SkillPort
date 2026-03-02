import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { LayoutDashboard, FileText, Settings, LogOut, Briefcase, FileCheck } from 'lucide-react';
import clsx from 'clsx';

const Navbar = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            window.location.assign('/');
        }
    };

    const NavItem = ({ to, icon: Icon, label }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
                    isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                )
            }
        >
            <Icon size={18} />
            <span>{label}</span>
        </NavLink>
    );

    return (
        <nav className="glass-panel sticky top-0 z-50 px-6 py-4 mb-8">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-tr from-blue-500 to-purple-500 p-2 rounded-lg">
                        <Briefcase className="text-white" size={24} />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        DigitalPortfolio
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    {user.role === 'student' && (
                        <>
                            <NavItem to="/student-dashboard" icon={LayoutDashboard} label="Dashboard" />
                            <NavItem to="/portfolio-editor" icon={FileText} label="Editor" />
                            <NavItem to="/resume-builder" icon={FileCheck} label="Resume Builder" />
                        </>
                    )}
                    {user.role === 'faculty' && (
                        <NavItem to="/faculty-dashboard" icon={LayoutDashboard} label="Faculty Dashboard" />
                    )}
                    {user.role === 'admin' && (
                        <NavItem to="/admin-dashboard" icon={Settings} label="Admin" />
                    )}

                    <div className="h-6 w-px bg-white/10 mx-2" />

                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-medium text-white">{user.name}</span>
                            <span className="text-xs text-slate-400 capitalize">{user.role}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors text-slate-400"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
