import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData, FACULTY_EVALUATION_CRITERIA } from '../context/DataProvider';
import { supabase } from '../lib/supabaseClient';
import { ChevronRight, ExternalLink, User } from 'lucide-react';

const FacultyDashboard = () => {
    const navigate = useNavigate();
    const { getAllPortfolios } = useData();
    const portfolios = getAllPortfolios();
    const [profileNames, setProfileNames] = useState({});

    useEffect(() => {
        let cancelled = false;

        const loadProfileNames = async () => {
            const studentIds = portfolios
                .map((portfolio) => String(portfolio?.studentId || '').trim())
                .filter(Boolean);

            if (studentIds.length === 0) {
                if (!cancelled) setProfileNames({});
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, full_name')
                    .in('id', studentIds);

                if (error) throw error;

                const nextNames = (data || []).reduce((acc, profile) => {
                    const id = String(profile?.id || '').trim();
                    if (!id) return acc;
                    acc[id] = String(profile?.full_name || '').trim();
                    return acc;
                }, {});

                if (!cancelled) setProfileNames(nextNames);
            } catch (error) {
                console.error('Failed to load student names for faculty dashboard:', error);
                if (!cancelled) setProfileNames({});
            }
        };

        loadProfileNames();

        return () => {
            cancelled = true;
        };
    }, [portfolios]);

    const portfoliosWithDisplayNames = useMemo(() => (
        portfolios.map((portfolio) => ({
            ...portfolio,
            displayName: String(
                portfolio?.meta?.fullName
                || profileNames?.[portfolio?.studentId]
                || ''
            ).trim() || 'Unnamed Student',
        }))
    ), [portfolios, profileNames]);

    const getEvaluationSummary = (portfolio) => {
        const evaluation = portfolio?.meta?.facultyEvaluation;
        const totalScore = evaluation?.totalScore ?? portfolio?.score ?? '';
        const completedCriteria = FACULTY_EVALUATION_CRITERIA.filter((criterion) => {
            const value = evaluation?.criteriaScores?.[criterion.key];
            return value !== '' && value !== null && value !== undefined;
        }).length;

        return {
            totalScore,
            completedCriteria,
            isReviewed: totalScore !== '' && totalScore !== null && totalScore !== undefined,
        };
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Faculty Dashboard</h1>
                <p className="text-slate-400">Open a student review page, assign marks across 5 criteria, and edit saved evaluations anytime.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {portfoliosWithDisplayNames.length === 0 ? (
                    <div className="glass-panel p-10 rounded-2xl text-slate-400">
                        No student portfolios have been submitted yet.
                    </div>
                ) : portfoliosWithDisplayNames.map((portfolio) => {
                    const summary = getEvaluationSummary(portfolio);
                    return (
                        <button
                            key={portfolio.studentId}
                            type="button"
                            onClick={() => navigate(`/faculty-evaluation/${portfolio.studentId}`)}
                            className="glass-card rounded-2xl border border-white/10 p-6 text-left transition hover:border-blue-500/50 hover:bg-white/10"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700">
                                        <User size={20} className="text-slate-200" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">{portfolio.displayName}</h2>
                                        <p className="text-xs text-slate-400">Student ID: {portfolio.studentId}</p>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-slate-400" />
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-xl bg-white/5 p-3">
                                    <div className="text-slate-400">Projects</div>
                                    <div className="mt-1 text-white font-semibold">{portfolio.projects?.length || 0}</div>
                                </div>
                                <div className="rounded-xl bg-white/5 p-3">
                                    <div className="text-slate-400">Marks</div>
                                    <div className={`mt-1 font-semibold ${summary.isReviewed ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {summary.isReviewed ? `${summary.totalScore}/100` : 'Pending'}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                                <span>{summary.completedCriteria}/5 criteria filled</span>
                                <span>{summary.isReviewed ? 'Edit review' : 'Start review'}</span>
                            </div>

                            <div className="mt-5 flex items-center gap-2 text-sm text-blue-300">
                                <ExternalLink size={14} />
                                <span>Open evaluation page</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default FacultyDashboard;
