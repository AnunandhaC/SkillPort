
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ExternalLink, Plus, Save, ArrowRight, Download, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthProvider';
import { useData } from '../context/DataProvider';
import PortfolioView from './PortfolioView';

const PortfolioEditor = () => {
    const { user } = useAuth();
    const { savePortfolio, templates, loading, getStudentPortfolio, refreshPortfolios } = useData();
    const navigate = useNavigate();

    const normalizedProgram = String(user?.program || '')
        .trim()
        .toLowerCase()
        .replace(/\./g, '')
        .replace(/\s+/g, '');
    const isBArch = normalizedProgram === 'barch';
    const getDefaultBtechTemplate = (branch) => {
        const branchMap = {
            cs: 'btech-cs',
            mech: 'btech-mech',
            eee: 'btech-eee',
            ece: 'btech-ece',
            robo: 'btech-robo',
        };
        return branchMap[String(branch || 'cs').trim().toLowerCase()] || 'btech-cs';
    };

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
        templateId: 'btech-cs',
    });

    const [btechBranch, setBtechBranch] = useState('cs');
    const [editorMode, setEditorMode] = useState(false);
    const [isExportingTemplate, setIsExportingTemplate] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [initializedForUserId, setInitializedForUserId] = useState(null);
    const livePreviewRef = useRef(null);
    const [newSkillText, setNewSkillText] = useState('');
    const actionHandledOnMouseDownRef = useRef(false);

    const buildDefaultFormData = () => ({
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

    useEffect(() => {
        if (!user?.id || loading || initializedForUserId === user.id) return;

        const existingPortfolio = getStudentPortfolio(user.id);
        const defaultFormData = buildDefaultFormData();

        if (existingPortfolio) {
            setFormData({
                about: existingPortfolio.about || '',
                skills: Array.isArray(existingPortfolio.skills) ? existingPortfolio.skills : [],
                projects: Array.isArray(existingPortfolio.projects) ? existingPortfolio.projects : [],
                certifications: Array.isArray(existingPortfolio.certifications) ? existingPortfolio.certifications : [],
                meta: {
                    ...defaultFormData.meta,
                    ...(existingPortfolio.meta || {}),
                    fullName: existingPortfolio?.meta?.fullName || user?.name || '',
                    contactEmail: existingPortfolio?.meta?.contactEmail || user?.email || '',
                    templateStyle: {
                        ...defaultFormData.meta.templateStyle,
                        ...(existingPortfolio?.meta?.templateStyle || {}),
                    },
                    templatePages: Array.isArray(existingPortfolio?.meta?.templatePages)
                        ? existingPortfolio.meta.templatePages
                        : [],
                },
                templateId: existingPortfolio.templateId || defaultFormData.templateId,
            });
            setInitializedForUserId(user.id);
            return;
        }

        setFormData(defaultFormData);

        setInitializedForUserId(user.id);
    }, [user?.id, user?.name, user?.email, isBArch, loading, initializedForUserId, getStudentPortfolio]);

    const buildPortfolioPayload = () => ({
        ...formData,
        templateId: isBArch
            ? String(formData.templateId || '').startsWith('barch-')
                ? formData.templateId
                : 'barch-red'
            : (formData.templateId === 'barch-red' || formData.templateId === 'modern')
                ? getDefaultBtechTemplate(btechBranch)
                : formData.templateId,
        meta: {
            ...formData.meta,
            // Keep page copies in local editor state only; storing full snapshots makes saves heavy and brittle.
            templatePageCopies: [],
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

    const flushPendingEdits = async () => {
        const activeEl = document.activeElement;
        if (
            activeEl
            && (
                activeEl.tagName === 'INPUT'
                || activeEl.tagName === 'TEXTAREA'
                || activeEl.isContentEditable
            )
            && typeof activeEl.blur === 'function'
        ) {
            activeEl.blur();
        }

        await Promise.resolve();
        await new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
        await new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
    };

    const handleSave = async ({ enforceRequired = false, silent = false } = {}) => {
        if (isSaving) return false;

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
                setSaveStatus({ type: 'error', text: `Missing required fields: ${missing.join(', ')}` });
                alert(`Please complete required BArch details: ${missing.join(', ')}`);
                return false;
            }
        }

        try {
            setIsSaving(true);
            setSaveStatus({ type: 'info', text: 'Preparing your latest edits...' });
            await flushPendingEdits();
            const payload = buildPortfolioPayload();
            setSaveStatus({ type: 'info', text: 'Saving portfolio to Supabase...' });
            await savePortfolio(user.id, payload);
            setSaveStatus({ type: 'success', text: 'Portfolio saved successfully.' });
            refreshPortfolios().catch((refreshError) => {
                console.warn('Background portfolio refresh failed:', refreshError);
            });
            if (!silent) alert('Portfolio saved successfully!');
            return true;
        } catch (error) {
            console.error('Failed to save portfolio:', error);
            const message = error?.message || 'Unknown error while saving portfolio.';
            setSaveStatus({ type: 'error', text: `Failed to save portfolio: ${message}` });
            if (!silent) alert(`Failed to save portfolio: ${message}`);
            return false;
        } finally {
            setIsSaving(false);
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
        if (saved) {
            setSaveStatus({ type: 'success', text: 'Portfolio published successfully.' });
            navigate('/student-dashboard');
        }
    };

    const runToolbarAction = async (action) => {
        await action();
    };

    const makeMouseDownHandler = (action) => async (event) => {
        actionHandledOnMouseDownRef.current = true;
        event.preventDefault();
        await runToolbarAction(action);
    };

    const makeClickHandler = (action) => async () => {
        if (actionHandledOnMouseDownRef.current) {
            actionHandledOnMouseDownRef.current = false;
            return;
        }
        await runToolbarAction(action);
    };

    const handleDownloadTemplate = async () => {
        try {
            const activeEl = document.activeElement;
            if (
                activeEl
                && (
                    activeEl.tagName === 'INPUT'
                    || activeEl.tagName === 'TEXTAREA'
                    || activeEl.isContentEditable
                )
                && typeof activeEl.blur === 'function'
            ) {
                activeEl.blur();
            }

            await Promise.resolve();
            setIsExportingTemplate(true);
            const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
                import('html2canvas'),
                import('jspdf'),
            ]);

            // Allow blur commits + React state updates + export-mode repaint to fully settle.
            await new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
            await new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
            if (document?.fonts?.ready) {
                try {
                    await document.fonts.ready;
                } catch {
                    // ignore font readiness errors, continue export
                }
            }

            const canvas = await html2canvas(livePreviewRef.current, {
                scale: Math.max(3, Math.ceil((window.devicePixelRatio || 1) * 2)),
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                imageTimeout: 0,
                scrollX: 0,
                scrollY: -window.scrollY,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
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
                { title: 'New Project', desc: 'Edit this project description' },
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
            const pages = Array.isArray(prev?.meta?.templatePages) ? prev.meta.templatePages : [];
            return {
                ...prev,
                about: '',
                meta: {
                    ...(prev.meta || {}),
                    templatePages: [
                        ...pages,
                        {
                            title: `New Page ${pages.length + 1}`,
                            content: 'Add content for this page.',
                            image: '',
                        },
                    ],
                },
            };
        });
    };

    const updateTemplatePage = (idx, patch) => {
        setFormData((prev) => {
            const pages = Array.isArray(prev?.meta?.templatePages) ? [...prev.meta.templatePages] : [];
            pages[idx] = { ...(pages[idx] || {}), ...patch };
            return {
                ...prev,
                meta: {
                    ...(prev.meta || {}),
                    templatePages: pages,
                },
            };
        });
    };

    const removeTemplatePage = (idx) => {
        setFormData((prev) => ({
            ...prev,
            meta: {
                ...(prev.meta || {}),
                templatePages: (Array.isArray(prev?.meta?.templatePages) ? prev.meta.templatePages : []).filter((_, i) => i !== idx),
            },
        }));
    };

    const addCertification = () => {
        setFormData((prev) => ({
            ...prev,
            certifications: [...(Array.isArray(prev.certifications) ? prev.certifications : []), { name: 'New Certification', image: '' }],
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
            if (t.id === 'modern') return false;
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
                {saveStatus ? (
                    <div className={`mx-2 rounded-lg px-3 py-2 text-sm ${
                        saveStatus.type === 'error'
                            ? 'bg-red-500/10 text-red-300 border border-red-500/30'
                            : saveStatus.type === 'info'
                                ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    }`}>
                        {saveStatus.text}
                    </div>
                ) : null}

                <div className="pt-8 px-2 space-y-3">
                    <button
                        type="button"
                        onMouseDown={makeMouseDownHandler(handlePreview)}
                        onClick={makeClickHandler(handlePreview)}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition-all"
                    >
                        <Eye size={18} /> Preview Portfolio
                    </button>
                    <button
                        type="button"
                        onMouseDown={makeMouseDownHandler(() => handleSave())}
                        onClick={makeClickHandler(() => handleSave())}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 transition-all"
                    >
                        <Save size={18} /> {isSaving ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button
                        type="button"
                        onMouseDown={makeMouseDownHandler(handleDownloadTemplate)}
                        onClick={makeClickHandler(handleDownloadTemplate)}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 transition-all"
                    >
                        <Download size={18} /> Download PDF
                    </button>
                    <button
                        type="button"
                        onMouseDown={makeMouseDownHandler(handlePublish)}
                        onClick={makeClickHandler(handlePublish)}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-all shadow-lg shadow-green-500/20"
                    >
                        <span>{isSaving ? 'Publishing...' : 'Publish Changes'}</span>
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
                                                navigate(`/portfolio/view/${demoId}`);
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
                                    editable={!isExportingTemplate}
                                    onPortfolioChange={!isExportingTemplate ? setFormData : undefined}
                                    hideFooterBadge
                                    exportMode={isExportingTemplate}
                                    editorScopeId="dps-live-template-preview-main"
                                />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2" data-export-hide="1">
                                <button
                                    type="button"
                                    onClick={handleDownloadTemplate}
                                    className="inline-flex items-center gap-2 text-sm bg-cyan-600 px-3 py-1 rounded text-white"
                                >
                                    <Download size={14} /> Download PDF
                                </button>
                            </div>

                            <div className="rounded-xl border border-white/15 bg-black/20 p-4 space-y-4" data-export-hide="1">
                                <h4 className="text-white font-semibold">Template Controls (All Templates)</h4>
                                <p className="text-xs text-slate-400">Use this for templates where inline editing is limited. These controls also work for templates you add later.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input
                                        value={formData?.meta?.fullName || ''}
                                        onChange={(e) => setMeta('fullName', e.target.value)}
                                        placeholder="Full name"
                                        className="bg-slate-900/60 border border-slate-700 rounded p-2 text-sm text-white"
                                    />
                                    <input
                                        value={formData?.meta?.role || ''}
                                        onChange={(e) => setMeta('role', e.target.value)}
                                        placeholder="Role / title"
                                        className="bg-slate-900/60 border border-slate-700 rounded p-2 text-sm text-white"
                                    />
                                    <input
                                        value={formData?.meta?.contactEmail || ''}
                                        onChange={(e) => setMeta('contactEmail', e.target.value)}
                                        placeholder="Contact email"
                                        className="bg-slate-900/60 border border-slate-700 rounded p-2 text-sm text-white"
                                    />
                                    <input
                                        value={formData?.meta?.education || ''}
                                        onChange={(e) => setMeta('education', e.target.value)}
                                        placeholder="Education"
                                        className="bg-slate-900/60 border border-slate-700 rounded p-2 text-sm text-white"
                                    />
                                    <input
                                        value={formData?.meta?.educationYears || ''}
                                        onChange={(e) => setMeta('educationYears', e.target.value)}
                                        placeholder="Education years"
                                        className="bg-slate-900/60 border border-slate-700 rounded p-2 text-sm text-white"
                                    />
                                    <input
                                        value={formData?.meta?.experience || ''}
                                        onChange={(e) => setMeta('experience', e.target.value)}
                                        placeholder="Experience"
                                        className="bg-slate-900/60 border border-slate-700 rounded p-2 text-sm text-white"
                                    />
                                    <input
                                        value={formData?.meta?.experienceYears || ''}
                                        onChange={(e) => setMeta('experienceYears', e.target.value)}
                                        placeholder="Experience years"
                                        className="bg-slate-900/60 border border-slate-700 rounded p-2 text-sm text-white"
                                    />
                                    <input
                                        value={formData?.about || ''}
                                        onChange={(e) => setRoot('about', e.target.value)}
                                        placeholder="About"
                                        className="bg-slate-900/60 border border-slate-700 rounded p-2 text-sm text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <h5 className="text-sm text-slate-200">Hide/Show Sections</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { key: 'about', label: 'About' },
                                            { key: 'skills', label: 'Skills' },
                                            { key: 'projects', label: 'Projects' },
                                            { key: 'certifications', label: 'Certifications' },
                                            { key: 'services', label: 'Services' },
                                            { key: 'qualification', label: 'Qualification' },
                                            { key: 'testimonials', label: 'Testimonials' },
                                            { key: 'contact', label: 'Contact' },
                                            { key: 'extraPages', label: 'Extra Pages' },
                                        ].map((s) => {
                                            const visible = formData?.meta?.sectionVisibility?.[s.key] !== false;
                                            return (
                                                <button
                                                    key={s.key}
                                                    type="button"
                                                    onClick={() => setSectionVisibility(s.key, !visible)}
                                                    className={`px-2 py-1 rounded-full text-xs border ${visible ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-300'}`}
                                                >
                                                    {visible ? `Hide ${s.label}` : `Show ${s.label}`}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-sm text-slate-200">Extra Pages</h5>
                                        <button type="button" onClick={addTemplatePage} className="text-xs px-2 py-1 bg-blue-600 rounded text-white">Add</button>
                                    </div>
                                    {(Array.isArray(formData?.meta?.templatePages) ? formData.meta.templatePages : []).length === 0 && (
                                        <p className="text-xs text-slate-400">Add a page to generate another page in the same template style.</p>
                                    )}
                                    {(Array.isArray(formData?.meta?.templatePages) ? formData.meta.templatePages : []).map((page, i) => (
                                        <div key={`template-page-${i}`} className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-medium text-slate-300">Page {i + 2}</span>
                                                <button type="button" onClick={() => removeTemplatePage(i)} className="text-red-400 hover:text-red-300">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <input
                                                value={page?.title || ''}
                                                onChange={(e) => updateTemplatePage(i, { title: e.target.value })}
                                                placeholder="Page title"
                                                className="w-full bg-slate-900/60 border border-slate-700 rounded p-2 text-sm text-white"
                                            />
                                            <textarea
                                                value={page?.content || ''}
                                                onChange={(e) => updateTemplatePage(i, { content: e.target.value })}
                                                placeholder="Page content"
                                                rows={4}
                                                className="w-full bg-slate-900/60 border border-slate-700 rounded p-2 text-sm text-white"
                                            />
                                            <input
                                                value={page?.image || ''}
                                                onChange={(e) => updateTemplatePage(i, { image: e.target.value })}
                                                placeholder="Optional image URL"
                                                className="w-full bg-slate-900/60 border border-slate-700 rounded p-2 text-sm text-white"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-sm text-slate-200">Skills</h5>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            value={newSkillText}
                                            onChange={(e) => setNewSkillText(e.target.value)}
                                            placeholder="Add skill"
                                            className="flex-1 bg-slate-900/60 border border-slate-700 rounded p-2 text-sm text-white"
                                        />
                                        <button type="button" onClick={addSkill} className="px-3 py-2 bg-blue-600 rounded text-white text-sm">Add</button>
                                    </div>
                                    <div className="space-y-1">
                                        {(Array.isArray(formData.skills) ? formData.skills : []).map((s, i) => (
                                            <div key={`${s}-${i}`} className="grid grid-cols-[1fr_auto] gap-2">
                                                <input
                                                    value={s}
                                                    onChange={(e) => updateSkill(i, e.target.value)}
                                                    className="bg-slate-900/60 border border-slate-700 rounded p-2 text-sm text-white"
                                                />
                                                <button type="button" onClick={() => removeSkill(i)} className="text-red-400 hover:text-red-300">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-sm text-slate-200">Projects</h5>
                                        <button type="button" onClick={addProject} className="text-xs px-2 py-1 bg-blue-600 rounded text-white">Add</button>
                                    </div>
                                    {(Array.isArray(formData.projects) ? formData.projects : []).map((p, i) => (
                                        <div key={i} className="grid grid-cols-[1fr_auto] gap-2">
                                            <input
                                                value={p.title || ''}
                                                onChange={(e) => updateProject(i, { title: e.target.value })}
                                                placeholder="Project title"
                                                className="bg-slate-900/60 border border-slate-700 rounded p-2 text-sm text-white"
                                            />
                                            <button type="button" onClick={() => removeProject(i)} className="text-red-400 hover:text-red-300">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-sm text-slate-200">Certifications</h5>
                                        <button type="button" onClick={addCertification} className="text-xs px-2 py-1 bg-blue-600 rounded text-white">Add</button>
                                    </div>
                                    {(Array.isArray(formData.certifications) ? formData.certifications : []).map((c, i) => (
                                        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                                            <input
                                                value={c.name || ''}
                                                onChange={(e) => updateCertification(i, { name: e.target.value })}
                                                placeholder="Certification"
                                                className="bg-slate-900/60 border border-slate-700 rounded p-2 text-sm text-white"
                                            />
                                            <input
                                                value={c.issuer || ''}
                                                onChange={(e) => updateCertification(i, { issuer: e.target.value })}
                                                placeholder="Issuer"
                                                className="bg-slate-900/60 border border-slate-700 rounded p-2 text-sm text-white"
                                            />
                                            <button type="button" onClick={() => removeCertification(i)} className="text-red-400 hover:text-red-300">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default PortfolioEditor;
