import React, { useState, useCallback, useRef } from 'react';
import { FileText, Plus, Trash2, Download, Save, Eye, X } from 'lucide-react';

// Input components defined outside to prevent recreation on every render
const InputField = ({ label, value, onChange, placeholder, type = 'text', className = '' }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
        <input
            type={type}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, rows = 3, className = '' }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
        <textarea
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
    </div>
);

const ResumeBuilder = () => {
    const [formData, setFormData] = useState({
        // Contact Information
        name: '',
        phone: '',
        linkedin: '',
        email: '',
        github: '',
        
        // Career Objective
        careerObjective: '',
        
        // Education
        education: [
            {
                id: Date.now(),
                degree: '',
                university: '',
                institution: '',
                location: '',
                startDate: '',
                endDate: '',
                gpa: '',
                percentage: '',
                type: 'degree' // 'degree' or 'intermediate'
            }
        ],
        
        // Technical Skills
        languages: [],
        developerTools: [],
        technologies: [],
        softSkills: [],
        
        // Training and Certifications
        certifications: [
            {
                id: Date.now() + 1,
                name: '',
                issuer: '',
                startDate: '',
                endDate: '',
                description: ''
            }
        ],
        
        // Projects
        projects: [
            {
                id: Date.now() + 2,
                title: '',
                technologies: '',
                date: '',
                status: '',
                description: ''
            }
        ]
    });

    const [currentSkillInput, setCurrentSkillInput] = useState({
        language: '',
        developerTool: '',
        technology: '',
        softSkill: ''
    });

    const [showPreview, setShowPreview] = useState(false);
    const resumePreviewRef = useRef(null);

    const updateField = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const updateArrayField = useCallback((field, id, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item) => item.id === id ? { ...item, ...value } : item)
        }));
    }, []);

    const addArrayItem = (field, defaultItem) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], { ...defaultItem, id: Date.now() + Math.random() }]
        }));
    };

    const removeArrayItem = (field, id) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((item) => item.id !== id)
        }));
    };

    const addSkill = (skillType) => {
        const skill = currentSkillInput[skillType];
        if (skill.trim()) {
            const fieldMap = {
                language: 'languages',
                developerTool: 'developerTools',
                technology: 'technologies',
                softSkill: 'softSkills'
            };
            setFormData(prev => ({
                ...prev,
                [fieldMap[skillType]]: [...prev[fieldMap[skillType]], skill.trim()]
            }));
            setCurrentSkillInput(prev => ({ ...prev, [skillType]: '' }));
        }
    };

    const removeSkill = (skillType, index) => {
        const fieldMap = {
            language: 'languages',
            developerTool: 'developerTools',
            technology: 'technologies',
            softSkill: 'softSkills'
        };
        setFormData(prev => ({
            ...prev,
            [fieldMap[skillType]]: prev[fieldMap[skillType]].filter((_, i) => i !== index)
        }));
    };

    const generateResumePDF = async () => {
        const captureRoot = resumePreviewRef.current;
        if (!captureRoot) return;

        const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
            import('html2canvas'),
            import('jspdf'),
        ]);

        const canvas = await html2canvas(captureRoot, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            windowWidth: Math.max(captureRoot.scrollWidth || 816, 816),
            windowHeight: Math.max(captureRoot.scrollHeight || 1056, 1056),
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

        const fileName = formData.name ? `${formData.name.replace(/\s+/g, '_')}_Resume.pdf` : 'Resume.pdf';
        pdf.save(fileName);
    };

    const renderResumePreviewContent = (previewRef = null) => (
        <div
            ref={previewRef}
            className="max-w-3xl mx-auto bg-white p-8 shadow-lg"
            style={{ minHeight: '210mm', fontFamily: 'serif', width: '816px' }}
        >
            <div className="text-center mb-4" style={{ marginTop: '8px' }}>
                <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    {formData.name ? formData.name.toUpperCase() : 'YOUR NAME'}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-600">
                    {formData.phone && <span className="underline">{formData.phone}</span>}
                    {formData.linkedin && (
                        <span className="underline">
                            linkedin.com/in/{formData.linkedin.split('/').pop() || formData.linkedin}
                        </span>
                    )}
                    {formData.email && <span className="underline">{formData.email}</span>}
                    {formData.github && (
                        <span className="underline">
                            github.com/{formData.github.split('/').pop() || formData.github}
                        </span>
                    )}
                    {formData.phone && (formData.linkedin || formData.email || formData.github) && <span>~</span>}
                    {formData.linkedin && formData.email && <span>~</span>}
                    {formData.email && formData.github && <span>~</span>}
                </div>
            </div>

            {formData.careerObjective && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wide">Career Objective</h2>
                    <hr className="border-gray-900 mb-2" />
                    <div className="pl-4">
                        <p className="text-xs text-gray-700 leading-relaxed">{formData.careerObjective}</p>
                    </div>
                </div>
            )}

            {formData.education.some(e => e.degree || e.university) && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wide">Education</h2>
                    <hr className="border-gray-900 mb-2" />
                    {formData.education.map((edu) => (
                        (edu.degree || edu.university) && (
                            <div key={edu.id} className="mb-3 flex justify-between items-start">
                                <div className="flex-1">
                                    {edu.university && (
                                        <h3 className="text-xs font-bold text-gray-900 mb-0.5">{edu.university}</h3>
                                    )}
                                    {edu.degree && (
                                        <p className="text-xs italic text-gray-700 mb-0.5">{edu.degree}</p>
                                    )}
                                    {edu.institution && (
                                        <p className="text-xs text-gray-600">{edu.institution}</p>
                                    )}
                                    {edu.location && (
                                        <p className="text-xs text-gray-600">{edu.location}</p>
                                    )}
                                </div>
                                <div className="text-right text-xs text-gray-600 ml-4">
                                    {edu.startDate && edu.endDate && (
                                        <p className="font-bold mb-0.5">{edu.startDate} -- {edu.endDate}</p>
                                    )}
                                    {edu.gpa && <p>Current GPA: {edu.gpa}</p>}
                                    {edu.percentage && <p>Percentage: {edu.percentage}%</p>}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}

            {(formData.languages.length > 0 || formData.developerTools.length > 0 ||
              formData.technologies.length > 0 || formData.softSkills.length > 0) && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wide">Technical Skills</h2>
                    <hr className="border-gray-900 mb-2" />
                    <div className="pl-4 space-y-1 text-xs">
                        {formData.languages.length > 0 && (
                            <div>
                                <span className="font-bold text-gray-900">Languages</span>
                                <span className="text-gray-700">: {formData.languages.join(', ')}</span>
                            </div>
                        )}
                        {formData.developerTools.length > 0 && (
                            <div>
                                <span className="font-bold text-gray-900">Developer Tools</span>
                                <span className="text-gray-700">: {formData.developerTools.join(', ')}</span>
                            </div>
                        )}
                        {formData.technologies.length > 0 && (
                            <div>
                                <span className="font-bold text-gray-900">Technologies/Frameworks</span>
                                <span className="text-gray-700">: {formData.technologies.join(', ')}</span>
                            </div>
                        )}
                        {formData.softSkills.length > 0 && (
                            <div>
                                <span className="font-bold text-gray-900">Soft Skills</span>
                                <span className="text-gray-700">: {formData.softSkills.join(', ')}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {formData.certifications.some(c => c.name || c.issuer || c.description) && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wide">Training and Certifications</h2>
                    <hr className="border-gray-900 mb-2" />
                    {formData.certifications.map((cert) => (
                        (cert.name || cert.issuer || cert.description) && (
                            <div key={cert.id} className="mb-3">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex-1">
                                        {cert.name && (
                                            <h3 className="text-xs font-bold text-gray-900">{cert.name}</h3>
                                        )}
                                        {cert.issuer && (
                                            <p className="text-xs italic text-gray-700">{cert.issuer}</p>
                                        )}
                                    </div>
                                    {(cert.startDate || cert.endDate) && (
                                        <div className="text-right text-xs font-bold text-gray-900 ml-4">
                                            {cert.startDate && cert.endDate
                                                ? `${cert.startDate} -- ${cert.endDate}`
                                                : cert.startDate || cert.endDate}
                                        </div>
                                    )}
                                </div>
                                {cert.description && (
                                    <div className="pl-4">
                                        {cert.description.split('\n').filter(l => l.trim()).map((line, idx) => (
                                            <p key={idx} className="text-xs text-gray-700 mb-0.5">- {line.trim()}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    ))}
                </div>
            )}

            {formData.projects.some(p => p.title || p.technologies || p.description) && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wide">Projects</h2>
                    <hr className="border-gray-900 mb-2" />
                    {formData.projects.map((project) => (
                        (project.title || project.technologies || project.description) && (
                            <div key={project.id} className="mb-3">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex-1">
                                        <span className="text-xs font-bold text-gray-900">
                                            {project.title || 'Project'}
                                            {project.technologies && ` | ${project.technologies}`}
                                        </span>
                                    </div>
                                    {(project.date || project.status) && (
                                        <div className="text-right text-xs font-bold text-gray-900 ml-4">
                                            {project.date || project.status}
                                        </div>
                                    )}
                                </div>
                                {project.description && (
                                    <div className="pl-4">
                                        {project.description.split('\n').filter(l => l.trim()).map((line, idx) => (
                                            <p key={idx} className="text-xs text-gray-700 mb-0.5">- {line.trim()}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );



    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Resume Builder</h1>
                    <p className="text-slate-400">Fill in your information to generate a professional resume</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowPreview(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all"
                    >
                        <Eye size={20} />
                        <span>Preview Resume</span>
                    </button>
                    <button
                        onClick={generateResumePDF}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-lg shadow-lg shadow-blue-500/25 transition-all"
                    >
                        <Download size={20} />
                        <span>Generate Resume PDF</span>
                    </button>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-xl space-y-8">
                {/* Contact Information */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <FileText size={20} />
                        Contact Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="Full Name *"
                            value={formData.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            placeholder="e.g., John Doe"
                        />
                        <InputField
                            label="Phone"
                            value={formData.phone}
                            onChange={(e) => updateField('phone', e.target.value)}
                            placeholder="e.g., +1 234 567 8900"
                        />
                        <InputField
                            label="Email"
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            placeholder="e.g., john.doe@email.com"
                            type="email"
                        />
                        <InputField
                            label="LinkedIn"
                            value={formData.linkedin}
                            onChange={(e) => updateField('linkedin', e.target.value)}
                            placeholder="e.g., linkedin.com/in/johndoe"
                        />
                        <InputField
                            label="GitHub"
                            value={formData.github}
                            onChange={(e) => updateField('github', e.target.value)}
                            placeholder="e.g., github.com/johndoe"
                        />
                    </div>
                </section>

                {/* Career Objective */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-4">Career Objective</h2>
                    <TextAreaField
                        label="Career Objective"
                        value={formData.careerObjective}
                        onChange={(e) => updateField('careerObjective', e.target.value)}
                        placeholder="Write a brief statement about your career goals and what you're looking for..."
                        rows={4}
                    />
                </section>

                {/* Education */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Education</h2>
                        <button
                            onClick={() => addArrayItem('education', {
                                degree: '',
                                university: '',
                                institution: '',
                                location: '',
                                startDate: '',
                                endDate: '',
                                gpa: '',
                                percentage: '',
                                type: 'degree'
                            })}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
                        >
                            <Plus size={18} />
                            <span>Add Education</span>
                        </button>
                    </div>
                    <div className="space-y-6">
                        {formData.education.map((edu, index) => (
                            <div key={edu.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">Education Entry {index + 1}</h3>
                                    {formData.education.length > 1 && (
                                        <button
                                            onClick={() => removeArrayItem('education', edu.id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        label="University/Institution"
                                        value={edu.university}
                                        onChange={(e) => updateArrayField('education', edu.id, { university: e.target.value })}
                                        placeholder="e.g., APJ Abdul Kalam Technological University"
                                    />
                                    <InputField
                                        label="Degree/Qualification"
                                        value={edu.degree}
                                        onChange={(e) => updateArrayField('education', edu.id, { degree: e.target.value })}
                                        placeholder="e.g., Bachelor of Technology in Computer Science"
                                    />
                                    <InputField
                                        label="Institution Name"
                                        value={edu.institution}
                                        onChange={(e) => updateArrayField('education', edu.id, { institution: e.target.value })}
                                        placeholder="e.g., Rajiv Gandhi Institute Of Technology"
                                    />
                                    <InputField
                                        label="Location"
                                        value={edu.location}
                                        onChange={(e) => updateArrayField('education', edu.id, { location: e.target.value })}
                                        placeholder="e.g., Kottayam, Kerala"
                                    />
                                    <InputField
                                        label="Start Date"
                                        value={edu.startDate}
                                        onChange={(e) => updateArrayField('education', edu.id, { startDate: e.target.value })}
                                        placeholder="e.g., 2023"
                                    />
                                    <InputField
                                        label="End Date"
                                        value={edu.endDate}
                                        onChange={(e) => updateArrayField('education', edu.id, { endDate: e.target.value })}
                                        placeholder="e.g., 2027"
                                    />
                                    <InputField
                                        label="GPA (if applicable)"
                                        value={edu.gpa}
                                        onChange={(e) => updateArrayField('education', edu.id, { gpa: e.target.value })}
                                        placeholder="e.g., 8.4"
                                    />
                                    <InputField
                                        label="Percentage (if applicable)"
                                        value={edu.percentage}
                                        onChange={(e) => updateArrayField('education', edu.id, { percentage: e.target.value })}
                                        placeholder="e.g., 96.75"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Technical Skills */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-4">Technical Skills</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Languages</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={currentSkillInput.language}
                                    onChange={(e) => setCurrentSkillInput(prev => ({ ...prev, language: e.target.value }))}
                                    onKeyPress={(e) => e.key === 'Enter' && addSkill('language')}
                                    placeholder="e.g., Java, Python, JavaScript"
                                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={() => addSkill('language')}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.languages.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-lg flex items-center gap-2">
                                        {skill}
                                        <button onClick={() => removeSkill('language', index)} className="text-blue-400 hover:text-blue-300">
                                            <Trash2 size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Developer Tools</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={currentSkillInput.developerTool}
                                    onChange={(e) => setCurrentSkillInput(prev => ({ ...prev, developerTool: e.target.value }))}
                                    onKeyPress={(e) => e.key === 'Enter' && addSkill('developerTool')}
                                    placeholder="e.g., VS Code, Git"
                                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={() => addSkill('developerTool')}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.developerTools.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-green-600/20 text-green-300 rounded-lg flex items-center gap-2">
                                        {skill}
                                        <button onClick={() => removeSkill('developerTool', index)} className="text-green-400 hover:text-green-300">
                                            <Trash2 size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Technologies/Frameworks</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={currentSkillInput.technology}
                                    onChange={(e) => setCurrentSkillInput(prev => ({ ...prev, technology: e.target.value }))}
                                    onKeyPress={(e) => e.key === 'Enter' && addSkill('technology')}
                                    placeholder="e.g., React, Node.js, MySQL"
                                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={() => addSkill('technology')}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.technologies.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-lg flex items-center gap-2">
                                        {skill}
                                        <button onClick={() => removeSkill('technology', index)} className="text-purple-400 hover:text-purple-300">
                                            <Trash2 size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Soft Skills</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={currentSkillInput.softSkill}
                                    onChange={(e) => setCurrentSkillInput(prev => ({ ...prev, softSkill: e.target.value }))}
                                    onKeyPress={(e) => e.key === 'Enter' && addSkill('softSkill')}
                                    placeholder="e.g., Problem-solving, Teamwork, Communication"
                                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={() => addSkill('softSkill')}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.softSkills.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-lg flex items-center gap-2">
                                        {skill}
                                        <button onClick={() => removeSkill('softSkill', index)} className="text-orange-400 hover:text-orange-300">
                                            <Trash2 size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Training and Certifications */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Training and Certifications</h2>
                        <button
                            onClick={() => addArrayItem('certifications', {
                                name: '',
                                issuer: '',
                                startDate: '',
                                endDate: '',
                                description: ''
                            })}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
                        >
                            <Plus size={18} />
                            <span>Add Certification</span>
                        </button>
                    </div>
                    <div className="space-y-6">
                        {formData.certifications.map((cert, index) => (
                            <div key={cert.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">Certification {index + 1}</h3>
                                    {formData.certifications.length > 1 && (
                                        <button
                                            onClick={() => removeArrayItem('certifications', cert.id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        label="Certification Name"
                                        value={cert.name}
                                        onChange={(e) => updateArrayField('certifications', cert.id, { name: e.target.value })}
                                        placeholder="e.g., IBM Build with Real-World AI Certification"
                                    />
                                    <InputField
                                        label="Issuer/Organization"
                                        value={cert.issuer}
                                        onChange={(e) => updateArrayField('certifications', cert.id, { issuer: e.target.value })}
                                        placeholder="e.g., IBM"
                                    />
                                    <InputField
                                        label="Start Date"
                                        value={cert.startDate}
                                        onChange={(e) => updateArrayField('certifications', cert.id, { startDate: e.target.value })}
                                        placeholder="e.g., September 2025"
                                    />
                                    <InputField
                                        label="End Date"
                                        value={cert.endDate}
                                        onChange={(e) => updateArrayField('certifications', cert.id, { endDate: e.target.value })}
                                        placeholder="e.g., October 2025"
                                    />
                                </div>
                                <div className="mt-4">
                                    <TextAreaField
                                        label="Description"
                                        value={cert.description}
                                        onChange={(e) => updateArrayField('certifications', cert.id, { description: e.target.value })}
                                        placeholder="Describe what you learned or achieved..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Projects */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Projects</h2>
                        <button
                            onClick={() => addArrayItem('projects', {
                                title: '',
                                technologies: '',
                                date: '',
                                status: '',
                                description: ''
                            })}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
                        >
                            <Plus size={18} />
                            <span>Add Project</span>
                        </button>
                    </div>
                    <div className="space-y-6">
                        {formData.projects.map((project, index) => (
                            <div key={project.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">Project {index + 1}</h3>
                                    {formData.projects.length > 1 && (
                                        <button
                                            onClick={() => removeArrayItem('projects', project.id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        label="Project Title"
                                        value={project.title}
                                        onChange={(e) => updateArrayField('projects', project.id, { title: e.target.value })}
                                        placeholder="e.g., Digital Portfolio Management System"
                                    />
                                    <InputField
                                        label="Technologies Used"
                                        value={project.technologies}
                                        onChange={(e) => updateArrayField('projects', project.id, { technologies: e.target.value })}
                                        placeholder="e.g., React, Node.js, MySQL"
                                    />
                                    <InputField
                                        label="Date"
                                        value={project.date}
                                        onChange={(e) => updateArrayField('projects', project.id, { date: e.target.value })}
                                        placeholder="e.g., October 2025"
                                    />
                                    <InputField
                                        label="Status"
                                        value={project.status}
                                        onChange={(e) => updateArrayField('projects', project.id, { status: e.target.value })}
                                        placeholder="e.g., Ongoing, Completed"
                                    />
                                </div>
                                <div className="mt-4">
                                    <TextAreaField
                                        label="Description"
                                        value={project.description}
                                        onChange={(e) => updateArrayField('projects', project.id, { description: e.target.value })}
                                        placeholder="Describe your project, what it does, and your contributions..."
                                        rows={4}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="fixed left-[-10000px] top-0 pointer-events-none opacity-0">
                {renderResumePreviewContent(resumePreviewRef)}
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-500">
                            <h2 className="text-2xl font-bold text-white">Resume Preview</h2>
                            <div className="flex gap-3">
                                <button
                                    onClick={generateResumePDF}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
                                >
                                    <Download size={18} />
                                    <span>Download PDF</span>
                                </button>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="p-2 hover:bg-white/20 text-white rounded-lg transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Preview Content */}
                        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                            {renderResumePreviewContent()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeBuilder;
