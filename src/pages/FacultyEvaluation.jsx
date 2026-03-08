import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataProvider';
import { User, ExternalLink, Save, ArrowLeft } from 'lucide-react';

const CATEGORIES = [
    { key: 'projectsWork', label: 'Projects & Work Quality', description: 'Quality and relevance of projects' },
    { key: 'skillsExpertise', label: 'Skills & Expertise', description: 'Depth and breadth of skills shown' },
    { key: 'presentationDesign', label: 'Presentation & Design', description: 'Clarity and visual presentation' },
    { key: 'completenessDepth', label: 'Completeness & Depth', description: 'About, certifications, detail' },
    { key: 'overallImpact', label: 'Overall Impact', description: 'Overall impression and professionalism' },
];

const FacultyEvaluation = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const { getStudentPortfolio, addReview, savePortfolio, refreshPortfolios } = useData();

    const [student, setStudent] = useState(null);
    const [categoryScores, setCategoryScores] = useState({
        projectsWork: '',
        skillsExpertise: '',
        presentationDesign: '',
        completenessDepth: '',
        overallImpact: '',
    });
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const SAVE_TIMEOUT_MS = 15000;

    useEffect(() => {
        const p = getStudentPortfolio(studentId);
        setStudent(p);
        if (p) {
            const saved = p.meta?.evaluationCategories || {};
            setCategoryScores({
                projectsWork: saved.projectsWork !== undefined && saved.projectsWork !== null ? String(saved.projectsWork) : '',
                skillsExpertise: saved.skillsExpertise !== undefined && saved.skillsExpertise !== null ? String(saved.skillsExpertise) : '',
                presentationDesign: saved.presentationDesign !== undefined && saved.presentationDesign !== null ? String(saved.presentationDesign) : '',
                completenessDepth: saved.completenessDepth !== undefined && saved.completenessDepth !== null ? String(saved.completenessDepth) : '',
                overallImpact: saved.overallImpact !== undefined && saved.overallImpact !== null ? String(saved.overallImpact) : '',
            });
            setFeedback(p.facultyFeedback || '');
        }
    }, [getStudentPortfolio, studentId]);

    const withTimeout = (promise, ms) =>
        Promise.race([
            promise,
            new Promise((_, reject) =>
                setTimeout(
                    () =>
                        reject(
                            new Error(
                                'Saving evaluation timed out. Please check Supabase policies/migrations and try again.'
                            )
                        ),
                    ms
                )
            ),
        ]);

    const updateCategoryScore = (key, value) => {
        setCategoryScores((prev) => ({ ...prev, [key]: value }));
    };

    const getComputedOverall = () => {
        const values = CATEGORIES.map((c) => Number(categoryScores[c.key])).filter((n) => Number.isFinite(n) && n >= 0 && n <= 100);
        if (values.length !== 5) return null;
        return Math.round(values.reduce((a, b) => a + b, 0) / 5);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!student) {
            setError('Student portfolio not found.');
            return;
        }

        const parsed = {};
        for (const cat of CATEGORIES) {
            const n = Number(categoryScores[cat.key]);
            if (!Number.isFinite(n) || n < 0 || n > 100) {
                setError(`"${cat.label}" must be a number between 0 and 100.`);
                return;
            }
            parsed[cat.key] = n;
        }

        if (!feedback.trim()) {
            setError('Please enter constructive feedback.');
            return;
        }

        const overallScore = Math.round(Object.values(parsed).reduce((a, b) => a + b, 0) / 5);

        try {
            setSubmitting(true);

            addReview({
                studentId: student.studentId,
                comments: feedback.trim(),
                rating: overallScore,
                reviewer: 'Faculty',
            });

            await withTimeout(
                savePortfolio(student.studentId, {
                    ...student,
                    score: overallScore,
                    facultyFeedback: feedback.trim(),
                    meta: {
                        ...(student.meta || {}),
                        evaluationCategories: parsed,
                    },
                }),
                SAVE_TIMEOUT_MS
            );

            await refreshPortfolios();
            setSuccess('Evaluation saved successfully.');
        } catch (err) {
            const message = err?.message || 'Failed to save evaluation.';
            const hint = message.includes(
                'column "faculty_feedback" of relation "portfolios" does not exist'
            )
                ? ' Run supabase/migrations/007_add_faculty_feedback_to_portfolios.sql in Supabase SQL Editor.'
                : '';
            setError(`${message}.${hint}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => navigate('/faculty-dashboard')}
                    className="flex items-center gap-2 text-slate-300 hover:text-white text-sm"
                >
                    <ArrowLeft size={16} />
                    Back to Faculty Dashboard
                </button>
                {student && (
                    <a
                        href={`/portfolio/view/${student.studentId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                        <ExternalLink size={16} />
                        Open Portfolio
                    </a>
                )}
            </div>

            {!student ? (
                <div className="glass-panel p-6 rounded-2xl min-h-[200px] flex items-center justify-center">
                    <p className="text-slate-400 text-sm">
                        Loading portfolio for <span className="font-mono">{studentId}</span> or it
                        does not exist.
                    </p>
                </div>
            ) : (
                <div className="glass-panel p-6 rounded-2xl space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                            <User size={20} className="text-slate-300" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">
                                {student.meta?.name || `Student ID: ${student.studentId}`}
                            </h1>
                            <p className="text-xs text-slate-400">
                                Detailed evaluation and scoring for this portfolio.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-xl">
                            <h3 className="text-sm font-bold text-slate-300 mb-2">Projects</h3>
                            <ul className="list-disc pl-4 space-y-1 text-slate-400 text-sm">
                                {student.projects?.map((p, i) => (
                                    <li key={i}>{p.title}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl">
                            <h3 className="text-sm font-bold text-slate-300 mb-2">Skills</h3>
                            <p className="text-slate-400 text-sm">
                                {Array.isArray(student.skills)
                                    ? student.skills.join(', ')
                                    : student.skills}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 pt-4 border-t border-white/10">
                        <h3 className="text-lg font-bold text-white">Evaluation by category</h3>
                        <p className="text-sm text-slate-400">
                            Rate each category from 0 to 100. Overall score is the average of the five.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {CATEGORIES.map((cat) => (
                                <div key={cat.key} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        {cat.label}
                                    </label>
                                    <p className="text-xs text-slate-500 mb-2">{cat.description}</p>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        required
                                        value={categoryScores[cat.key]}
                                        onChange={(e) => updateCategoryScore(cat.key, e.target.value)}
                                        className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white w-24"
                                        placeholder="0–100"
                                    />
                                </div>
                            ))}
                        </div>

                        {getComputedOverall() !== null && (
                            <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 inline-block">
                                <span className="text-sm text-slate-400">Computed overall score: </span>
                                <span className="text-lg font-bold text-white">{getComputedOverall()}/100</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Constructive feedback</label>
                            <textarea
                                rows={4}
                                required
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white"
                                placeholder="Enter specific feedback on projects and presentation..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition"
                        >
                            <Save size={18} />
                            {submitting ? 'Saving...' : student.score ? 'Update Evaluation' : 'Submit Evaluation'}
                        </button>
                        {error && <p className="text-sm text-red-400">{error}</p>}
                        {success && <p className="text-sm text-green-400">{success}</p>}
                    </form>
                </div>
            )}
        </div>
    );
};

export default FacultyEvaluation;

