import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DesignStoreProvider, useDesignStore } from '../editor/designStore.jsx';
import DesignCanvas from '../editor/DesignCanvas';
import { createBasicPortfolioTemplate, createEmptyDocument, createUniconsDocumentFromPortfolio } from '../editor/designSchema';
import { useAuth } from '../context/AuthProvider';
import { useData } from '../context/DataProvider';
import PortfolioView from './PortfolioView';

const MANAGED_TEMPLATE_SECTIONS = [
    { key: 'about', label: 'About' },
    { key: 'skills', label: 'Skills' },
    { key: 'projects', label: 'Projects' },
    { key: 'certifications', label: 'Certifications' },
    { key: 'qualification', label: 'Qualification / Timeline' },
    { key: 'services', label: 'Services' },
    { key: 'testimonials', label: 'Testimonials' },
    { key: 'contact', label: 'Contact' },
    { key: 'extraPages', label: 'Extra Pages' },
];

const buildDocumentForCreateMode = () => {
    const blankDoc = createEmptyDocument();
    return {
        ...blankDoc,
        templateId: 'custom-template',
    };
};

const TemplateCanvasToolbar = () => {
    const { canUndo, canRedo, undo, redo, setDocument } = useDesignStore();
    const { user } = useAuth();
    const { getStudentPortfolio } = useData();

    const loadBasic = () => {
        const source = user?.id ? getStudentPortfolio(user.id) : null;
        setDocument(
            createBasicPortfolioTemplate({
                fullName: source?.meta?.fullName || user?.name || 'Your Name',
                about: source?.about || 'Write about yourself.',
            })
        );
    };

    const loadUnicons = () => {
        const source = user?.id ? getStudentPortfolio(user.id) : null;
        const fallback = {
            about: 'Write your about section here.',
            skills: ['HTML', 'CSS', 'JavaScript'],
            projects: [{ title: 'Project 1', desc: 'Describe project.' }],
            certifications: [{ name: 'Certification', issuer: 'Issuer' }],
            meta: {
                fullName: user?.name || 'B.Tech CSE Student',
                role: 'Frontend Developer',
            },
        };
        setDocument(createUniconsDocumentFromPortfolio(source || fallback));
    };

    return (
        <div className="flex items-center gap-2 mb-4">
            <button
                type="button"
                onClick={loadBasic}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-900 text-white"
            >
                Load Basic
            </button>
            <button
                type="button"
                onClick={loadUnicons}
                className="px-3 py-2 rounded-lg border border-blue-300 bg-blue-600 text-white"
            >
                Load Unicons
            </button>
            <button
                type="button"
                onClick={undo}
                disabled={!canUndo}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-50"
            >
                Undo
            </button>
            <button
                type="button"
                onClick={redo}
                disabled={!canRedo}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-50"
            >
                Redo
            </button>
        </div>
    );
};

const CreateTemplateLab = () => {
    const initialDocument = useMemo(() => buildDocumentForCreateMode(), []);

    return (
        <DesignStoreProvider initialDocument={initialDocument}>
            <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">Create New Template</h1>
                        <p className="text-slate-400">Blank canvas mode for creating a new template structure.</p>
                    </div>
                    <Link
                        to="/admin-dashboard"
                        className="px-3 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800"
                    >
                        Back to Admin
                    </Link>
                </div>
                <TemplateCanvasToolbar />
                <DesignCanvas />
            </div>
        </DesignStoreProvider>
    );
};

