import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataProvider';
import { AlertCircle, Briefcase, GraduationCap, Download, FileText, FileDown, Send, Bot, User, Sparkles } from 'lucide-react';

export const SuggestionEngine = ({ portfolio }) => {
    const { analyzePortfolio } = useData();
    const suggestions = useMemo(() => analyzePortfolio(portfolio), [portfolio, analyzePortfolio]);
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
                text: `Hello! I'm your Portfolio Assistant. I can help you improve your portfolio and answer questions about it. ${suggestions.length > 0 ? 'I have some suggestions for you:' : 'Your portfolio looks great!'}`
            };
            const initialMessages = [welcomeMessage];
            
            if (suggestions.length > 0) {
                suggestions.forEach((suggestion, index) => {
                    initialMessages.push({
                        id: Date.now() + index + 1,
                        type: 'bot',
                        text: `💡 ${suggestion}`
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
    }, [portfolio, suggestions]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const generateResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();
        
        // Portfolio analysis queries
        if (lowerMessage.includes('suggest') || lowerMessage.includes('improve') || lowerMessage.includes('help')) {
            if (suggestions.length > 0) {
                return `Based on your portfolio, here are my recommendations:\n\n${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n\n')}\n\nWould you like me to elaborate on any of these?`;
            }
            return 'Your portfolio looks great! To make it even better, consider adding more detailed project descriptions, showcasing your best work prominently, and keeping your skills section updated.';
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
                creative: 'Creative Bold',
                academic: 'Academic Professional'
            };
            return `You're currently using the "${templateNames[template] || 'Modern Minimal'}" template. Each template has its own style:\n- Modern Minimal: Clean and professional\n- Creative Bold: Eye-catching and dynamic\n- Academic Professional: Structured and detailed\n\nYou can change templates anytime in the Portfolio Editor!`;
        }

        // General portfolio questions
        if (lowerMessage.includes('what') && (lowerMessage.includes('missing') || lowerMessage.includes('need'))) {
            const missing = [];
            if (!portfolio?.about || portfolio.about.length < 50) missing.push('a detailed About section');
            if (!portfolio?.skills || portfolio.skills.length === 0) missing.push('Skills section');
            if (!portfolio?.projects || portfolio.projects.length === 0) missing.push('Projects');
            if (!portfolio?.certifications || portfolio.certifications.length === 0) missing.push('Certifications');
            
            if (missing.length > 0) {
                return `Your portfolio could benefit from:\n\n${missing.map((m, i) => `${i + 1}. ${m}`).join('\n')}\n\nThese elements help create a complete and professional portfolio that showcases your full potential!`;
            }
            return 'Your portfolio has all the essential elements! Consider adding more details, updating content regularly, and showcasing your best work prominently.';
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
    const { opportunities } = useData();

    // Simple Mock Matching Logic
    const eligibleOpportunities = useMemo(() => {
        if (!portfolio) return [];
        const studentSkills = new Set(portfolio.skills?.map(s => s.toLowerCase()) || []);

        return opportunities.filter(opp => {
            // If no skills required or student has at least one matching skill
            if (opp.requiredSkills.length === 0) return true;
            return opp.requiredSkills.some(skill => studentSkills.has(skill.toLowerCase()));
        });
    }, [portfolio, opportunities]);

    if (!portfolio) return <div className="text-slate-500">Create a portfolio to see matches.</div>;

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="text-blue-400" />
                <span>Recommended For You</span>
            </h3>
            {eligibleOpportunities.length === 0 ? (
                <p className="text-slate-500">No matching opportunities found based on your current skills.</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {eligibleOpportunities.map(opp => (
                        <div key={opp.id} className="glass-card p-6 rounded-xl border border-white/10 group">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs px-2 py-1 rounded ${opp.type === 'Internship' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
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
                            </div>

                            <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition cursor-pointer">
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}
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
    const generateHTMLContent = () => {
        if (!portfolio) return '';

        const { about, skills, projects, certifications, templateId } = portfolio;
        const studentId = portfolio.studentId || 'portfolio';

        // Generate HTML based on template
        let htmlContent = '';
        
        if (templateId === 'modern') {
            htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - ${studentId}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        header { padding: 80px 0; }
        h1 { font-size: 3.5rem; font-weight: 700; margin-bottom: 24px; letter-spacing: -0.02em; }
        .about { font-size: 1.25rem; color: #475569; max-width: 42rem; line-height: 1.75; }
        section { padding: 80px 0; }
        .bg-light { background-color: #f8fafc; }
        h2 { font-size: 2rem; font-weight: 700; margin-bottom: 40px; }
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; }
        .project-card { background: white; padding: 32px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .project-card h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 12px; }
        .project-card p { color: #475569; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px; }
        .skill-tag { padding: 8px 16px; background: #f1f5f9; border-radius: 8px; color: #334155; font-weight: 500; }
        .certifications { display: flex; flex-direction: column; gap: 16px; }
        .cert-item { display: flex; justify-content: space-between; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; }
        .cert-item:last-child { border-bottom: none; }
        .cert-name { font-weight: 500; }
        .cert-issuer { color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Student Portfolio</h1>
            <p class="about">${about || 'No description available.'}</p>
        </header>

        <section class="bg-light">
            <div class="container">
                <h2>Featured Projects</h2>
                <div class="projects-grid">
                    ${projects && projects.length > 0 ? projects.map(p => `
                        <div class="project-card">
                            <h3>${p.title || 'Untitled Project'}</h3>
                            <p>${p.desc || 'No description available.'}</p>
                        </div>
                    `).join('') : '<p>No projects available.</p>'}
                </div>
            </div>
        </section>

        <section>
            <div class="container">
                <h2>Skills & Certifications</h2>
                <div class="skills">
                    ${skills && skills.length > 0 ? skills.map(s => `<span class="skill-tag">${s}</span>`).join('') : '<p>No skills listed.</p>'}
                </div>
                <div class="certifications">
                    ${certifications && certifications.length > 0 ? certifications.map(c => `
                        <div class="cert-item">
                            <span class="cert-name">${c.name || 'Unnamed Certification'}</span>
                            <span class="cert-issuer">${c.issuer || 'Unknown Issuer'}</span>
                        </div>
                    `).join('') : '<p>No certifications available.</p>'}
                </div>
            </div>
        </section>
    </div>
</body>
</html>`;
        } else {
            // Fallback template
            htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - ${studentId}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: serif; line-height: 1.8; color: #1e293b; background: #f8fafc; }
        .container { max-width: 800px; margin: 0 auto; background: white; min-height: 100vh; padding: 80px 40px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        header { border-bottom: 2px solid #000; padding-bottom: 32px; margin-bottom: 48px; }
        h1 { font-size: 2.5rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 16px; }
        .about { font-size: 1.125rem; font-style: italic; color: #475569; }
        h2 { font-size: 1.5rem; font-weight: 700; text-transform: uppercase; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
        h2::before { content: ''; width: 32px; height: 2px; background: #000; }
        section { margin-bottom: 48px; }
        .project { margin-bottom: 32px; }
        .project h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 8px; }
        .project p { color: #475569; }
        .skills { line-height: 2; }
        ul { list-style: disc; padding-left: 20px; }
        li { margin-bottom: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Portfolio</h1>
            <p class="about">${about || 'No description available.'}</p>
        </header>

        <section>
            <h2>Projects</h2>
            ${projects && projects.length > 0 ? projects.map(p => `
                <div class="project">
                    <h3>${p.title || 'Untitled Project'}</h3>
                    <p>${p.desc || 'No description available.'}</p>
                </div>
            `).join('') : '<p>No projects available.</p>'}
        </section>

        <section>
            <h2>Skills</h2>
            <p class="skills">${skills && skills.length > 0 ? skills.join(' • ') : 'No skills listed.'}</p>
        </section>

        <section>
            <h2>Awards</h2>
            <ul>
                ${certifications && certifications.length > 0 ? certifications.map(c => `
                    <li><strong>${c.name || 'Unnamed Certification'}</strong> - ${c.issuer || 'Unknown Issuer'}</li>
                `).join('') : '<li>No certifications available.</li>'}
            </ul>
        </section>
    </div>
</body>
</html>`;
        }

        return htmlContent;
    };

    const handleDownloadPDF = async () => {
        if (!portfolio) return;

        // Lazy load jsPDF only when needed
        const { default: jsPDF } = await import('jspdf');
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let yPos = margin;

        // Header
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.text('Portfolio', margin, yPos);
        yPos += 10;

        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(`Student ID: ${portfolio.studentId || 'N/A'}`, margin, yPos);
        yPos += 15;

        // About Section
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text('About', margin, yPos);
        yPos += 10;

        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        const aboutText = doc.splitTextToSize(portfolio.about || 'No description available.', pageWidth - 2 * margin);
        doc.text(aboutText, margin, yPos);
        yPos += aboutText.length * 6 + 10;

        // Check if we need a new page
        if (yPos > 250) {
            doc.addPage();
            yPos = margin;
        }

        // Skills Section
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text('Skills', margin, yPos);
        yPos += 10;

        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        const skillsText = (portfolio.skills || []).length > 0 
            ? (portfolio.skills || []).join(', ')
            : 'No skills listed.';
        const skillsSplit = doc.splitTextToSize(skillsText, pageWidth - 2 * margin);
        doc.text(skillsSplit, margin, yPos);
        yPos += skillsSplit.length * 6 + 15;

        // Projects Section
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text('Projects', margin, yPos);
        yPos += 10;

        (portfolio.projects || []).forEach((p, index) => {
            // Check if we need a new page
            if (yPos > 250) {
                doc.addPage();
                yPos = margin;
            }

            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(p.title || `Project ${index + 1}`, margin, yPos);
            yPos += 8;

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            const descText = doc.splitTextToSize(p.desc || 'No description available.', pageWidth - 2 * margin);
            doc.text(descText, margin, yPos);
            yPos += descText.length * 5 + 10;
        });

        // Certifications Section
        if (portfolio.certifications && portfolio.certifications.length > 0) {
            // Check if we need a new page
            if (yPos > 250) {
                doc.addPage();
                yPos = margin;
            }

            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            doc.text('Certifications', margin, yPos);
            yPos += 10;

            portfolio.certifications.forEach(c => {
                // Check if we need a new page
                if (yPos > 250) {
                    doc.addPage();
                    yPos = margin;
                }

                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                doc.text(c.name || 'Unnamed Certification', margin, yPos);
                yPos += 7;

                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                doc.text(`Issued by: ${c.issuer || 'Unknown'}`, margin + 5, yPos);
                yPos += 10;
            });
        }

        doc.save(`${portfolio.studentId || 'portfolio'}_portfolio.pdf`);
    };

    const handleDownloadHTML = () => {
        if (!portfolio) return;

        const htmlContent = generateHTMLContent();
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${portfolio.studentId || 'portfolio'}_portfolio.html`;
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
