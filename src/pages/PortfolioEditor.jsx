import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useData } from '../context/DataProvider';
import { useNavigate } from 'react-router-dom';
import { User, Code, Briefcase, Award, Palette, Save, ArrowRight, Eye, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

const PortfolioEditor = () => {
    const { user } = useAuth();
    const { savePortfolio, getStudentPortfolio, templates, loading } = useData();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('about');
    const [formData, setFormData] = useState({
        about: '',
        skills: '', // comma separated for simplicity in this MVP
        projects: [],
        certifications: [],
        templateId: 'modern'
    });

    useEffect(() => {
        const existing = getStudentPortfolio(user?.id);
        if (existing) {
            setFormData(existing);
        }
    }, [user, getStudentPortfolio]);

    const buildPortfolioPayload = () => ({
        ...formData,
        skills: Array.isArray(formData.skills) ? formData.skills : formData.skills.split(',').map(s => s.trim()).filter(Boolean)
    });

    const handleSave = async () => {
        try {
            await savePortfolio(user.id, buildPortfolioPayload());
            alert('Portfolio saved successfully!');
            return true;
        } catch (error) {
            console.error('Failed to save portfolio:', error);
            const message = error?.message || 'Unknown error while saving portfolio.';
            const hint =
                message.includes('relation "portfolios" does not exist') ||
                message.includes('no unique or exclusion constraint matching the ON CONFLICT')
                    ? ' Run supabase/migrations/002_portfolios.sql in Supabase SQL Editor.'
                    : '';
            alert(`Failed to save portfolio: ${message}.${hint}`);
            return false;
        }
    };

    const handlePreview = async () => {
        // Save current draft before previewing
        const saved = await handleSave();
        if (!saved) return;
        // Open in new tab
        window.open(`/portfolio/view/${user.id}`, '_blank');
    };

    const handlePublish = async () => {
        const saved = await handleSave();
        if (saved) {
            navigate('/student-dashboard');
        }
    };

    if (loading) {
        return <div className="text-white text-center py-16">Loading portfolio...</div>;
    }

    if (!user?.id) {
        return <div className="text-red-400 text-center py-16">User not found. Please sign in again.</div>;
    }

    const TabButton = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={clsx(
                'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all w-full md:w-auto',
                activeTab === id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
            )}
        >
            <Icon size={18} />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                <h2 className="text-lg font-bold text-white mb-4 px-2">Editor Sections</h2>
                <TabButton id="about" icon={User} label="About Me" />
                <TabButton id="skills" icon={Code} label="Skills" />
                <TabButton id="projects" icon={Briefcase} label="Projects" />
                <TabButton id="certs" icon={Award} label="Certifications" />
                <TabButton id="design" icon={Palette} label="Design & Template" />

                <div className="pt-8 px-2 space-y-3">
                    {user?.id && (
                        <button
                            onClick={handlePreview}
                            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition-all"
                        >
                            <Eye size={18} /> Preview Portfolio
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 transition-all"
                    >
                        <Save size={18} /> Save Draft
                    </button>
                    <button
                        onClick={handlePublish}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-all shadow-lg shadow-green-500/20"
                    >
                        <span>Publish Changes</span>
                        <ArrowRight size={18} />
                    </button>
                    {user?.id && (
                        <div className="pt-4 border-t border-white/10">
                            <p className="text-xs text-slate-400 mb-2">Portfolio Link:</p>
                            <div className="flex items-center gap-2 p-2 bg-slate-900/50 rounded text-xs text-slate-300 break-all">
                                <ExternalLink size={14} />
                                <span>{window.location.origin}/portfolio/view/{user.id}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 glass-panel p-8 rounded-2xl min-h-[500px]">

                {/* About Section */}
                {activeTab === 'about' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Professional Summary</label>
                            <textarea
                                rows={6}
                                value={formData.about}
                                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="I am a passionate developer..."
                            />
                        </div>
                    </div>
                )}

                {/* Skills Section */}
                {activeTab === 'skills' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Skills & Expertise</h2>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Skills (Comma separated)</label>
                            <input
                                type="text"
                                value={Array.isArray(formData.skills) ? formData.skills.join(', ') : formData.skills}
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="React, Node.js, Python, UI Design"
                            />
                        </div>
                    </div>
                )}

                {/* Projects Section */}
                {activeTab === 'projects' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Projects</h2>
                            <button
                                onClick={() => setFormData({ ...formData, projects: [...formData.projects, { title: '', desc: '', tech: '' }] })}
                                className="text-sm bg-blue-600 px-3 py-1 rounded text-white"
                            >
                                + Add Project
                            </button>
                        </div>

                        {formData.projects.length === 0 && <p className="text-slate-500">No projects added yet.</p>}

                        <div className="space-y-4">
                            {formData.projects.map((proj, idx) => (
                                <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                                    <input
                                        placeholder="Project Title"
                                        value={proj.title}
                                        onChange={(e) => {
                                            const newProjs = [...formData.projects];
                                            newProjs[idx].title = e.target.value;
                                            setFormData({ ...formData, projects: newProjs });
                                        }}
                                        className="w-full bg-transparent border-b border-slate-700 pb-2 text-white outline-none focus:border-blue-500"
                                    />
                                    <textarea
                                        placeholder="Project Description"
                                        value={proj.desc}
                                        onChange={(e) => {
                                            const newProjs = [...formData.projects];
                                            newProjs[idx].desc = e.target.value;
                                            setFormData({ ...formData, projects: newProjs });
                                        }}
                                        className="w-full bg-transparent border-b border-slate-700 pb-2 text-slate-300 text-sm outline-none focus:border-blue-500"
                                    />
                                    <button
                                        onClick={() => {
                                            const newProjs = formData.projects.filter((_, i) => i !== idx);
                                            setFormData({ ...formData, projects: newProjs });
                                        }}
                                        className="text-xs text-red-400 hover:text-red-300"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Design Section */}
                {activeTab === 'design' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Choose Template</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {templates.map(t => (
                                <div
                                    key={t.id}
                                    onClick={() => setFormData({ ...formData, templateId: t.id })}
                                    className={clsx(
                                        'p-4 rounded-xl border cursor-pointer transition-all',
                                        formData.templateId === t.id
                                            ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/50'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    )}
                                >
                                    <h3 className="font-bold text-white">{t.name}</h3>
                                    <p className="text-sm text-slate-400">{t.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certifications - Simplified implementation like projects */}
                {activeTab === 'certs' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Certifications</h2>
                            <button
                                onClick={() => setFormData({ ...formData, certifications: [...formData.certifications, { name: '', issuer: '' }] })}
                                className="text-sm bg-blue-600 px-3 py-1 rounded text-white"
                            >
                                + Add Certification
                            </button>
                        </div>
                        {formData.certifications.map((cert, idx) => (
                            <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                                <input
                                    placeholder="Certification Name"
                                    value={cert.name}
                                    onChange={(e) => {
                                        const newCerts = [...formData.certifications];
                                        newCerts[idx].name = e.target.value;
                                        setFormData({ ...formData, certifications: newCerts });
                                    }}
                                    className="w-full bg-transparent border-b border-slate-700 pb-2 text-white outline-none focus:border-blue-500"
                                />
                                <input
                                    placeholder="Issuer"
                                    value={cert.issuer}
                                    onChange={(e) => {
                                        const newCerts = [...formData.certifications];
                                        newCerts[idx].issuer = e.target.value;
                                        setFormData({ ...formData, certifications: newCerts });
                                    }}
                                    className="w-full bg-transparent border-b border-slate-700 pb-2 text-slate-300 text-sm outline-none focus:border-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default PortfolioEditor;
