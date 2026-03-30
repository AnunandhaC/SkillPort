
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ExternalLink, Plus, Save, ArrowRight, Download, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthProvider';
import { useData } from '../context/DataProvider';
import PortfolioView from './PortfolioView';

const PortfolioEditor = () => {
    const { user } = useAuth();
    const { savePortfolio, templates, loading } = useData();
    const navigate = useNavigate();

    const normalizedProgram = String(user?.program || '')
        .trim()
        .toLowerCase()
        .replace(/\./g, '')
        .replace(/\s+/g, '');
    const isBArch = normalizedProgram === 'barch';

    const [formData, setFormData] = useState({
        about: '',
        skills: '',
        projects: [],
        certifications: [],
        meta: {
            fullName: '',
            role: '',
            education: '',
            educationYears: '',
            experience: '',
            experienceYears: '',
            college: '',
            company: '',
            contactEmail: '',
            linkedinUrl: '',
            githubUrl: '',
            heroImage: '',
            profileImage: '',
            templateStyle: {
                fontFamily: 'default',
                textScale: 100,
            },
            templatePages: [],
        },
        templateId: 'modern',
    });

    const [btechBranch, setBtechBranch] = useState('cs');
    const [editorMode, setEditorMode] = useState(false);
    const [isExportingTemplate, setIsExportingTemplate] = useState(false);
    const [initializedForUserId, setInitializedForUserId] = useState(null);
    const livePreviewRef = useRef(null);
    const [newSkillText, setNewSkillText] = useState('');

    useEffect(() => {
        if (!user?.id || loading || initializedForUserId === user.id) return;

        setFormData({
            about: '',
            skills: '',
            projects: [],
            certifications: [],
            meta: {
                fullName: user?.name || '',
                role: '',
                education: '',
                educationYears: '',
                experience: '',
                experienceYears: '',
                college: '',
                company: '',
                contactEmail: user?.email || '',
                linkedinUrl: '',
                githubUrl: '',
                heroImage: '',
                profileImage: '',
                templateStyle: {
                    fontFamily: 'default',
                    textScale: 100,
                },
                templatePages: [],
            },
            templateId: isBArch ? 'barch-red' : 'modern',
        });

        setInitializedForUserId(user.id);
    }, [user?.id, user?.name, user?.email, isBArch, loading, initializedForUserId]);

    const buildPortfolioPayload = () => ({
        ...formData,
        templateId: isBArch
            ? String(formData.templateId || '').startsWith('barch-')
                ? formData.templateId
                : 'barch-red'
            : formData.templateId === 'barch-red'
                ? 'modern'
                : formData.templateId,
        meta: {
            ...formData.meta,
            fullName: formData?.meta?.fullName || user?.name || '',
            contactEmail: formData?.meta?.contactEmail || user?.email || '',
            templateStyle: {
                fontFamily: formData?.meta?.templateStyle?.fontFamily || 'default',
                textScale: Number(formData?.meta?.templateStyle?.textScale || 100),
            },
            templatePages: Array.isArray(formData?.meta?.templatePages)
                ? formData.meta.templatePages
                    .map((p) => ({
                        title: String(p?.title || '').trim(),
                        content: String(p?.content || '').trim(),
                        image: String(p?.image || '').trim(),
                    }))
                    .filter((p) => p.title || p.content || p.image)
                : [],
        },
        skills: Array.isArray(formData.skills)
            ? formData.skills
            : String(formData.skills || '')
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
    });

    const handleSave = async ({ enforceRequired = false, silent = false } = {}) => {
        if (isBArch && enforceRequired) {
            const requiredFields = [
                { key: 'fullName', label: 'Full Name' },
                { key: 'education', label: 'Education' },
                { key: 'experience', label: 'Experience' },
                { key: 'contactEmail', label: 'Contact Email' },
            ];
            const missing = requiredFields
                .filter((f) => !String(formData?.meta?.[f.key] || '').trim())
                .map((f) => f.label);

            if (missing.length > 0) {
                alert(`Please complete required BArch details: ${missing.join(', ')}`);
                return false;
            }
        }

        try {
            await savePortfolio(user.id, buildPortfolioPayload());
            if (!silent) alert('Portfolio saved successfully!');
            return true;
        } catch (error) {
            console.error('Failed to save portfolio:', error);
            const message = error?.message || 'Unknown error while saving portfolio.';
            if (!silent) alert(`Failed to save portfolio: ${message}`);
            return false;
        }
    };

    const handlePreview = async () => {
        const previewUrl = `${window.location.origin}/portfolio/view/${user.id}?preview=1&t=${Date.now()}`;

        try {
            localStorage.setItem(`dps_preview_draft_${user.id}`, JSON.stringify(buildPortfolioPayload()));
        } catch (e) {
            console.warn('Could not cache preview draft locally:', e);
        }

        const previewTab = window.open('about:blank', '_blank');
        if (previewTab && !previewTab.closed) {
            previewTab.location.href = previewUrl;
        } else {
            window.open(previewUrl, '_blank');
        }

        await handleSave({ enforceRequired: false, silent: true });
    };

    const handlePublish = async () => {
        const saved = await handleSave({ enforceRequired: true });
        if (saved) navigate('/student-dashboard');
    };

    const handleDownloadTemplate = async () => {
        try {
            setIsExportingTemplate(true);
            const payload = buildPortfolioPayload();
            try {
                localStorage.setItem(`dps_preview_draft_${user.id}`, JSON.stringify(payload));
            } catch (e) {
                console.warn('Could not cache download draft locally:', e);
            }

            const printUrl = `${window.location.origin}/portfolio/view/${user.id}?preview=1&download=1&t=${Date.now()}`;
            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = '0';
            iframe.style.right = '0';
            iframe.style.bottom = '0';
            iframe.src = printUrl;
            document.body.appendChild(iframe);
            const cleanup = () => {
                try {
                    iframe.remove();
                } catch {
                    // ignore
                }
            };
            iframe.onload = () => {
                setTimeout(() => {
                    cleanup();
                }, 20000);
            };
        } catch (error) {
            console.error('Failed to download template PDF:', error);
            alert('Failed to download PDF. Please try again.');
        } finally {
            setIsExportingTemplate(false);
        }
    };

    const setRoot = (key, value) => {
        setFormData((prev) => {
            if (key === 'templateId' && prev.templateId !== value) {
                return {
                    ...prev,
                    [key]: value,
                    meta: {
                        ...(prev.meta || {}),
                        templatePageCopies: [],
                        templatePages: [],
                    },
                };
            }
            return { ...prev, [key]: value };
        });
    };

    const setMeta = (key, value) => {
        setFormData((prev) => ({ ...prev, meta: { ...(prev.meta || {}), [key]: value } }));
    };

    const setSectionVisibility = (key, visible) => {
        setFormData((prev) => ({
            ...prev,
            meta: {
                ...(prev.meta || {}),
                sectionVisibility: {
                    ...(prev?.meta?.sectionVisibility || {}),
                    [key]: visible,
                },
            },
        }));
    };

    const addProject = () => {
        setFormData((prev) => ({
            ...prev,
            projects: [
                ...(prev.projects || []),
                { title: 'New Project', desc: 'Edit this project details', tech: '', year: '', image: '', repoUrl: '', pdfUrl: '', pdfName: '' },
            ],
        }));
    };

    const updateProject = (idx, patch) => {
        setFormData((prev) => {
            const projects = Array.isArray(prev.projects) ? [...prev.projects] : [];
            projects[idx] = { ...(projects[idx] || {}), ...patch };
            return { ...prev, projects };
        });
    };

    const removeProject = (idx) => {
        setFormData((prev) => ({
            ...prev,
            projects: (Array.isArray(prev.projects) ? prev.projects : []).filter((_, i) => i !== idx),
        }));
    };

    const addTemplatePage = () => {
        setFormData((prev) => {
            const copies = Array.isArray(prev?.meta?.templatePageCopies) ? prev.meta.templatePageCopies : [];
            const snapshot = JSON.parse(JSON.stringify({
                ...prev,
                about: '',
                meta: {
                    ...(prev.meta || {}),
                    fullName: '',
                    role: '',
                    sectionVisibility: {
                        ...(prev?.meta?.sectionVisibility || {}),
                        about: false,
                    },
                    hideIntroOnTemplatePage: true,
                    templatePageCopies: [],
                    templatePages: [],
                },
            }));
            return {
                ...prev,
                meta: {
                    ...(prev.meta || {}),
                    sectionVisibility: {
                        ...(prev?.meta?.sectionVisibility || {}),
                        extraPages: true,
                    },
                    templatePageCopies: [...copies, snapshot],
                },
            };
        });
    };

    const addCertification = () => {
        setFormData((prev) => ({
            ...prev,
            certifications: [...(Array.isArray(prev.certifications) ? prev.certifications : []), { name: 'New Certification', issuer: 'Issuer' }],
        }));
    };

    const updateCertification = (idx, patch) => {
        setFormData((prev) => {
            const certifications = Array.isArray(prev.certifications) ? [...prev.certifications] : [];
            certifications[idx] = { ...(certifications[idx] || {}), ...patch };
            return { ...prev, certifications };
        });
    };

    const removeCertification = (idx) => {
        setFormData((prev) => ({
            ...prev,
            certifications: (Array.isArray(prev.certifications) ? prev.certifications : []).filter((_, i) => i !== idx),
        }));
    };

    const addSkill = () => {
        const value = String(newSkillText || '').trim();
        if (!value) return;
        setFormData((prev) => ({
            ...prev,
            skills: [...(Array.isArray(prev.skills) ? prev.skills : []), value],
        }));
        setNewSkillText('');
    };

    const updateSkill = (idx, value) => {
        setFormData((prev) => {
            const skills = Array.isArray(prev.skills) ? [...prev.skills] : [];
            skills[idx] = value;
            return { ...prev, skills };
        });
    };

    const removeSkill = (idx) => {
        setFormData((prev) => ({
            ...prev,
            skills: (Array.isArray(prev.skills) ? prev.skills : []).filter((_, i) => i !== idx),
        }));
    };

    const visibleTemplates = templates
        .filter((t) => (isBArch ? t.group === 'barch' : t.group && !String(t.group).startsWith('barch')))
        .filter((t) => {
            if (isBArch) return true;
            if (!t.branch) return true;
            return t.branch === btechBranch;
        });

    const selectedTemplate = visibleTemplates.find((t) => t.id === formData.templateId)
        || templates.find((t) => t.id === formData.templateId);
    const sectionToggleOptions = (() => {
        const base = [
            { key: 'about', label: 'About' },
            { key: 'skills', label: 'Skills' },
            { key: 'projects', label: 'Projects' },
            { key: 'certifications', label: 'Certifications' },
            { key: 'services', label: 'Services' },
            { key: 'qualification', label: 'Qualification' },
            { key: 'testimonials', label: 'Testimonials' },
            { key: 'contact', label: 'Contact' },
            { key: 'extraPages', label: 'Extra Pages' },
        ];
        const fromTemplate = (Array.isArray(selectedTemplate?.sections) ? selectedTemplate.sections : [])
            .map((section) => ({
                key: String(section?.key || ''),
                label: String(section?.label || section?.key || ''),
            }))
            .filter((section) => section.key);
        const byKey = new Map();
        [...base, ...fromTemplate].forEach((section) => {
            if (!section.key || byKey.has(section.key)) return;
            byKey.set(section.key, section);
        });
        return Array.from(byKey.values());
    })();

    const editorShellClass = (() => {
        if (String(formData.templateId || '').startsWith('barch-')) {
            return 'rounded-2xl border border-rose-300/30 bg-gradient-to-br from-rose-950/60 via-slate-900/90 to-slate-800/90 p-6 md:p-8 space-y-6';
        }
        if (String(formData.templateId || '').startsWith('btech-')) {
            return 'rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-slate-950/85 via-slate-900/85 to-cyan-950/40 p-6 md:p-8 space-y-6';
        }
        if (formData.templateId === 'academic') {
            return 'rounded-2xl border border-blue-200/25 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 p-6 md:p-8 space-y-6';
        }
        return 'rounded-2xl border border-white/15 bg-gradient-to-br from-slate-900/80 to-slate-800/80 p-6 md:p-8 space-y-6';
    })();

    if (loading) return <div className="text-white text-center py-16">Loading portfolio...</div>;
    if (!user?.id) return <div className="text-red-400 text-center py-16">User not found. Please sign in again.</div>;

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                <h2 className="text-lg font-bold text-white mb-4 px-2">Template Editor</h2>
                <div className="px-4 py-3 rounded-lg text-sm font-medium bg-blue-600 text-white shadow-lg shadow-blue-500/25">
                    Design & Template
                </div>

                <div className="pt-8 px-2 space-y-3">
                    <button
                        onClick={handlePreview}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition-all"
                    >
                        <Eye size={18} /> Preview Portfolio
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 transition-all"
                    >
                        <Save size={18} /> Save Draft
                    </button>
                    <button
                        onClick={handleDownloadTemplate}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 transition-all"
                    >
                        <Download size={18} /> Download PDF
                    </button>
                    <button
                        onClick={handlePublish}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-all shadow-lg shadow-green-500/20"
                    >
                        <span>Publish Changes</span>
                        <ArrowRight size={18} />
                    </button>
                    <div className="pt-4 border-t border-white/10">
                        <p className="text-xs text-slate-400 mb-2">Portfolio Link:</p>
                        <div className="flex items-center gap-2 p-2 bg-slate-900/50 rounded text-xs text-slate-300 break-all">
                            <ExternalLink size={14} />
                            <span>{window.location.origin}/portfolio/view/{user.id}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 glass-panel p-8 rounded-2xl min-h-[500px] space-y-8">
                {!editorMode ? (
                    <>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Choose Template</h2>
                            <p className="text-sm text-slate-400">Select template first. Live editor opens on a separate full editing view.</p>
                        </div>

                        {!isBArch && (
                            <div>
                                <p className="text-sm text-slate-300 mb-2">Select BTech branch</p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { id: 'cs', label: 'Computer Science' },
                                        { id: 'mech', label: 'Mechanical' },
                                        { id: 'eee', label: 'Electrical' },
                                        { id: 'ece', label: 'Electronics' },
                                        { id: 'robo', label: 'Robotics' },
                                    ].map((b) => (
                                        <button
                                            key={b.id}
                                            type="button"
                                            onClick={() => setBtechBranch(b.id)}
                                            className={clsx(
                                                'px-3 py-1 rounded-full text-xs font-medium border',
                                                btechBranch === b.id
                                                    ? 'bg-blue-600 border-blue-400 text-white'
                                                    : 'bg-slate-900/40 border-white/15 text-slate-200 hover:bg-white/5'
                                            )}
                                        >
                                            {b.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {visibleTemplates.map((t) => (
                                <div
                                    key={t.id}
                                    className={clsx(
                                        'p-4 rounded-xl border transition-all',
                                        formData.templateId === t.id
                                            ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/50'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    )}
                                >
                                    <h3 className="font-bold text-white">{t.name}</h3>
                                    <p className="text-sm text-slate-400">{t.description}</p>
                                    <div className="mt-3 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setRoot('templateId', t.id);
                                                setEditorMode(true);
                                            }}
                                            className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-500 transition"
                                        >
                                            Open Live Editor
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const demoId = `demo-${t.id}`;
                                                const url = `${window.location.origin}/portfolio/view/${demoId}`;
                                                window.open(url, '_blank');
                                            }}
                                            className="px-3 py-1 rounded-lg border border-white/20 text-xs text-slate-200 hover:bg-white/10 transition"
                                        >
                                            View demo
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="text-2xl font-bold text-white">
                                    Live Visual Editor
                                    {selectedTemplate?.name ? ` - ${selectedTemplate.name}` : ''}
                                </h3>
                                <p className="text-sm text-slate-400">Template -&gt; Visual editor -&gt; Click and edit directly. Changes appear immediately here.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditorMode(false)}
                                className="px-3 py-2 rounded-lg border border-white/20 text-sm text-slate-200 hover:bg-white/10 transition"
                            >
                                Change Template
                            </button>
                        </div>

                        <div className={`${editorShellClass} min-h-[80vh]`}>
                            <div id="dps-live-template-preview" ref={livePreviewRef} className="rounded-xl overflow-hidden border border-white/10">
                                <div id="dps-live-template-preview-main">
                                <PortfolioView
                                    portfolioOverride={buildPortfolioPayload()}
                                    editable
                                    onPortfolioChange={setFormData}
                                    hideFooterBadge
                                    exportMode={isExportingTemplate}
                                    editorScopeId="dps-live-template-preview-main"
                                />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={addTemplatePage}
                                    className="inline-flex items-center gap-2 text-sm bg-blue-600 px-3 py-1 rounded text-white"
                                >
                                    <Plus size={14} /> Add Page
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDownloadTemplate}
                                    className="inline-flex items-center gap-2 text-sm bg-cyan-600 px-3 py-1 rounded text-white"
                                >
                                    <Download size={14} /> Download PDF
                                </button>
                            </div>

                            <div className="rounded-xl border border-white/15 bg-black/20 p-4">
                                <p className="text-xs text-slate-300">
                                    Inline editing is enabled inside the template preview. Click text directly in the template to edit content, and use inline section tools there.
                                </p>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default PortfolioEditor;
