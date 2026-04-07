import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ExternalLink, Save } from 'lucide-react';
import PortfolioView from './PortfolioView';
import { FACULTY_EVALUATION_CRITERIA, useData } from '../context/DataProvider';

const FacultyEvaluation = () => {
    const { id } = useParams();
    const { getStudentPortfolio, saveFacultyEvaluation, refreshPortfolios, loading } = useData();
    const portfolio = getStudentPortfolio(id);
    const [criteriaScores, setCriteriaScores] = useState({});
    const [feedback, setFeedback] = useState('');
    const [saveState, setSaveState] = useState({ type: '', message: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [buttonState, setButtonState] = useState('idle');

    useEffect(() => {
        if (!portfolio?.studentId) return;

        const nextScores = FACULTY_EVALUATION_CRITERIA.reduce((acc, criterion) => {
            const rawValue = portfolio?.meta?.facultyEvaluation?.criteriaScores?.[criterion.key];
            acc[criterion.key] = rawValue === '' || rawValue === null || rawValue === undefined
                ? ''
                : String(rawValue);
            return acc;
        }, {});
        const nextFeedback = String(
            portfolio?.meta?.facultyEvaluation?.feedback
            ?? portfolio?.facultyFeedback
            ?? ''
        );

        setCriteriaScores(nextScores);
        setFeedback(nextFeedback);
        setSaveState({ type: '', message: '' });
        setButtonState('idle');
    }, [id, portfolio?.studentId]);

    const totalScore = FACULTY_EVALUATION_CRITERIA.reduce((sum, criterion) => {
        const numericValue = Number(criteriaScores?.[criterion.key]);
        return sum + (Number.isFinite(numericValue) ? numericValue : 0);
    }, 0);

    const displayName = String(
        portfolio?.meta?.fullName
        || portfolio?.studentId
        || 'Student'
    ).trim();

    const handleScoreChange = (criterionKey, maxScore, value) => {
        const sanitized = String(value || '').replace(/[^\d]/g, '');
        if (sanitized === '') {
            setCriteriaScores((prev) => ({ ...prev, [criterionKey]: '' }));
            return;
        }

        const numericValue = Math.max(0, Math.min(maxScore, Number(sanitized)));
        setCriteriaScores((prev) => ({ ...prev, [criterionKey]: String(numericValue) }));
        setButtonState('idle');
    };

    const handleSaveEvaluation = async () => {
        if (!portfolio?.studentId) return;

        setIsSaving(true);
        setButtonState('saving');
        setSaveState({ type: '', message: '' });

        try {
            const normalizedScores = FACULTY_EVALUATION_CRITERIA.reduce((acc, criterion) => {
                const numericValue = Number(criteriaScores?.[criterion.key]);
                acc[criterion.key] = Number.isFinite(numericValue)
                    ? Math.max(0, Math.min(Number(criterion.maxScore || 20), numericValue))
                    : '';
                return acc;
            }, {});

            await saveFacultyEvaluation(portfolio.studentId, {
                criteriaScores: normalizedScores,
                feedback,
                totalScore,
                updatedAt: new Date().toISOString(),
            });

            setSaveState({ type: 'success', message: 'Evaluation saved successfully.' });
            setIsSaving(false);
            setButtonState('saved');

            Promise.resolve(refreshPortfolios()).catch((error) => {
                console.error('Failed to refresh portfolios after faculty save:', error);
            });
        } catch (error) {
            console.error('Failed to save faculty evaluation:', error);
            setSaveState({ type: 'error', message: error?.message || 'Failed to save evaluation.' });
            setIsSaving(false);
            setButtonState('idle');
        }
    };

    if (loading) {
        return <div className="text-white text-center py-16">Loading student portfolio...</div>;
    }

    if (!portfolio) {
        return (
            <div className="glass-panel rounded-2xl p-8 text-center">
                <h1 className="text-2xl font-bold text-white">Student portfolio not found</h1>
                <p className="mt-2 text-slate-400">The selected student has not submitted a portfolio yet.</p>
                <Link to="/faculty-dashboard" className="mt-6 inline-flex items-center gap-2 text-blue-300 hover:text-blue-200">
                    <ArrowLeft size={16} />
                    Back to Faculty Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <Link to="/faculty-dashboard" className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200">
                        <ArrowLeft size={16} />
                        Back to Faculty Dashboard
                    </Link>
                    <h1 className="mt-3 text-3xl font-bold text-white">Faculty Evaluation</h1>
                    <p className="mt-2 text-slate-400">{displayName} • Student ID: {portfolio.studentId}</p>
                </div>
                <Link
                    to={`/portfolio/view/${portfolio.studentId}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
                >
                    <ExternalLink size={16} />
                    Open Portfolio
                </Link>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_420px] gap-6 items-start">
                <div className="glass-panel rounded-2xl p-4 md:p-6 overflow-hidden">
                    <PortfolioView portfolioOverride={portfolio} hideFooterBadge />
                </div>

                <div className="glass-panel rounded-2xl p-6 space-y-5 xl:sticky xl:top-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Assign Marks</h2>
                        <p className="mt-1 text-sm text-slate-400">Review all 5 criteria and save the faculty feedback for this student.</p>
                    </div>

                    <div className="space-y-4">
                        {FACULTY_EVALUATION_CRITERIA.map((criterion) => (
                            <label key={criterion.key} className="block">
                                <div className="mb-1 flex items-center justify-between text-sm">
                                    <span className="text-slate-200">{criterion.label}</span>
                                    <span className="text-slate-400">/ {criterion.maxScore}</span>
                                </div>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={criteriaScores?.[criterion.key] ?? ''}
                                    onChange={(e) => handleScoreChange(criterion.key, criterion.maxScore, e.target.value)}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={`0 - ${criterion.maxScore}`}
                                />
                            </label>
                        ))}
                    </div>

                    <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
                        <div className="text-sm text-slate-300">Total Score</div>
                        <div className="mt-1 text-3xl font-bold text-white">{totalScore}/100</div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-slate-300">Faculty Feedback</label>
                        <textarea
                            rows={8}
                            value={feedback}
                            onChange={(e) => {
                                setFeedback(e.target.value);
                                setButtonState('idle');
                            }}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Write guidance, strengths, and improvements for the student."
                        />
                    </div>

                    {saveState.message && (
                        <div className={`rounded-lg border px-4 py-3 text-sm ${
                            saveState.type === 'success'
                                ? 'border-green-500/30 bg-green-500/10 text-green-300'
                                : 'border-red-500/30 bg-red-500/10 text-red-300'
                        }`}>
                            {saveState.message}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleSaveEvaluation}
                        disabled={isSaving}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {buttonState === 'saved' ? <Check size={18} /> : <Save size={18} />}
                        {buttonState === 'saving' ? 'Saving...' : buttonState === 'saved' ? 'Saved' : 'Save Evaluation'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FacultyEvaluation;
