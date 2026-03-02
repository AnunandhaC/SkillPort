import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { User, ExternalLink, Save } from 'lucide-react';

const FacultyDashboard = () => {
    const { getAllPortfolios, addReview, savePortfolio, refreshPortfolios } = useData();
    const portfolios = getAllPortfolios();
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [score, setScore] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const SAVE_TIMEOUT_MS = 15000;

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
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Faculty Dashboard</h1>
                <p className="text-slate-400">Review student portfolios and provide evaluations.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Student List */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-bold text-white mb-4">Pending Reviews</h2>
                    {portfolios.length === 0 ? (
                        <p className="text-slate-500">No portfolios submitted yet.</p>
                    ) : (
                        portfolios.map(p => (
                            <div
                                key={p.studentId}
                                onClick={() => setSelectedStudent(p)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedStudent?.studentId === p.studentId ? 'bg-blue-600/20 border-blue-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                                        <User size={20} className="text-slate-300" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Student ID: {p.studentId}</h3>
                                        <p className="text-xs text-slate-400">Last updated: {new Date(p.lastUpdated).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">{p.projects?.length || 0} Projects</span>
                                    <span className={p.score ? "text-green-400" : "text-yellow-400"}>
                                        {p.score ? `Score: ${p.score}` : 'Pending Score'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Review Area */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl min-h-[400px]">
                    {!selectedStudent ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <User size={48} className="mb-4 opacity-50" />
                            <p>Select a student to review</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-between items-start border-b border-white/10 pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Portfolio Review</h2>
                                    <p className="text-slate-400 text-sm max-w-lg">{selectedStudent.about}</p>
                                </div>
                                <a
                                    href={`/portfolio/view/${selectedStudent.studentId}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                >
                                    <ExternalLink size={16} />
                                    Open Website
                                </a>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-xl">
                                    <h3 className="text-sm font-bold text-slate-300 mb-2">Projects</h3>
                                    <ul className="list-disc pl-4 space-y-1 text-slate-400 text-sm">
                                        {selectedStudent.projects?.map((p, i) => <li key={i}>{p.title}</li>)}
                                    </ul>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl">
                                    <h3 className="text-sm font-bold text-slate-300 mb-2">Skills</h3>
                                    <p className="text-slate-400 text-sm">{selectedStudent.skills}</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmitReview} className="space-y-4 pt-4 border-t border-white/10">
                                <h3 className="text-lg font-bold text-white">Evaluation</h3>

                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Score (0-100)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        required
                                        value={score}
                                        onChange={(e) => setScore(e.target.value)}
                                        className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white w-32"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Constructive Feedback</label>
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
                                    {submitting ? 'Submitting...' : 'Submit Evaluation'}
                                </button>
                                {submitError && <p className="text-sm text-red-400">{submitError}</p>}
                                {submitSuccess && <p className="text-sm text-green-400">{submitSuccess}</p>}
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
