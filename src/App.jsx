import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { DataProvider } from './context/DataProvider';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Lazy load pages for code splitting
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const FacultyDashboard = lazy(() => import('./pages/FacultyDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const PortfolioEditor = lazy(() => import('./pages/PortfolioEditor'));
const PortfolioView = lazy(() => import('./pages/PortfolioView'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));

// Loading component
const LoadingFallback = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading...</p>
        </div>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <DataProvider>
                    <Suspense fallback={<LoadingFallback />}>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password" element={<ResetPassword />} />

                            <Route path="/portfolio/view/:id" element={<PortfolioView />} />
                            <Route element={<Layout />}>
                                <Route path="/student-dashboard" element={<StudentDashboard />} />
                                <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
                                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                                <Route path="/portfolio-editor" element={<PortfolioEditor />} />
                                <Route path="/resume-builder" element={<ResumeBuilder />} />
                            </Route>
                        </Routes>
                    </Suspense>
                </DataProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
