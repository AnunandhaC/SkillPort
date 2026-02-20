import React from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../context/DataProvider';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

const PortfolioView = () => {
    const { id } = useParams();
    const { getStudentPortfolio } = useData();
    const portfolio = getStudentPortfolio(id);

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
