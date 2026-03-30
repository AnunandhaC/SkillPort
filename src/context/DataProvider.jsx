import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const DataContext = createContext(null);

export const useData = () => useContext(DataContext);

const INITIAL_OPPORTUNITIES = [
    {
        id: '1',
        title: 'Frontend Developer Internship',
        company: 'TechCorp',
        type: 'Internship',
        minGpa: 8.5,
        requiredSkills: ['React', 'JavaScript'],
        description: '3 month summer internship for React developers.'
    },
    {
        id: '2',
        title: 'Academic Excellence Scholarship',
        company: 'University Foundation',
        type: 'Scholarship',
        minGpa: 9.0,
        incomeLimit: 500000,
        requiredSkills: [],
        description: 'Scholarship for high achieving students.'
    },
    {
        id: '3',
        title: 'Full Stack Engineer',
        company: 'StartupX',
        type: 'Internship',
        minGpa: 7.5,
        requiredSkills: ['Node.js', 'React', 'MongoDB'],
        description: 'Fast paced startup environment.'
    }
];

export const DEFAULT_TEMPLATE_SECTIONS = [
    { key: 'about', label: 'About', enabled: true },
    { key: 'skills', label: 'Skills', enabled: true },
    { key: 'projects', label: 'Projects', enabled: true },
    { key: 'certifications', label: 'Certifications', enabled: true },
    { key: 'qualification', label: 'Qualification', enabled: true },
    { key: 'services', label: 'Services', enabled: true },
    { key: 'testimonials', label: 'Testimonials', enabled: true },
    { key: 'contact', label: 'Contact', enabled: true },
    { key: 'extraPages', label: 'Extra Pages', enabled: true },
    { key: 'portfolio', label: 'Portfolio', enabled: true },
    { key: 'project', label: 'Project In Mind', enabled: true },
    { key: 'testimonial', label: 'Testimonial', enabled: true },
];

const normalizeSectionKey = (value) =>
    String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

const normalizeTemplateSections = (sections) => {
    if (!Array.isArray(sections) || sections.length === 0) {
        return DEFAULT_TEMPLATE_SECTIONS.map((section) => ({ ...section }));
    }

    const seen = new Set();
    const normalized = [];

    sections.forEach((raw) => {
        const key = normalizeSectionKey(raw?.key);
        if (!key || seen.has(key)) return;
        seen.add(key);

        const label = String(raw?.label || '')
            .trim()
            || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

        normalized.push({
            key,
            label,
            enabled: raw?.enabled !== false,
        });
    });

    if (normalized.length === 0) {
        return DEFAULT_TEMPLATE_SECTIONS.map((section) => ({ ...section }));
    }

    return normalized;
};

const normalizeTemplate = (template) => ({
    ...template,
    baseTemplateId: String(template?.baseTemplateId || template?.id || 'modern').trim() || 'modern',
    themeColor: String(template?.themeColor || '#2563eb').trim() || '#2563eb',
    backgroundColor: String(template?.backgroundColor || '').trim(),
    sections: normalizeTemplateSections(template?.sections),
});

const INITIAL_TEMPLATES = [
    { id: 'modern', name: 'Modern Minimal', description: 'Clean and whitespace heavy', group: 'general' },
    { id: 'academic', name: 'Academic Professional', description: 'Structured and detailed', group: 'general' },
    // BTech Templates (grouped by BTech branch)
    { id: 'btech-cs', name: 'BTech Computer Science', description: 'Templates focused on CSE projects and skills', group: 'btech-branch', branch: 'cs' },
    { id: 'btech-cs-unicons', name: 'BTech CS Unicons Sections', description: 'Single-page section layout (home, about, skills, qualification, services, portfolio, contact)', group: 'btech-branch', branch: 'cs' },
    { id: 'btech-mech', name: 'BTech Mechanical', description: 'Templates focused on Mechanical projects and tools', group: 'btech-branch', branch: 'mech' },
    { id: 'btech-mech-wajiha', name: 'Mechanical Portfolio Classic', description: 'Single-page mechanical portfolio with intro, skill bars, work showcase, and contact', group: 'btech-branch', branch: 'mech' },
    { id: 'btech-eee', name: 'BTech Electrical', description: 'Templates focused on Electrical projects and skills', group: 'btech-branch', branch: 'eee' },
    { id: 'btech-ece', name: 'BTech Electronics', description: 'Templates focused on Electronics & Communication', group: 'btech-branch', branch: 'ece' },
    { id: 'btech-robo', name: 'BTech Robotics', description: 'Templates focused on Robotics & Automation', group: 'btech-branch', branch: 'robo' },
    // BArch Templates (unchanged)
    { id: 'barch-red', name: 'BArch Red Studio', description: 'Red and white modern architecture portfolio', group: 'barch' },
    { id: 'barch-portfolio-a', name: 'BArch Portfolio Book', description: 'Editorial portfolio style with large project boards', group: 'barch' },
    { id: 'barch-portfolio-b', name: 'BArch Slate Journal', description: 'Dark studio portfolio with timeline and project cards', group: 'barch' }
].map(normalizeTemplate);

