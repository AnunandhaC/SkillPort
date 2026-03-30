import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataProvider';
import { User, ExternalLink, Save } from 'lucide-react';

const FacultyDashboard = () => {
    const { getAllPortfolios, addReview, savePortfolio, refreshPortfolios } = useData();
    const portfolios = getAllPortfolios();

    const totalPortfolios = portfolios.length;
    const completedCount = portfolios.filter((p) => p.score !== undefined && p.score !== null && p.score !== '').length;
    const pendingCount = totalPortfolios - completedCount;
    const navigate = useNavigate();
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [score, setScore] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const SAVE_TIMEOUT_MS = 15000;

    useEffect(() => {
        if (selectedStudent) {
            setScore(
                selectedStudent.score !== undefined &&
                selectedStudent.score !== null &&
                selectedStudent.score !== ''
                    ? String(selectedStudent.score)
                    : ''
            );
            setFeedback(selectedStudent.facultyFeedback || '');
        } else {
            setScore('');
            setFeedback('');
        }
    }, [selectedStudent]);

    const withTimeout = (promise, ms) =>
        Promise.race([
            promise,
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Saving evaluation timed out. Please check Supabase policies/migrations and try again.')), ms)
            ),
        ]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess('');

        if (!selectedStudent) {
            setSubmitError('Please select a student before submitting.');
            return;
        }

        const parsedScore = Number(score);
        if (!Number.isFinite(parsedScore) || parsedScore < 0 || parsedScore > 100) {
            setSubmitError('Score must be a number between 0 and 100.');
            return;
        }

        if (!feedback.trim()) {
            setSubmitError('Please enter constructive feedback.');
            return;
        }

        try {
            setSubmitting(true);

            // UC3: Store Feedback
            addReview({
                studentId: selectedStudent.studentId,
                comments: feedback.trim(),
                rating: parsedScore,
                reviewer: 'Faculty'
            });

            // UC6: Assign Score (Updating the portfolio directly for simplicity)
            await withTimeout(savePortfolio(selectedStudent.studentId, {
                ...selectedStudent,
                score: parsedScore,
                facultyFeedback: feedback.trim(),
            }), SAVE_TIMEOUT_MS);
            await refreshPortfolios();
        } catch (error) {
            const message = error?.message || 'Failed to save evaluation.';
            const hint = message.includes('column "faculty_feedback" of relation "portfolios" does not exist')
                ? ' Run supabase/migrations/007_add_faculty_feedback_to_portfolios.sql in Supabase SQL Editor.'
                : '';
            setSubmitError(`${message}.${hint}`);
            return;
        } finally {
            setSubmitting(false);
        }

        setSubmitSuccess('Evaluation submitted successfully.');
        setFeedback('');
        setScore('');
        setSelectedStudent(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Faculty Dashboard</h1>
                    <p className="text-slate-400">
                        Track student portfolios, assign scores, and refine evaluations.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex flex-col">
                        <span className="text-xs uppercase tracking-wide text-slate-400">Total Students</span>
                        <span className="text-lg font-semibold text-white">{totalPortfolios}</span>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/40 flex flex-col">
                        <span className="text-xs uppercase tracking-wide text-green-300">Completed</span>
                        <span className="text-lg font-semibold text-green-300">{completedCount}</span>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/40 flex flex-col">
                        <span className="text-xs uppercase tracking-wide text-yellow-300">Pending</span>
                        <span className="text-lg font-semibold text-yellow-300">{pendingCount}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Student List */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-bold text-white mb-1">Student Evaluations</h2>
                    {portfolios.length === 0 ? (
                        <p className="text-slate-500">No portfolios submitted yet.</p>
                    ) : (
                        portfolios.map(p => (
                            <div
                                key={p.studentId}
                                onClick={() => setSelectedStudent(p)}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5 ${
                                    selectedStudent?.studentId === p.studentId
                                        ? 'bg-blue-600/20 border-blue-500'
                                        : 'bg-slate-900/60 border-white/10 hover:bg-white/5'
                                }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                                        <User size={20} className="text-slate-300" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-white truncate">
                                            {p.meta?.name || `Student ID: ${p.studentId}`}
                                        </h3>
                                        <p className="text-xs text-slate-400">
                                            Last updated: {new Date(p.lastUpdated).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm mt-2">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800/70 border border-slate-600/60">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                            {p.projects?.length || 0} projects
                                        </span>
                                        <span
                                            className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ${
                                                p.score
                                                    ? 'bg-green-500/10 border-green-500/40 text-green-300'
                                                    : 'bg-yellow-500/10 border-yellow-500/40 text-yellow-300'
                                            }`}
                                        >
                                            {p.score ? `Score: ${p.score}` : 'Pending'}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/faculty-evaluation/${p.studentId}`);
                                        }}
                                        className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md font-semibold transition shadow-sm"
                                    >
                                        {p.score ? 'Edit Score' : 'Assign Score'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
