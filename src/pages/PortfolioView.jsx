import React from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../context/DataProvider';

const PortfolioView = () => {
    const { id } = useParams();
    const { getStudentPortfolio, loading } = useData();
    const portfolio = getStudentPortfolio(id);

    if (loading) return <div className="text-white text-center mt-20">Loading portfolio...</div>;
    if (!portfolio) return <div className="text-white text-center mt-20">Portfolio not found or not published.</div>;

    const { about, skills, projects, certifications, templateId } = portfolio;

    // Tiny "Made with" banner
    const Footer = () => (
        <div className="fixed bottom-4 right-4 bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-xs">
            Built with Digital Portfolio System
        </div>
    );

    // Modern Minimal Template
    if (templateId === 'modern') {
        return (
            <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-black selection:text-white">
                <header className="px-6 py-20 max-w-4xl mx-auto">
                    <h1 className="text-6xl font-bold tracking-tighter mb-6">Student Portfolio</h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">{about}</p>

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
                                    <h3 className="text-xl font-bold mb-3">{p.title}</h3>
                                    <p className="text-slate-600 mb-4">{p.desc}</p>
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
                                <span className="text-slate-500">{c.issuer}</span>
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
                    <p className="text-2xl md:text-3xl text-slate-400 font-light max-w-3xl mx-auto">{about}</p>
                </header>

                <section className="px-6 py-12">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((p, i) => (
                            <div key={i} className="aspect-square bg-slate-900 rounded-3xl p-8 flex flex-col justify-end hover:bg-slate-800 transition cursor-pointer group">
                                <div className="mb-auto">
                                    <span className="text-xs font-mono text-purple-400">0{i + 1}</span>
                                </div>
                                <h3 className="text-3xl font-bold group-hover:text-purple-400 transition">{p.title}</h3>
                                <p className="text-slate-500 mt-2">{p.desc}</p>
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
                            <h2 className="text-3xl sm:text-4xl font-normal leading-tight mt-1">{fullName}</h2>
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
                            <p className="text-xs sm:text-sm max-w-xl leading-relaxed mb-6">
                                {about || 'An architect who believes in sustainable and minimal design, focusing on functionality and harmony with nature.'}
                            </p>

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
                                        <h4 className="mt-2 font-normal text-sm sm:text-base">{p.title || `Project ${i + 1}`}</h4>
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

    // Fallback / Academic
    return (
        <div className="min-h-screen bg-slate-50 font-serif text-slate-800">
            <div className="max-w-3xl mx-auto bg-white min-h-screen shadow-2xl p-12 md:p-20 border-x">
                <header className="border-b-2 border-black pb-8 mb-12">
                    <h1 className="text-4xl font-bold uppercase tracking-widest mb-4">Portfolio</h1>
                    <p className="text-lg italic text-slate-600">{about}</p>
                </header>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold uppercase mb-6 flex items-center gap-3">
                        <span className="w-8 h-1 bg-black"></span> Projects
                    </h2>
                    <div className="space-y-8">
                        {projects.map((p, i) => (
                            <div key={i}>
                                <h3 className="text-xl font-bold">{p.title}</h3>
                                <p className="text-slate-600 mt-1">{p.desc}</p>
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
                    <ul className="list-disc pl-5 space-y-2">
                        {certifications.map((c, i) => (
                            <li key={i}>
                                <span className="font-bold">{c.name}</span> - {c.issuer}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default PortfolioView;