const TEMPLATE_STORAGE_KEY = 'dps_template_configs_v1';
const DEFAULT_TEMPLATE_SECTIONS = {
    about: true,
    skills: true,
    projects: true,
    certifications: true,
    services: true,
    qualification: true,
    testimonials: true,
    contact: true,
    extraPages: true,
};

const normalizeTemplateConfig = (template) => {
    if (!template || typeof template !== 'object') return null;

    const id = String(template.id || '').trim();
    if (!id) return null;

    return {
        id,
        name: String(template.name || 'Untitled Template').trim(),
        description: String(template.description || '').trim(),
        group: String(template.group || 'general').trim() || 'general',
        branch: template.branch ? String(template.branch).trim() : undefined,
        renderer: String(template.renderer || 'built-in').trim() || 'built-in',
        sections: Array.isArray(template.sections)
            ? template.sections.map((section) => String(section || '').trim()).filter(Boolean)
            : [],
        theme: template.theme && typeof template.theme === 'object'
            ? {
                heroBg: String(template.theme.heroBg || '#0f172a').trim() || '#0f172a',
                accent: String(template.theme.accent || '#2563eb').trim() || '#2563eb',
                surface: String(template.theme.surface || '#ffffff').trim() || '#ffffff',
                canvas: String(template.theme.canvas || '#f8fafc').trim() || '#f8fafc',
                text: String(template.theme.text || '#0f172a').trim() || '#0f172a',
                muted: String(template.theme.muted || '#475569').trim() || '#475569',
            }
            : undefined,
        defaultSectionVisibility: {
            ...DEFAULT_TEMPLATE_SECTIONS,
            ...(template.defaultSectionVisibility && typeof template.defaultSectionVisibility === 'object'
                ? template.defaultSectionVisibility
                : {}),
        },
    };
};

