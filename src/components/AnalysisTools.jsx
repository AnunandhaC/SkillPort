import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataProvider';
import { AlertCircle, Briefcase, GraduationCap, Download, FileText, FileDown, Send, Bot, User, Sparkles } from 'lucide-react';

export const SuggestionEngine = ({ portfolio }) => {
    const { analyzePortfolio, getPortfolioCompletion } = useData();
    const suggestions = useMemo(() => analyzePortfolio(portfolio), [portfolio, analyzePortfolio]);
    const completion = useMemo(() => getPortfolioCompletion(portfolio), [portfolio, getPortfolioCompletion]);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Initialize with welcome message and suggestions
    useEffect(() => {
        if (messages.length === 0 && portfolio) {
            const welcomeMessage = {
                id: Date.now(),
                type: 'bot',
                text: `Hello! I'm your Portfolio Assistant. Your portfolio is ${completion.percentage}% complete (${completion.completedCount}/${completion.totalCount} criteria finished). ${suggestions.length > 0 ? 'I have some suggestions for you:' : 'Your portfolio looks great!'}`
            };
            const initialMessages = [welcomeMessage];
            
            if (suggestions.length > 0) {
                suggestions.forEach((suggestion, index) => {
                    initialMessages.push({
                        id: Date.now() + index + 1,
                        type: 'bot',
                        text: suggestion
                    });
                });
            } else {
                initialMessages.push({
                    id: Date.now() + 1,
                    type: 'bot',
                    text: 'Your portfolio is well-structured! Feel free to ask me any questions about improving it further.'
                });
            }
            
            setMessages(initialMessages);
        }
    }, [portfolio, suggestions, completion, messages.length]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const generateResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();
        const missingCriteria = completion.criteria.filter((item) => !item.completed);

        if (
            lowerMessage.includes('percentage')
            || lowerMessage.includes('percent')
            || lowerMessage.includes('completion')
            || lowerMessage.includes('complete')
        ) {
            if (missingCriteria.length === 0) {
                return `Your portfolio is ${completion.percentage}% complete. You've finished all ${completion.totalCount} portfolio criteria.`;
            }

            return `Your portfolio is ${completion.percentage}% complete (${completion.completedCount}/${completion.totalCount} criteria done).\n\nTo improve it further, add:\n${missingCriteria.map((item, index) => `${index + 1}. ${item.label}`).join('\n')}`;
        }
        
        // Portfolio analysis queries
        if (lowerMessage.includes('suggest') || lowerMessage.includes('improve') || lowerMessage.includes('help')) {
            if (suggestions.length > 0) {
                return `Your portfolio is currently ${completion.percentage}% complete.\n\nBased on your portfolio, here are my recommendations:\n\n${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n\n')}\n\nWould you like me to elaborate on any of these?`;
            }
            return `Your portfolio is ${completion.percentage}% complete and looks great! To make it even better, consider adding more detailed project descriptions, showcasing your best work prominently, and keeping your skills section updated.`;
        }

        // Skills related
        if (lowerMessage.includes('skill')) {
            const skills = portfolio?.skills || [];
            if (skills.length === 0) {
                return 'I notice you haven\'t added any skills yet. Adding relevant skills helps employers quickly understand your expertise. Consider adding technical skills, programming languages, tools, and soft skills that match your projects and career goals.';
            }
            return `You have ${skills.length} skill${skills.length > 1 ? 's' : ''} listed: ${skills.join(', ')}. That's a good start! Consider adding more specific skills related to your projects, or skills that are in demand for your target roles.`;
        }

        // Projects related
        if (lowerMessage.includes('project')) {
            const projects = portfolio?.projects || [];
            if (projects.length === 0) {
                return 'Projects are crucial for showcasing your practical experience! Add projects that demonstrate your skills, problem-solving abilities, and technical expertise. Include a clear title, description, technologies used, and if possible, links to live demos or GitHub repositories.';
            }
            return `You have ${projects.length} project${projects.length > 1 ? 's' : ''} listed. Great! To make them stand out more, ensure each project has:\n- A clear, descriptive title\n- Detailed description of what it does\n- Technologies/tools used\n- Your role and contributions\n- Links to demos or code (if available)`;
        }

        // About section
        if (lowerMessage.includes('about') || lowerMessage.includes('summary') || lowerMessage.includes('bio')) {
            const about = portfolio?.about || '';
            if (!about || about.length < 50) {
                return 'Your "About" section is your first impression! Write a compelling professional summary (50+ words) that highlights:\n- Who you are professionally\n- Your key skills and interests\n- What makes you unique\n- Your career goals or what you\'re looking for\n\nThis helps visitors quickly understand your value proposition.';
            }
            return `Your "About" section looks good! Make sure it's engaging and clearly communicates your professional identity. Consider updating it regularly to reflect your latest achievements and goals.`;
        }

        // Certifications
        if (lowerMessage.includes('certif') || lowerMessage.includes('certificate')) {
            const certs = portfolio?.certifications || [];
            if (certs.length === 0) {
                return 'Certifications add credibility to your portfolio! Consider adding:\n- Professional certifications\n- Online course completions\n- Workshop or training certificates\n- Academic achievements\n\nThese show your commitment to continuous learning and professional development.';
            }
            return `You have ${certs.length} certification${certs.length > 1 ? 's' : ''} listed. Excellent! Certifications validate your skills and show employers that you're committed to professional growth.`;
        }

        // Template/design
        if (lowerMessage.includes('template') || lowerMessage.includes('design') || lowerMessage.includes('look')) {
            const template = portfolio?.templateId || 'modern';
            const templateNames = {
                modern: 'Modern Minimal',
                academic: 'Academic Professional',
                btech: 'BTech General',
                'btech-bedimcode-1': 'BTech Classic (Bedimcode style)',
                'btech-bedimcode-2': 'BTech Sections (Qualification style)',
                'btech-cs': 'BTech Computer Science',
                'btech-cs-unicons': 'BTech CS Unicons Sections',
                'btech-mech': 'BTech Mechanical',
                'btech-mech-wajiha': 'Mechanical Portfolio Classic',
                'btech-eee': 'BTech Electrical',
                'btech-ece': 'BTech Electronics',
                'btech-robo': 'BTech Robotics',
                'barch-red': 'BArch Red Studio',
                'barch-cs': 'BArch Computer Science',
                'barch-mech': 'BArch Mechanical',
                'barch-eee': 'BArch Electrical',
                'barch-ece': 'BArch Electronics',
                'barch-robo': 'BArch Robotics',
                'barch-portfolio-a': 'BArch Portfolio Book',
                'barch-portfolio-b': 'BArch Slate Journal'
            };
            return `You're currently using the "${templateNames[template] || 'Modern Minimal'}" template. Each template has its own unique style tailored for your program and department.\n\nYou can change templates anytime in the Portfolio Editor!`;
        }

        // General portfolio questions
        if (lowerMessage.includes('what') && (lowerMessage.includes('missing') || lowerMessage.includes('need'))) {
            const missing = [];
            if (!portfolio?.about || portfolio.about.length < 50) missing.push('a detailed About section');
            if (!portfolio?.skills || portfolio.skills.length === 0) missing.push('Skills section');
            if (!portfolio?.projects || portfolio.projects.length === 0) missing.push('Projects');
            if (!portfolio?.certifications || portfolio.certifications.length === 0) missing.push('Certifications');
            
            if (missing.length > 0) {
                return `Your portfolio is ${completion.percentage}% complete.\n\nYour portfolio could benefit from:\n\n${missing.map((m, i) => `${i + 1}. ${m}`).join('\n')}\n\nThese elements help create a complete and professional portfolio that showcases your full potential!`;
            }
            return `Your portfolio is ${completion.percentage}% complete and has all the essential elements! Consider adding more details, updating content regularly, and showcasing your best work prominently.`;
        }

        // Default responses
        const defaultResponses = [
            'That\'s a great question! Based on your portfolio, I\'d recommend focusing on showcasing your best projects prominently and keeping your skills section updated.',
            'I can help you with portfolio improvements, suggestions, or answer questions about your current portfolio. Try asking about skills, projects, certifications, or how to improve specific sections.',
            'Feel free to ask me about:\n- How to improve your portfolio\n- What sections need work\n- Skills and projects\n- Certifications\n- Portfolio design and templates',
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    };

    const handleSend = async () => {
        if (!inputValue.trim() || isTyping) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: inputValue.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(() => {
            const botResponse = {
                id: Date.now() + 1,
                type: 'bot',
                text: generateResponse(userMessage.text)
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 800);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!portfolio) {
        return (
            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400">
                <p>Create a portfolio first to get personalized suggestions and chat with your Portfolio Assistant!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[600px] bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                        <Bot className="text-blue-400" size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                            Portfolio Assistant
                            <Sparkles className="text-yellow-400" size={16} />
                        </h3>
                        <p className="text-xs text-slate-400">Ask me anything about your portfolio</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {message.type === 'bot' && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                                <Bot className="text-blue-400" size={16} />
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                message.type === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-800 text-slate-100 border border-slate-700'
                            }`}
                        >
                            <p className="text-sm whitespace-pre-line">{message.text}</p>
                        </div>
                        {message.type === 'user' && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                                <User className="text-purple-400" size={16} />
                            </div>
                        )}
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex gap-3 justify-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                            <Bot className="text-blue-400" size={16} />
                        </div>
                        <div className="bg-slate-800 text-slate-100 border border-slate-700 rounded-2xl px-4 py-2">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700 bg-slate-900/50">
                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about your portfolio..."
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isTyping}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isTyping}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">Try: "How can I improve my portfolio?" or "What skills should I add?"</p>
            </div>
        </div>
    );
};

export const OpportunityMatcher = ({ portfolio }) => {
    const { opportunities, savePortfolio, refreshPortfolios } = useData();
    const parseOptionalNumber = (value) => {
        const normalized = String(value ?? '').replace(/,/g, '').trim();
        if (!normalized) return Number.NaN;
        return Number(normalized);
    };
    const portfolioMeta = portfolio?.meta && typeof portfolio.meta === 'object' ? portfolio.meta : {};
    const savedIncome =
        portfolio?.familyIncome ??
        portfolioMeta.familyIncome ??
        portfolioMeta.annualIncome ??
        portfolioMeta.householdIncome ??
        portfolioMeta.income ??
        '';
    const savedGpa =
        portfolio?.currentGpa ??
        portfolioMeta.currentGpa ??
        portfolioMeta.gpa ??
        '';
    const [incomeInput, setIncomeInput] = useState('');
    const [gpaInput, setGpaInput] = useState('');
    const [isSavingEligibility, setIsSavingEligibility] = useState(false);
    const [eligibilityStatus, setEligibilityStatus] = useState(null);
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);

    useEffect(() => {
        setIncomeInput(savedIncome === '' ? '' : String(savedIncome));
        setGpaInput(savedGpa === '' ? '' : String(savedGpa));
    }, [savedIncome, savedGpa]);

    const scholarshipMatches = useMemo(() => {
        if (!portfolio) return [];
        const studentIncome = parseOptionalNumber(savedIncome);

        return opportunities.filter((opp) => {
            if (opp.type !== 'Scholarship') return false;
            if (
                opp.incomeLimit !== undefined &&
                opp.incomeLimit !== null &&
                opp.incomeLimit !== ''
            ) {
                if (!Number.isFinite(studentIncome)) return false;
                return studentIncome <= Number(opp.incomeLimit);
            }
            return true;
        });
    }, [portfolio, opportunities, savedIncome]);

    // Simple Mock Matching Logic
    const internshipMatches = useMemo(() => {
        if (!portfolio) return [];
        const studentSkills = new Set(portfolio.skills?.map(s => s.toLowerCase()) || []);
        const studentGpa = parseOptionalNumber(savedGpa);

        return opportunities.filter(opp => {
            if (opp.type !== 'Internship') return false;

            if (
                opp.minGpa !== undefined &&
                opp.minGpa !== null &&
                opp.minGpa !== ''
            ) {
                if (!Number.isFinite(studentGpa)) return false;
                if (studentGpa < Number(opp.minGpa)) return false;
            }

            // If no skills required or student has at least one matching skill
            if (opp.requiredSkills.length === 0) return true;
            return opp.requiredSkills.some(skill => studentSkills.has(skill.toLowerCase()));
        });
    }, [portfolio, opportunities, savedGpa]);

    const needsIncomeInput = opportunities.some(
        (opp) =>
            opp.type === 'Scholarship' &&
            opp.incomeLimit !== undefined &&
            opp.incomeLimit !== null &&
            opp.incomeLimit !== '' &&
            !Number.isFinite(parseOptionalNumber(savedIncome))
    );

    const needsGpaInput = opportunities.some(
        (opp) =>
            opp.type === 'Internship' &&
            opp.minGpa !== undefined &&
            opp.minGpa !== null &&
            opp.minGpa !== '' &&
            !Number.isFinite(parseOptionalNumber(savedGpa))
    );

    const handleEligibilitySave = async (field) => {
        if (!portfolio?.studentId) return;

        const rawValue = field === 'income' ? incomeInput : gpaInput;
        const normalizedValue = Number(String(rawValue).replace(/,/g, '').trim());

        if (!Number.isFinite(normalizedValue)) {
            setEligibilityStatus({
                type: 'error',
                text: field === 'income' ? 'Enter a valid family income.' : 'Enter a valid CGPA out of 10.',
            });
            window.alert(field === 'income' ? 'Enter a valid family income.' : 'Enter a valid CGPA out of 10.');
            return;
        }

        if (field === 'gpa' && (normalizedValue < 0 || normalizedValue > 10)) {
            setEligibilityStatus({
                type: 'error',
                text: 'Enter a valid CGPA between 0 and 10.',
            });
            window.alert('Enter a valid CGPA between 0 and 10.');
            return;
        }

        setIsSavingEligibility(true);

        try {
            setEligibilityStatus({
                type: 'info',
                text: field === 'income' ? 'Saving family income...' : 'Saving CGPA...',
            });

            const withTimeout = async (promise, label, timeoutMs = 45000) => {
                let timeoutId;

                const timeoutPromise = new Promise((_, reject) => {
                    timeoutId = window.setTimeout(() => {
                        reject(new Error(`${label} timed out after ${Math.round(timeoutMs / 1000)}s`));
                    }, timeoutMs);
                });

                try {
                    return await Promise.race([promise, timeoutPromise]);
                } finally {
                    window.clearTimeout(timeoutId);
                }
            };

            await withTimeout(savePortfolio(portfolio.studentId, {
                ...(field === 'income'
                    ? { familyIncome: normalizedValue }
                    : { currentGpa: normalizedValue }),
            }), 'Eligibility save');

            setEligibilityStatus({
                type: 'info',
                text: 'Refreshing opportunities...',
            });
            await withTimeout(refreshPortfolios(), 'Opportunity refresh', 10000);
            setEligibilityStatus({
                type: 'success',
                text: field === 'income' ? 'Family income saved.' : 'CGPA saved.',
            });
        } catch (error) {
            console.error(`Failed to save ${field}:`, error);
            const message = error?.message || `Failed to save ${field}.`;
            setEligibilityStatus({
                type: 'error',
                text: message,
            });
            window.alert(message);
        } finally {
            setIsSavingEligibility(false);
        }
    };

    if (!portfolio) return <div className="text-slate-500">Create a portfolio to see matches.</div>;

    const hasAnyMatches = scholarshipMatches.length > 0 || internshipMatches.length > 0;
    const emptyStateMessage = needsIncomeInput && needsGpaInput
        ? 'Add your family income and current CGPA to unlock scholarship and internship matches.'
        : needsIncomeInput
            ? 'Add your family income to unlock scholarship matches.'
            : needsGpaInput
                ? 'Add your current CGPA out of 10 to unlock internship matches.'
                : 'No matching opportunities found based on your current eligibility and skills.';

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="text-blue-400" />
                <span>Recommended For You</span>
            </h3>
            {needsIncomeInput ? (
                <div className="glass-card p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                    <p className="text-sm font-medium text-white">Scholarships need your family income.</p>
                    <p className="text-sm text-slate-400 mt-1">Enter it once to check scholarship eligibility against income limits.</p>
                    {eligibilityStatus ? (
                        <div className={`mt-3 rounded-lg px-3 py-2 text-sm ${
                            eligibilityStatus.type === 'error'
                                ? 'bg-red-500/10 text-red-300 border border-red-500/30'
                                : eligibilityStatus.type === 'info'
                                    ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20'
                                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        }`}>
                            {eligibilityStatus.text}
                        </div>
                    ) : null}
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                        <input
                            type="number"
                            min="0"
                            value={incomeInput}
                            onChange={(e) => setIncomeInput(e.target.value)}
                            placeholder="Family income"
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                            type="button"
                            onClick={() => handleEligibilitySave('income')}
                            disabled={isSavingEligibility}
                            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSavingEligibility ? 'Saving...' : 'Save Income'}
                        </button>
                    </div>
                </div>
            ) : null}
            {needsGpaInput ? (
                <div className="glass-card p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                    <p className="text-sm font-medium text-white">Internships need your current CGPA.</p>
                    <p className="text-sm text-slate-400 mt-1">Enter it once on a 10-point scale to match against internship cutoffs.</p>
                    {eligibilityStatus ? (
                        <div className={`mt-3 rounded-lg px-3 py-2 text-sm ${
                            eligibilityStatus.type === 'error'
                                ? 'bg-red-500/10 text-red-300 border border-red-500/30'
                                : eligibilityStatus.type === 'info'
                                    ? 'bg-blue-500/10 text-blue-200 border border-blue-500/20'
                                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        }`}>
                            {eligibilityStatus.text}
                        </div>
                    ) : null}
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                        <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.01"
                            value={gpaInput}
                            onChange={(e) => setGpaInput(e.target.value)}
                            placeholder="Current CGPA (out of 10)"
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => handleEligibilitySave('gpa')}
                            disabled={isSavingEligibility}
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSavingEligibility ? 'Saving...' : 'Save CGPA'}
                        </button>
                    </div>
                </div>
            ) : null}
            {!hasAnyMatches ? (
                <p className="text-slate-500">{emptyStateMessage}</p>
            ) : (
                <div className="space-y-6">
                    {scholarshipMatches.length > 0 ? (
                        <div className="space-y-3">
                            <div>
                                <h4 className="text-lg font-semibold text-white">Scholarships</h4>
                                <p className="text-sm text-slate-400">Only scholarships within your saved family income are shown.</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {scholarshipMatches.map((opp) => (
                                    <div key={opp.id} className="glass-card p-6 rounded-xl border border-white/10 group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">
                                                {opp.type}
                                            </span>
                                            <span className="text-xs text-slate-500">Match</span>
                                        </div>
                                        <h4 className="font-bold text-white text-lg group-hover:text-blue-400 transition">{opp.title}</h4>
                                        <p className="text-slate-400 text-sm mb-4">{opp.company}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {opp.requiredSkills.map(s => (
                                                <span key={s} className="text-xs px-2 py-1 bg-white/5 rounded text-slate-300">{s}</span>
                                            ))}
                                            {opp.incomeLimit ? (
                                                <span className="text-xs px-2 py-1 bg-emerald-500/10 rounded text-emerald-300">
                                                    Income up to {opp.incomeLimit}
                                                </span>
                                            ) : null}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setSelectedOpportunity(opp)}
                                            className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition cursor-pointer"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {internshipMatches.length > 0 ? (
                        <div className="space-y-3">
                            <div>
                                <h4 className="text-lg font-semibold text-white">Internships</h4>
                                <p className="text-sm text-slate-400">Shown based on your saved CGPA and matching skills.</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {internshipMatches.map((opp) => (
                                    <div key={opp.id} className="glass-card p-6 rounded-xl border border-white/10 group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                                                {opp.type}
                                            </span>
                                            <span className="text-xs text-slate-500">Match</span>
                                        </div>
                                        <h4 className="font-bold text-white text-lg group-hover:text-blue-400 transition">{opp.title}</h4>
                                        <p className="text-slate-400 text-sm mb-4">{opp.company}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {opp.requiredSkills.map(s => (
                                                <span key={s} className="text-xs px-2 py-1 bg-white/5 rounded text-slate-300">{s}</span>
                                            ))}
                                            {opp.minGpa ? (
                                                <span className="text-xs px-2 py-1 bg-blue-500/10 rounded text-blue-300">
                                                    Min CGPA {opp.minGpa}/10
                                                </span>
                                            ) : null}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setSelectedOpportunity(opp)}
                                            className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition cursor-pointer"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
            {selectedOpportunity ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
                    <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className={`inline-flex rounded px-2 py-1 text-xs ${selectedOpportunity.type === 'Internship' ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                    {selectedOpportunity.type}
                                </p>
                                <h4 className="mt-3 text-xl font-bold text-white">{selectedOpportunity.title}</h4>
                                <p className="text-sm text-slate-400">{selectedOpportunity.company}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedOpportunity(null)}
                                className="rounded-lg border border-white/10 px-3 py-1 text-sm text-slate-300 hover:bg-white/5"
                            >
                                Close
                            </button>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-slate-200">
                            {selectedOpportunity.description || 'No description available for this opportunity.'}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2">
                            {selectedOpportunity.requiredSkills.map((skill) => (
                                <span key={skill} className="rounded bg-white/5 px-2 py-1 text-xs text-slate-300">
                                    {skill}
                                </span>
                            ))}
                            {selectedOpportunity.type === 'Internship' && selectedOpportunity.minGpa ? (
                                <span className="rounded bg-blue-500/10 px-2 py-1 text-xs text-blue-300">
                                    Minimum CGPA: {selectedOpportunity.minGpa}/10
                                </span>
                            ) : null}
                            {selectedOpportunity.type === 'Scholarship' && selectedOpportunity.incomeLimit ? (
                                <span className="rounded bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                                    Family income up to: {selectedOpportunity.incomeLimit}
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export const ResumeGenerator = ({ portfolio }) => {
    const handleDownload = async () => {
        if (!portfolio) return;

        // Lazy load jsPDF only when needed
        const { default: jsPDF } = await import('jspdf');
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.text("Portfolio Resume", 20, 20);

        doc.setFontSize(12);
        doc.text(`ID: ${portfolio.studentId}`, 20, 30);

        // About
        doc.setFontSize(16);
        doc.text("Professional Summary", 20, 45);
        doc.setFontSize(11);
        const splitText = doc.splitTextToSize(portfolio.about || '', 170);
        doc.text(splitText, 20, 55);

        let yPos = 55 + (splitText.length * 5) + 10;

        // Skills
        doc.setFontSize(16);
        doc.text("Skills", 20, yPos);
        yPos += 10;
        doc.setFontSize(11);
        const skillsText = (portfolio.skills || []).join(', ');
        doc.text(skillsText, 20, yPos);

        yPos += 20;

        // Projects
        doc.setFontSize(16);
        doc.text("Projects", 20, yPos);
        yPos += 10;

        (portfolio.projects || []).forEach(p => {
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(p.title, 20, yPos);
            doc.setFont(undefined, 'normal');
            yPos += 6;
            doc.setFontSize(10);
            doc.text(p.desc || '', 20, yPos);
            yPos += 12;
        });

        doc.save(`${portfolio.studentId}_resume.pdf`);
    };

    return (
        <button
            onClick={handleDownload}
            disabled={!portfolio}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Download size={18} />
            <span>Download Resume PDF</span>
        </button>
    );
};

export const PortfolioDownloader = ({ portfolio }) => {
    const getEffectivePortfolio = () => {
        if (!portfolio) return null;
        try {
            const draftRaw = localStorage.getItem(`dps_preview_draft_${portfolio.studentId}`);
            if (!draftRaw) return portfolio;
            const draft = JSON.parse(draftRaw);
            if (draft && typeof draft === 'object') {
                return { ...portfolio, ...draft, studentId: portfolio.studentId };
            }
        } catch (e) {
            console.warn('Failed to read local draft for download:', e);
        }
        return portfolio;
    };

    const resolveTheme = (templateId) => {
        if (String(templateId || '').startsWith('barch-')) {
            return {
                cover: 'Architecture Portfolio',
                bg: '#e9e2d7',
                page: '#fbf7f1',
                text: '#1f1a16',
                muted: '#6f6253',
                accent: '#7c4a2e',
                font: "Georgia, 'Times New Roman', serif",
            };
        }
        if (String(templateId || '').startsWith('btech-')) {
            return {
                cover: 'BTech Portfolio',
                bg: '#0b1220',
                page: '#111c32',
                text: '#e2e8f0',
                muted: '#94a3b8',
                accent: '#38bdf8',
                font: "'Segoe UI', Tahoma, sans-serif",
            };
        }
        if (templateId === 'academic') {
            return {
                cover: 'Academic Portfolio',
                bg: '#f8fafc',
                page: '#ffffff',
                text: '#111827',
                muted: '#4b5563',
                accent: '#111827',
                font: "Georgia, 'Times New Roman', serif",
            };
        }
        return {
            cover: 'Student Portfolio',
            bg: '#f1f5f9',
            page: '#ffffff',
            text: '#0f172a',
            muted: '#475569',
            accent: '#2563eb',
            font: "'Segoe UI', Tahoma, sans-serif",
        };
    };

    const generateHTMLContent = () => {
        const source = getEffectivePortfolio();
        if (!source) return '';

        const { about, skills, projects, certifications, templateId } = source;
        const studentId = source.studentId || 'portfolio';
        const meta = source.meta && typeof source.meta === 'object' ? source.meta : {};
        const fullName = meta.fullName || studentId || 'Student';
        const role = meta.role || 'Student Portfolio';
        const theme = resolveTheme(templateId);

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - ${studentId}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: ${theme.font}; background: ${theme.bg}; color: ${theme.text}; }
        .book { max-width: 210mm; margin: 0 auto; }
        .page {
            width: 210mm;
            min-height: 297mm;
            padding: 18mm;
            background: ${theme.page};
            border-bottom: 1px solid ${theme.muted};
            page-break-after: always;
            break-after: page;
        }
        .page:last-child { page-break-after: auto; break-after: auto; }
        .cover { display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(160deg, ${theme.page}, ${theme.bg}); }
        .smallcaps { letter-spacing: .2em; text-transform: uppercase; font-size: 11px; color: ${theme.muted}; }
        h1 { font-size: 48px; line-height: 1.05; margin-top: 12px; }
        h2 { font-size: 30px; margin-bottom: 14px; }
        .muted { color: ${theme.muted}; }
        .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
        .chip { border: 1px solid ${theme.muted}; border-radius: 999px; padding: 5px 11px; font-size: 12px; }
        .cert { padding: 10px 0; border-bottom: 1px solid ${theme.muted}; }
        .project-title { font-size: 36px; line-height: 1.1; margin-bottom: 10px; }
        .project-meta { margin-top: 12px; font-size: 13px; letter-spacing: .08em; text-transform: uppercase; color: ${theme.muted}; }
        .project-image {
            margin-top: 16px;
            width: 100%;
            height: 140mm;
            object-fit: cover;
            border: 1px solid ${theme.muted};
            background: ${theme.bg};
        }
        .no-image {
            margin-top: 16px;
            width: 100%;
            height: 140mm;
            border: 1px dashed ${theme.muted};
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${theme.muted};
            font-size: 13px;
        }
        .linkline { margin-top: 8px; font-size: 12px; color: ${theme.muted}; overflow-wrap: anywhere; }
        a { color: ${theme.accent}; }
        @media print {
            body { background: white; }
            .page { border-bottom: 0; }
        }
    </style>
</head>
<body>
    <main class="book">
        <section class="page cover">
            <div>
                <p class="smallcaps">${theme.cover}</p>
                <h1>${fullName}</h1>
                <p style="margin-top:10px; font-size:18px;" class="muted">${role}</p>
            </div>
            <p class="smallcaps">Digital Portfolio System</p>
        </section>

        <section class="page">
            <p class="smallcaps">Profile</p>
            <h2>About</h2>
            <p class="muted" style="line-height:1.8;">${about || 'No description available.'}</p>

            <h2 style="margin-top:28px;">Skills</h2>
            <div class="chips">
                ${skills && skills.length > 0 ? skills.map(s => `<span class="chip">${s}</span>`).join('') : '<p class="muted">No skills listed.</p>'}
            </div>

            <h2 style="margin-top:28px;">Certifications</h2>
            <div>
                ${certifications && certifications.length > 0 ? certifications.map(c => `
                    <div class="cert">
                        <strong>${c.name || 'Unnamed Certification'}</strong>
                        <div class="muted">${c.issuer || 'Unknown Issuer'}</div>
                    </div>
                `).join('') : '<p class="muted">No certifications available.</p>'}
            </div>
        </section>

        ${projects && projects.length > 0 ? projects.map((p, i) => `
            <section class="page">
                <p class="smallcaps">Project ${i + 1}</p>
                <h2 class="project-title">${p.title || `Project ${i + 1}`}</h2>
                <p class="muted" style="line-height:1.8;">${p.desc || 'No description available.'}</p>
                <p class="project-meta">${p.year || 'Year not specified'}${p.tech ? ` • ${p.tech}` : ''}</p>
                ${p.repoUrl ? `<p class="linkline">Repository: <a href="${p.repoUrl}" target="_blank" rel="noopener noreferrer">${p.repoUrl}</a></p>` : ''}
                ${p.pdfUrl ? `<p class="linkline">Project PDF: <a href="${p.pdfUrl}" target="_blank" rel="noopener noreferrer">${p.pdfName || 'Open PDF'}</a></p>` : ''}
                ${(p.image || p.imageUrl)
                    ? `<img class="project-image" src="${p.image || p.imageUrl}" alt="${p.title || `Project ${i + 1}`}" />`
                    : '<div class="no-image">Add project image URL to show board here</div>'}
            </section>
        `).join('') : `
            <section class="page">
                <p class="smallcaps">Projects</p>
                <h2>Selected Works</h2>
                <p class="muted">No projects available.</p>
            </section>
        `}
    </main>
</body>
</html>`;
    };

    const handleDownloadPDF = async () => {
        const source = getEffectivePortfolio();
        if (!source) return;

        const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
            import('html2canvas'),
            import('jspdf'),
        ]);

        const captureUrl = `${window.location.origin}/portfolio/view/${source.studentId}?t=${Date.now()}`;
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.left = '-10000px';
        iframe.style.top = '0';
        iframe.style.width = '1440px';
        iframe.style.height = '2200px';
        iframe.style.border = '0';
        iframe.style.opacity = '0';
        iframe.src = captureUrl;
        document.body.appendChild(iframe);

        const cleanup = () => {
            try {
                iframe.remove();
            } catch {
                // ignore cleanup issues
            }
        };

        try {
            await new Promise((resolve, reject) => {
                iframe.onload = () => resolve();
                iframe.onerror = () => reject(new Error('Failed to load portfolio template for PDF export.'));
            });

            await new Promise((resolve) => window.setTimeout(resolve, 1200));

            const frameWindow = iframe.contentWindow;
            const frameDocument = iframe.contentDocument || frameWindow?.document;
            const captureRoot = frameDocument?.querySelector('.min-h-screen') || frameDocument?.body;
            if (!captureRoot) {
                throw new Error('Could not render the portfolio template for PDF export.');
            }

            const canvas = await html2canvas(captureRoot, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                windowWidth: Math.max(captureRoot.scrollWidth || 1440, 1440),
                windowHeight: Math.max(captureRoot.scrollHeight || 2200, 2200),
            });

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const imageData = canvas.toDataURL('image/png');

            let renderedHeight = imgHeight;
            let position = 0;
            pdf.addImage(imageData, 'PNG', 0, position, imgWidth, imgHeight);
            renderedHeight -= pageHeight;

            while (renderedHeight > 0) {
                position = renderedHeight - imgHeight;
                pdf.addPage();
                pdf.addImage(imageData, 'PNG', 0, position, imgWidth, imgHeight);
                renderedHeight -= pageHeight;
            }

            pdf.save(`${source.studentId || 'portfolio'}_portfolio.pdf`);
        } finally {
            cleanup();
        }
    };

    const handleDownloadHTML = () => {
        const source = getEffectivePortfolio();
        if (!source) return;

        const htmlContent = generateHTMLContent();
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${source.studentId || 'portfolio'}_portfolio.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (!portfolio) {
        return null;
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileDown size={20} />
                <span>Download Portfolio</span>
            </h3>
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FileText size={18} />
                    <span>Download as PDF</span>
                </button>
                <button
                    onClick={handleDownloadHTML}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FileDown size={18} />
                    <span>Download as HTML</span>
                </button>
            </div>
            <p className="text-sm text-slate-400">
                Download your portfolio as a PDF or standalone HTML file that can be shared offline.
            </p>
        </div>
    );
};
