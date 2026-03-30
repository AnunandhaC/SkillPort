import React, { useEffect, useState } from 'react';
import { DEFAULT_TEMPLATE_SECTIONS, useData } from '../context/DataProvider';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabaseClient';
import { Users, Layout, Plus, Trash2 } from 'lucide-react';

const BUILT_IN_SECTION_KEYS = new Set([
    'about',
    'skills',
    'projects',
    'certifications',
    'services',
    'qualification',
    'testimonials',
    'testimonial',
    'contact',
    'extraPages',
    'portfolio',
    'project',
]);

const PREVIEWABLE_BASE_TEMPLATES = [
    { id: 'modern', label: 'Modern Minimal' },
    { id: 'academic', label: 'Academic Professional' },
    { id: 'barch-red', label: 'BArch Red Studio' },
    { id: 'barch-portfolio-a', label: 'BArch Portfolio Book' },
    { id: 'barch-portfolio-b', label: 'BArch Slate Journal' },
    { id: 'btech-cs', label: 'BTech Computer Science' },
    { id: 'btech-cs-unicons', label: 'BTech CS Unicons Sections' },
    { id: 'btech-mech', label: 'BTech Mechanical' },
    { id: 'btech-mech-wajiha', label: 'Mechanical Portfolio Classic' },
    { id: 'btech-eee', label: 'BTech Electrical' },
    { id: 'btech-ece', label: 'BTech Electronics' },
    { id: 'btech-robo', label: 'BTech Robotics' },
];

