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
        minGpa: 3.5,
        requiredSkills: ['React', 'JavaScript'],
        description: '3 month summer internship for React developers.'
    },
    {
        id: '2',
        title: 'Academic Excellence Scholarship',
        company: 'University Foundation',
        type: 'Scholarship',
        minGpa: 3.8,
        requiredSkills: [],
        description: 'Scholarship for high achieving students.'
    },
    {
        id: '3',
        title: 'Full Stack Engineer',
        company: 'StartupX',
        type: 'Internship',
        minGpa: 3.0,
        requiredSkills: ['Node.js', 'React', 'MongoDB'],
        description: 'Fast paced startup environment.'
    }
];

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
];

export const DataProvider = ({ children }) => {
    const [portfolios, setPortfolios] = useState({});
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
    const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
    const [users, setUsers] = useState([]); // Mock user registry for Admin

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

        // Keep dashboards in sync when another role updates portfolio scores/content.
        const pollId = setInterval(() => {
            loadPortfolios();
        }, 10000);

        return () => {
            clearInterval(pollId);
        };
    }, [loadPortfolios]);

    const savePortfolio = async (studentId, data) => {
        if (!studentId) throw new Error('Missing student id.');
        const existing = portfolios[studentId] || {};

        const normalized = {
            studentId,
            about: data?.about || '',
            skills: Array.isArray(data?.skills) ? data.skills : [],
            projects: Array.isArray(data?.projects) ? data.projects : [],
            certifications: Array.isArray(data?.certifications) ? data.certifications : [],
            meta: data?.meta && typeof data.meta === 'object' ? data.meta : {},
            templateId: data?.templateId || 'modern',
            score: data?.score !== undefined ? data.score : (existing.score ?? ''),
            facultyFeedback:
                data?.facultyFeedback !== undefined
                    ? data.facultyFeedback
                    : (existing.facultyFeedback ?? ''),
            lastUpdated: new Date().toISOString(),
        };

        const payload = {
            about: normalized.about,
            skills: normalized.skills,
            projects: normalized.projects,
            certifications: normalized.certifications,
            meta: normalized.meta,
            template_id: normalized.templateId,
            score: normalized.score === '' ? null : normalized.score,
            faculty_feedback: normalized.facultyFeedback || '',
            last_updated: normalized.lastUpdated,
        };

        // Avoid relying on ON CONFLICT in case existing DB table missed unique constraint on student_id
        const { data: updatedRows, error: updateError } = await supabase
            .from('portfolios')
            .update(payload)
            .eq('student_id', normalized.studentId)
            .select('student_id');

        if (updateError) throw updateError;

        if (!updatedRows || updatedRows.length === 0) {
            const { error: insertError } = await supabase
                .from('portfolios')
                .insert({
                    student_id: normalized.studentId,
                    ...payload,
                });
            if (insertError) throw insertError;
        }

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
            refreshPortfolios: loadPortfolios,
            addReview,
            getStudentPortfolio,
            getAllPortfolios,
            analyzePortfolio // Exposed for UC2
        }}>
            {children}
        </DataContext.Provider>
    );
};
