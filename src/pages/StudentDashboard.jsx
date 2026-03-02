import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useData } from '../context/DataProvider';
import { Link } from 'react-router-dom';
import { Plus, Edit3, Eye, FileText, TrendingUp, Award, ExternalLink, BarChart, Zap } from 'lucide-react';
import { SuggestionEngine, OpportunityMatcher, ResumeGenerator, PortfolioDownloader } from '../components/AnalysisTools';

const StudentDashboard = () => {
    const { user } = useAuth();
    const { getStudentPortfolio, loading } = useData();
    const portfolio = getStudentPortfolio(user?.id);
    const [activeTab, setActiveTab] = useState('overview');

    if (loading) {
        return <div className="text-white text-center py-16">Loading portfolio...</div>;
    }

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="glass-card p-6 rounded-xl flex items-center justify-between">
            <div>
                <p className="text-slate-400 text-sm mb-1">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
            <div className={`p-3 rounded-lg bg-${color}-500/20 text-${color}-400`}>
                <Icon size={24} />
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Portfolio</h1>
                    <p className="text-slate-400">Manage your digital presence and career opportunities.</p>
                </div>
                <div className="flex gap-4">
                    {portfolio && user?.id && (
                        <>
                            <Link
                                to={`/portfolio/view/${user.id}`}
                                target="_blank"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                                title="Open Public Website"
                            >
                                <ExternalLink size={18} />
                                <span>View Website</span>
                            </Link>
                            <Link
                                to="/portfolio-editor"
                                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium shadow-lg shadow-blue-500/25 transition-all"
                            >
                                <Edit3 size={18} />
                                <span>Edit Portfolio</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {!portfolio ? (
                <div className="glass-panel p-12 rounded-2xl text-center">
                    <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Plus size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Start Your Journey</h2>
                    <p className="text-slate-400 max-w-md mx-auto mb-8">
                        Create a professional digital portfolio to showcase your skills, projects, and achievements to potential employers.
                    </p>
                    <Link
                        to="/portfolio-editor"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all hover:scale-105 shadow-xl shadow-blue-500/20"
                    >
                        Build Portfolio
                    </Link>
                </div>
            ) : (
                <>
                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-white/10">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`pb-4 px-2 text-sm font-medium border-b-2 transition ${activeTab === 'overview' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('analysis')}
                            className={`pb-4 px-2 text-sm font-medium border-b-2 transition ${activeTab === 'analysis' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                        >
                            Analysis & Suggestions
                        </button>
                        <button
                            onClick={() => setActiveTab('opportunities')}
                            className={`pb-4 px-2 text-sm font-medium border-b-2 transition ${activeTab === 'opportunities' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                        >
                            Opportunities
                        </button>
                    </div>

                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard icon={TrendingUp} label="Profile Score" value={portfolio.score || 'N/A'} color="green" />
                                <StatCard icon={Eye} label="Views" value={Math.floor(Math.random() * 50)} color="blue" />
                                <StatCard icon={Award} label="Achievements" value={portfolio.certifications?.length || 0} color="purple" />
                                <StatCard icon={FileText} label="Projects" value={portfolio.projects?.length || 0} color="orange" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-panel p-6 rounded-xl">
                                    <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                                    <div className="flex flex-wrap gap-4">
                                        <ResumeGenerator portfolio={portfolio} />
                                    </div>
                                </div>
                                <div className="glass-panel p-6 rounded-xl">
                                    <PortfolioDownloader portfolio={portfolio} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'analysis' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="max-w-4xl mx-auto">
                                <SuggestionEngine portfolio={portfolio} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'opportunities' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <OpportunityMatcher portfolio={portfolio} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default StudentDashboard;
