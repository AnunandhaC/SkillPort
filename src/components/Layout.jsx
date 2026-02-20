import React from 'react';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthProvider';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

    // Protect routes that aren't login
    if (!user && location.pathname !== '/') {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 pb-12">
                <Outlet />
            </main>
            <footer className="py-6 text-center text-slate-500 text-sm">
                &copy; {new Date().getFullYear()} Digital Portfolio System. All rights reserved.
            </footer>
        </div>
    );
};

export default Layout;
