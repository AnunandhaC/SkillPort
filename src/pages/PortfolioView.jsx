import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useData } from '../context/DataProvider';
import { Github, Linkedin, Mail, Menu, X, ChevronUp } from 'lucide-react';

const PortfolioView = ({ portfolioOverride = null, editable = false, onPortfolioChange = null, hideFooterBadge = false, suppressTemplateCopies = false, exportMode = false, editorScopeId = '' }) => {
    const { id } = useParams();
    const location = useLocation();
    const { getStudentPortfolio, getTemplateById, loading } = useData();
    const normalizeText = (value, fallback = '') => {
        if (typeof value === 'string') return value;
        if (value === null || value === undefined) return fallback;
        return String(value);
    };

    const normalizeProject = (project) => {
        const safeProject = project && typeof project === 'object' ? project : {};
        return {
            ...safeProject,
            title: normalizeText(safeProject.title),
            desc: normalizeText(safeProject.desc),
            tech: normalizeText(safeProject.tech),
            year: normalizeText(safeProject.year),
            image: normalizeText(safeProject.image),
            imageUrl: normalizeText(safeProject.imageUrl),
            repoUrl: normalizeText(safeProject.repoUrl),
            pdfUrl: normalizeText(safeProject.pdfUrl),
            pdfName: normalizeText(safeProject.pdfName),
        };
    };

    const normalizeCertification = (certification) => {
        const safeCertification = certification && typeof certification === 'object' ? certification : {};
        return {
            ...safeCertification,
            name: normalizeText(safeCertification.name),
            issuer: normalizeText(safeCertification.issuer),
        };
    };

    const normalizeMeta = (meta) => {
        const safeMeta = meta && typeof meta === 'object' ? meta : {};
        const stringKeys = [
            'fullName', 'role', 'education', 'educationYears', 'experience', 'experienceYears',
            'college', 'company', 'contactEmail', 'linkedinUrl', 'githubUrl', 'heroImage',
            'profileImage', 'greetingText', 'aboutHeading', 'workHeading', 'contactHeading',
            'contactLead', 'uniconsProjectNote', 'uniconsFooterText',
        ];
        const normalized = { ...safeMeta };

        stringKeys.forEach((key) => {
            normalized[key] = normalizeText(safeMeta[key]);
        });

        normalized.templateStyle = safeMeta.templateStyle && typeof safeMeta.templateStyle === 'object'
            ? {
                ...safeMeta.templateStyle,
                fontFamily: normalizeText(safeMeta.templateStyle.fontFamily, 'default'),
                textScale: Number(safeMeta.templateStyle.textScale || 100),
            }
            : { fontFamily: 'default', textScale: 100 };

        normalized.templatePageCopies = Array.isArray(safeMeta.templatePageCopies)
            ? safeMeta.templatePageCopies.filter((item) => item && typeof item === 'object')
            : [];

        normalized.templatePages = Array.isArray(safeMeta.templatePages)
            ? safeMeta.templatePages
                .filter((item) => item && typeof item === 'object')
                .map((item) => ({
                    ...item,
                    title: normalizeText(item.title),
                    content: normalizeText(item.content),
                    image: normalizeText(item.image),
                }))
            : [];

        return normalized;
    };

    const normalizePortfolio = (source, studentIdOverride = undefined) => {
        if (!source || typeof source !== 'object') return null;

        return {
            ...source,
            studentId: normalizeText(source.studentId || studentIdOverride),
            about: normalizeText(source.about),
            skills: Array.isArray(source.skills) ? source.skills.map((skill) => normalizeText(skill)).filter(Boolean) : [],
            projects: Array.isArray(source.projects) ? source.projects.map(normalizeProject) : [],
            certifications: Array.isArray(source.certifications) ? source.certifications.map(normalizeCertification) : [],
            meta: normalizeMeta(source.meta),
            templateId: typeof source.templateId === 'string' && source.templateId.trim() ? source.templateId : 'modern',
        };
    };

    let portfolio = normalizePortfolio(portfolioOverride || getStudentPortfolio(id), id);
    const isEditable = Boolean(editable && typeof onPortfolioChange === 'function');
    const isPreviewMode = (() => {
        if (portfolioOverride) return false;
        try {
            return new URLSearchParams(location.search).get('preview') === '1';
        } catch {
            return false;
        }
    })();
    const isDownloadMode = (() => {
        try {
            return new URLSearchParams(location.search).get('download') === '1';
        } catch {
            return false;
        }
    })();

    if (isPreviewMode && id) {
        try {
            const cached = localStorage.getItem(`dps_preview_draft_${id}`);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed && typeof parsed === 'object') {
                    portfolio = normalizePortfolio({
                        ...(portfolio || {}),
                        ...parsed,
                        studentId: id,
                    }, id);
                }
            }
            const configRaw = localStorage.getItem(`dps_preview_template_config_${id}`);
            if (configRaw) {
                const parsedConfig = JSON.parse(configRaw);
                if (parsedConfig && typeof parsedConfig === 'object') {
                    previewTemplateConfig = parsedConfig;
                }
            }
        } catch (e) {
            console.warn('Failed to load preview draft:', e);
        }
    }

    const isLoadingPortfolio = !portfolioOverride && loading;
    const isMissingPortfolio = !portfolio;
    portfolio = portfolio || {
        studentId: normalizeText(id),
        about: '',
        skills: [],
        projects: [],
        certifications: [],
        meta: normalizeMeta({}),
        templateId: 'modern',
    };

    const { about, skills, projects, certifications, templateId } = portfolio;
    const globalMeta = portfolio.meta && typeof portfolio.meta === 'object' ? portfolio.meta : {};
    const templateConfig = getTemplateById(templateId);
    const sectionVisibility = {
        about: true,
        skills: true,
        projects: true,
        certifications: true,
        services: true,
        qualification: true,
        testimonials: true,
        testimonial: true,
        contact: true,
        extraPages: true,
        ...(templateConfig?.defaultSectionVisibility || {}),
        ...(globalMeta.sectionVisibility || {}),
    };
    const showSection = (key) => sectionVisibility[key] !== false;
    const builtInSectionKeys = new Set([
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
    const customSectionLabels = globalMeta?.customSectionLabels || {};
    const templateCustomSections = (Array.isArray(currentTemplate?.sections) ? currentTemplate.sections : [])
        .filter((section) => section?.key && !builtInSectionKeys.has(section.key))
        .map((section) => ({
            key: String(section.key),
            label: String(customSectionLabels?.[String(section.key)] || section.label || section.key),
        }));
    const metaCustomSections = Object.keys(globalMeta?.customSections || {})
        .filter((key) => key && !builtInSectionKeys.has(key))
        .map((key) => ({
            key,
            label: String(customSectionLabels?.[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())),
        }));
    const customTemplateSections = [...templateCustomSections, ...metaCustomSections]
        .reduce((acc, section) => {
            if (acc.some((s) => s.key === section.key)) return acc;
            acc.push(section);
            return acc;
        }, [])
        .filter((section) => showSection(section.key));
    const templateStyle = portfolio?.meta?.templateStyle || {};
    const templatePages = Array.isArray(portfolio?.meta?.templatePages) ? portfolio.meta.templatePages : [];
    const fontFamilyMap = {
        default: undefined,
        poppins: "'Poppins', 'Segoe UI', sans-serif",
        merriweather: "'Merriweather', Georgia, serif",
        'fira-sans': "'Fira Sans', 'Segoe UI', sans-serif",
        playfair: "'Playfair Display', Georgia, serif",
    };
    const pageStyle = {
        fontFamily: fontFamilyMap[templateStyle.fontFamily] || undefined,
        fontSize: `${(Number(templateStyle.textScale || 100) / 100).toFixed(2)}em`,
    };

    useEffect(() => {
        const css = [
            showSection('about') ? '' : '#about,.about.section{display:none !important;}',
            showSection('skills') ? '' : '#skills,.skills.section{display:none !important;}',
            showSection('projects') ? '' : '#portfolio,#work,#projects-section,.portfolio.section{display:none !important;}',
            showSection('certifications') ? '' : '.certifications.section,.awards.section{display:none !important;}',
            showSection('qualification') ? '' : '.qualification.section{display:none !important;}',
            showSection('services') ? '' : '.services.section{display:none !important;}',
            showSection('testimonials') ? '' : '.testimonial.section{display:none !important;}',
            showSection('contact') ? '' : '#contact,.contact.section{display:none !important;}',
            'footer,.footer{display:none !important;}',
            '.dps-extra-page header:first-of-type{display:none !important;}',
            '.dps-extra-page #home{display:none !important;}',
            '.dps-extra-page section:first-of-type{display:none !important;}',
        ].join('\n');

        const id = 'dps-section-visibility-style';
        let styleEl = document.getElementById(id);
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = id;
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = css;

        // Fallback: hide sections by heading keywords for templates without semantic ids/classes.
        const scope = (editorScopeId && document.getElementById(editorScopeId)) || document;
        const sections = Array.from(scope.querySelectorAll('section'));
        sections.forEach((sec) => {
            if (sec.dataset.dpsHiddenByFilter === '1') {
                sec.style.display = '';
                delete sec.dataset.dpsHiddenByFilter;
            }
        });

        const headingText = (sec) => {
            const h = sec.querySelector('h1,h2,h3,h4,h5,h6');
            return String(h?.textContent || '').trim().toLowerCase();
        };

        const hideWhere = (predicate) => {
            sections.forEach((sec) => {
                if (predicate(sec)) {
                    sec.style.display = 'none';
                    sec.dataset.dpsHiddenByFilter = '1';
                }
            });
        };

        if (!showSection('about')) {
            hideWhere((sec) => /\babout\b/.test(headingText(sec)));
        }
        if (!showSection('skills')) {
            hideWhere((sec) => /(skills?|expertise|tech stack|tools)/.test(headingText(sec)));
        }
        if (!showSection('projects')) {
            hideWhere((sec) => /(projects?|portfolio|selected works|work|timeline)/.test(headingText(sec)));
        }
        if (!showSection('certifications')) {
            hideWhere((sec) => /(certifications?|awards|recognition)/.test(headingText(sec)));
        }
        if (!showSection('qualification')) {
            hideWhere((sec) => /(qualification|education|experience)/.test(headingText(sec)));
        }
        if (!showSection('services')) {
            hideWhere((sec) => /\bservices?\b/.test(headingText(sec)));
        }
        if (!showSection('testimonials')) {
            hideWhere((sec) => /(testimonial|feedback)/.test(headingText(sec)));
        }
        if (!showSection('contact')) {
            hideWhere((sec) => /(contact|reach me)/.test(headingText(sec)));
        }
        const customHiddenKeys = Object.entries(sectionVisibility)
            .filter(([key, visible]) =>
                visible === false
                && !['about', 'skills', 'projects', 'certifications', 'qualification', 'services', 'testimonials', 'testimonial', 'contact'].includes(key)
            )
            .map(([key]) => key);
        customHiddenKeys.forEach((key) => {
            const keyRegex = new RegExp(`\\b${key.replace(/_/g, '[\\s_-]*')}\\b`, 'i');
            hideWhere((sec) => keyRegex.test(headingText(sec)));
        });

        return () => {
            const existing = document.getElementById(id);
            if (existing) existing.remove();
            sections.forEach((sec) => {
                if (sec.dataset.dpsHiddenByFilter === '1') {
                    sec.style.display = '';
                    delete sec.dataset.dpsHiddenByFilter;
                }
            });
        };
    }, [
        templateId,
        sectionVisibility.about,
        sectionVisibility.skills,
        sectionVisibility.projects,
        sectionVisibility.certifications,
        sectionVisibility.services,
        sectionVisibility.qualification,
        sectionVisibility.testimonials,
        sectionVisibility.testimonial,
        sectionVisibility.contact,
        sectionVisibility.portfolio,
        sectionVisibility.project,
        sectionVisibility.extraPages,
        editorScopeId,
    ]);

    useEffect(() => {
        const id = 'dps-template-accent-style';
        let styleEl = document.getElementById(id);
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = id;
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = `
            .text-blue-700,.text-blue-600,.text-blue-500,.text-blue-400,.text-blue-300,.text-cyan-300 {
                color: ${accentColor} !important;
            }
            .text-\\[\\#7372dd\\],.text-\\[\\#6261d2\\],.text-\\[\\#0077b5\\] {
                color: ${accentColor} !important;
            }
            .bg-blue-600,.bg-blue-500,.bg-indigo-600,.bg-cyan-600 {
                background-color: ${accentColor} !important;
            }
            .bg-\\[\\#7372dd\\],.bg-\\[\\#6261d2\\],.bg-\\[\\#0077b5\\] {
                background-color: ${accentColor} !important;
            }
            .from-\\[\\#7372dd\\],.to-\\[\\#7372dd\\],.from-\\[\\#6261d2\\],.to-\\[\\#6261d2\\] {
                --tw-gradient-from: ${accentColor} var(--tw-gradient-from-position) !important;
                --tw-gradient-to: ${accentColor} var(--tw-gradient-to-position) !important;
            }
            .border-blue-600,.border-blue-500,.border-blue-400,.border-blue-300 {
                border-color: ${accentColor} !important;
            }
            .border-\\[\\#7372dd\\],.border-\\[\\#6261d2\\],.border-\\[\\#0077b5\\] {
                border-color: ${accentColor} !important;
            }
            a:hover {
                color: ${accentColor} !important;
            }
        `;
        return () => {
            const existing = document.getElementById(id);
            if (existing) existing.remove();
        };
    }, [accentColor]);

    useEffect(() => {
        const isHexColor = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(backgroundColor);
        if (!isHexColor) return undefined;

        const scope = (editorScopeId && document.getElementById(editorScopeId)) || document;
        const roots = Array.from(scope.querySelectorAll('.min-h-screen'));
        const touched = [];

        roots.forEach((root) => {
            const el = root;
            touched.push({ el, prev: el.style.backgroundColor });
            el.style.backgroundColor = backgroundColor;
        });

        return () => {
            touched.forEach(({ el, prev }) => {
                el.style.backgroundColor = prev || '';
            });
        };
    }, [backgroundColor, templateId, isEditable, editorScopeId]);

    useEffect(() => {
        if (!isDownloadMode) return undefined;
        const timer = window.setTimeout(() => {
            window.print();
        }, 500);
        const closeTimer = window.setTimeout(() => {
            window.close();
        }, 1200);
        return () => {
            window.clearTimeout(timer);
            window.clearTimeout(closeTimer);
        };
    }, [isDownloadMode]);

    const commitRoot = (key, value) => {
        if (!isEditable) return;
        onPortfolioChange((prev) => ({ ...prev, [key]: value }));
    };

    const commitMeta = (key, value) => {
        if (!isEditable) return;
        onPortfolioChange((prev) => ({ ...prev, meta: { ...(prev.meta || {}), [key]: value } }));
    };

    const setSectionVisibilityInline = (key, visible) => {
        if (!isEditable) return;
        onPortfolioChange((prev) => ({
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

    const commitProject = (index, key, value) => {
        if (!isEditable) return;
        onPortfolioChange((prev) => {
            const nextProjects = Array.isArray(prev.projects) ? [...prev.projects] : [];
            nextProjects[index] = { ...(nextProjects[index] || {}), [key]: value };
            return { ...prev, projects: nextProjects };
        });
    };

    const addProjectItem = (item) => {
        if (!isEditable) return;
        onPortfolioChange((prev) => ({
            ...prev,
            projects: [...(Array.isArray(prev.projects) ? prev.projects : []), item],
        }));
    };

    const removeProjectItem = (index) => {
        if (!isEditable) return;
        onPortfolioChange((prev) => ({
            ...prev,
            projects: (Array.isArray(prev.projects) ? prev.projects : []).filter((_, i) => i !== index),
        }));
    };

    const updateWorkHighlightItem = (index, patch) => {
        if (!isEditable) return;
        onPortfolioChange((prev) => {
            const list = Array.isArray(prev?.meta?.workHighlights) ? [...prev.meta.workHighlights] : [];
            list[index] = { ...(list[index] || {}), ...patch };
            return { ...prev, meta: { ...(prev.meta || {}), workHighlights: list } };
        });
    };

    const addWorkHighlightItem = (item = { title: 'New Highlight', text: 'Describe this work item.' }) => {
        if (!isEditable) return;
        onPortfolioChange((prev) => ({
            ...prev,
            meta: {
                ...(prev.meta || {}),
                workHighlights: [...(Array.isArray(prev?.meta?.workHighlights) ? prev.meta.workHighlights : []), item],
            },
        }));
    };

    const removeWorkHighlightItem = (index) => {
        if (!isEditable) return;
        onPortfolioChange((prev) => ({
            ...prev,
            meta: {
                ...(prev.meta || {}),
                workHighlights: (Array.isArray(prev?.meta?.workHighlights) ? prev.meta.workHighlights : []).filter((_, i) => i !== index),
            },
        }));
    };

    const setSkillsList = (nextSkills) => {
        if (!isEditable) return;
        onPortfolioChange((prev) => ({ ...prev, skills: nextSkills }));
    };

    const updateSkillItem = (index, value) => {
        const current = Array.isArray(skills) ? [...skills] : [];
        current[index] = value;
        setSkillsList(current);
    };

    const addSkillItem = (label = 'New Skill') => {
        const next = [...(Array.isArray(skills) ? skills : []), label];
        setSkillsList(next);
    };

    const removeSkillItem = (index) => {
        const next = (Array.isArray(skills) ? skills : []).filter((_, i) => i !== index);
        setSkillsList(next);
    };

    const updateMetaListItem = (key, index, patch) => {
        if (!isEditable) return;
        onPortfolioChange((prev) => {
            const list = Array.isArray(prev?.meta?.[key]) ? [...prev.meta[key]] : [];
            list[index] = { ...(list[index] || {}), ...patch };
            return { ...prev, meta: { ...(prev.meta || {}), [key]: list } };
        });
    };

    const addMetaListItem = (key, item) => {
        if (!isEditable) return;
        onPortfolioChange((prev) => ({
            ...prev,
            meta: {
                ...(prev.meta || {}),
                [key]: [...(Array.isArray(prev?.meta?.[key]) ? prev.meta[key] : []), item],
            },
        }));
    };

    const removeMetaListItem = (key, index) => {
        if (!isEditable) return;
        onPortfolioChange((prev) => ({
            ...prev,
            meta: {
                ...(prev.meta || {}),
                [key]: (Array.isArray(prev?.meta?.[key]) ? prev.meta[key] : []).filter((_, i) => i !== index),
            },
        }));
    };

    const addSkillGlobal = () => {
        if (!isEditable) return;
        const value = window.prompt('Add skill');
        const clean = String(value || '').trim();
        if (!clean) return;
        onPortfolioChange((prev) => ({
            ...prev,
            skills: [...(Array.isArray(prev.skills) ? prev.skills : []), clean],
        }));
    };

    const updateCertificationItem = (index, key, value) => {
        if (!isEditable) return;
        onPortfolioChange((prev) => {
            const nextCertifications = Array.isArray(prev.certifications) ? [...prev.certifications] : [];
            nextCertifications[index] = { ...(nextCertifications[index] || {}), [key]: value };
            return { ...prev, certifications: nextCertifications };
        });
    };

    const addProjectGlobal = () => {
        if (!isEditable) return;
        onPortfolioChange((prev) => ({
            ...prev,
            projects: [
                ...(Array.isArray(prev.projects) ? prev.projects : []),
                {
                    title: `Project ${(Array.isArray(prev.projects) ? prev.projects.length : 0) + 1}`,
                    desc: 'Edit project description',
                    tech: '',
                    year: '',
                    image: '',
                    repoUrl: '',
                    pdfUrl: '',
                },
            ],
        }));
    };

    const addCertificationGlobal = () => {
        if (!isEditable) return;
        onPortfolioChange((prev) => ({
            ...prev,
            certifications: [
                ...(Array.isArray(prev.certifications) ? prev.certifications : []),
                { name: 'New Certification', issuer: 'Issuer' },
            ],
        }));
    };

    const updateTemplatePage = (index, patch) => {
        if (!isEditable) return;
        onPortfolioChange((prev) => {
            const nextPages = Array.isArray(prev?.meta?.templatePages) ? [...prev.meta.templatePages] : [];
            nextPages[index] = { ...(nextPages[index] || {}), ...patch };
            return {
                ...prev,
                meta: {
                    ...(prev.meta || {}),
                    templatePages: nextPages,
                },
            };
        });
    };

    const removeTemplatePage = (index) => {
        if (!isEditable) return;
        onPortfolioChange((prev) => ({
            ...prev,
            meta: {
                ...(prev.meta || {}),
                templatePages: (Array.isArray(prev?.meta?.templatePages) ? prev.meta.templatePages : []).filter((_, i) => i !== index),
            },
        }));
    };

    const EditableText = ({ as = 'span', className = '', value = '', placeholder = '', onCommit }) => {
        const Tag = as;
        if (!isEditable || typeof onCommit !== 'function') {
            return <Tag className={className}>{value || placeholder}</Tag>;
        }

        const elementRef = useRef(null);
        const isEditingRef = useRef(false);

        useEffect(() => {
            const nextValue = String(value || '');
            if (isEditingRef.current) return;

            if (!elementRef.current) return;

            const nextDisplay = nextValue || placeholder;
            if (elementRef.current.textContent !== nextDisplay) {
                elementRef.current.textContent = nextDisplay;
            }
        }, [value, placeholder]);

        const commit = (text) => {
            const nextValue = String(text || '');
            onCommit(nextValue);
        };

        return (
            <Tag
                ref={elementRef}
                contentEditable
                suppressContentEditableWarning
                onFocus={(e) => {
                    isEditingRef.current = true;
                    if (!String(value || '') && e.currentTarget.textContent === placeholder) {
                        e.currentTarget.textContent = '';
                    }
                }}
                onBlur={(e) => {
                    isEditingRef.current = false;
                    commit(e.currentTarget.textContent || '');
                }}
                onKeyDown={(e) => {
                    if ((e.key === 'Enter' && !e.shiftKey) || e.key === 'Escape') {
                        e.preventDefault();
                        e.currentTarget.blur();
                    }
                }}
                className={`${className} outline-none rounded px-1 -mx-1 hover:bg-black/10`}
            >
                {value || placeholder}
            </Tag>
        );
    };

    // Tiny "Made with" banner
    const Footer = () => (
        <>
            {customTemplateSections.length > 0 && (
                <section className="mx-auto mt-10 max-w-6xl space-y-4 px-6">
                    {customTemplateSections.map((section) => {
                        const sectionKey = String(section.key);
                        const sectionLabel = String(section.label || sectionKey).trim() || sectionKey;
                        const content = String(globalMeta?.customSections?.[sectionKey] || '');
                        return (
                            <article
                                key={sectionKey}
                                id={sectionKey}
                                className="rounded-2xl border border-slate-300 bg-white p-6 text-slate-800 shadow-sm"
                            >
                                <EditableText
                                    as="h3"
                                    className="text-xl font-semibold"
                                    value={sectionLabel}
                                    placeholder="Section Title"
                                    onCommit={(value) => {
                                        if (!isEditable) return;
                                        onPortfolioChange((prev) => ({
                                            ...prev,
                                            meta: {
                                                ...(prev.meta || {}),
                                                customSectionLabels: {
                                                    ...(prev?.meta?.customSectionLabels || {}),
                                                    [sectionKey]: String(value || '').trim() || sectionLabel,
                                                },
                                            },
                                        }));
                                    }}
                                />
                                <EditableText
                                    as="p"
                                    className="mt-3 text-sm text-slate-700"
                                    value={content}
                                    placeholder={`Add ${sectionLabel} content`}
                                    onCommit={(value) => {
                                        if (!isEditable) return;
                                        onPortfolioChange((prev) => ({
                                            ...prev,
                                            meta: {
                                                ...(prev.meta || {}),
                                                customSections: {
                                                    ...(prev?.meta?.customSections || {}),
                                                    [sectionKey]: value,
                                                },
                                            },
                                        }));
                                    }}
                                />
                                {isEditable && (
                                    <button
                                        type="button"
                                        data-dps-no-inline-edit="1"
                                        className="mt-3 text-xs text-red-600 hover:text-red-500"
                                        onClick={() => {
                                            onPortfolioChange((prev) => {
                                                const nextCustom = { ...(prev?.meta?.customSections || {}) };
                                                delete nextCustom[sectionKey];
                                                return {
                                                    ...prev,
                                                    meta: {
                                                        ...(prev.meta || {}),
                                                        customSections: nextCustom,
                                                        sectionVisibility: {
                                                            ...(prev?.meta?.sectionVisibility || {}),
                                                            [sectionKey]: false,
                                                        },
                                                    },
                                                };
                                            });
                                        }}
                                    >
                                        Remove Section
                                    </button>
                                )}
                            </article>
                        );
                    })}
                </section>
            )}
            {!suppressTemplateCopies && <TemplateExtraPages />}
            {!hideFooterBadge && (
                null
            )}
        </>
    );

    useEffect(() => {
        if (!isEditable || exportMode) return undefined;

        const matches = {
            skills: /(skills?|expertise|tech stack|tools)/i,
            projects: /(projects?|portfolio|selected works|work|timeline)/i,
            certifications: /(certifications?|awards|recognition)/i,
        };

        const actions = {
            skills: addSkillGlobal,
            projects: addProjectGlobal,
            certifications: addCertificationGlobal,
        };

        const labels = {
            skills: '+ Skill',
            projects: '+ Project',
            certifications: '+ Certification',
        };

        const injected = [];
        const scope = (editorScopeId && document.getElementById(editorScopeId)) || document;
        const sections = Array.from(scope.querySelectorAll('section'));
        sections.forEach((section) => {
            const heading = section.querySelector('h1,h2,h3,h4,h5,h6');
            if (!heading) return;
            const text = String(heading.textContent || '').trim();
            if (!text) return;

            const key = Object.keys(matches).find((k) => matches[k].test(text));
            if (!key) return;
            if (heading.dataset.dpsInlineAdd === '1') return;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = labels[key];
            btn.className = 'dps-inline-add-btn';
            btn.style.marginLeft = '8px';
            btn.style.padding = '2px 8px';
            btn.style.borderRadius = '999px';
            btn.style.fontSize = '12px';
            btn.style.fontWeight = '600';
            btn.style.border = '1px solid rgba(37,99,235,0.35)';
            btn.style.background = 'rgba(37,99,235,0.1)';
            btn.style.color = '#2563eb';
            btn.style.cursor = 'pointer';
            btn.addEventListener('click', actions[key]);

            const wrap = document.createElement('span');
            wrap.style.display = 'inline-flex';
            wrap.style.alignItems = 'center';
            wrap.appendChild(btn);
            heading.appendChild(wrap);
            heading.dataset.dpsInlineAdd = '1';

            injected.push({ heading, btn, wrap, key });
        });

        return () => {
            injected.forEach(({ heading, btn, wrap, key }) => {
                btn.removeEventListener('click', actions[key]);
                if (wrap.parentElement) wrap.parentElement.removeChild(wrap);
                if (heading) delete heading.dataset.dpsInlineAdd;
            });
        };
    }, [isEditable, exportMode, templateId, projects?.length, skills?.length, certifications?.length]);

    const getProjectImage = (p) => p?.image || p?.imageUrl || '';
    const ProjectAttachments = ({ p, dark = false, showImage = true }) => {
        const image = getProjectImage(p);
        const textClass = dark ? 'text-slate-300' : 'text-slate-600';
        const linkClass = dark ? 'text-cyan-300 hover:text-cyan-200' : 'text-blue-700 hover:text-blue-600';

        return (
            <div className="mt-3 space-y-2">
                {p?.repoUrl && (
                    <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className={`block text-xs break-all underline ${linkClass}`}>
                        Repo: {p.repoUrl}
                    </a>
                )}
                {p?.pdfUrl && (
                    <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" className={`block text-xs break-all underline ${linkClass}`}>
                        PDF: {p.pdfName || 'Open project PDF'}
                    </a>
                )}
                {showImage && image ? (
                    <img src={image} alt={p?.title || 'Project'} className="w-full h-48 object-cover rounded-xl border border-white/10" />
                ) : showImage ? (
                    <div className={`text-xs ${textClass}`}>No project image added.</div>
                ) : null}
            </div>
        );
    };
    const getExtraPageTheme = () => {
        if (String(templateId || '').startsWith('barch-')) {
            return {
                section: 'bg-[#f4efe8] text-slate-900',
                shell: 'mx-auto max-w-6xl px-6 py-14',
                card: 'overflow-hidden rounded-[2rem] border border-rose-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)]',
                hero: 'border-b border-rose-100 bg-gradient-to-r from-rose-900 via-rose-700 to-orange-500 px-8 py-10 text-white',
                content: 'grid gap-8 px-8 py-8 lg:grid-cols-[1.2fr_0.8fr]',
                title: 'text-3xl md:text-4xl font-black uppercase tracking-[0.16em]',
                text: 'text-base leading-8 text-slate-700',
                badge: 'inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white',
                emptyImage: 'flex min-h-[260px] items-center justify-center rounded-[1.5rem] border border-dashed border-rose-200 bg-rose-50 px-6 text-center text-sm text-rose-500',
            };
        }
        if (templateId === 'btech-cs-unicons') {
            return {
                section: 'bg-[#f7f9fc] text-slate-900',
                shell: 'mx-auto max-w-6xl px-6 py-10',
                card: 'rounded-[2rem] border border-slate-200 bg-white shadow-sm',
                hero: 'border-b border-slate-200 px-8 py-8',
                content: 'grid gap-6 px-8 py-8 lg:grid-cols-[1.1fr_0.9fr]',
                title: 'text-3xl font-bold',
                text: 'text-base leading-8 text-slate-600',
                badge: 'inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700',
                emptyImage: 'flex min-h-[240px] items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 text-center text-sm text-slate-500',
            };
        }
        if (String(templateId || '').startsWith('btech-')) {
            return {
                section: 'bg-slate-950 text-slate-100',
                shell: 'mx-auto max-w-6xl px-6 py-12',
                card: 'overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-slate-900/80 shadow-[0_30px_80px_rgba(8,47,73,0.35)]',
                hero: 'border-b border-cyan-400/20 bg-gradient-to-r from-slate-900 via-cyan-950 to-blue-950 px-8 py-9',
                content: 'grid gap-6 px-8 py-8 lg:grid-cols-[1.1fr_0.9fr]',
                title: 'text-3xl md:text-4xl font-bold text-white',
                text: 'text-base leading-8 text-slate-300',
                badge: 'inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200',
                emptyImage: 'flex min-h-[240px] items-center justify-center rounded-[1.5rem] border border-dashed border-cyan-400/25 bg-slate-950/60 px-6 text-center text-sm text-cyan-200/70',
            };
        }
        if (templateId === 'academic') {
            return {
                section: 'bg-[#f8fafc] text-slate-900',
                shell: 'mx-auto max-w-6xl px-6 py-12',
                card: 'overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm',
                hero: 'border-b border-slate-200 bg-slate-900 px-8 py-9 text-white',
                content: 'grid gap-6 px-8 py-8 lg:grid-cols-[1.15fr_0.85fr]',
                title: 'text-3xl font-bold',
                text: 'text-base leading-8 text-slate-700',
                badge: 'inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200',
                emptyImage: 'flex min-h-[240px] items-center justify-center rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-6 text-center text-sm text-slate-500',
            };
        }
        return {
            section: 'bg-white text-slate-900',
            shell: 'mx-auto max-w-6xl px-6 py-12',
            card: 'overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_25px_60px_rgba(15,23,42,0.08)]',
            hero: 'border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-700 px-8 py-9 text-white',
            content: 'grid gap-6 px-8 py-8 lg:grid-cols-[1.15fr_0.85fr]',
            title: 'text-3xl font-bold',
            text: 'text-base leading-8 text-slate-700',
            badge: 'inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200',
            emptyImage: 'flex min-h-[240px] items-center justify-center rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-6 text-center text-sm text-slate-500',
        };
    };

    const TemplateExtraPages = () => {
        if (suppressTemplateCopies || !showSection('extraPages') || !templatePages.length) return null;

        const theme = getExtraPageTheme();

        return (
            <div>
                {templatePages.map((page, i) => (
                    <section key={`template-page-${i}`} className={theme.section} style={pageStyle}>
                        <div className={theme.shell}>
                            <div className={theme.card}>
                                <div className={theme.hero}>
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="space-y-3">
                                            <span className={theme.badge}>Page {i + 2}</span>
                                            <EditableText
                                                as="h2"
                                                className={theme.title}
                                                value={page?.title}
                                                placeholder={`Page ${i + 2}`}
                                                onCommit={(value) => updateTemplatePage(i, { title: value })}
                                            />
                                        </div>
                                        {isEditable && !exportMode && (
                                            <button
                                                type="button"
                                                onClick={() => removeTemplatePage(i)}
                                                className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-white/10"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className={theme.content}>
                                    <div className="space-y-4">
                                        <EditableText
                                            as="p"
                                            className={theme.text}
                                            value={page?.content}
                                            placeholder="Write the content for this extra page."
                                            onCommit={(value) => updateTemplatePage(i, { content: value })}
                                        />
                                        {isEditable && !exportMode && (
                                            <textarea
                                                value={page?.content || ''}
                                                onChange={(e) => updateTemplatePage(i, { content: e.target.value })}
                                                rows={8}
                                                className="w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        {page?.image ? (
                                            <img
                                                src={page.image}
                                                alt={page?.title || `Page ${i + 2}`}
                                                className="h-full min-h-[240px] w-full rounded-[1.5rem] object-cover"
                                            />
                                        ) : (
                                            <div className={theme.emptyImage}>
                                                Add an image URL to place a visual on this page.
                                            </div>
                                        )}
                                        {isEditable && !exportMode && (
                                            <input
                                                type="text"
                                                value={page?.image || ''}
                                                onChange={(e) => updateTemplatePage(i, { image: e.target.value })}
                                                placeholder="Image URL"
                                                className="w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                ))}
            </div>
        );
    };

    if (isLoadingPortfolio) return <div className="text-white text-center mt-20">Loading portfolio...</div>;
    if (isMissingPortfolio) return <div className="text-white text-center mt-20">Portfolio not found or not published.</div>;

    // Modern Minimal Template
    if (templateId === 'modern') {
        return (
            <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-black selection:text-white">
                <header className="px-6 py-20 max-w-4xl mx-auto">
                    <h1 className="text-6xl font-bold tracking-tighter mb-6">Student Portfolio</h1>
                    <EditableText
                        as="p"
                        className="text-xl text-slate-600 leading-relaxed max-w-2xl"
                        value={about}
                        placeholder="Write your About section here."
                        onCommit={(v) => commitRoot('about', v)}
                    />

                    <div className="flex gap-4 mt-8">
                        <button className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-slate-800 transition">Contact Me</button>
                    </div>
                </header>

                <section className="bg-slate-50 py-20 px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-10">Featured Projects</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {projects.map((p, i) => (
                                <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                                    <EditableText as="h3" className="text-xl font-bold mb-3" value={p.title} placeholder={`Project ${i + 1}`} onCommit={(v) => commitProject(i, 'title', v)} />
                                    <EditableText as="p" className="text-slate-600 mb-4" value={p.desc} placeholder="Describe this project." onCommit={(v) => commitProject(i, 'desc', v)} />
                                    <ProjectAttachments p={p} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-20 px-6 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-10">Skills & Certifications</h2>
                    <div className="flex flex-wrap gap-2 mb-8">
                        {skills && skills.map(s => (
                            <span key={s} className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700 font-medium">{s}</span>
                        ))}
                    </div>
                    <div className="space-y-4">
                        {certifications.map((c, i) => (
                            <div key={i} className="flex items-center justify-between border-b py-4">
                                <span className="font-medium">{c.name}</span>
                                {renderCertificationContent(c)}
                            </div>
                        ))}
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    // Creative Bold Template
    if (templateId === 'creative') {
        return (
            <div className="min-h-screen bg-[#0f0f0f] text-white font-display">
                <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 h-2"></div>
                <header className="px-6 py-24 max-w-5xl mx-auto text-center">
                    <h1 className="text-7xl md:text-9xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
                        HELLO.
                    </h1>
                    <EditableText
                        as="p"
                        className="text-2xl md:text-3xl text-slate-400 font-light max-w-3xl mx-auto"
                        value={about}
                        placeholder="Write your intro here."
                        onCommit={(v) => commitRoot('about', v)}
                    />
                </header>

                <section className="px-6 py-12">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((p, i) => (
                            <div key={i} className="aspect-square bg-slate-900 rounded-3xl p-8 flex flex-col justify-end hover:bg-slate-800 transition cursor-pointer group">
                                <div className="mb-auto">
                                    <span className="text-xs font-mono text-purple-400">0{i + 1}</span>
                                </div>
                                <EditableText as="h3" className="text-3xl font-bold group-hover:text-purple-400 transition" value={p.title} placeholder={`Project ${i + 1}`} onCommit={(v) => commitProject(i, 'title', v)} />
                                <EditableText as="p" className="text-slate-500 mt-2" value={p.desc} placeholder="Describe this project." onCommit={(v) => commitProject(i, 'desc', v)} />
                                <ProjectAttachments p={p} dark />
                            </div>
                        ))}
                    </div>
                </section>

                <section className="py-20 px-6 text-center">
                    <h2 className="text-sm font-mono text-slate-500 mb-8 border-b border-slate-800 inline-block pb-2">EXPERTISE</h2>
                    <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
                        {skills && skills.map(s => (
                            <span key={s} className="px-6 py-3 border border-white/10 rounded-full hover:bg-white hover:text-black transition cursor-default">{s}</span>
                        ))}
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    // BArch Red Studio Template (based on provided reference markup)
    if (templateId === 'barch-red') {
        const meta = portfolio.meta && typeof portfolio.meta === 'object' ? portfolio.meta : {};
        const fullName = meta.fullName || 'Student';
        const firstName = fullName.split(' ')[0] || 'Student';
        const heroImage = meta.heroImage || projects?.[0]?.image || '';
        const profileImage = meta.profileImage || '';
        const contactEmail = meta.contactEmail || 'contact@example.com';
        const linkedinUrl = meta.linkedinUrl || '';
        const skillsText = Array.isArray(skills) ? skills.join(', ') : '';

        const scrollToProjects = () => {
            const section = document.getElementById('projects-section');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };

        return (
            <div className="bg-[#f3f1eb] min-h-screen flex flex-col text-black">
                <div className="flex-grow">
                    <div className="relative w-full overflow-hidden">
                        {heroImage ? (
                            <img
                                src={heroImage}
                                alt={`Hero image for ${fullName}`}
                                className="w-full h-[30vh] sm:h-[40vh] xl:h-[50vh] object-cover block"
                            />
                        ) : (
                            <div className="w-full h-[30vh] sm:h-[40vh] xl:h-[50vh] bg-gradient-to-r from-[#2b2b2b] via-[#505050] to-[#1f1f1f]" />
                        )}

                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4 bg-black/25">
                            <h1 className="text-3xl sm:text-4xl font-normal leading-tight">Portfolio by</h1>
                            <EditableText as="h2" className="text-3xl sm:text-4xl font-normal leading-tight mt-1" value={fullName} placeholder="Your Name" onCommit={(v) => commitMeta('fullName', v)} />
                            <button
                                onClick={scrollToProjects}
                                className="mt-6 bg-black/80 rounded-full px-6 py-2 text-xs sm:text-sm font-semibold tracking-wide"
                            >
                                VIEW WORKS
                            </button>
                            <div className="absolute top-4 left-4 z-20">
                                <div className="font-serif font-bold text-2xl tracking-[0.08em] text-white">{firstName}</div>
                            </div>
                        </div>
                    </div>

                    <section className="bg-[#f3f1eb] px-6 sm:px-12 py-8 sm:py-12 flex flex-col sm:flex-row gap-8 sm:gap-12">
                        <div className="flex-shrink-0 w-40 sm:w-48">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt={`Portrait of ${fullName}`}
                                    className="w-full h-auto object-cover rounded-xl"
                                />
                            ) : (
                                <div className="w-full aspect-square rounded-xl bg-[#d7d0c3] flex items-center justify-center text-4xl font-serif text-[#5a5142]">
                                    {firstName.charAt(0)}
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <h3 className="font-bold text-sm sm:text-base mb-2">ABOUT ME</h3>
                            <EditableText
                                as="p"
                                className="text-xs sm:text-sm max-w-xl leading-relaxed mb-6"
                                value={about}
                                placeholder="An architect who believes in sustainable and minimal design, focusing on functionality and harmony with nature."
                                onCommit={(v) => commitRoot('about', v)}
                            />

                            <div className="flex flex-col sm:flex-row sm:space-x-12 text-xs sm:text-sm font-semibold text-black max-w-xl">
                                <div className="mb-4 sm:mb-0">
                                    <p className="uppercase">EDUCATION</p>
                                    <p className="mt-1 font-normal whitespace-pre-line">{meta.education || 'B.Arch'}</p>
                                </div>
                                <div className="mb-4 sm:mb-0">
                                    <p className="uppercase">EXPERIENCE</p>
                                    <p className="mt-1 font-normal">{meta.experience || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="uppercase">SKILLS</p>
                                    <p className="mt-1 font-normal leading-tight">{skillsText || 'Not specified'}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="projects-section" className="px-6 sm:px-12 pb-12">
                        <h3 className="font-bold text-base sm:text-lg mb-4">PROJECTS</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6 max-w-full">
                            {projects.map((p, i) => {
                                const img = p.image || p.imageUrl || '';
                                return (
                                    <div key={i}>
                                        {img ? (
                                            <a href={img} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={img}
                                                    alt={p.title || `Project ${i + 1}`}
                                                    className="w-full h-auto mx-auto rounded-lg max-h-[250px] object-cover transition-transform duration-300 hover:scale-105"
                                                />
                                            </a>
                                        ) : (
                                            <div className="w-full h-[220px] rounded-lg bg-[#dcd7cb] flex items-center justify-center text-[#6f6655] text-sm">
                                                Add Project Image URL
                                            </div>
                                        )}
                                        <EditableText as="h4" className="mt-2 font-normal text-sm sm:text-base" value={p.title || `Project ${i + 1}`} placeholder={`Project ${i + 1}`} onCommit={(v) => commitProject(i, 'title', v)} />
                                        <p className="text-xs sm:text-sm">{p.year || ''}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                <footer className="bg-[#d7d0c3] w-full px-6 py-6 text-sm sm:text-base font-semibold text-black">
                    <div className="max-w-6xl mx-auto flex flex-col gap-2 sm:gap-3">
                        <div className="flex items-center gap-2">
                            <span>CONTACT:</span>
                            <a href={`mailto:${contactEmail}`} className="hover:underline font-normal">
                                Get in touch
                            </a>
                        </div>
                        {linkedinUrl && (
                            <div className="flex items-center gap-2">
                                <span>LinkedIn:</span>
                                <a
                                    href={linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline font-normal text-black break-all"
                                >
                                    {linkedinUrl}
                                </a>
                            </div>
                        )}
                    </div>
                </footer>
            </div>
        );
    }

    // BTech Template
    if (templateId === 'btech') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
                <header className="px-6 py-24 max-w-5xl mx-auto text-center border-b border-slate-700">
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        BTech Portfolio
                    </h1>
                    <EditableText
                        as="p"
                        className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto"
                        value={about}
                        placeholder="Write your About section here."
                        onCommit={(v) => commitRoot('about', v)}
                    />
                    <div className="flex justify-center gap-4 mt-8">
                        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition">Contact</button>
                    </div>
                </header>

                <section className="px-6 py-16 max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
                        <span className="w-1 h-8 bg-blue-500"></span> Featured Projects
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {projects.map((p, i) => (
                            <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition">
                                <EditableText as="h3" className="text-xl font-bold mb-3 text-blue-400" value={p.title} placeholder={`Project ${i + 1}`} onCommit={(v) => commitProject(i, 'title', v)} />
                                <EditableText as="p" className="text-slate-300 mb-4" value={p.desc} placeholder="Describe this project." onCommit={(v) => commitProject(i, 'desc', v)} />
                                <ProjectAttachments p={p} dark />
                                <div className="text-sm text-slate-500">{p.tech || 'Technologies not specified'}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="px-6 py-16 bg-slate-800/50 max-w-5xl mx-auto w-full">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <span className="w-1 h-8 bg-cyan-500"></span> Technical Skills
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {skills && skills.map(s => (
                            <span key={s} className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-full text-sm font-medium hover:bg-slate-600 transition">{s}</span>
                        ))}
                    </div>
                </section>

                <section className="px-6 py-16 max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
                        <span className="w-1 h-8 bg-blue-500"></span> Certifications & Awards
                    </h2>
                    <div className="space-y-4">
                        {certifications.map((c, i) => (
                            <div key={i} className="bg-slate-800 border-l-4 border-blue-500 p-4 rounded">
                                <h4 className="font-bold text-white">{c.name}</h4>
                                <div className="mt-2">{renderCertificationContent(c, 'h-16 w-16 rounded-lg object-cover border border-white/10', 'text-slate-400 text-sm')}</div>
                            </div>
                        ))}
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    // BTech Classic Single Page (Bedimcode-style: Home/About/Skills/Work/Contact)
    if (templateId === 'btech-bedimcode-1') {
        return (
            <>
                <BtechBedimcode1Template
                    portfolio={portfolio}
                    about={about}
                    skills={skills}
                    projects={projects}
                    exportMode={exportMode}
                />
                <TemplateExtraPages />
            </>
        );
    }

    // BTech Sections (Qualification-style: includes qualification timeline)
    if (templateId === 'btech-bedimcode-2') {
        return (
            <>
                <BtechBedimcode2Template
                    portfolio={portfolio}
                    about={about}
                    skills={skills}
                    projects={projects}
                />
                <TemplateExtraPages />
            </>
        );
    }

    // BTech Computer Science Template
    if (templateId === 'btech-cs') {
        const meta = portfolio.meta || {};
        const fullName = meta.fullName || 'B.Tech CSE Student';
        return (
            <div className="min-h-screen bg-white text-slate-900 font-sans" style={pageStyle}>
                <header className="px-6 py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white max-w-6xl mx-auto">
                    <h1 className="text-5xl font-bold mb-2">Computer Science Engineering Portfolio</h1>
                    <EditableText as="p" className="text-lg text-blue-100 mb-1" value={fullName} placeholder="Your Name" onCommit={(v) => commitMeta('fullName', v)} />
                    <EditableText as="p" className="text-lg text-blue-100" value={about} placeholder="Your intro" onCommit={(v) => commitRoot('about', v)} />
                </header>

                <section className="px-6 py-16 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-blue-900">Software & Development Projects</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {projects.map((p, i) => (
                            <div key={i} className="border-2 border-blue-200 rounded-lg p-6 hover:shadow-lg transition">
                                <EditableText as="h3" className="text-2xl font-bold text-blue-700 mb-3" value={p.title} placeholder={`Project ${i + 1}`} onCommit={(v) => commitProject(i, 'title', v)} />
                                <EditableText as="p" className="text-slate-700 mb-4" value={p.desc} placeholder="Describe this project." onCommit={(v) => commitProject(i, 'desc', v)} />
                                <ProjectAttachments p={p} />
                                <div className="text-sm text-blue-600 font-medium">{p.tech || 'Tech stack not specified'}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="px-6 py-16 bg-blue-50 max-w-6xl mx-auto w-full">
                    <h2 className="text-3xl font-bold mb-8 text-blue-900">Core CS Skills</h2>
                    <div className="flex flex-wrap gap-3">
                        {skills && skills.map(s => (
                            <span key={s} className="px-4 py-2 bg-white border-2 border-blue-400 text-blue-700 rounded-full font-medium">{s}</span>
                        ))}
                    </div>
                </section>

                <section className="px-6 py-16 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-blue-900">Certifications</h2>
                    <div className="space-y-4">
                        {certifications.map((c, i) => (
                            <div key={i} className="bg-blue-100 border-l-4 border-blue-600 p-4 rounded">
                                <h4 className="font-bold text-blue-900">{c.name}</h4>
                                <div className="mt-2">{renderCertificationContent(c, 'h-16 w-16 rounded-lg object-cover border border-blue-200', 'text-blue-700')}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <Footer />
            </div>
        );
    }

    // BTech CS Unicons Sections Template
    if (templateId === 'btech-cs-unicons') {
        const meta = portfolio.meta || {};
        const fullName = meta.fullName || 'B.Tech CSE Student';
        const role = meta.role || 'Frontend Developer';
        const college = meta.college || 'Computer Science Department';
        const company = meta.company || 'Open for Internship';
        const contactEmail = meta.contactEmail || 'contact@example.com';
        const serviceItems = Array.isArray(meta.uniconsServices) && meta.uniconsServices.length > 0
            ? meta.uniconsServices
            : [
                { title: 'Web Development', text: 'Building responsive web interfaces and scalable apps.' },
                { title: 'UI/UX Design', text: 'Designing clean and accessible user experiences.' },
                { title: 'Backend APIs', text: 'Developing APIs, authentication, and database flows.' },
            ];
        const testimonials = Array.isArray(meta.uniconsTestimonials) && meta.uniconsTestimonials.length > 0
            ? meta.uniconsTestimonials
            : [
                { name: 'Faculty Mentor', text: 'Strong problem-solving skills and consistent project delivery.' },
                { name: 'Project Teammate', text: 'Great collaborator with excellent frontend implementation skills.' },
            ];
        const sectionVisibility = {
            about: showSection('about'),
            skills: showSection('skills'),
            qualification: showSection('qualification'),
            services: showSection('services'),
            portfolio: showSection('projects'),
            project: showSection('projects'),
            testimonial: showSection('testimonials'),
            contact: showSection('contact'),
            ...(meta.uniconsSections || {}),
        };

        return (
            <div className="min-h-screen bg-[#f7f9fc] text-slate-900 font-sans" style={pageStyle}>
                <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur" id="header">
                    <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="font-bold text-lg">Portfolio</div>
                        <nav className="text-sm flex flex-wrap gap-3 text-slate-600">
                            {['home', 'about', 'skills', 'portfolio', 'contact'].map((item) => (
                                <a key={item} href={`#${item}`} className="hover:text-blue-600 capitalize">
                                    {item}
                                </a>
                            ))}
                        </nav>
                    </div>
                </header>

                <main className="main max-w-6xl mx-auto px-6 py-10 space-y-8">
                    <section className="home section bg-white rounded-2xl border border-slate-200 p-8" id="home">
                        <p className="text-blue-600 font-semibold text-sm uppercase tracking-[0.15em]">Hello, I am</p>
                        <EditableText as="h1" className="text-4xl md:text-5xl font-bold mt-2" value={fullName} placeholder="Your Name" onCommit={(v) => commitMeta('fullName', v)} />
                        <EditableText as="p" className="text-slate-600 mt-3 text-lg" value={role} placeholder="Your Role" onCommit={(v) => commitMeta('role', v)} />
                    </section>

                    {sectionVisibility.about && (
                        <section className="about section bg-white rounded-2xl border border-slate-200 p-8" id="about">
                            <h2 className="text-2xl font-bold mb-4">About</h2>
                            <EditableText as="p" className="text-slate-700 leading-7" value={about} placeholder="Write your about section here." onCommit={(v) => commitRoot('about', v)} />
                        </section>
                    )}

                    {sectionVisibility.skills && (
                        <section className="skills section bg-white rounded-2xl border border-slate-200 p-8" id="skills">
                            <div className="flex items-center justify-between gap-3 mb-4">
                                <h2 className="text-2xl font-bold">Skills</h2>
                                {isEditable && (
                                    <button
                                        type="button"
                                        onClick={() => addSkillItem('New Skill')}
                                        className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-100"
                                    >
                                        Add Skill
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(skills || []).map((s, i) => (
                                    <span key={`${s}-${i}`} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border border-blue-300 bg-blue-50 text-blue-700">
                                        {isEditable ? (
                                            <input
                                                value={s}
                                                onChange={(e) => updateSkillItem(i, e.target.value)}
                                                className="bg-transparent min-w-[80px] max-w-[140px] outline-none"
                                            />
                                        ) : (
                                            <span>{s}</span>
                                        )}
                                        {isEditable && (
                                            <button
                                                type="button"
                                                onClick={() => removeSkillItem(i)}
                                                className="rounded-full text-xs font-bold text-blue-600 hover:text-red-600"
                                                aria-label={`Remove skill ${i + 1}`}
                                            >
                                                x
                                            </button>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {sectionVisibility.qualification && (
                        <section className="qualification section bg-white rounded-2xl border border-slate-200 p-8">
                            <h2 className="text-2xl font-bold mb-4">Qualification</h2>
                            <div className="grid md:grid-cols-2 gap-4 text-slate-700">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Education</p>
                                    <EditableText as="p" className="font-medium" value={meta.education || college} placeholder="Education" onCommit={(v) => commitMeta('education', v)} />
                                    <EditableText as="p" className="text-sm text-slate-500" value={meta.educationYears || ''} placeholder="Years" onCommit={(v) => commitMeta('educationYears', v)} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Experience</p>
                                    <EditableText as="p" className="font-medium" value={meta.experience || company} placeholder="Experience" onCommit={(v) => commitMeta('experience', v)} />
                                    <EditableText as="p" className="text-sm text-slate-500" value={meta.experienceYears || ''} placeholder="Years" onCommit={(v) => commitMeta('experienceYears', v)} />
                                </div>
                            </div>
                        </section>
                    )}

                    {sectionVisibility.services && (
                        <section className="services section bg-white rounded-2xl border border-slate-200 p-8" id="services">
                            <div className="flex items-center justify-between gap-3 mb-4">
                                <h2 className="text-2xl font-bold">Services</h2>
                                {isEditable && (
                                    <button
                                        type="button"
                                        onClick={() => addMetaListItem('uniconsServices', { title: 'New Service', text: 'Describe this service.' })}
                                        className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-100"
                                    >
                                        Add Service
                                    </button>
                                )}
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                {serviceItems.map((srv, i) => (
                                    <article key={`${srv.title}-${i}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <EditableText as="h3" className="font-semibold" value={srv.title} placeholder="Service title" onCommit={(v) => updateMetaListItem('uniconsServices', i, { title: v })} />
                                            {isEditable && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeMetaListItem('uniconsServices', i)}
                                                    className="rounded-full border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <EditableText as="p" className="text-sm text-slate-600 mt-2" value={srv.text} placeholder="Service description" onCommit={(v) => updateMetaListItem('uniconsServices', i, { text: v })} />
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}

                    {sectionVisibility.portfolio && (
                        <section className="portfolio section bg-white rounded-2xl border border-slate-200 p-8" id="portfolio">
                            <div className="flex items-center justify-between gap-3 mb-4">
                                <h2 className="text-2xl font-bold">Portfolio</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-5">
                                {projects.map((p, i) => (
                                    <article key={i} className="rounded-xl border border-slate-200 p-5">
                                        <div className="flex items-start justify-between gap-2">
                                            <EditableText as="h3" className="text-xl font-semibold" value={p.title || `Project ${i + 1}`} placeholder={`Project ${i + 1}`} onCommit={(v) => commitProject(i, 'title', v)} />
                                            {isEditable && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeProjectItem(i)}
                                                    className="rounded-full border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <EditableText as="p" className="text-slate-600 mt-2" value={p.desc} placeholder="Describe this project." onCommit={(v) => commitProject(i, 'desc', v)} />
                                        <ProjectAttachments p={p} />
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}

                    {sectionVisibility.project && (
                    <section className="project section bg-blue-600 text-white rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-2">Project In Mind</h2>
                        <EditableText
                            as="p"
                            className="text-blue-100"
                            value={meta.uniconsProjectNote || 'Looking for collaboration on web or AI projects. Reach out through the contact section.'}
                            placeholder="Project-in-mind note"
                            onCommit={(v) => commitMeta('uniconsProjectNote', v)}
                        />
                    </section>
                    )}

                    {sectionVisibility.testimonial && (
                        <section className="testimonial section bg-white rounded-2xl border border-slate-200 p-8">
                            <div className="flex items-center justify-between gap-3 mb-4">
                                <h2 className="text-2xl font-bold">Testimonial</h2>
                                {isEditable && (
                                    <button
                                        type="button"
                                        onClick={() => addMetaListItem('uniconsTestimonials', { name: 'Name', text: 'Share a testimonial here.' })}
                                        className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-100"
                                    >
                                        Add Testimonial
                                    </button>
                                )}
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {testimonials.map((t, i) => (
                                    <blockquote key={`${t.name}-${i}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <EditableText as="p" className="text-slate-700" value={t.text} placeholder="Testimonial text" onCommit={(v) => updateMetaListItem('uniconsTestimonials', i, { text: v })} />
                                            {isEditable && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeMetaListItem('uniconsTestimonials', i)}
                                                    className="rounded-full border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <EditableText as="footer" className="text-sm text-slate-500 mt-2" value={`- ${t.name || 'Name'}`} placeholder="- Name" onCommit={(v) => updateMetaListItem('uniconsTestimonials', i, { name: String(v).replace(/^-+\s*/, '') })} />
                                    </blockquote>
                                ))}
                            </div>
                        </section>
                    )}

                    {sectionVisibility.contact && (
                        <section className="contact section bg-white rounded-2xl border border-slate-200 p-8" id="contact">
                            <h2 className="text-2xl font-bold mb-4">Contact Me</h2>
                            <EditableText as="p" className="text-blue-700 break-all" value={contactEmail} placeholder="you@example.com" onCommit={(v) => commitMeta('contactEmail', v)} />
                        </section>
                    )}
                </main>

                <footer className="footer border-t border-slate-200 bg-white">
                    <EditableText
                        as="div"
                        className="max-w-6xl mx-auto px-6 py-5 text-sm text-slate-500"
                        value={meta.uniconsFooterText || 'Portfolio footer'}
                        placeholder="Footer text"
                        onCommit={(v) => commitMeta('uniconsFooterText', v)}
                    />
                </footer>

                <Footer />
            </div>
        );
    }

    // BTech CS Devfolio Template
    if (templateId === 'btech-cs-devfolio') {
        const meta = portfolio.meta || {};
        const fullName = meta.fullName || 'B.Tech CSE Student';
        return (
            <div className="min-h-screen bg-[#0b1220] text-slate-100 font-sans" style={pageStyle}>
                <header className="max-w-6xl mx-auto px-6 py-16">
                    <p className="uppercase tracking-[0.18em] text-cyan-300 text-xs">Developer Portfolio</p>
                    <EditableText as="h1" className="mt-3 text-5xl font-bold" value={fullName} placeholder="Your Name" onCommit={(v) => commitMeta('fullName', v)} />
                    <EditableText as="p" className="mt-4 text-slate-300 max-w-3xl" value={about} placeholder="Your intro" onCommit={(v) => commitRoot('about', v)} />
                </header>

                <section className="max-w-6xl mx-auto px-6 pb-14">
                    <h2 className="text-2xl font-bold mb-6">Projects</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {projects.map((p, i) => (
                            <article key={i} className="rounded-2xl border border-cyan-500/30 bg-[#111c32] p-5">
                                <h3 className="text-xl font-semibold text-cyan-300">{p.title || `Project ${i + 1}`}</h3>
                                <EditableText as="p" className="text-slate-300 mt-2" value={p.desc} placeholder="Describe this project." onCommit={(v) => commitProject(i, 'desc', v)} />
                                {p.tech && <p className="text-xs uppercase tracking-[0.12em] text-cyan-200 mt-3">{p.tech}</p>}
                                <ProjectAttachments p={p} dark />
                            </article>
                        ))}
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-6 pb-14">
                    <h2 className="text-2xl font-bold mb-5">Tech Stack</h2>
                    <div className="flex flex-wrap gap-2">
                        {(skills || []).map((s) => (
                            <span key={s} className="px-3 py-1 rounded-full text-sm border border-cyan-400/40 bg-cyan-400/10">
                                {s}
                            </span>
                        ))}
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    // BTech CS Systems Grid Template
    if (templateId === 'btech-cs-systems') {
        const meta = portfolio.meta || {};
        const fullName = meta.fullName || 'B.Tech CSE Student';
        return (
            <div className="min-h-screen bg-white text-slate-900 font-sans" style={pageStyle}>
                <header className="border-b border-slate-200">
                    <div className="max-w-6xl mx-auto px-6 py-14">
                        <EditableText as="h1" className="text-4xl md:text-5xl font-bold" value={fullName} placeholder="Your Name" onCommit={(v) => commitMeta('fullName', v)} />
                        <EditableText as="p" className="mt-4 text-slate-600 max-w-3xl" value={about} placeholder="Your intro" onCommit={(v) => commitRoot('about', v)} />
                    </div>
                </header>

                <section className="max-w-6xl mx-auto px-6 py-12">
                    <h2 className="text-2xl font-bold mb-6">Systems & Software Projects</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {projects.map((p, i) => (
                            <div key={i} className="rounded-xl border border-slate-300 p-4 hover:shadow-md transition">
                                <div className="text-xs text-slate-500 font-mono mb-2">#{String(i + 1).padStart(2, '0')}</div>
                                <EditableText as="h3" className="font-bold text-lg" value={p.title || `Project ${i + 1}`} placeholder={`Project ${i + 1}`} onCommit={(v) => commitProject(i, 'title', v)} />
                                <EditableText as="p" className="text-sm text-slate-600 mt-2" value={p.desc} placeholder="Describe this project." onCommit={(v) => commitProject(i, 'desc', v)} />
                                <ProjectAttachments p={p} showImage={false} />
                                {p.tech && <p className="text-xs text-slate-500 mt-2">{p.tech}</p>}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-6 pb-12">
                    <h2 className="text-2xl font-bold mb-5">Core Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {(skills || []).map((s) => (
                            <span key={s} className="px-3 py-1 rounded bg-slate-100 border border-slate-300 text-sm">{s}</span>
                        ))}
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    // BTech CS AI/ML Track Template
    if (templateId === 'btech-cs-ml') {
        const meta = portfolio.meta || {};
        const fullName = meta.fullName || 'B.Tech CSE Student';
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-slate-100 font-sans" style={pageStyle}>
                <header className="max-w-6xl mx-auto px-6 py-16">
                    <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">AI / ML Portfolio</p>
                    <EditableText as="h1" className="mt-3 text-5xl font-bold" value={fullName} placeholder="Your Name" onCommit={(v) => commitMeta('fullName', v)} />
                    <EditableText as="p" className="mt-4 text-slate-300 max-w-3xl" value={about} placeholder="Your intro" onCommit={(v) => commitRoot('about', v)} />
                </header>

                <section className="max-w-6xl mx-auto px-6 pb-14">
                    <h2 className="text-2xl font-bold mb-6">Model & Data Projects</h2>
                    <div className="space-y-5">
                        {projects.map((p, i) => (
                            <article key={i} className="rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-5">
                                <EditableText as="h3" className="text-xl font-semibold text-indigo-200" value={p.title || `Project ${i + 1}`} placeholder={`Project ${i + 1}`} onCommit={(v) => commitProject(i, 'title', v)} />
                                <EditableText as="p" className="text-slate-300 mt-2" value={p.desc} placeholder="Describe this project." onCommit={(v) => commitProject(i, 'desc', v)} />
                                {p.tech && <p className="text-xs uppercase tracking-[0.12em] text-indigo-200 mt-3">Stack: {p.tech}</p>}
                                <ProjectAttachments p={p} dark />
                            </article>
                        ))}
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-6 pb-16">
                    <h2 className="text-2xl font-bold mb-4">Tools & Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {(skills || []).map((s) => (
                            <span key={s} className="px-3 py-1 rounded-full bg-indigo-400/15 border border-indigo-300/30 text-sm">
                                {s}
                            </span>
                        ))}
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    // BTech Mechanical Engineering Template
    if (templateId === 'btech-mech') {
        const meta = portfolio.meta || {};
        const fullName = meta.fullName || 'B.Tech Mechanical Student';
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 text-slate-900 font-sans">
                <header className="px-6 py-20 bg-gradient-to-r from-orange-600 to-amber-700 text-white">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-5xl font-bold mb-2">Mechanical Engineering Portfolio</h1>
                        <EditableText as="p" className="text-lg text-orange-100 mb-1" value={fullName} placeholder="Your Name" onCommit={(v) => commitMeta('fullName', v)} />
                        <EditableText as="p" className="text-lg text-orange-100" value={about} placeholder="Your intro" onCommit={(v) => commitRoot('about', v)} />
                    </div>
                </header>

                <section className="px-6 py-16 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-orange-900">Mechanical & Design Projects</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {projects.map((p, i) => (
                            <div key={i} className="bg-white border-2 border-orange-300 rounded-lg p-6 shadow-md hover:shadow-lg transition">
                                <EditableText as="h3" className="text-2xl font-bold text-orange-700 mb-3" value={p.title} placeholder={`Project ${i + 1}`} onCommit={(v) => commitProject(i, 'title', v)} />
                                <EditableText as="p" className="text-slate-700 mb-4" value={p.desc} placeholder="Describe this project." onCommit={(v) => commitProject(i, 'desc', v)} />
                                <ProjectAttachments p={p} />
                                <div className="text-sm text-orange-600 font-medium">{p.tech || 'Tools & software not specified'}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="px-6 py-16 bg-orange-100 max-w-6xl mx-auto w-full">
                    <h2 className="text-3xl font-bold mb-8 text-orange-900">Mechanical Skills & Tools</h2>
                    <div className="flex flex-wrap gap-3">
                        {skills && skills.map(s => (
                            <span key={s} className="px-4 py-2 bg-white border-2 border-orange-500 text-orange-700 rounded-full font-medium">{s}</span>
                        ))}
                    </div>
                </section>

                <section className="px-6 py-16 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-orange-900">Certifications & Achievements</h2>
                    <div className="space-y-4">
                        {certifications.map((c, i) => (
                            <div key={i} className="bg-orange-100 border-l-4 border-orange-600 p-4 rounded">
                                <h4 className="font-bold text-orange-900">{c.name}</h4>
                                <div className="mt-2">{renderCertificationContent(c, 'h-16 w-16 rounded-lg object-cover border border-orange-200', 'text-orange-700')}</div>
                            </div>
                        ))}
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    if (templateId === 'btech-mech-wajiha') {
        return (
            <BtechMechClassicTemplate
                portfolio={portfolio}
                about={about}
                skills={skills}
                projects={projects}
                certifications={certifications}
                exportMode={exportMode}
                EditableText={EditableText}
                ProjectAttachments={ProjectAttachments}
                commitRoot={commitRoot}
                commitMeta={commitMeta}
                commitProject={commitProject}
                updateSkillItem={updateSkillItem}
                addSkillItem={addSkillItem}
                removeSkillItem={removeSkillItem}
                updateCertificationItem={updateCertificationItem}
                isEditable={isEditable}
                Footer={Footer}
            />
        );
    }

    // BTech Electrical Engineering Template
    if (templateId === 'btech-eee') {
        const meta = portfolio.meta || {};
        const fullName = meta.fullName || 'B.Tech Electrical Student';
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 text-slate-900 font-sans">
                <header className="px-6 py-20 bg-gradient-to-r from-yellow-600 to-amber-600 text-white">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-5xl font-bold mb-2">Electrical Engineering Portfolio</h1>
                        <EditableText as="p" className="text-lg text-yellow-100 mb-1" value={fullName} placeholder="Your Name" onCommit={(v) => commitMeta('fullName', v)} />
                        <EditableText as="p" className="text-lg text-yellow-100" value={about} placeholder="Your intro" onCommit={(v) => commitRoot('about', v)} />
                    </div>
                </header>

                <section className="px-6 py-16 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-yellow-900">Electrical Projects & Designs</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {projects.map((p, i) => (
                            <div key={i} className="bg-white border-2 border-yellow-300 rounded-lg p-6 shadow-md hover:shadow-lg transition">
                                <EditableText as="h3" className="text-2xl font-bold text-yellow-700 mb-3" value={p.title} placeholder={`Project ${i + 1}`} onCommit={(v) => commitProject(i, 'title', v)} />
                                <EditableText as="p" className="text-slate-700 mb-4" value={p.desc} placeholder="Describe this project." onCommit={(v) => commitProject(i, 'desc', v)} />
                                <ProjectAttachments p={p} />
                                <div className="text-sm text-yellow-600 font-medium">{p.tech || 'Technologies not specified'}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="px-6 py-16 bg-yellow-100 max-w-6xl mx-auto w-full">
                    <h2 className="text-3xl font-bold mb-8 text-yellow-900">Electrical Skills</h2>
                    <div className="flex flex-wrap gap-3">
                        {skills && skills.map(s => (
                            <span key={s} className="px-4 py-2 bg-white border-2 border-yellow-500 text-yellow-700 rounded-full font-medium">{s}</span>
                        ))}
                    </div>
                </section>

                <section className="px-6 py-16 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-yellow-900">Certifications & Qualifications</h2>
                    <div className="space-y-4">
                        {certifications.map((c, i) => (
                            <div key={i} className="bg-yellow-100 border-l-4 border-yellow-600 p-4 rounded">
                                <h4 className="font-bold text-yellow-900">{c.name}</h4>
                                <div className="mt-2">{renderCertificationContent(c, 'h-16 w-16 rounded-lg object-cover border border-yellow-200', 'text-yellow-700')}</div>
                            </div>
                        ))}
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    // BTech Electronics Engineering Template
    if (templateId === 'btech-ece') {
        const meta = portfolio.meta || {};
        const fullName = meta.fullName || 'B.Tech Electronics Student';
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 text-slate-900 font-sans">
                <header className="px-6 py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-5xl font-bold mb-2">Electronics & Communication Portfolio</h1>
                        <EditableText as="p" className="text-lg text-purple-100 mb-1" value={fullName} placeholder="Your Name" onCommit={(v) => commitMeta('fullName', v)} />
                        <EditableText as="p" className="text-lg text-purple-100" value={about} placeholder="Your intro" onCommit={(v) => commitRoot('about', v)} />
                    </div>
                </header>

                <section className="px-6 py-16 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-purple-900">Electronics Projects</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {projects.map((p, i) => (
                            <div key={i} className="bg-white border-2 border-purple-300 rounded-lg p-6 shadow-md hover:shadow-lg transition">
                                <EditableText as="h3" className="text-2xl font-bold text-purple-700 mb-3" value={p.title} placeholder={`Project ${i + 1}`} onCommit={(v) => commitProject(i, 'title', v)} />
                                <EditableText as="p" className="text-slate-700 mb-4" value={p.desc} placeholder="Describe this project." onCommit={(v) => commitProject(i, 'desc', v)} />
                                <ProjectAttachments p={p} />
                                <div className="text-sm text-purple-600 font-medium">{p.tech || 'Components & tools not specified'}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="px-6 py-16 bg-purple-100 max-w-6xl mx-auto w-full">
                    <h2 className="text-3xl font-bold mb-8 text-purple-900">Electronics Expertise</h2>
                    <div className="flex flex-wrap gap-3">
                        {skills && skills.map(s => (
                            <span key={s} className="px-4 py-2 bg-white border-2 border-purple-500 text-purple-700 rounded-full font-medium">{s}</span>
                        ))}
                    </div>
                </section>

                <section className="px-6 py-16 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-purple-900">Certifications</h2>
                    <div className="space-y-4">
                        {certifications.map((c, i) => (
                            <div key={i} className="bg-purple-100 border-l-4 border-purple-600 p-4 rounded">
                                <h4 className="font-bold text-purple-900">{c.name}</h4>
                                <div className="mt-2">{renderCertificationContent(c, 'h-16 w-16 rounded-lg object-cover border border-purple-200', 'text-purple-700')}</div>
                            </div>
                        ))}
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    // BTech Robotics Template
    if (templateId === 'btech-robo') {
        const meta = portfolio.meta || {};
        const fullName = meta.fullName || 'B.Tech Robotics Student';
        return (
            <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 text-slate-900 font-sans">
                <header className="px-6 py-20 bg-gradient-to-r from-cyan-600 to-teal-600 text-white">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-5xl font-bold mb-2">Robotics & Automation Portfolio</h1>
                        <EditableText as="p" className="text-lg text-cyan-100 mb-1" value={fullName} placeholder="Your Name" onCommit={(v) => commitMeta('fullName', v)} />
                        <EditableText as="p" className="text-lg text-cyan-100" value={about} placeholder="Your intro" onCommit={(v) => commitRoot('about', v)} />
                    </div>
                </header>

                <section className="px-6 py-16 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-cyan-900">Robotics & Automation Projects</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {projects.map((p, i) => (
                            <div key={i} className="bg-white border-2 border-cyan-300 rounded-lg p-6 shadow-md hover:shadow-lg transition">
                                <EditableText as="h3" className="text-2xl font-bold text-cyan-700 mb-3" value={p.title} placeholder={`Project ${i + 1}`} onCommit={(v) => commitProject(i, 'title', v)} />
                                <EditableText as="p" className="text-slate-700 mb-4" value={p.desc} placeholder="Describe this project." onCommit={(v) => commitProject(i, 'desc', v)} />
                                <ProjectAttachments p={p} />
                                <div className="text-sm text-cyan-600 font-medium">{p.tech || 'Robotics platforms & tools not specified'}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="px-6 py-16 bg-cyan-100 max-w-6xl mx-auto w-full">
                    <h2 className="text-3xl font-bold mb-8 text-cyan-900">Robotics Skills</h2>
                    <div className="flex flex-wrap gap-3">
                        {skills && skills.map(s => (
                            <span key={s} className="px-4 py-2 bg-white border-2 border-cyan-500 text-cyan-700 rounded-full font-medium">{s}</span>
                        ))}
                    </div>
                </section>

                <section className="px-6 py-16 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-cyan-900">Certifications & Awards</h2>
                    <div className="space-y-4">
                        {certifications.map((c, i) => (
                            <div key={i} className="bg-cyan-100 border-l-4 border-cyan-600 p-4 rounded">
                                <h4 className="font-bold text-cyan-900">{c.name}</h4>
                                <div className="mt-2">{renderCertificationContent(c, 'h-16 w-16 rounded-lg object-cover border border-cyan-200', 'text-cyan-700')}</div>
                            </div>
                        ))}
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    // BArch Electronics Engineering Template
    if (templateId === 'barch-ece') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 text-slate-900 font-sans">
                <header className="px-6 py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <h1 className="text-5xl font-bold mb-4">Electronics Engineering Portfolio</h1>
                    <EditableText as="p" className="text-lg text-purple-100" value={about} placeholder="Your intro" onCommit={(v) => commitRoot('about', v)} />
                </header>

                <section className="px-6 py-16 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-purple-900">Electronics Projects</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {projects.map((p, i) => (
                            <div key={i} className="bg-white border-2 border-purple-300 rounded-lg p-6 shadow-md hover:shadow-lg transition">
                                <EditableText as="h3" className="text-2xl font-bold text-purple-700 mb-3" value={p.title} placeholder={`Project ${i + 1}`} onCommit={(v) => commitProject(i, 'title', v)} />
                                <EditableText as="p" className="text-slate-700 mb-4" value={p.desc} placeholder="Describe this project." onCommit={(v) => commitProject(i, 'desc', v)} />
                                <ProjectAttachments p={p} />
                                <div className="text-sm text-purple-600 font-medium">{p.tech || 'Components & tools not specified'}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="px-6 py-16 bg-purple-100 max-w-6xl mx-auto w-full">
                    <h2 className="text-3xl font-bold mb-8 text-purple-900">Electronics Expertise</h2>
                    <div className="flex flex-wrap gap-3">
                        {skills && skills.map(s => (
                            <span key={s} className="px-4 py-2 bg-white border-2 border-purple-500 text-purple-700 rounded-full font-medium">{s}</span>
                        ))}
                    </div>
                </section>

                <section className="px-6 py-16 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-purple-900">Certifications</h2>
                    <div className="space-y-4">
                        {certifications.map((c, i) => (
                            <div key={i} className="bg-purple-100 border-l-4 border-purple-600 p-4 rounded">
                                <h4 className="font-bold text-purple-900">{c.name}</h4>
                                <div className="mt-2">{renderCertificationContent(c, 'h-16 w-16 rounded-lg object-cover border border-purple-200', 'text-purple-700')}</div>
                            </div>
                        ))}
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    // BArch Robotics Template
    if (templateId === 'barch-robo') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 text-slate-900 font-sans">
                <header className="px-6 py-20 bg-gradient-to-r from-cyan-600 to-teal-600 text-white">
                    <h1 className="text-5xl font-bold mb-4">Robotics Portfolio</h1>
                    <EditableText as="p" className="text-lg text-cyan-100" value={about} placeholder="Your intro" onCommit={(v) => commitRoot('about', v)} />
                </header>

                <section className="px-6 py-16 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-cyan-900">Robotics & Automation Projects</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {projects.map((p, i) => (
                            <div key={i} className="bg-white border-2 border-cyan-300 rounded-lg p-6 shadow-md hover:shadow-lg transition">
                                <EditableText as="h3" className="text-2xl font-bold text-cyan-700 mb-3" value={p.title} placeholder={`Project ${i + 1}`} onCommit={(v) => commitProject(i, 'title', v)} />
                                <EditableText as="p" className="text-slate-700 mb-4" value={p.desc} placeholder="Describe this project." onCommit={(v) => commitProject(i, 'desc', v)} />
                                <ProjectAttachments p={p} />
                                <div className="text-sm text-cyan-600 font-medium">{p.tech || 'Robotics platforms & tools not specified'}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="px-6 py-16 bg-cyan-100 max-w-6xl mx-auto w-full">
                    <h2 className="text-3xl font-bold mb-8 text-cyan-900">Robotics Skills</h2>
                    <div className="flex flex-wrap gap-3">
                        {skills && skills.map(s => (
                            <span key={s} className="px-4 py-2 bg-white border-2 border-cyan-500 text-cyan-700 rounded-full font-medium">{s}</span>
                        ))}
                    </div>
                </section>

                <section className="px-6 py-16 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-cyan-900">Certifications & Awards</h2>
                    <div className="space-y-4">
                        {certifications.map((c, i) => (
                            <div key={i} className="bg-cyan-100 border-l-4 border-cyan-600 p-4 rounded">
                                <h4 className="font-bold text-cyan-900">{c.name}</h4>
                                <p className="text-cyan-700">{c.issuer}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    // BArch Portfolio Book Template
    if (templateId === 'barch-portfolio-a') {
        const meta = portfolio.meta && typeof portfolio.meta === 'object' ? portfolio.meta : {};
        const fullName = meta.fullName || 'Architecture Student';
        const role = meta.role || 'B.Arch Portfolio';
        const college = meta.college || 'School of Architecture';
        const contactEmail = meta.contactEmail || 'contact@example.com';
        const linkedinUrl = meta.linkedinUrl || '';
        const heroImage = meta.heroImage || projects?.[0]?.image || '';

        return (
            <div className="min-h-screen bg-[#f4f0e8] text-[#17120e] font-serif">
                <header className="border-b border-[#cfc4b2]">
                    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div>
                            <EditableText as="p" className="text-xs uppercase tracking-[0.25em] text-[#6a5d4f]" value={role} placeholder="Role" onCommit={(v) => commitMeta('role', v)} />
                            <EditableText as="h1" className="text-4xl md:text-6xl tracking-tight mt-2" value={fullName} placeholder="Your Name" onCommit={(v) => commitMeta('fullName', v)} />
                            <p className="text-sm text-[#554a3d] mt-3">{college}</p>
                        </div>
                        <div className="text-sm text-[#554a3d] space-y-1">
                            <a href={`mailto:${contactEmail}`} className="block hover:underline">{contactEmail}</a>
                            {linkedinUrl && (
                                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="block hover:underline break-all">
                                    {linkedinUrl}
                                </a>
                            )}
                        </div>
                    </div>
                </header>

                <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-8 items-start">
                    <div className="border border-[#d9cfbf] bg-[#ede3d4] rounded-2xl p-6">
                        <h2 className="text-xs uppercase tracking-[0.2em] text-[#6a5d4f] mb-4">About</h2>
                        <EditableText as="p" className="leading-7 text-[#2d241c]" value={about} placeholder="Write your About section." onCommit={(v) => commitRoot('about', v)} />
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-[#d9cfbf] bg-[#dfd5c5] min-h-[280px]">
                        {heroImage ? (
                            <img src={heroImage} alt={`Hero for ${fullName}`} className="w-full h-full object-cover min-h-[280px]" />
                        ) : (
                            <div className="min-h-[280px] w-full flex items-center justify-center text-[#6a5d4f] px-6 text-sm">
                                Add a hero image URL in Profile settings.
                            </div>
                        )}
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-6 pb-12">
                    <h2 className="text-xs uppercase tracking-[0.2em] text-[#6a5d4f] mb-5">Selected Works</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {projects.map((p, i) => {
                            const projectImage = p.image || p.imageUrl || '';
                            return (
                                <article key={i} className="bg-[#fffaf3] border border-[#d9cfbf] rounded-2xl overflow-hidden">
                                    {projectImage ? (
                                        <img src={projectImage} alt={p.title || `Project ${i + 1}`} className="w-full h-64 object-cover" />
                                    ) : (
                                        <div className="w-full h-64 bg-[#e7dccb] flex items-center justify-center text-[#6a5d4f] text-sm">
                                            Project board image
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <EditableText as="h3" className="text-xl" value={p.title || `Project ${i + 1}`} placeholder={`Project ${i + 1}`} onCommit={(v) => commitProject(i, 'title', v)} />
                                        <EditableText as="p" className="text-sm text-[#5d5144] mt-2" value={p.desc} placeholder="Describe this project." onCommit={(v) => commitProject(i, 'desc', v)} />
                                        <ProjectAttachments p={p} showImage={false} />
                                        <p className="text-xs uppercase tracking-[0.15em] text-[#7a6f61] mt-4">{p.year || 'Year not specified'}</p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-6">
                    <div className="bg-[#fffaf3] border border-[#d9cfbf] rounded-2xl p-6">
                        <h2 className="text-xs uppercase tracking-[0.2em] text-[#6a5d4f] mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {(skills || []).map((s) => (
                                <span key={s} className="px-3 py-1 rounded-full border border-[#c7b9a4] text-sm text-[#4f4336]">{s}</span>
                            ))}
                        </div>
                    </div>
                    <div className="bg-[#fffaf3] border border-[#d9cfbf] rounded-2xl p-6">
                        <h2 className="text-xs uppercase tracking-[0.2em] text-[#6a5d4f] mb-4">Certifications</h2>
                        <div className="space-y-3">
                            {certifications.map((c, i) => (
                                <div key={i} className="border-b border-[#e4d9c8] pb-2">
                                    <p className="font-semibold text-[#2d241c]">{c.name}</p>
                                    <p className="text-sm text-[#5d5144]">{c.issuer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    // BArch Slate Journal Template
    if (templateId === 'barch-portfolio-b') {
        const meta = portfolio.meta && typeof portfolio.meta === 'object' ? portfolio.meta : {};
        const fullName = meta.fullName || 'Architecture Student';
        const role = meta.role || 'Design Explorer';
        const education = meta.education || 'B.Arch';
        const educationYears = meta.educationYears || '';
        const experience = meta.experience || 'Studio Intern';
        const experienceYears = meta.experienceYears || '';
        const profileImage = meta.profileImage || '';

        return (
            <div className="min-h-screen bg-[#0f1318] text-[#e5e0d8] font-sans">
                <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1.1fr_1.9fr] gap-8">
                    <aside className="rounded-2xl border border-[#343b44] bg-[#151b22] p-6">
                        <div className="w-28 h-28 rounded-full overflow-hidden border border-[#4b545f] bg-[#1f2731] mb-5">
                            {profileImage ? (
                                <img src={profileImage} alt={fullName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl text-[#9ea8b5]">
                                    {fullName.charAt(0)}
                                </div>
                            )}
                        </div>
                        <EditableText as="h1" className="text-3xl font-semibold" value={fullName} placeholder="Your Name" onCommit={(v) => commitMeta('fullName', v)} />
                        <EditableText as="p" className="text-[#a7b0bb] mt-1" value={role} placeholder="Role" onCommit={(v) => commitMeta('role', v)} />
                        <EditableText as="p" className="text-sm text-[#8a95a2] mt-4 leading-6" value={about} placeholder="Write your About section." onCommit={(v) => commitRoot('about', v)} />

                        <div className="mt-6 space-y-3 text-sm">
                            <div>
                                <p className="uppercase tracking-[0.16em] text-[#8190a0] text-xs">Education</p>
                                <p>{education}</p>
                                {educationYears && <p className="text-[#90a0b1]">{educationYears}</p>}
                            </div>
                            <div>
                                <p className="uppercase tracking-[0.16em] text-[#8190a0] text-xs">Experience</p>
                                <p>{experience}</p>
                                {experienceYears && <p className="text-[#90a0b1]">{experienceYears}</p>}
                            </div>
                        </div>
                    </aside>

                    <main className="space-y-6">
                        <div className="rounded-2xl border border-[#343b44] bg-[#151b22] p-6">
                            <h2 className="text-xs uppercase tracking-[0.18em] text-[#8a95a2] mb-4">Project Timeline</h2>
                            <div className="space-y-4">
                                {projects.map((p, i) => (
                                    <div key={i} className="grid grid-cols-[80px_1fr] gap-4">
                                        <p className="text-sm text-[#9ea8b5]">{p.year || 'Year'}</p>
                                        <div className="border-l border-[#3f4955] pl-4">
                                            <EditableText as="h3" className="text-lg text-[#f0ebe3]" value={p.title || `Project ${i + 1}`} placeholder={`Project ${i + 1}`} onCommit={(v) => commitProject(i, 'title', v)} />
                                            <EditableText as="p" className="text-sm text-[#9ea8b5] mt-1" value={p.desc} placeholder="Describe this project." onCommit={(v) => commitProject(i, 'desc', v)} />
                                            <ProjectAttachments p={p} dark />
                                            {p.tech && <p className="text-xs uppercase tracking-[0.12em] text-[#7e8a97] mt-2">{p.tech}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <section className="rounded-2xl border border-[#343b44] bg-[#151b22] p-6">
                                <h2 className="text-xs uppercase tracking-[0.18em] text-[#8a95a2] mb-4">Tools</h2>
                                <div className="flex flex-wrap gap-2">
                                    {(skills || []).map((s) => (
                                        <span key={s} className="px-3 py-1 rounded-full bg-[#1f2731] border border-[#3d4754] text-sm text-[#d7dfe8]">{s}</span>
                                    ))}
                                </div>
                            </section>
                            <section className="rounded-2xl border border-[#343b44] bg-[#151b22] p-6">
                                <h2 className="text-xs uppercase tracking-[0.18em] text-[#8a95a2] mb-4">Recognition</h2>
                                <div className="space-y-3">
                                    {certifications.map((c, i) => (
                                        <div key={i}>
                                            <p className="text-[#f0ebe3]">{c.name}</p>
                                            <p className="text-sm text-[#9ea8b5]">{c.issuer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </main>
                </section>
                <Footer />
            </div>
        );
    }


    // Academic Professional Template
    if (templateId === 'academic') {
        return (
            <div className="min-h-screen bg-slate-50 font-serif text-slate-800">
                <div className="max-w-3xl mx-auto bg-white min-h-screen shadow-2xl p-12 md:p-20 border-x">
                    <header className="border-b-2 border-black pb-8 mb-12">
                        <h1 className="text-4xl font-bold uppercase tracking-widest mb-4">Portfolio</h1>
                        <EditableText as="p" className="text-lg italic text-slate-600" value={about} placeholder="Write your About section." onCommit={(v) => commitRoot('about', v)} />
                    </header>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold uppercase mb-6 flex items-center gap-3">
                            <span className="w-8 h-1 bg-black"></span> Projects
                        </h2>
                        <div className="space-y-8">
                            {projects.map((p, i) => (
                                <div key={i}>
                                    <EditableText as="h3" className="text-xl font-bold" value={p.title} placeholder={`Project ${i + 1}`} onCommit={(v) => commitProject(i, 'title', v)} />
                                    <EditableText as="p" className="text-slate-600 mt-1" value={p.desc} placeholder="Describe this project." onCommit={(v) => commitProject(i, 'desc', v)} />
                                    <ProjectAttachments p={p} />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold uppercase mb-6 flex items-center gap-3">
                            <span className="w-8 h-1 bg-black"></span> Skills
                        </h2>
                        <p className="leading-relaxed">
                            {skills && skills.join(" • ")}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase mb-6 flex items-center gap-3">
                            <span className="w-8 h-1 bg-black"></span> Awards
                        </h2>
                        {isEditable && (
                            <div className="mb-4">
                                <button
                                    type="button"
                                    onClick={addCertificationGlobal}
                                    className="px-3 py-1 rounded-lg border border-slate-300 bg-white text-sm font-medium hover:bg-slate-50 transition"
                                >
                                    + Certification
                                </button>
                            </div>
                        )}
                        <div className="space-y-3">
                            {certifications.map((c, i) => (
                                <div key={i} className="border border-slate-200 rounded-lg p-4 bg-white">
                                    <EditableText
                                        as="div"
                                        className="font-bold"
                                        value={c.name}
                                        placeholder={`Certification ${i + 1}`}
                                        onCommit={(v) => updateCertificationItem(i, 'name', v)}
                                    />
                                    <EditableText
                                        as="div"
                                        className="text-slate-600 mt-1"
                                        value={c.issuer || ''}
                                        placeholder="Issuer"
                                        onCommit={(v) => updateCertificationItem(i, 'issuer', v)}
                                    />
                                    {isEditable && (
                                        <div className="mt-3">
                                            <button
                                                type="button"
                                                onClick={() => onPortfolioChange((prev) => ({
                                                    ...prev,
                                                    certifications: (Array.isArray(prev.certifications) ? prev.certifications : []).filter((_, idx) => idx !== i),
                                                }))}
                                                className="text-xs text-red-600 hover:text-red-700"
                                            >
                                                Remove certification
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isEditable && certifications.length === 0 && (
                                <div className="text-sm text-slate-500">Add a certification to start editing.</div>
                            )}
                        </div>
                    </section>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
            <div className="max-w-md text-center">
                <div className="text-2xl font-bold">Unknown template</div>
                <div className="mt-2 text-white/70">Template id: <span className="font-mono">{String(templateId)}</span></div>
            </div>
        </div>
    );
};

const MadeWithBanner = () => (
    <div className="fixed bottom-4 right-4 bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-xs">
        Built with Digital Portfolio System
    </div>
);

const BtechBedimcode1Template = ({ portfolio, about, skills, projects, exportMode = false }) => {
    const meta = portfolio.meta && typeof portfolio.meta === 'object' ? portfolio.meta : {};
    const fullName = meta.fullName || 'Student';
    const role = meta.role || 'B.Tech Student';
    const contactEmail = meta.contactEmail || 'contact@example.com';
    const linkedinUrl = meta.linkedinUrl || '';
    const githubUrl = meta.githubUrl || '';
    const profileImage = meta.profileImage || '';

    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    const navLinks = useMemo(
        () => ([
            { id: 'home', label: 'Home' },
            { id: 'about', label: 'About' },
            { id: 'skills', label: 'Skills' },
            { id: 'work', label: 'Work' },
            { id: 'contact', label: 'Contact' },
        ]),
        []
    );

    useEffect(() => {
        if (exportMode) return undefined;
        const ids = navLinks.map((l) => l.id);
        const observers = [];

        ids.forEach((sectionId) => {
            const el = document.getElementById(sectionId);
            if (!el) return;
            const obs = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) setActiveSection(sectionId);
                    });
                },
                { root: null, threshold: 0.35 }
            );
            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, [exportMode, navLinks]);

    const scrollTo = (sectionId) => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const progressForSkill = (skill, idx) => {
        const match = String(skill || '').match(/(\d{1,3})\s*%$/);
        if (match) return Math.max(0, Math.min(100, Number(match[1])));
        const defaults = [95, 85, 75, 70, 65, 60];
        return defaults[idx % defaults.length];
    };

    return (
        <div className="min-h-screen bg-[#0b1220] text-white">
            {!exportMode && (
                <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b1220]/80 backdrop-blur">
                    <nav className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => scrollTo('home')}
                            className="font-semibold tracking-wide text-white hover:text-cyan-300 transition"
                        >
                            {fullName.split(' ')[0] || fullName}
                        </button>

                        <div className="hidden md:flex items-center gap-7 text-sm">
                            {navLinks.map((l) => (
                                <button
                                    key={l.id}
                                    type="button"
                                    onClick={() => scrollTo(l.id)}
                                    className={`transition ${
                                        activeSection === l.id ? 'text-cyan-300' : 'text-white/80 hover:text-white'
                                    }`}
                                >
                                    {l.label}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="md:hidden p-2 rounded-lg border border-white/10 hover:bg-white/5 transition"
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label="Toggle navigation"
                        >
                            {menuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </nav>

                    {menuOpen && (
                        <div className="md:hidden border-t border-white/10 px-5 py-3">
                            <div className="flex flex-col gap-2">
                                {navLinks.map((l) => (
                                    <button
                                        key={l.id}
                                        type="button"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            scrollTo(l.id);
                                        }}
                                        className={`text-left px-3 py-2 rounded-lg transition ${
                                            activeSection === l.id ? 'bg-white/10 text-cyan-300' : 'hover:bg-white/5 text-white/85'
                                        }`}
                                    >
                                        {l.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </header>
            )}

            <main>
                <section id="home" className="mx-auto max-w-6xl px-5 pt-16 pb-20">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                Hi,
                                <br />
                                I&apos;m <span className="text-cyan-300">{fullName}</span>
                                <br />
                                <span className="text-white/80 font-semibold">{role}</span>
                            </h1>

                            <div className="mt-7 flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => scrollTo('contact')}
                                    className="px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition"
                                >
                                    Contact
                                </button>
                                <a
                                    href={`mailto:${contactEmail}`}
                                    className="px-5 py-3 rounded-xl border border-white/15 text-white/90 hover:bg-white/5 transition inline-flex items-center gap-2"
                                >
                                    <Mail size={16} />
                                    <span>Email</span>
                                </a>
                            </div>

                            <div className="mt-8 flex items-center gap-3">
                                {linkedinUrl && (
                                    <a
                                        href={linkedinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-xl border border-white/10 hover:bg-white/5 transition"
                                        aria-label="LinkedIn"
                                    >
                                        <Linkedin size={18} />
                                    </a>
                                )}
                                {githubUrl && (
                                    <a
                                        href={githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-xl border border-white/10 hover:bg-white/5 transition"
                                        aria-label="GitHub"
                                    >
                                        <Github size={18} />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="justify-self-center w-full max-w-sm">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt={`Profile of ${fullName}`}
                                    className="w-full aspect-square object-cover rounded-[28px] border border-white/10 shadow-[0_30px_90px_-60px_rgba(34,211,238,0.9)]"
                                />
                            ) : (
                                <div className="w-full aspect-square rounded-[28px] border border-white/10 bg-gradient-to-br from-cyan-500/20 via-white/5 to-blue-500/20 flex items-center justify-center">
                                    <div className="text-6xl font-bold text-white/85">
                                        {(fullName.trim()[0] || 'S').toUpperCase()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section id="about" className="mx-auto max-w-6xl px-5 py-16 border-t border-white/10">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">About</h2>
                    <div className="grid md:grid-cols-2 gap-10 items-start">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                            <h3 className="font-semibold text-white/90 mb-3">Who I am</h3>
                            <p className="text-white/75 leading-relaxed whitespace-pre-line">
                                {about || 'Write a short professional summary in the editor to show here.'}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                            <h3 className="font-semibold text-white/90 mb-3">Education</h3>
                            <p className="text-white/75 leading-relaxed whitespace-pre-line">
                                {meta.education || 'B.Tech (Your Branch) — Your College (Year - Year)'}
                            </p>
                            <div className="mt-4 text-sm text-white/60">
                                Add this in the editor under meta.education.
                            </div>
                        </div>
                    </div>
                </section>

                <section id="skills" className="mx-auto max-w-6xl px-5 py-16 border-t border-white/10">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">Skills</h2>
                    {Array.isArray(skills) && skills.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {skills.slice(0, 8).map((s, idx) => {
                                const pct = progressForSkill(s, idx);
                                return (
                                    <div key={`${s}-${idx}`} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="font-semibold text-white/90">{String(s).replace(/\s*\d{1,3}\s*%$/, '')}</div>
                                            <div className="text-sm text-cyan-300 font-semibold">{pct}%</div>
                                        </div>
                                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-white/70 rounded-2xl border border-white/10 bg-white/5 p-6">
                            Add some skills in the editor to display them here.
                        </div>
                    )}
                </section>

                <section id="work" className="mx-auto max-w-6xl px-5 py-16 border-t border-white/10">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">Work</h2>
                    {Array.isArray(projects) && projects.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.slice(0, 6).map((p, idx) => {
                                const img = p?.image || p?.imageUrl || '';
                                return (
                                    <div key={idx} className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/7 transition">
                                        <div className="h-36 bg-gradient-to-br from-cyan-500/25 via-white/5 to-blue-500/25 relative">
                                            {img ? (
                                                <img src={img} alt={p?.title || `Project ${idx + 1}`} className="w-full h-full object-cover" />
                                            ) : null}
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-bold text-white/90">{p?.title || `Project ${idx + 1}`}</h3>
                                            <p className="text-sm text-white/70 mt-2 line-clamp-3">{p?.desc || 'Project description not provided.'}</p>
                                            {p?.tech && (
                                                <div className="mt-3 text-xs text-cyan-200/90 font-medium">{p.tech}</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-white/70 rounded-2xl border border-white/10 bg-white/5 p-6">
                            Add projects in the editor to show them here.
                        </div>
                    )}
                </section>

                <section id="contact" className="mx-auto max-w-6xl px-5 py-16 border-t border-white/10">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">Contact</h2>
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                            <div className="text-white/80 font-semibold">Reach me at</div>
                            <a className="mt-2 inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition" href={`mailto:${contactEmail}`}>
                                <Mail size={16} />
                                <span className="break-all">{contactEmail}</span>
                            </a>
                        </div>

                        <form
                            className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3"
                            onSubmit={(e) => {
                                e.preventDefault();
                                alert('This is a demo form. Use the email link to contact.');
                            }}
                        >
                            <input className="w-full px-4 py-3 rounded-xl bg-[#0b1220] border border-white/10 outline-none focus:ring-2 focus:ring-cyan-500/60" placeholder="Name" />
                            <input className="w-full px-4 py-3 rounded-xl bg-[#0b1220] border border-white/10 outline-none focus:ring-2 focus:ring-cyan-500/60" placeholder="Email" type="email" />
                            <textarea className="w-full px-4 py-3 rounded-xl bg-[#0b1220] border border-white/10 outline-none focus:ring-2 focus:ring-cyan-500/60 min-h-32" placeholder="Message" />
                            <button type="submit" className="w-full px-4 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition">
                                Send
                            </button>
                        </form>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 py-8">
                <div className="mx-auto max-w-6xl px-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="font-semibold text-white/85">{fullName}</div>
                    <div className="text-sm text-white/55">© {new Date().getFullYear()} All rights reserved</div>
                </div>
            </footer>

            <MadeWithBanner />
        </div>
    );
};

const BtechBedimcode2Template = ({ portfolio, about, skills, projects }) => {
    const meta = portfolio.meta && typeof portfolio.meta === 'object' ? portfolio.meta : {};
    const fullName = meta.fullName || 'Student';
    const contactEmail = meta.contactEmail || 'contact@example.com';
    const linkedinUrl = meta.linkedinUrl || '';
    const facultyFeedback = portfolio.facultyFeedback || '';

    const [showTop, setShowTop] = useState(false);

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 600);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const qualificationItems = [
        {
            title: meta.education || 'B.Tech — Your Branch',
            subtitle: meta.college || 'Your College / University',
            time: meta.educationYears || '20XX — 20XX',
        },
        {
            title: meta.experience || 'Internship / Training',
            subtitle: meta.company || 'Company / Lab / Club',
            time: meta.experienceYears || '20XX — 20XX',
        },
    ].filter((x) => String(x.title || '').trim() || String(x.subtitle || '').trim());

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white">
            <header className="mx-auto max-w-6xl px-5 py-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="text-sm text-white/60 tracking-wide uppercase">Portfolio</div>
                        <h1 className="text-3xl md:text-4xl font-bold mt-2">{fullName}</h1>
                        <p className="text-white/70 mt-2 max-w-2xl whitespace-pre-line">
                            {about || 'Add your professional summary in the editor to show it here.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {linkedinUrl && (
                            <a
                                href={linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition inline-flex items-center gap-2"
                            >
                                <Linkedin size={16} />
                                <span className="text-sm">LinkedIn</span>
                            </a>
                        )}
                        <a
                            href={`mailto:${contactEmail}`}
                            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition inline-flex items-center gap-2"
                        >
                            <Mail size={16} />
                            <span className="text-sm">Email</span>
                        </a>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-5 pb-16 space-y-14">
                <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h2 className="text-xl font-bold">Skills</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {Array.isArray(skills) && skills.length > 0 ? (
                            skills.map((s) => (
                                <span key={s} className="px-3 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/85">
                                    {s}
                                </span>
                            ))
                        ) : (
                            <span className="text-white/60">Add skills in the editor.</span>
                        )}
                    </div>
                </section>

                <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h2 className="text-xl font-bold">Qualification</h2>
                    <div className="mt-6 grid md:grid-cols-2 gap-6">
                        {qualificationItems.map((q, i) => (
                            <div key={i} className="rounded-2xl border border-white/10 bg-[#0b1220]/60 p-5">
                                <div className="text-cyan-300 text-sm font-semibold">{q.time}</div>
                                <div className="mt-2 text-lg font-bold text-white/90">{q.title}</div>
                                <div className="mt-1 text-sm text-white/65">{q.subtitle}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h2 className="text-xl font-bold">Projects</h2>
                    <div className="mt-6 grid md:grid-cols-2 gap-5">
                        {Array.isArray(projects) && projects.length > 0 ? (
                            projects.map((p, i) => (
                                <div key={i} className="rounded-2xl border border-white/10 bg-[#0b1220]/60 p-5">
                                    <div className="font-bold text-white/90">{p.title || `Project ${i + 1}`}</div>
                                    <div className="text-sm text-white/65 mt-2 whitespace-pre-line">{p.desc || 'Project description not provided.'}</div>
                                    <ProjectAttachments p={p} dark />
                                    {p.tech && <div className="mt-3 text-xs text-cyan-200/90 font-semibold">{p.tech}</div>}
                                </div>
                            ))
                        ) : (
                            <div className="text-white/60">Add projects in the editor.</div>
                        )}
                    </div>
                </section>

                <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h2 className="text-xl font-bold">Testimonial</h2>
                    <div className="mt-4 rounded-2xl border border-white/10 bg-[#0b1220]/60 p-5 text-white/75 whitespace-pre-line">
                        {facultyFeedback || 'Faculty feedback will appear here once provided.'}
                    </div>
                </section>

                <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h2 className="text-xl font-bold">Contact</h2>
                    <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                        <div className="text-white/70 break-all">{contactEmail}</div>
                        <a
                            href={`mailto:${contactEmail}`}
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition"
                        >
                            <Mail size={16} />
                            <span>Send Email</span>
                        </a>
                    </div>
                </section>
            </main>

            {showTop && !exportMode && (
                <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-6 right-6 p-3 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/15 backdrop-blur transition"
                    aria-label="Scroll to top"
                >
                    <ChevronUp size={18} />
                </button>
            )}

            <MadeWithBanner />
        </div>
    );
};

const BtechMechClassicTemplate = ({
    portfolio,
    about,
    skills,
    projects,
    certifications,
    exportMode = false,
    EditableText,
    ProjectAttachments,
    commitRoot,
    commitMeta,
    commitProject,
    updateSkillItem,
    addSkillItem,
    removeSkillItem,
    updateCertificationItem,
    isEditable = false,
    Footer,
}) => {
    const meta = portfolio.meta && typeof portfolio.meta === 'object' ? portfolio.meta : {};
    const fullName = meta.fullName || 'Mechanical Engineering Student';
    const role = meta.role || 'Mechanical Engineering Portfolio';
    const greetingText = meta.greetingText || 'Hey there!';
    const aboutHeading = meta.aboutHeading || 'ABOUT';
    const workHeading = meta.workHeading || 'WORK';
    const contactHeading = meta.contactHeading || 'CONTACT';
    const contactLead = meta.contactLead || 'Feel free to contact me.';
    const contactEmail = meta.contactEmail || 'contact@example.com';
    const linkedinUrl = meta.linkedinUrl || '';
    const githubUrl = meta.githubUrl || '';
    const profileImage = meta.profileImage || projects?.find((p) => p?.image)?.image || '';
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [showTop, setShowTop] = useState(false);

    const navLinks = useMemo(
        () => ([
            { id: 'about', label: 'About' },
            { id: 'work', label: 'Work' },
            { id: 'contact', label: 'Contact' },
        ]),
        []
    );

    useEffect(() => {
        if (exportMode) return undefined;
        const ids = ['home', ...navLinks.map((item) => item.id)];
        const observers = [];

        ids.forEach((sectionId) => {
            const el = document.getElementById(sectionId);
            if (!el) return;
            const obs = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) setActiveSection(sectionId);
                    });
                },
                { root: null, threshold: 0.35 }
            );
            obs.observe(el);
            observers.push(obs);
        });

        const onScroll = () => setShowTop(window.scrollY > 420);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            observers.forEach((obs) => obs.disconnect());
            window.removeEventListener('scroll', onScroll);
        };
    }, [exportMode, navLinks]);

    const scrollTo = (sectionId) => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const parsedSkills = (Array.isArray(skills) ? skills : []).slice(0, 8).map((skill, idx) => {
        const raw = String(skill || '').trim();
        const match = raw.match(/^(.*?)(?:\s*[-:]\s*|\s+)(\d{1,3})%$/) || raw.match(/^(.*?)[( ](\d{1,3})%[)]?$/);
        const percent = Math.max(35, Math.min(100, Number(match?.[2] || [90, 80, 75, 70, 65, 60, 55, 50][idx % 8])));
        const label = String(match?.[1] || raw || `Skill ${idx + 1}`).trim();
        return { label, percent, sourceIndex: idx, accent: idx % 2 === 0 ? '#7372dd' : '#b7b6fd' };
    });

    const leftSkills = parsedSkills.filter((_, idx) => idx % 2 === 0);
    const rightSkills = parsedSkills.filter((_, idx) => idx % 2 === 1);
    const featuredProjects = (Array.isArray(projects) ? projects : []).slice(0, 3);
    const getProjectImage = (project) => project?.image || project?.imageUrl || '';
    const defaultWorkHighlights = [
        { title: 'Responsive', text: 'Layouts adapt cleanly across desktop, tablet, and mobile screens.' },
        { title: 'Precise', text: 'Design decisions focus on clarity, usability, and practical engineering communication.' },
        { title: 'Intuitive', text: 'Sections are structured to make technical work easy to scan and understand.' },
        { title: 'Dynamic', text: 'Project stories, visuals, and links bring the portfolio to life.' },
    ];
    const workHighlights = Array.isArray(meta.workHighlights) && meta.workHighlights.length > 0
        ? meta.workHighlights
        : defaultWorkHighlights;

    return (
        <div className="min-h-screen bg-white text-slate-800">
            {!exportMode && (
                <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
                    <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
                        <button
                            type="button"
                            onClick={() => scrollTo('home')}
                            className="text-lg font-semibold tracking-wide text-[#7372dd]"
                        >
                            {fullName.split(' ')[0] || fullName}
                        </button>

                        <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
                            {navLinks.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => scrollTo(item.id)}
                                    className={activeSection === item.id ? 'text-[#7372dd]' : 'hover:text-[#7372dd]'}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="rounded-lg border border-slate-300 p-2 md:hidden"
                            onClick={() => setMenuOpen((value) => !value)}
                            aria-label="Toggle navigation"
                        >
                            {menuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </nav>

                    {menuOpen && (
                        <div className="border-t border-slate-200 px-5 py-3 md:hidden">
                            <div className="flex flex-col gap-2">
                                {navLinks.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            scrollTo(item.id);
                                        }}
                                        className="rounded-lg px-3 py-2 text-left text-slate-700 hover:bg-slate-100"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </header>
            )}

            <section id="home" className="px-6 pb-12 pt-24 text-center">
                <div className="mx-auto max-w-5xl">
                    <EditableText
                        as="div"
                        className="font-['Lobster','cursive'] text-5xl text-slate-700 sm:text-6xl"
                        value={greetingText}
                        placeholder="Hey there!"
                        onCommit={(value) => commitMeta('greetingText', value)}
                    />
                    <div className="mt-4 text-4xl font-semibold text-slate-700 sm:text-5xl">
                        I am{' '}
                        <EditableText
                            as="span"
                            className="text-[#7372dd]"
                            value={fullName}
                            placeholder="Your Name"
                            onCommit={(value) => commitMeta('fullName', value)}
                        />
                    </div>
                    <EditableText
                        as="p"
                        className="mx-auto mt-4 max-w-2xl text-lg text-slate-600"
                        value={about}
                        placeholder="A passionate Mechanical Engineering student building practical systems and products."
                        onCommit={(value) => commitRoot('about', value)}
                    />
                    <EditableText
                        as="p"
                        className="mt-3 text-sm uppercase tracking-[0.28em] text-slate-400"
                        value={role}
                        placeholder="Mechanical Engineering Portfolio"
                        onCommit={(value) => commitMeta('role', value)}
                    />
                </div>
            </section>

            <section id="about" className="bg-slate-100 px-6 py-16">
                <div className="mx-auto max-w-6xl">
                    <EditableText
                        as="h2"
                        className="text-center text-4xl font-bold tracking-wide text-slate-700"
                        value={aboutHeading}
                        placeholder="ABOUT"
                        onCommit={(value) => commitMeta('aboutHeading', value)}
                    />
                    <div className="mx-auto mt-4 h-1 w-24 bg-slate-300" />

                    <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr]">
                        <div>
                            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                                {profileImage ? (
                                    <img src={profileImage} alt={fullName} className="h-[360px] w-full object-cover" />
                                ) : (
                                    <div className="flex h-[360px] items-center justify-center bg-gradient-to-br from-[#d9d8ff] via-white to-[#f0efff] px-8 text-center text-slate-500">
                                        Add a profile image in the editor to personalize this section.
                                    </div>
                                )}
                            </div>
                            {isEditable && (
                                <input
                                    type="text"
                                    value={profileImage}
                                    onChange={(e) => commitMeta('profileImage', e.target.value)}
                                    placeholder="Profile image URL"
                                    className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                                />
                            )}
                            <h3 className="mt-6 text-2xl font-semibold text-slate-700">Who am I?</h3>
                            <EditableText
                                as="p"
                                className="mt-3 text-justify leading-7 text-slate-600"
                                value={about}
                                placeholder="Write a short introduction about your background, interests, and engineering focus."
                                onCommit={(value) => commitRoot('about', value)}
                            />
                        </div>

                        <div>
                            <h3 className="text-2xl font-semibold tracking-wide text-slate-700">SKILLS</h3>
                            <div id="skills" className="mt-6 grid gap-6 lg:grid-cols-2">
                                {[leftSkills, rightSkills].map((column, columnIndex) => (
                                    <div key={columnIndex} className="space-y-5">
                                        {column.length > 0 ? column.map((skillItem) => (
                                            <div key={`${skillItem.label}-${skillItem.percent}`} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                                                <div className="mb-2 flex items-center justify-between gap-4">
                                                    <EditableText
                                                        as="span"
                                                        className="font-semibold text-slate-700"
                                                        value={skillItem.label}
                                                        placeholder={`Skill ${skillItem.sourceIndex + 1}`}
                                                        onCommit={(value) => updateSkillItem(skillItem.sourceIndex, `${value} ${skillItem.percent}%`)}
                                                    />
                                                    <EditableText
                                                        as="span"
                                                        className="text-sm font-semibold text-slate-500"
                                                        value={`${skillItem.percent}%`}
                                                        placeholder="80%"
                                                        onCommit={(value) => {
                                                            const nextPercent = Math.max(35, Math.min(100, Number(String(value || '').replace(/[^\d]/g, '') || skillItem.percent)));
                                                            updateSkillItem(skillItem.sourceIndex, `${skillItem.label} ${nextPercent}%`);
                                                        }}
                                                    />
                                                </div>
                                                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{ width: `${skillItem.percent}%`, backgroundColor: skillItem.accent }}
                                                    />
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="rounded-2xl bg-white p-5 text-slate-500 shadow-sm ring-1 ring-slate-200">
                                                Add skills in the editor to show mechanical tools and competencies.
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {isEditable && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => addSkillItem('New Skill 80%')}
                                        className="rounded-lg bg-[#7372dd] px-3 py-1 text-sm font-medium text-white"
                                    >
                                        Add skill
                                    </button>
                                    {Array.isArray(skills) && skills.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeSkillItem(Math.max(0, skills.length - 1))}
                                            className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium text-slate-600"
                                        >
                                            Remove last
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section id="work" className="px-6 py-16">
                <div className="mx-auto max-w-6xl">
                    <EditableText
                        as="h2"
                        className="text-center text-4xl font-bold tracking-wide text-slate-700"
                        value={workHeading}
                        placeholder="WORK"
                        onCommit={(value) => commitMeta('workHeading', value)}
                    />
                    <div className="mx-auto mt-4 h-1 w-24 bg-slate-300" />

                    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {workHighlights.map((item, index) => (
                            <div key={`${item.title || 'highlight'}-${index}`} className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#7372dd]/10 text-2xl font-bold text-[#7372dd]">
                                    {String(item.title || 'H').charAt(0)}
                                </div>
                                <EditableText
                                    as="h3"
                                    className="mt-5 font-['Lobster','cursive'] text-3xl text-slate-700"
                                    value={item.title}
                                    placeholder={`Highlight ${index + 1}`}
                                    onCommit={(value) => {
                                        const next = [...workHighlights];
                                        next[index] = { ...(next[index] || {}), title: value };
                                        commitMeta('workHighlights', next);
                                    }}
                                />
                                <EditableText
                                    as="p"
                                    className="mt-3 leading-7 text-slate-600"
                                    value={item.text}
                                    placeholder="Highlight description"
                                    onCommit={(value) => {
                                        const next = [...workHighlights];
                                        next[index] = { ...(next[index] || {}), text: value };
                                        commitMeta('workHighlights', next);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    {isEditable && (
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => commitMeta('workHighlights', [...workHighlights, { title: 'New Highlight', text: 'Describe this highlight.' }])}
                                className="rounded-lg bg-[#7372dd] px-3 py-1 text-sm font-medium text-white"
                            >
                                Add highlight
                            </button>
                            {workHighlights.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => commitMeta('workHighlights', workHighlights.slice(0, -1))}
                                    className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium text-slate-600"
                                >
                                    Remove last
                                </button>
                            )}
                        </div>
                    )}

                    <div className="mt-16">
                        <h3 className="text-center text-3xl font-semibold tracking-wide text-slate-700">PROJECT SHOWCASE</h3>
                        <div className="mx-auto mt-8 max-w-5xl text-justify leading-7 text-slate-600">
                            {(Array.isArray(projects) && projects.length > 0) ? (
                                <EditableText
                                    as="p"
                                    value={projects[0]?.desc}
                                    placeholder="Use this area to introduce your best mechanical engineering project, design system, lab build, or fabrication work."
                                    onCommit={(value) => commitProject(0, 'desc', value)}
                                />
                            ) : (
                                <p>Add projects in the editor to populate this showcase area.</p>
                            )}
                        </div>

                        <div className="mt-10 grid gap-6 md:grid-cols-3">
                            {featuredProjects.length > 0 ? featuredProjects.map((project, index) => (
                                <article key={`${project.title || 'project'}-${index}`} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                                    <div className="aspect-[4/3] bg-slate-100">
                                        {getProjectImage(project) ? (
                                            <img src={getProjectImage(project)} alt={project.title || `Project ${index + 1}`} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#d9d8ff] to-white px-6 text-center text-slate-500">
                                                Add a project image in the editor
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <EditableText
                                            as="h4"
                                            className="text-xl font-semibold text-slate-700"
                                            value={project.title}
                                            placeholder={`Project ${index + 1}`}
                                            onCommit={(value) => commitProject(index, 'title', value)}
                                        />
                                        <EditableText
                                            as="p"
                                            className="mt-3 text-sm leading-6 text-slate-600"
                                            value={project.desc}
                                            placeholder="Describe this project."
                                            onCommit={(value) => commitProject(index, 'desc', value)}
                                        />
                                        {isEditable && (
                                            <input
                                                type="text"
                                                value={getProjectImage(project)}
                                                onChange={(e) => commitProject(index, 'image', e.target.value)}
                                                placeholder="Project image URL"
                                                className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700"
                                            />
                                        )}
                                        <ProjectAttachments p={project} />
                                    </div>
                                </article>
                            )) : (
                                [0, 1, 2].map((index) => (
                                    <div key={index} className="flex min-h-[280px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center text-slate-500">
                                        Add project details and images in the editor.
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section id="contact" className="bg-slate-100 px-6 py-16">
                <div className="mx-auto max-w-5xl text-center">
                    <EditableText
                        as="h2"
                        className="text-4xl font-bold tracking-wide text-slate-700"
                        value={contactHeading}
                        placeholder="CONTACT"
                        onCommit={(value) => commitMeta('contactHeading', value)}
                    />
                    <div className="mx-auto mt-4 h-1 w-24 bg-slate-300" />
                    <EditableText
                        as="p"
                        className="mx-auto mt-6 max-w-2xl text-slate-600"
                        value={contactLead}
                        placeholder="Feel free to contact me."
                        onCommit={(value) => commitMeta('contactLead', value)}
                    />

                    {isEditable && (
                        <div className="mx-auto mt-6 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
                            <input
                                type="text"
                                value={contactEmail}
                                onChange={(e) => commitMeta('contactEmail', e.target.value)}
                                placeholder="Email"
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                            />
                            <input
                                type="text"
                                value={linkedinUrl}
                                onChange={(e) => commitMeta('linkedinUrl', e.target.value)}
                                placeholder="LinkedIn URL"
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                            />
                            <input
                                type="text"
                                value={githubUrl}
                                onChange={(e) => commitMeta('githubUrl', e.target.value)}
                                placeholder="GitHub URL"
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                            />
                        </div>
                    )}

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <a
                            href={`mailto:${contactEmail}`}
                            className="inline-flex items-center gap-2 rounded-full bg-[#7372dd] px-5 py-3 text-sm font-semibold text-white hover:bg-[#6261d2]"
                        >
                            <Mail size={16} />
                            <EditableText
                                as="span"
                                value={contactEmail}
                                placeholder="contact@example.com"
                                onCommit={(value) => commitMeta('contactEmail', value)}
                            />
                        </a>
                        {linkedinUrl && (
                            <a
                                href={linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-[#0077b5] px-5 py-3 text-sm font-semibold text-white"
                            >
                                <Linkedin size={16} />
                                <span>LinkedIn</span>
                            </a>
                        )}
                        {githubUrl && (
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                            >
                                <Github size={16} />
                                <span>GitHub</span>
                            </a>
                        )}
                    </div>

                    {Array.isArray(certifications) && certifications.length > 0 && (
                        <div className="mt-12 rounded-3xl bg-white p-8 text-left shadow-sm ring-1 ring-slate-200">
                            <h3 className="text-2xl font-semibold text-slate-700">Certifications</h3>
                            <div className="mt-5 space-y-3">
                                {certifications.map((item, index) => (
                                    <div key={`${item.name || 'cert'}-${index}`} className="rounded-2xl border border-slate-200 px-4 py-3">
                                        <EditableText
                                            as="div"
                                            className="font-semibold text-slate-700"
                                            value={item.name}
                                            placeholder={`Certification ${index + 1}`}
                                            onCommit={(value) => updateCertificationItem(index, 'name', value)}
                                        />
                                        <EditableText
                                            as="div"
                                            className="text-sm text-slate-500"
                                            value={item.issuer}
                                            placeholder="Issuer"
                                            onCommit={(value) => updateCertificationItem(index, 'issuer', value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {!exportMode && showTop && (
                <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-6 right-6 rounded-full bg-[#7372dd] p-3 text-white shadow-lg"
                    aria-label="Scroll to top"
                >
                    <ChevronUp size={18} />
                </button>
            )}

            <Footer />
        </div>
    );
};

export default PortfolioView;




