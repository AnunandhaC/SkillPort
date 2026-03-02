import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { User, Star, ExternalLink, MessageSquare, Save } from 'lucide-react';

const FacultyDashboard = () => {
    const { getAllPortfolios, addReview, savePortfolio } = useData();
    const portfolios = getAllPortfolios();
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [score, setScore] = useState('');

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!selectedStudent) return;

        // UC3: Store Feedback
        addReview({
            studentId: selectedStudent.studentId,
            comments: feedback,
            rating: score,
            reviewer: 'Faculty'
        });

        // UC6: Assign Score (Updating the portfolio directly for simplicity)
        try {
            await savePortfolio(selectedStudent.studentId, {
                ...selectedStudent,
                score: score
            });
        } catch (error) {
            alert(`Failed to save evaluation: ${error.message}`);
            return;
        }

        alert('Evaluation submitted successfully!');
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
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium transition"
                                >
                                    <Save size={18} />
                                    Submit Evaluation
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