const TemplatePreviewEditor = ({ templateId }) => {
    const { getStudentPortfolio, getTemplateById, saveTemplateConfig } = useData();
    const initialTemplatePortfolio = useMemo(() => {
        const source = getStudentPortfolio(`demo-${templateId}`) || getStudentPortfolio('demo-modern');
        return {
            ...source,
            templateId: templateId || source?.templateId || 'modern',
        };
    }, [getStudentPortfolio, templateId]);

    const [draftPortfolio, setDraftPortfolio] = useState(initialTemplatePortfolio);
    const [sectionDraft, setSectionDraft] = useState(() => ({
        about: true,
        skills: true,
        projects: true,
        certifications: true,
        qualification: true,
        services: true,
        testimonials: true,
        contact: true,
        extraPages: true,
        ...(getTemplateById(templateId)?.defaultSectionVisibility || {}),
    }));
    const [saveState, setSaveState] = useState(null);
    const templateConfig = getTemplateById(templateId);

    useEffect(() => {
        setDraftPortfolio(initialTemplatePortfolio);
    }, [initialTemplatePortfolio]);

    useEffect(() => {
        setSectionDraft({
            about: true,
            skills: true,
            projects: true,
            certifications: true,
            qualification: true,
            services: true,
            testimonials: true,
            contact: true,
            extraPages: true,
            ...(getTemplateById(templateId)?.defaultSectionVisibility || {}),
        });
        setSaveState(null);
    }, [getTemplateById, templateId]);

    const previewPortfolio = useMemo(() => ({
        ...draftPortfolio,
        meta: {
            ...(draftPortfolio?.meta || {}),
            sectionVisibility: {
                ...(draftPortfolio?.meta?.sectionVisibility || {}),
                ...sectionDraft,
            },
        },
    }), [draftPortfolio, sectionDraft]);

    const handleToggleSection = (key) => {
        setSectionDraft((prev) => ({ ...prev, [key]: !prev[key] }));
        setSaveState(null);
    };

    const handleSaveTemplateSections = async () => {
        try {
            await saveTemplateConfig({
                ...(templateConfig || { id: templateId, name: templateId, description: '' }),
                defaultSectionVisibility: sectionDraft,
            });
            setSaveState({ type: 'success', text: 'Template section settings saved.' });
        } catch (error) {
            setSaveState({ type: 'error', text: error?.message || 'Failed to save template settings.' });
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Edit Template</h1>
                    <p className="text-slate-400">
                        Control which sections are preserved in <span className="font-mono text-slate-200">{templateId || 'modern'}</span>.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            setDraftPortfolio(initialTemplatePortfolio);
                            setSectionDraft({
                                about: true,
                                skills: true,
                                projects: true,
                                certifications: true,
                                qualification: true,
                                services: true,
                                testimonials: true,
                                contact: true,
                                extraPages: true,
                                ...(getTemplateById(templateId)?.defaultSectionVisibility || {}),
                            });
                            setSaveState(null);
                        }}
                        className="px-3 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800"
                    >
                        Reset Demo Content
                    </button>
                    <Link
                        to="/admin-dashboard"
                        className="px-3 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800"
                    >
                        Back to Admin
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                <aside className="rounded-2xl border border-white/10 bg-slate-950/50 p-5 space-y-5">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Section Controls</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Turn sections on or off for this template. Saved settings become the admin default for future use.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {MANAGED_TEMPLATE_SECTIONS.map((section) => {
                            const enabled = sectionDraft[section.key] !== false;
                            return (
                                <button
                                    key={section.key}
                                    type="button"
                                    onClick={() => handleToggleSection(section.key)}
                                    className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                                        enabled
                                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                                            : 'border-white/10 bg-white/5 text-slate-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="font-medium">{section.label}</span>
                                        <span className={`text-xs uppercase tracking-[0.2em] ${enabled ? 'text-emerald-300' : 'text-slate-500'}`}>
                                            {enabled ? 'Keep' : 'Remove'}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={handleSaveTemplateSections}
                        className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-500"
                    >
                        Save Template Sections
                    </button>

                    {saveState && (
                        <p className={`text-sm ${saveState.type === 'success' ? 'text-emerald-300' : 'text-red-400'}`}>
                            {saveState.text}
                        </p>
                    )}
                </aside>

                <div className="rounded-2xl border border-white/10 bg-slate-950/40 overflow-hidden">
                    <PortfolioView
                        portfolioOverride={previewPortfolio}
                        editable
                        onPortfolioChange={setDraftPortfolio}
                        hideFooterBadge
                    />
                </div>
            </div>
        </div>
    );
};

const DesignLab = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const mode = params.get('action') === 'create' ? 'create' : 'edit';
    const templateId = params.get('template') || 'modern';

    if (mode === 'create') {
        return <CreateTemplateLab />;
    }

    return <TemplatePreviewEditor templateId={templateId} />;
};

export default DesignLab;
