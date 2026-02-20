import React, { createContext, useContext, useState, useEffect } from 'react';

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
    const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
    const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
    const [users, setUsers] = useState([]); // Mock user registry for Admin

    useEffect(() => {
        const storedPortfolios = localStorage.getItem('dps_portfolios');
        const storedReviews = localStorage.getItem('dps_reviews');

        if (storedPortfolios) {
            try {
                const parsed = JSON.parse(storedPortfolios);
                // Ensure all portfolios have studentId set
                const updated = {};
                Object.keys(parsed).forEach(studentId => {
                    updated[studentId] = { ...parsed[studentId], studentId };
                });
                setPortfolios(updated);
                // Update localStorage if we fixed any missing studentIds
                if (JSON.stringify(parsed) !== JSON.stringify(updated)) {
                    localStorage.setItem('dps_portfolios', JSON.stringify(updated));
                }
            } catch (e) {
                console.error("Failed to parse portfolios", e);
            }
        }
        if (storedReviews) {
            try {
                setReviews(JSON.parse(storedReviews));
            } catch (e) {
                console.error("Failed to parse reviews", e);
            }
        }
    }, []);

    const savePortfolio = (studentId, data) => {
        const updated = { ...portfolios, [studentId]: { ...data, studentId, lastUpdated: new Date().toISOString() } };
        setPortfolios(updated);
        localStorage.setItem('dps_portfolios', JSON.stringify(updated));
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
