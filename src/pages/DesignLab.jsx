import React from 'react';
import { DesignStoreProvider, useDesignStore } from '../editor/designStore.jsx';
import DesignCanvas from '../editor/DesignCanvas';
import { createBasicPortfolioTemplate, createUniconsDocumentFromPortfolio } from '../editor/designSchema';
import { useAuth } from '../context/AuthProvider';
import { useData } from '../context/DataProvider';

const Toolbar = () => {
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

const DesignLabInner = () => (
    <div className="p-6 md:p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Design Lab (Canva-like Scaffold)</h1>
        <p className="text-slate-400 mb-6">Structured document model + draggable nodes + inline text + undo/redo. Unicons template is now available in document format.</p>
        <Toolbar />
        <DesignCanvas />
    </div>
);

const DesignLab = () => (
    <DesignStoreProvider>
        <DesignLabInner />
    </DesignStoreProvider>
);

export default DesignLab;
