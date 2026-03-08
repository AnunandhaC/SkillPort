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
                        text: `ðŸ’¡ ${suggestion}`
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

        const { default: jsPDF } = await import('jspdf');
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const templateId = source?.templateId || '';
        const meta = source?.meta && typeof source.meta === 'object' ? source.meta : {};
        const fullName = meta.fullName || source.studentId || 'Student';
        const role = meta.role || 'Student Portfolio';
        const theme = resolveTheme(templateId);

        doc.setFontSize(30);
        doc.setFont(undefined, 'bold');
        doc.text(theme.cover, margin, 52);
        doc.setFontSize(22);
        doc.text(fullName, margin, 70);
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(role, margin, 80);

        doc.addPage();
        let yPos = margin;
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text('About', margin, yPos);
        yPos += 10;
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        const aboutText = doc.splitTextToSize(source.about || 'No description available.', pageWidth - 2 * margin);
        doc.text(aboutText, margin, yPos);
        yPos += aboutText.length * 6 + 12;

        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Skills', margin, yPos);
        yPos += 8;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const skillsText = (source.skills || []).length > 0 ? source.skills.join(', ') : 'No skills listed.';
        const skillsSplit = doc.splitTextToSize(skillsText, pageWidth - 2 * margin);
        doc.text(skillsSplit, margin, yPos);
        yPos += skillsSplit.length * 5 + 12;

        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Certifications', margin, yPos);
        yPos += 8;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        (source.certifications || []).forEach((c) => {
            if (yPos > 260) {
                doc.addPage();
                yPos = margin;
            }
            doc.text(`- ${c.name || 'Unnamed Certification'} (${c.issuer || 'Unknown Issuer'})`, margin, yPos);
            yPos += 6;
        });

        (source.projects || []).forEach((p, index) => {
            doc.addPage();
            let py = margin;
            doc.setFontSize(11);
            doc.setFont(undefined, 'normal');
            doc.text(`Project ${index + 1}`, margin, py);
            py += 8;

            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            doc.text(p.title || `Project ${index + 1}`, margin, py);
            py += 10;

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            if (p.year) {
                doc.text(`Year: ${p.year}`, margin, py);
                py += 6;
            }
            if (p.tech) {
                const techText = doc.splitTextToSize(`Tech/Tools: ${p.tech}`, pageWidth - 2 * margin);
                doc.text(techText, margin, py);
                py += techText.length * 5 + 4;
            }
            if (p.repoUrl) {
                const repoText = doc.splitTextToSize(`Repository: ${p.repoUrl}`, pageWidth - 2 * margin);
                doc.text(repoText, margin, py);
                py += repoText.length * 5 + 4;
            }
            if (p.pdfUrl) {
                const pdfText = doc.splitTextToSize(`Project PDF: ${p.pdfName || p.pdfUrl}`, pageWidth - 2 * margin);
                doc.text(pdfText, margin, py);
                py += pdfText.length * 5 + 4;
            }
            const descText = doc.splitTextToSize(p.desc || 'No description available.', pageWidth - 2 * margin);
            doc.text(descText, margin, py);
        });

        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i += 1) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, 290, { align: 'right' });
        }

        doc.save(`${source.studentId || 'portfolio'}_portfolio.pdf`);
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