const AdminDashboard = () => {
    const { templates, createTemplate, updateTemplate, removeTemplate } = useData();
    const { createFaculty } = useAuth();
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [facultyForm, setFacultyForm] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [editingTemplateId, setEditingTemplateId] = useState(null);
    const [templateForm, setTemplateForm] = useState({
        name: '',
        description: '',
        baseTemplateId: 'modern',
        themeColor: '#2563eb',
        backgroundColor: '#ffffff',
        sections: [],
    });
    const [newSection, setNewSection] = useState({ key: '', label: '' });
    const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
    const [createTemplateForm, setCreateTemplateForm] = useState({
        name: '',
        description: '',
        group: 'general',
        branch: '',
        previewTemplateId: 'modern',
        themeColor: '#2563eb',
        backgroundColor: '#ffffff',
        sections: DEFAULT_TEMPLATE_SECTIONS,
    });
    const [newCreateSection, setNewCreateSection] = useState({ key: '', label: '' });
    const [templateError, setTemplateError] = useState('');
    const [templateSuccess, setTemplateSuccess] = useState('');

    const loadUsers = async () => {
        setLoadingUsers(true);
        try {
            const { data, error: listError } = await supabase
                .from('profiles')
                .select('id, full_name, email, role, created_at')
                .order('created_at', { ascending: false });
            if (listError) throw listError;
            setUsers(data || []);
        } catch (listError) {
            setError(listError.message || 'Failed to load users.');
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleCreateFaculty = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await createFaculty({
                name: facultyForm.name,
                email: facultyForm.email,
                password: facultyForm.password,
            });

            setSuccess('Faculty account created successfully.');
            setFacultyForm({ name: '', email: '', password: '' });
            await loadUsers();
        } catch (createError) {
            setError(createError.message || 'Failed to create faculty account.');
        }
    };

    const startEditingTemplate = (template) => {
        setTemplateError('');
        setTemplateSuccess('');
        setIsCreatingTemplate(false);
        setEditingTemplateId(template.id);
        setTemplateForm({
            name: template.name || '',
            description: template.description || '',
            baseTemplateId: template.baseTemplateId || template.id || 'modern',
            themeColor: template.themeColor || '#2563eb',
            backgroundColor: template.backgroundColor || '#ffffff',
            sections: Array.isArray(template.sections) && template.sections.length > 0
                ? template.sections
                : DEFAULT_TEMPLATE_SECTIONS,
        });
    };

    const cancelEditingTemplate = () => {
        setEditingTemplateId(null);
        setTemplateForm({ name: '', description: '', baseTemplateId: 'modern', themeColor: '#2563eb', backgroundColor: '#ffffff', sections: [] });
        setNewSection({ key: '', label: '' });
        setTemplateError('');
    };

    const startCreatingTemplate = () => {
        setTemplateError('');
        setTemplateSuccess('');
        setEditingTemplateId(null);
        setTemplateForm({ name: '', description: '', baseTemplateId: 'modern', themeColor: '#2563eb', backgroundColor: '#ffffff', sections: [] });
        setNewSection({ key: '', label: '' });
        setIsCreatingTemplate(true);
        setCreateTemplateForm({
            name: '',
            description: '',
            group: 'general',
            branch: '',
            previewTemplateId: 'modern',
            themeColor: '#2563eb',
            backgroundColor: '#ffffff',
            sections: DEFAULT_TEMPLATE_SECTIONS,
        });
        setNewCreateSection({ key: '', label: '' });
    };

    const cancelCreatingTemplate = () => {
        setIsCreatingTemplate(false);
        setCreateTemplateForm({
            name: '',
            description: '',
            group: 'general',
            branch: '',
            previewTemplateId: 'modern',
            themeColor: '#2563eb',
            backgroundColor: '#ffffff',
            sections: DEFAULT_TEMPLATE_SECTIONS,
        });
        setNewCreateSection({ key: '', label: '' });
        setTemplateError('');
    };

    const normalizeSectionKey = (value) =>
        String(value || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');
    const makeUniqueSectionKey = (sections, desiredKey) => {
        const safeDesired = normalizeSectionKey(desiredKey);
        if (!safeDesired) return '';
        const used = new Set(
            (Array.isArray(sections) ? sections : [])
                .map((section) => normalizeSectionKey(section?.key))
                .filter(Boolean)
        );
        if (!used.has(safeDesired)) return safeDesired;
        let index = 2;
        let candidate = `${safeDesired}_${index}`;
        while (used.has(candidate)) {
            index += 1;
            candidate = `${safeDesired}_${index}`;
        }
        return candidate;
    };

    const buildPreviewMeta = (sections) => {
        const safeSections = Array.isArray(sections) ? sections : [];
        const sectionVisibility = safeSections.reduce((acc, section) => {
            const key = normalizeSectionKey(section?.key);
            if (!key) return acc;
            acc[key] = section?.enabled !== false;
            return acc;
        }, {});
        const customSections = safeSections.reduce((acc, section) => {
            const key = normalizeSectionKey(section?.key);
            if (!key || BUILT_IN_SECTION_KEYS.has(key)) return acc;
            acc[key] = `${section.label || key} content preview`;
            return acc;
        }, {});
        return { sectionVisibility, customSections };
    };

    const openTemplatePreview = ({ templateId, baseTemplateId, templateName, themeColor, backgroundColor, sections }) => {
        const safeTemplateId = String(templateId || '').trim() || 'preview-template';
        const safeBaseTemplateId = String(baseTemplateId || '').trim();
        if (!safeBaseTemplateId) {
            setTemplateError('Please choose a valid template for preview.');
            return;
        }

        const previewId = `demo-${safeBaseTemplateId}`;
        const normalizedSections = (Array.isArray(sections) ? sections : []).map((section) => ({
            key: normalizeSectionKey(section?.key),
            label: String(section?.label || '').trim(),
            enabled: section?.enabled !== false,
        })).filter((section) => section.key);
        const { sectionVisibility, customSections } = buildPreviewMeta(normalizedSections);

        const previewPayload = {
            templateId: safeBaseTemplateId,
            meta: {
                sectionVisibility,
                customSections,
                templateBackgroundColor: String(backgroundColor || '').trim(),
            },
        };
        const previewTemplateConfig = {
            id: safeTemplateId,
            name: String(templateName || 'Template Preview').trim() || 'Template Preview',
            baseTemplateId: safeBaseTemplateId,
            themeColor: String(themeColor || '#2563eb').trim() || '#2563eb',
            backgroundColor: String(backgroundColor || '').trim(),
            sections: normalizedSections,
        };

        try {
            localStorage.setItem(`dps_preview_draft_${previewId}`, JSON.stringify(previewPayload));
            localStorage.setItem(`dps_preview_template_config_${previewId}`, JSON.stringify(previewTemplateConfig));
        } catch (storageError) {
            console.warn('Failed to cache template preview data:', storageError);
        }

        const url = `${window.location.origin}/portfolio/view/${previewId}?preview=1&t=${Date.now()}`;
        window.open(url, '_blank');
    };

    const updateSection = (index, patch) => {
        setTemplateForm((prev) => {
            const current = Array.isArray(prev.sections) ? [...prev.sections] : [];
            current[index] = { ...(current[index] || {}), ...patch };
            return { ...prev, sections: current };
        });
    };

    const removeSection = (index) => {
        setTemplateForm((prev) => ({
            ...prev,
            sections: (Array.isArray(prev.sections) ? prev.sections : []).filter((_, i) => i !== index),
        }));
    };

    const addSection = () => {
        setTemplateError('');
        const label = String(newSection.label || '').trim();
        const requestedKey = normalizeSectionKey(newSection.key || newSection.label);
        const key = makeUniqueSectionKey(templateForm.sections, requestedKey);

        if (!key) {
            setTemplateError('Section key or section label is required.');
            return;
        }

        setTemplateForm((prev) => ({
            ...prev,
            sections: [
                ...(Array.isArray(prev.sections) ? prev.sections : []),
                {
                    key,
                    label: label || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
                    enabled: true,
                },
            ],
        }));
        setNewSection({ key: '', label: '' });
    };

    const updateCreateSection = (index, patch) => {
        setCreateTemplateForm((prev) => {
            const current = Array.isArray(prev.sections) ? [...prev.sections] : [];
            current[index] = { ...(current[index] || {}), ...patch };
            return { ...prev, sections: current };
        });
    };

    const removeCreateSection = (index) => {
        setCreateTemplateForm((prev) => ({
            ...prev,
            sections: (Array.isArray(prev.sections) ? prev.sections : []).filter((_, i) => i !== index),
        }));
    };

    const addCreateSection = () => {
        setTemplateError('');
        const label = String(newCreateSection.label || '').trim();
        const requestedKey = normalizeSectionKey(newCreateSection.key || newCreateSection.label);
        const key = makeUniqueSectionKey(createTemplateForm.sections, requestedKey);

        if (!key) {
            setTemplateError('Section key or section label is required.');
            return;
        }

        setCreateTemplateForm((prev) => ({
            ...prev,
            sections: [
                ...(Array.isArray(prev.sections) ? prev.sections : []),
                {
                    key,
                    label: label || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
                    enabled: true,
                },
            ],
        }));
        setNewCreateSection({ key: '', label: '' });
    };

    const handleSaveTemplate = (e) => {
        e.preventDefault();
        setTemplateError('');
        setTemplateSuccess('');

        if (!editingTemplateId) {
            setTemplateError('Please select a template to edit.');
            return;
        }
        if (!templateForm.name.trim() || !templateForm.description.trim()) {
            setTemplateError('Template name and description are required.');
            return;
        }
        if (!Array.isArray(templateForm.sections) || templateForm.sections.length === 0) {
            setTemplateError('Add at least one section for this template.');
            return;
        }
        const normalizedKeys = templateForm.sections.map((section) => normalizeSectionKey(section?.key));
        if (normalizedKeys.some((key) => !key)) {
            setTemplateError('Each section must have a valid key.');
            return;
        }
        if (new Set(normalizedKeys).size !== normalizedKeys.length) {
            setTemplateError('Section keys must be unique.');
            return;
        }

        try {
            updateTemplate(editingTemplateId, {
                name: templateForm.name.trim(),
                description: templateForm.description.trim(),
                baseTemplateId: templateForm.baseTemplateId,
                themeColor: templateForm.themeColor,
                backgroundColor: templateForm.backgroundColor,
                sections: templateForm.sections.map((section) => ({
                    key: normalizeSectionKey(section.key),
                    label: String(section.label || '').trim(),
                    enabled: section.enabled !== false,
                })),
            });
            setTemplateSuccess('Template updated successfully.');
            setEditingTemplateId(null);
            setTemplateForm({ name: '', description: '', baseTemplateId: 'modern', themeColor: '#2563eb', backgroundColor: '#ffffff', sections: [] });
            setNewSection({ key: '', label: '' });
        } catch (updateError) {
            setTemplateError(updateError.message || 'Failed to update template.');
        }
    };

    const handleCreateTemplate = (e) => {
        e.preventDefault();
        setTemplateError('');
        setTemplateSuccess('');

        if (!createTemplateForm.name.trim() || !createTemplateForm.description.trim()) {
            setTemplateError('Template name and description are required.');
            return;
        }
        if (!Array.isArray(createTemplateForm.sections) || createTemplateForm.sections.length === 0) {
            setTemplateError('Add at least one section for this template.');
            return;
        }

        const normalizedKeys = createTemplateForm.sections.map((section) => normalizeSectionKey(section?.key));
        if (normalizedKeys.some((key) => !key)) {
            setTemplateError('Each section must have a valid key.');
            return;
        }
        if (new Set(normalizedKeys).size !== normalizedKeys.length) {
            setTemplateError('Section keys must be unique.');
            return;
        }

        try {
            createTemplate({
                id: normalizeSectionKey(createTemplateForm.name),
                name: createTemplateForm.name.trim(),
                description: createTemplateForm.description.trim(),
                group: createTemplateForm.group,
                branch: createTemplateForm.group === 'btech-branch'
                    ? normalizeSectionKey(createTemplateForm.branch)
                    : '',
                baseTemplateId: createTemplateForm.previewTemplateId,
                themeColor: createTemplateForm.themeColor,
                backgroundColor: createTemplateForm.backgroundColor,
                sections: createTemplateForm.sections.map((section) => ({
                    key: normalizeSectionKey(section.key),
                    label: String(section.label || '').trim(),
                    enabled: section.enabled !== false,
                })),
            });
            setTemplateSuccess('Template created successfully.');
            setIsCreatingTemplate(false);
            setCreateTemplateForm({
                name: '',
                description: '',
                group: 'general',
                branch: '',
                previewTemplateId: 'modern',
                themeColor: '#2563eb',
                backgroundColor: '#ffffff',
                sections: DEFAULT_TEMPLATE_SECTIONS,
            });
            setNewCreateSection({ key: '', label: '' });
        } catch (createError) {
            setTemplateError(createError.message || 'Failed to create template.');
        }
    };

    const handlePreviewNewTemplate = () => {
        setTemplateError('');

        const baseTemplateId = String(createTemplateForm.previewTemplateId || '').trim();
        if (!baseTemplateId) {
            setTemplateError('Please choose a preview base template.');
            return;
        }
        openTemplatePreview({
            templateId: normalizeSectionKey(createTemplateForm.name) || 'new-template-preview',
            baseTemplateId,
            templateName: createTemplateForm.name || 'New Template Preview',
            themeColor: createTemplateForm.themeColor,
            backgroundColor: createTemplateForm.backgroundColor,
            sections: createTemplateForm.sections,
        });
    };

    const handlePreviewExistingTemplate = () => {
        setTemplateError('');
        if (!editingTemplateId) {
            setTemplateError('Please select a template to preview.');
            return;
        }
        openTemplatePreview({
            templateId: editingTemplateId,
            baseTemplateId: templateForm.baseTemplateId || editingTemplateId,
            templateName: templateForm.name || 'Edited Template Preview',
            themeColor: templateForm.themeColor,
            backgroundColor: templateForm.backgroundColor,
            sections: templateForm.sections,
        });
    };

    const handleRemoveTemplate = (templateId, templateName = '') => {
        setTemplateError('');
        setTemplateSuccess('');
        const safeName = String(templateName || templateId || '').trim();
        const confirmed = window.confirm(`Delete template "${safeName}"? This cannot be undone.`);
        if (!confirmed) return;

        try {
            removeTemplate(templateId);
            setTemplateSuccess(`Template "${safeName}" removed.`);
            if (editingTemplateId === templateId) {
                setEditingTemplateId(null);
                setTemplateForm({ name: '', description: '', baseTemplateId: 'modern', themeColor: '#2563eb', backgroundColor: '#ffffff', sections: [] });
                setNewSection({ key: '', label: '' });
            }
        } catch (removeError) {
            setTemplateError(removeError.message || 'Failed to remove template.');
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-slate-400">System configuration and user management.</p>
            </div>

            <div className="flex gap-4 border-b border-white/10 pb-1">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activeTab === 'users' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}
                >
                    User Management
                </button>
                <button
                    onClick={() => setActiveTab('templates')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activeTab === 'templates' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}
                >
                    Template Management
                </button>
            </div>

            {activeTab === 'users' && (
                <div className="space-y-6">
                    <div className="glass-panel rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Faculty</h2>
                        <form onSubmit={handleCreateFaculty} className="grid grid-cols-1 md:grid-cols-4 gap-3" autoComplete="off">
                            <input
                                type="text"
                                required
                                name="faculty_full_name"
                                autoComplete="off"
                                value={facultyForm.name}
                                onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                                placeholder="Full Name"
                                className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="email"
                                required
                                name="faculty_email"
                                autoComplete="off"
                                value={facultyForm.email}
                                onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                                placeholder="Email"
                                className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="password"
                                required
                                minLength={6}
                                name="faculty_temp_password"
                                autoComplete="new-password"
                                value={facultyForm.password}
                                onChange={(e) => setFacultyForm({ ...facultyForm, password: e.target.value })}
                                placeholder="Temporary Password"
                                className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2.5 font-medium transition"
                            >
                                Create Faculty
                            </button>
                        </form>
                        {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
                        {success && <p className="text-sm text-green-400 mt-3">{success}</p>}
                    </div>

                    <div className="glass-panel rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-white/5 text-slate-200 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Email</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loadingUsers ? (
                                <tr>
                                    <td className="px-6 py-4 text-slate-400" colSpan={3}>Loading users...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td className="px-6 py-4 text-slate-400" colSpan={3}>No users found.</td>
                                </tr>
                            ) : users.map(user => (
                                <tr key={user.id} className="hover:bg-white/5 transition">
                                    <td className="px-6 py-4 text-white font-medium">{user.full_name || 'Unnamed'}</td>
                                    <td className="px-6 py-4 capitalize">
                                        <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : user.role === 'faculty' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                </div>
            )}

            {activeTab === 'templates' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(t => (
                        <div key={t.id} className="glass-card p-6 rounded-xl border border-white/10">
                            <div className="flex justify-between items-start mb-4">
                                <Layout size={32} className="text-blue-400" />
                                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">Active</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{t.name}</h3>
                            <p className="text-sm text-slate-400 mb-4">{t.description}</p>
                            <button
                                onClick={() => startEditingTemplate(t)}
                                className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                            >
                                Edit Template
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRemoveTemplate(t.id, t.name)}
                                className="mt-2 inline-flex items-center gap-1 text-sm text-red-400 hover:text-red-300 font-medium"
                            >
                                <Trash2 size={14} /> Remove Template
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={startCreatingTemplate}
                        className="border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-6 text-slate-500 hover:border-blue-500/50 hover:text-blue-400 transition cursor-pointer"
                    >
                        <Plus size={32} className="mb-2" />
                        <span className="font-medium">Add New Template</span>
                    </button>
                </div>
            )}

            {activeTab === 'templates' && editingTemplateId && (
                <div className="glass-panel rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Edit Template</h2>
                    <form onSubmit={handleSaveTemplate} className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Template Name</label>
                            <input
                                type="text"
                                value={templateForm.name}
                                onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Description</label>
                            <textarea
                                rows={4}
                                value={templateForm.description}
                                onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Base Template Layout</label>
                                <select
                                    value={templateForm.baseTemplateId}
                                    onChange={(e) => setTemplateForm({ ...templateForm, baseTemplateId: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {PREVIEWABLE_BASE_TEMPLATES.map((template) => (
                                        <option key={template.id} value={template.id}>{template.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Template Color</label>
                                <input
                                    type="color"
                                    value={templateForm.themeColor}
                                    onChange={(e) => setTemplateForm({ ...templateForm, themeColor: e.target.value })}
                                    className="h-[42px] w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-1 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Background Color</label>
                                <input
                                    type="color"
                                    value={templateForm.backgroundColor}
                                    onChange={(e) => setTemplateForm({ ...templateForm, backgroundColor: e.target.value })}
                                    className="h-[42px] w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-1 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm text-slate-400">Template Sections</label>
                            <div className="space-y-2 max-h-72 overflow-auto pr-1">
                                {(Array.isArray(templateForm.sections) ? templateForm.sections : []).map((section, index) => (
                                    <div key={`${section.key}-${index}`} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
                                        <input
                                            type="text"
                                            value={section.key}
                                            onChange={(e) => updateSection(index, { key: normalizeSectionKey(e.target.value) })}
                                            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="section_key"
                                        />
                                        <input
                                            type="text"
                                            value={section.label}
                                            onChange={(e) => updateSection(index, { label: e.target.value })}
                                            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Section Label"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => updateSection(index, { enabled: section.enabled === false })}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium border ${
                                                section.enabled !== false
                                                    ? 'bg-green-500/20 border-green-500/40 text-green-300'
                                                    : 'bg-slate-800 border-slate-600 text-slate-300'
                                            }`}
                                        >
                                            {section.enabled !== false ? 'Enabled' : 'Disabled'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeSection(index)}
                                            className="px-3 py-2 rounded-lg text-xs font-medium border border-red-500/40 text-red-300 hover:bg-red-500/10"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
                                <input
                                    type="text"
                                    value={newSection.key}
                                    onChange={(e) => setNewSection((prev) => ({ ...prev, key: e.target.value }))}
                                    placeholder="new_section_key"
                                    className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    value={newSection.label}
                                    onChange={(e) => setNewSection((prev) => ({ ...prev, label: e.target.value }))}
                                    placeholder="New Section Label"
                                    className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={addSection}
                                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2.5 font-medium transition"
                                >
                                    Add Section
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handlePreviewExistingTemplate}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2.5 font-medium transition"
                            >
                                Preview Template
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2.5 font-medium transition"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={cancelEditingTemplate}
                                className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2.5 font-medium transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRemoveTemplate(editingTemplateId, templateForm.name)}
                                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white rounded-lg px-4 py-2.5 font-medium transition"
                            >
                                <Trash2 size={16} /> Remove Template
                            </button>
                        </div>
                    </form>
                    {templateError && <p className="text-sm text-red-400 mt-3">{templateError}</p>}
                    {templateSuccess && <p className="text-sm text-green-400 mt-3">{templateSuccess}</p>}
                </div>
            )}

            {activeTab === 'templates' && isCreatingTemplate && (
                <div className="glass-panel rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Create New Template</h2>
                    <form onSubmit={handleCreateTemplate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Template Name</label>
                                <input
                                    type="text"
                                    value={createTemplateForm.name}
                                    onChange={(e) => setCreateTemplateForm((prev) => ({ ...prev, name: e.target.value }))}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Group</label>
                                <select
                                    value={createTemplateForm.group}
                                    onChange={(e) => setCreateTemplateForm((prev) => ({ ...prev, group: e.target.value }))}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="general">General</option>
                                    <option value="btech-branch">BTech Branch</option>
                                    <option value="barch">BArch</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Preview Base Template</label>
                            <select
                                value={createTemplateForm.previewTemplateId}
                                onChange={(e) => setCreateTemplateForm((prev) => ({ ...prev, previewTemplateId: e.target.value }))}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {PREVIEWABLE_BASE_TEMPLATES.map((template) => (
                                    <option key={template.id} value={template.id}>
                                        {template.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Template Color</label>
                            <input
                                type="color"
                                value={createTemplateForm.themeColor}
                                onChange={(e) => setCreateTemplateForm((prev) => ({ ...prev, themeColor: e.target.value }))}
                                className="h-[42px] w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-1 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Background Color</label>
                            <input
                                type="color"
                                value={createTemplateForm.backgroundColor}
                                onChange={(e) => setCreateTemplateForm((prev) => ({ ...prev, backgroundColor: e.target.value }))}
                                className="h-[42px] w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-1 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {createTemplateForm.group === 'btech-branch' && (
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Branch Key</label>
                                <input
                                    type="text"
                                    value={createTemplateForm.branch}
                                    onChange={(e) => setCreateTemplateForm((prev) => ({ ...prev, branch: e.target.value }))}
                                    placeholder="cs / mech / eee / ece / robo"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Description</label>
                            <textarea
                                rows={4}
                                value={createTemplateForm.description}
                                onChange={(e) => setCreateTemplateForm((prev) => ({ ...prev, description: e.target.value }))}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm text-slate-400">Template Sections</label>
                            <div className="space-y-2 max-h-72 overflow-auto pr-1">
                                {(Array.isArray(createTemplateForm.sections) ? createTemplateForm.sections : []).map((section, index) => (
                                    <div key={`${section.key}-${index}`} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
                                        <input
                                            type="text"
                                            value={section.key}
                                            onChange={(e) => updateCreateSection(index, { key: normalizeSectionKey(e.target.value) })}
                                            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="section_key"
                                        />
                                        <input
                                            type="text"
                                            value={section.label}
                                            onChange={(e) => updateCreateSection(index, { label: e.target.value })}
                                            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Section Label"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => updateCreateSection(index, { enabled: section.enabled === false })}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium border ${
                                                section.enabled !== false
                                                    ? 'bg-green-500/20 border-green-500/40 text-green-300'
                                                    : 'bg-slate-800 border-slate-600 text-slate-300'
                                            }`}
                                        >
                                            {section.enabled !== false ? 'Enabled' : 'Disabled'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeCreateSection(index)}
                                            className="px-3 py-2 rounded-lg text-xs font-medium border border-red-500/40 text-red-300 hover:bg-red-500/10"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
                                <input
                                    type="text"
                                    value={newCreateSection.key}
                                    onChange={(e) => setNewCreateSection((prev) => ({ ...prev, key: e.target.value }))}
                                    placeholder="new_section_key"
                                    className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    value={newCreateSection.label}
                                    onChange={(e) => setNewCreateSection((prev) => ({ ...prev, label: e.target.value }))}
                                    placeholder="New Section Label"
                                    className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={addCreateSection}
                                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2.5 font-medium transition"
                                >
                                    Add Section
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handlePreviewNewTemplate}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2.5 font-medium transition"
                            >
                                Preview Template
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2.5 font-medium transition"
                            >
                                Create Template
                            </button>
                            <button
                                type="button"
                                onClick={cancelCreatingTemplate}
                                className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2.5 font-medium transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                    {templateError && <p className="text-sm text-red-400 mt-3">{templateError}</p>}
                    {templateSuccess && <p className="text-sm text-green-400 mt-3">{templateSuccess}</p>}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