export const DataProvider = ({ children }) => {
    const [portfolios, setPortfolios] = useState({});
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
    const [templateConfigs, setTemplateConfigs] = useState(() => {
        try {
            const stored = localStorage.getItem(TEMPLATE_STORAGE_KEY);
            if (!stored) return [];
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? parsed.map(normalizeTemplateConfig).filter(Boolean) : [];
        } catch (error) {
            console.error('Failed to load template configs from localStorage:', error);
            return [];
        }
    });
    const [users, setUsers] = useState([]); // Mock user registry for Admin

    const templates = React.useMemo(() => {
        const merged = new Map(INITIAL_TEMPLATES.map((template) => [template.id, {
            ...template,
            renderer: 'built-in',
            defaultSectionVisibility: { ...DEFAULT_TEMPLATE_SECTIONS },
        }]));

        templateConfigs.forEach((template) => {
            const prev = merged.get(template.id) || {};
            merged.set(template.id, {
                ...prev,
                ...template,
            });
        });

        return Array.from(merged.values());
    }, [templateConfigs]);

    useEffect(() => {
        try {
            localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templateConfigs));
        } catch (error) {
            console.error('Failed to persist template configs:', error);
        }
    }, [templateConfigs]);

    const loadOpportunities = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('opportunities')
                .select('*')
                .order('title', { ascending: true });

            if (error) throw error;

            const mapped = (data || []).map((row) => ({
                id: String(row.id),
                title: row.title || 'Untitled Opportunity',
                company: row.company || 'Unknown Organization',
                type: row.type || 'Internship',
                minGpa: row.min_gpa ?? row.minGpa ?? '',
                incomeLimit: row.income_limit ?? row.incomeLimit ?? '',
                requiredSkills: Array.isArray(row.required_skills)
                    ? row.required_skills
                    : Array.isArray(row.requiredSkills)
                        ? row.requiredSkills
                        : [],
                description: row.description || '',
            }));

            setOpportunities(mapped.length > 0 ? mapped : INITIAL_OPPORTUNITIES);
        } catch (error) {
            console.error('Failed to load opportunities from Supabase:', error);
            setOpportunities(INITIAL_OPPORTUNITIES);
        }
    }, []);

    const createOpportunity = async (data) => {
        const title = String(data?.title || '').trim();
        const company = String(data?.company || '').trim();
        const type = String(data?.type || 'Internship').trim() || 'Internship';
        const description = String(data?.description || '').trim();
        const requiredSkills = Array.isArray(data?.requiredSkills)
            ? data.requiredSkills.map((skill) => String(skill || '').trim()).filter(Boolean)
            : String(data?.requiredSkills || '')
                .split(',')
                .map((skill) => skill.trim())
                .filter(Boolean);

        const parseOptionalNumber = (value) => {
            const normalized = String(value ?? '').replace(/,/g, '').trim();
            if (!normalized) return null;
            const parsed = Number(normalized);
            return Number.isFinite(parsed) ? parsed : null;
        };

        if (!title) throw new Error('Opportunity title is required.');
        if (!company) throw new Error('Company or organization is required.');
        if (!description) throw new Error('Opportunity description is required.');

        const payload = {
            title,
            company,
            type,
            description,
            min_gpa: parseOptionalNumber(data?.minGpa),
            income_limit: type === 'Scholarship' ? parseOptionalNumber(data?.incomeLimit) : null,
            required_skills: requiredSkills,
        };

        const { data: inserted, error } = await supabase
            .from('opportunities')
            .insert(payload)
            .select()
            .single();

        if (error) throw error;

        const mapped = {
            id: String(inserted.id),
            title: inserted.title || title,
            company: inserted.company || company,
            type: inserted.type || type,
            minGpa: inserted.min_gpa ?? '',
            incomeLimit: inserted.income_limit ?? '',
            requiredSkills: Array.isArray(inserted.required_skills) ? inserted.required_skills : requiredSkills,
            description: inserted.description || description,
        };

        setOpportunities((prev) => [...prev, mapped].sort((a, b) => a.title.localeCompare(b.title)));
        return mapped;
    };

    const loadPortfolios = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('portfolios')
                .select('*')
                .order('last_updated', { ascending: false });

            if (error) throw error;

            const mapped = {};
            (data || []).forEach((row) => {
                    mapped[row.student_id] = {
                        studentId: row.student_id,
                        about: row.about || '',
                        skills: Array.isArray(row.skills) ? row.skills : [],
                        projects: Array.isArray(row.projects) ? row.projects : [],
                        certifications: Array.isArray(row.certifications) ? row.certifications : [],
                        meta: row.meta && typeof row.meta === 'object' ? row.meta : {},
                        familyIncome:
                            row.family_income ??
                            (row.meta && typeof row.meta === 'object'
                                ? (
                                    row.meta.familyIncome ??
                                    row.meta.annualIncome ??
                                    row.meta.householdIncome ??
                                    row.meta.income ??
                                    ''
                                )
                                : ''),
                        currentGpa:
                            row.current_gpa ??
                            (row.meta && typeof row.meta === 'object'
                                ? (row.meta.currentGpa ?? row.meta.gpa ?? '')
                                : ''),
                        templateId: row.template_id || 'modern',
                        score: row.score ?? '',
                        facultyFeedback: row.faculty_feedback || '',
                        lastUpdated: row.last_updated || row.updated_at || new Date().toISOString(),
                    };
                });

            setPortfolios(mapped);
        } catch (error) {
            console.error('Failed to load portfolios from Supabase:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const storedReviews = localStorage.getItem('dps_reviews');

        if (storedReviews) {
            try {
                setReviews(JSON.parse(storedReviews));
            } catch (e) {
                console.error("Failed to parse reviews", e);
            }
        }

        loadPortfolios();
        loadOpportunities();

        // Keep dashboards in sync when another role updates portfolio scores/content.
        const pollId = setInterval(() => {
            loadPortfolios();
            loadOpportunities();
        }, 10000);

        return () => {
            clearInterval(pollId);
        };
    }, [loadOpportunities, loadPortfolios]);

    useEffect(() => {
        localStorage.setItem('dps_templates', JSON.stringify(templates));
    }, [templates]);

    const savePortfolio = async (studentId, data) => {
        if (!studentId) throw new Error('Missing student id.');
        const existing = portfolios[studentId] || {};
        const existingMeta = existing?.meta && typeof existing.meta === 'object' ? existing.meta : {};
        const incomingMeta = data?.meta && typeof data.meta === 'object' ? data.meta : {};
        const mergedMeta = {
            ...existingMeta,
            ...incomingMeta,
        };

        const normalized = {
            studentId,
            about:
                data?.about !== undefined
                    ? data.about || ''
                    : (existing.about || ''),
            skills:
                data?.skills !== undefined
                    ? (Array.isArray(data?.skills) ? data.skills : [])
                    : (Array.isArray(existing.skills) ? existing.skills : []),
            projects:
                data?.projects !== undefined
                    ? (Array.isArray(data?.projects) ? data.projects : [])
                    : (Array.isArray(existing.projects) ? existing.projects : []),
            certifications:
                data?.certifications !== undefined
                    ? (Array.isArray(data?.certifications) ? data.certifications : [])
                    : (Array.isArray(existing.certifications) ? existing.certifications : []),
            meta: mergedMeta,
            familyIncome:
                data?.familyIncome !== undefined
                    ? data.familyIncome
                    : (existing.familyIncome ?? ''),
            currentGpa:
                data?.currentGpa !== undefined
                    ? data.currentGpa
                    : (existing.currentGpa ?? ''),
            templateId:
                data?.templateId !== undefined
                    ? (data.templateId || 'modern')
                    : (existing.templateId || 'modern'),
            score: data?.score !== undefined ? data.score : (existing.score ?? ''),
            facultyFeedback:
                data?.facultyFeedback !== undefined
                    ? data.facultyFeedback
                    : (existing.facultyFeedback ?? ''),
            lastUpdated: new Date().toISOString(),
        };

        const sanitizedMeta = normalized.meta && typeof normalized.meta === 'object'
            ? {
                ...normalized.meta,
                templatePageCopies: [],
            }
            : {};

        const payload = {
            about: normalized.about,
            skills: normalized.skills,
            projects: normalized.projects,
            certifications: normalized.certifications,
            meta: sanitizedMeta,
            family_income: normalized.familyIncome === '' ? null : normalized.familyIncome,
            current_gpa: normalized.currentGpa === '' ? null : normalized.currentGpa,
            template_id: normalized.templateId,
            score: normalized.score === '' ? null : normalized.score,
            faculty_feedback: normalized.facultyFeedback || '',
            last_updated: normalized.lastUpdated,
        };

        const payloadSize = new Blob([JSON.stringify(payload)]).size;
        if (payloadSize > 500_000) {
            console.warn(`Large portfolio payload detected: ${payloadSize} bytes`);
        }

        const stripUnsupportedColumns = (currentPayload, error) => {
            const message = String(error?.message || '');
            const nextPayload = { ...currentPayload };
            let changed = false;

            if (message.includes('column "meta"') || message.includes("Could not find the 'meta' column")) {
                delete nextPayload.meta;
                changed = true;
            }

            if (
                message.includes('column "faculty_feedback"')
                || message.includes("Could not find the 'faculty_feedback' column")
            ) {
                delete nextPayload.faculty_feedback;
                changed = true;
            }

            if (
                message.includes('column "family_income"')
                || message.includes("Could not find the 'family_income' column")
            ) {
                delete nextPayload.family_income;
                changed = true;
            }

            if (
                message.includes('column "current_gpa"')
                || message.includes("Could not find the 'current_gpa' column")
            ) {
                delete nextPayload.current_gpa;
                changed = true;
            }

            return changed ? nextPayload : null;
        };

        const executeWithTimeout = async (builder, label, timeoutMs = 20000) => {
            const controller = new AbortController();
            const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

            try {
                return await builder.abortSignal(controller.signal);
            } catch (error) {
                if (error?.name === 'AbortError' || error?.code === 'ABORT_ERR') {
                    throw new Error(`${label} timed out after ${Math.round(timeoutMs / 1000)}s. Please try again.`);
                }
                throw error;
            } finally {
                window.clearTimeout(timeoutId);
            }
        };

        const persistPortfolio = async (currentPayload) => {
            const rowPayload = {
                student_id: normalized.studentId,
                ...currentPayload,
            };

            const attempt = await executeWithTimeout(
                supabase
                .from('portfolios')
                .upsert(rowPayload, { onConflict: 'student_id' }),
                'Portfolio save'
            );

            if (!attempt.error) return currentPayload;

            const fallbackPayload = stripUnsupportedColumns(currentPayload, attempt.error);
            if (!fallbackPayload) throw attempt.error;

            console.warn('Retrying portfolio upsert without unsupported columns:', attempt.error.message);

            const retry = await executeWithTimeout(
                supabase
                    .from('portfolios')
                    .upsert(
                        {
                            student_id: normalized.studentId,
                            ...fallbackPayload,
                        },
                        { onConflict: 'student_id' }
                    ),
                'Portfolio save retry'
            );

            if (retry.error) throw retry.error;
            return fallbackPayload;
        };

        await persistPortfolio(payload);

        setPortfolios((prev) => ({
            ...prev,
            [studentId]: normalized,
        }));
    };

    const addReview = (review) => {
        const updated = [...reviews, { ...review, id: Date.now().toString(), date: new Date().toISOString() }];
        setReviews(updated);
        localStorage.setItem('dps_reviews', JSON.stringify(updated));
    };

    const getStudentPortfolio = (studentId) => {
        if (!studentId) return null;

        // Demo portfolios for viewing templates without entering data
        if (typeof studentId === 'string' && studentId.startsWith('demo-')) {
            const templateKey = studentId.replace('demo-', '');

            const base = {
                studentId,
                about: 'I am a B.Tech student passionate about building modern web applications and solving real-world problems through code.',
                skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Git'],
                projects: [
                    {
                        title: 'Online Voting System',
                        desc: 'A secure web-based voting platform built with React and Node.js, featuring user authentication and real-time result dashboards.',
                        tech: 'React, Node.js, Express, MongoDB',
                        year: '2025',
                        image: '',
                    },
                    {
                        title: 'Smart Attendance Tracker',
                        desc: 'Face-recognition-based attendance system integrated with a simple admin dashboard for report generation.',
                        tech: 'Python, OpenCV, Flask, SQLite',
                        year: '2024',
                        image: '',
                    },
                ],
                certifications: [
                    { name: 'AWS Academy Cloud Foundations', issuer: 'Amazon Web Services' },
                    { name: 'Responsive Web Design', issuer: 'freeCodeCamp' },
                ],
                meta: {
                    fullName: 'Demo Student',
                    role: 'B.Tech CSE Student',
                    education: 'B.Tech in Computer Science and Engineering',
                    educationYears: '2022 - 2026',
                    college: 'Your College Name',
                    experience: 'Summer Intern - Web Developer',
                    experienceYears: 'Jun 2025 - Aug 2025',
                    company: 'TechCorp Labs',
                    contactEmail: 'demo.student@example.com',
                    linkedinUrl: 'https://www.linkedin.com/in/demo-student',
                    githubUrl: 'https://github.com/demo-student',
                    heroImage: '',
                    profileImage: '',
                },
                familyIncome: '',
                currentGpa: '',
                templateId: templateKey,
                score: '',
                facultyFeedback: 'Demo feedback from faculty will appear here in the real portfolio.',
                lastUpdated: new Date().toISOString(),
            };

            return base;
        }

        return portfolios[studentId] || null;
    };

    const getAllPortfolios = () => Object.entries(portfolios).map(([id, data]) => ({ studentId: id, ...data }));

    const getTemplateById = (templateId) => templates.find((template) => template.id === templateId) || null;

    const saveTemplateConfig = async (template) => {
        const normalized = normalizeTemplateConfig(template);
        if (!normalized) throw new Error('Template id is required.');

        setTemplateConfigs((prev) => {
            const next = prev.filter((item) => item.id !== normalized.id);
            next.push(normalized);
            return next.sort((a, b) => a.name.localeCompare(b.name));
        });

        return normalized;
    };

    const deleteTemplateConfig = async (templateId) => {
        const target = String(templateId || '').trim();
        if (!target) return;
        setTemplateConfigs((prev) => prev.filter((item) => item.id !== target));
    };

    const getPortfolioCompletion = (portfolio) => {
        if (!portfolio) {
            return {
                percentage: 0,
                completedCount: 0,
                totalCount: 5,
                criteria: [
                    { key: 'about', label: 'About section', completed: false },
                    { key: 'skills', label: 'Skills added', completed: false },
                    { key: 'projects', label: 'Projects added', completed: false },
                    { key: 'certifications', label: 'Certifications added', completed: false },
                    { key: 'profileDetails', label: 'Profile details added', completed: false },
                ],
            };
        }

        const meta = portfolio?.meta && typeof portfolio.meta === 'object' ? portfolio.meta : {};
        const criteria = [
            {
                key: 'about',
                label: 'About section',
                completed: Boolean(portfolio.about && portfolio.about.trim().length >= 50),
            },
            {
                key: 'skills',
                label: 'Skills added',
                completed: Array.isArray(portfolio.skills) && portfolio.skills.length > 0,
            },
            {
                key: 'projects',
                label: 'Projects added',
                completed: Array.isArray(portfolio.projects) && portfolio.projects.length > 0,
            },
            {
                key: 'certifications',
                label: 'Certifications added',
                completed: Array.isArray(portfolio.certifications) && portfolio.certifications.length > 0,
            },
            {
                key: 'profileDetails',
                label: 'Profile details added',
                completed: Boolean(
                    (meta.fullName && String(meta.fullName).trim())
                    || (meta.role && String(meta.role).trim())
                    || (meta.contactEmail && String(meta.contactEmail).trim())
                ),
            },
        ];

        const completedCount = criteria.filter((item) => item.completed).length;
        const totalCount = criteria.length;

        return {
            percentage: Math.round((completedCount / totalCount) * 100),
            completedCount,
            totalCount,
            criteria,
        };
    };

    // Helper for UC2: Suggestions
    const analyzePortfolio = (portfolio) => {
        const suggestions = [];
        if (!portfolio) return ['Portfolio is empty. Please create one.'];

        if (!portfolio.about || portfolio.about.length < 50) suggestions.push('Enhance your "About" section with more details (>50 chars).');
        if (!portfolio.skills || portfolio.skills.length === 0) suggestions.push('Add at least one skill.');
        if (!portfolio.projects || portfolio.projects.length === 0) suggestions.push('Add at least one project to showcase your work.');
        if (!portfolio.certifications || portfolio.certifications.length === 0) suggestions.push('Add certifications to boost credibility.');

        return suggestions;
    };

    return (
        <DataContext.Provider value={{
            portfolios,
            reviews,
            loading,
            opportunities,
            templates,
            users,
            savePortfolio,
            saveTemplateConfig,
            deleteTemplateConfig,
            createOpportunity,
            refreshPortfolios: loadPortfolios,
            refreshOpportunities: loadOpportunities,
            addReview,
            createTemplate,
            updateTemplate,
            removeTemplate,
            getStudentPortfolio,
            getAllPortfolios,
            getTemplateById,
            getPortfolioCompletion,
            analyzePortfolio // Exposed for UC2
        }}>
            {children}
        </DataContext.Provider>
    );
};
