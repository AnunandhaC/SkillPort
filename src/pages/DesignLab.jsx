import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DesignStoreProvider, useDesignStore } from '../editor/designStore.jsx';
import DesignCanvas from '../editor/DesignCanvas';
import { createBasicPortfolioTemplate, createEmptyDocument, createUniconsDocumentFromPortfolio } from '../editor/designSchema';
import { useAuth } from '../context/AuthProvider';
import { useData } from '../context/DataProvider';
import PortfolioView from './PortfolioView';

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
    const { getStudentPortfolio } = useData();
    const initialTemplatePortfolio = useMemo(() => {
        const source = getStudentPortfolio(`demo-${templateId}`) || getStudentPortfolio('demo-modern');
        return {
            ...source,
            templateId: templateId || source?.templateId || 'modern',
        };
    }, [getStudentPortfolio, templateId]);

    const [draftPortfolio, setDraftPortfolio] = useState(initialTemplatePortfolio);

    useEffect(() => {
        setDraftPortfolio(initialTemplatePortfolio);
    }, [initialTemplatePortfolio]);

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Edit Template</h1>
                    <p className="text-slate-400">
                        Template preview editor for <span className="font-mono text-slate-200">{templateId || 'modern'}</span>.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setDraftPortfolio(initialTemplatePortfolio)}
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

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 overflow-hidden">
                <PortfolioView
                    portfolioOverride={draftPortfolio}
                    editable
                    onPortfolioChange={setDraftPortfolio}
                    hideFooterBadge
                />
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
