import React, { createContext, useContext, useState, useEffect } from 'react';
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
    { id: 'modern', name: 'Modern Minimal', description: 'Clean and whitespace heavy' },
    { id: 'creative', name: 'Creative Bold', description: 'Colorful and dynamic' },
    { id: 'academic', name: 'Academic Professional', description: 'Structured and detailed' }
];

export const DataProvider = ({ children }) => {
    const [portfolios, setPortfolios] = useState({});
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
    const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
    const [users, setUsers] = useState([]); // Mock user registry for Admin

    useEffect(() => {
        const storedReviews = localStorage.getItem('dps_reviews');
        let alive = true;

        if (storedReviews) {
            try {
                setReviews(JSON.parse(storedReviews));
            } catch (e) {
                console.error("Failed to parse reviews", e);
            }
        }

        const loadPortfolios = async () => {
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
                        templateId: row.template_id || 'modern',
                        score: row.score ?? '',
                        lastUpdated: row.last_updated || row.updated_at || new Date().toISOString(),
                    };
                });

                if (alive) setPortfolios(mapped);
            } catch (error) {
                console.error('Failed to load portfolios from Supabase:', error);
            } finally {
                if (alive) setLoading(false);
            }
        };

        loadPortfolios();

        return () => {
            alive = false;
        };
    }, []);

    const savePortfolio = async (studentId, data) => {
        if (!studentId) throw new Error('Missing student id.');

        const normalized = {
            studentId,
            about: data?.about || '',
            skills: Array.isArray(data?.skills) ? data.skills : [],
            projects: Array.isArray(data?.projects) ? data.projects : [],
            certifications: Array.isArray(data?.certifications) ? data.certifications : [],
            templateId: data?.templateId || 'modern',
            score: data?.score ?? '',
            lastUpdated: new Date().toISOString(),
        };

        const payload = {
            about: normalized.about,
            skills: normalized.skills,
            projects: normalized.projects,
            certifications: normalized.certifications,
            template_id: normalized.templateId,
            score: normalized.score === '' ? null : normalized.score,
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

    const getStudentPortfolio = (studentId) => portfolios[studentId] || null;

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
            addReview,
            getStudentPortfolio,
            getAllPortfolios,
            analyzePortfolio // Exposed for UC2
        }}>
            {children}
        </DataContext.Provider>
    );
};
