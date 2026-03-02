import{j as e,D as z,e as N,F as P,f as v,g as $,U as T,h as C,B as D,E as I,P as A,i as M,T as E,A as L}from"./ui-vendor-Bts8prWh.js";import{r as g,L as w}from"./react-vendor-BUEQUwh2.js";import{u as k,a as R}from"./index-Ce4vSZTH.js";import{_ as S}from"./pdf-vendor-B1zU7fDV.js";const Y=({portfolio:s})=>{const{analyzePortfolio:x}=k(),m=g.useMemo(()=>x(s),[s,x]),[i,l]=g.useState([]),[t,r]=g.useState(""),[n,a]=g.useState(!1),p=g.useRef(null),b=g.useRef(null);g.useEffect(()=>{if(i.length===0&&s){const c=[{id:Date.now(),type:"bot",text:`Hello! I'm your Portfolio Assistant. I can help you improve your portfolio and answer questions about it. ${m.length>0?"I have some suggestions for you:":"Your portfolio looks great!"}`}];m.length>0?m.forEach((f,o)=>{c.push({id:Date.now()+o+1,type:"bot",text:`💡 ${f}`})}):c.push({id:Date.now()+1,type:"bot",text:"Your portfolio is well-structured! Feel free to ask me any questions about improving it further."}),l(c)}},[s,m]),g.useEffect(()=>{var d;(d=p.current)==null||d.scrollIntoView({behavior:"smooth"})},[i,n]);const u=d=>{const c=d.toLowerCase();if(c.includes("suggest")||c.includes("improve")||c.includes("help"))return m.length>0?`Based on your portfolio, here are my recommendations:

${m.map((o,y)=>`${y+1}. ${o}`).join(`

`)}

Would you like me to elaborate on any of these?`:"Your portfolio looks great! To make it even better, consider adding more detailed project descriptions, showcasing your best work prominently, and keeping your skills section updated.";if(c.includes("skill")){const o=(s==null?void 0:s.skills)||[];return o.length===0?"I notice you haven't added any skills yet. Adding relevant skills helps employers quickly understand your expertise. Consider adding technical skills, programming languages, tools, and soft skills that match your projects and career goals.":`You have ${o.length} skill${o.length>1?"s":""} listed: ${o.join(", ")}. That's a good start! Consider adding more specific skills related to your projects, or skills that are in demand for your target roles.`}if(c.includes("project")){const o=(s==null?void 0:s.projects)||[];return o.length===0?"Projects are crucial for showcasing your practical experience! Add projects that demonstrate your skills, problem-solving abilities, and technical expertise. Include a clear title, description, technologies used, and if possible, links to live demos or GitHub repositories.":`You have ${o.length} project${o.length>1?"s":""} listed. Great! To make them stand out more, ensure each project has:
- A clear, descriptive title
- Detailed description of what it does
- Technologies/tools used
- Your role and contributions
- Links to demos or code (if available)`}if(c.includes("about")||c.includes("summary")||c.includes("bio")){const o=(s==null?void 0:s.about)||"";return!o||o.length<50?`Your "About" section is your first impression! Write a compelling professional summary (50+ words) that highlights:
- Who you are professionally
- Your key skills and interests
- What makes you unique
- Your career goals or what you're looking for

This helps visitors quickly understand your value proposition.`:`Your "About" section looks good! Make sure it's engaging and clearly communicates your professional identity. Consider updating it regularly to reflect your latest achievements and goals.`}if(c.includes("certif")||c.includes("certificate")){const o=(s==null?void 0:s.certifications)||[];return o.length===0?`Certifications add credibility to your portfolio! Consider adding:
- Professional certifications
- Online course completions
- Workshop or training certificates
- Academic achievements

These show your commitment to continuous learning and professional development.`:`You have ${o.length} certification${o.length>1?"s":""} listed. Excellent! Certifications validate your skills and show employers that you're committed to professional growth.`}if(c.includes("template")||c.includes("design")||c.includes("look")){const o=(s==null?void 0:s.templateId)||"modern";return`You're currently using the "${{modern:"Modern Minimal",creative:"Creative Bold",academic:"Academic Professional"}[o]||"Modern Minimal"}" template. Each template has its own style:
- Modern Minimal: Clean and professional
- Creative Bold: Eye-catching and dynamic
- Academic Professional: Structured and detailed

You can change templates anytime in the Portfolio Editor!`}if(c.includes("what")&&(c.includes("missing")||c.includes("need"))){const o=[];return(!(s!=null&&s.about)||s.about.length<50)&&o.push("a detailed About section"),(!(s!=null&&s.skills)||s.skills.length===0)&&o.push("Skills section"),(!(s!=null&&s.projects)||s.projects.length===0)&&o.push("Projects"),(!(s!=null&&s.certifications)||s.certifications.length===0)&&o.push("Certifications"),o.length>0?`Your portfolio could benefit from:

${o.map((y,F)=>`${F+1}. ${y}`).join(`
`)}

These elements help create a complete and professional portfolio that showcases your full potential!`:"Your portfolio has all the essential elements! Consider adding more details, updating content regularly, and showcasing your best work prominently."}const f=["That's a great question! Based on your portfolio, I'd recommend focusing on showcasing your best projects prominently and keeping your skills section updated.","I can help you with portfolio improvements, suggestions, or answer questions about your current portfolio. Try asking about skills, projects, certifications, or how to improve specific sections.",`Feel free to ask me about:
- How to improve your portfolio
- What sections need work
- Skills and projects
- Certifications
- Portfolio design and templates`];return f[Math.floor(Math.random()*f.length)]},h=async()=>{if(!t.trim()||n)return;const d={id:Date.now(),type:"user",text:t.trim()};l(c=>[...c,d]),r(""),a(!0),setTimeout(()=>{const c={id:Date.now()+1,type:"bot",text:u(d.text)};l(f=>[...f,c]),a(!1)},800)},j=d=>{d.key==="Enter"&&!d.shiftKey&&(d.preventDefault(),h())};return s?e.jsxs("div",{className:"flex flex-col h-[600px] bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden",children:[e.jsx("div",{className:"p-4 border-b border-slate-700 bg-gradient-to-r from-blue-600/20 to-purple-600/20",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-blue-600/20 rounded-lg",children:e.jsx(v,{className:"text-blue-400",size:20})}),e.jsxs("div",{children:[e.jsxs("h3",{className:"font-bold text-white flex items-center gap-2",children:["Portfolio Assistant",e.jsx($,{className:"text-yellow-400",size:16})]}),e.jsx("p",{className:"text-xs text-slate-400",children:"Ask me anything about your portfolio"})]})]})}),e.jsxs("div",{className:"flex-1 overflow-y-auto p-4 space-y-4",children:[i.map(d=>e.jsxs("div",{className:`flex gap-3 ${d.type==="user"?"justify-end":"justify-start"}`,children:[d.type==="bot"&&e.jsx("div",{className:"flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center",children:e.jsx(v,{className:"text-blue-400",size:16})}),e.jsx("div",{className:`max-w-[80%] rounded-2xl px-4 py-2 ${d.type==="user"?"bg-blue-600 text-white":"bg-slate-800 text-slate-100 border border-slate-700"}`,children:e.jsx("p",{className:"text-sm whitespace-pre-line",children:d.text})}),d.type==="user"&&e.jsx("div",{className:"flex-shrink-0 w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center",children:e.jsx(T,{className:"text-purple-400",size:16})})]},d.id)),n&&e.jsxs("div",{className:"flex gap-3 justify-start",children:[e.jsx("div",{className:"flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center",children:e.jsx(v,{className:"text-blue-400",size:16})}),e.jsx("div",{className:"bg-slate-800 text-slate-100 border border-slate-700 rounded-2xl px-4 py-2",children:e.jsxs("div",{className:"flex gap-1",children:[e.jsx("div",{className:"w-2 h-2 bg-slate-400 rounded-full animate-bounce",style:{animationDelay:"0ms"}}),e.jsx("div",{className:"w-2 h-2 bg-slate-400 rounded-full animate-bounce",style:{animationDelay:"150ms"}}),e.jsx("div",{className:"w-2 h-2 bg-slate-400 rounded-full animate-bounce",style:{animationDelay:"300ms"}})]})})]}),e.jsx("div",{ref:p})]}),e.jsxs("div",{className:"p-4 border-t border-slate-700 bg-slate-900/50",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx("input",{ref:b,type:"text",value:t,onChange:d=>r(d.target.value),onKeyPress:j,placeholder:"Ask about your portfolio...",className:"flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500",disabled:n}),e.jsx("button",{onClick:h,disabled:!t.trim()||n,className:"px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",children:e.jsx(C,{size:18})})]}),e.jsx("p",{className:"text-xs text-slate-500 mt-2",children:'Try: "How can I improve my portfolio?" or "What skills should I add?"'})]})]}):e.jsx("div",{className:"p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400",children:e.jsx("p",{children:"Create a portfolio first to get personalized suggestions and chat with your Portfolio Assistant!"})})},U=({portfolio:s})=>{const{opportunities:x}=k(),m=g.useMemo(()=>{var l;if(!s)return[];const i=new Set(((l=s.skills)==null?void 0:l.map(t=>t.toLowerCase()))||[]);return x.filter(t=>t.requiredSkills.length===0?!0:t.requiredSkills.some(r=>i.has(r.toLowerCase())))},[s,x]);return s?e.jsxs("div",{className:"space-y-6",children:[e.jsxs("h3",{className:"text-xl font-bold text-white flex items-center gap-2",children:[e.jsx(D,{className:"text-blue-400"}),e.jsx("span",{children:"Recommended For You"})]}),m.length===0?e.jsx("p",{className:"text-slate-500",children:"No matching opportunities found based on your current skills."}):e.jsx("div",{className:"grid md:grid-cols-2 gap-4",children:m.map(i=>e.jsxs("div",{className:"glass-card p-6 rounded-xl border border-white/10 group",children:[e.jsxs("div",{className:"flex justify-between items-start mb-2",children:[e.jsx("span",{className:`text-xs px-2 py-1 rounded ${i.type==="Internship"?"bg-blue-500/20 text-blue-400":"bg-purple-500/20 text-purple-400"}`,children:i.type}),e.jsx("span",{className:"text-xs text-slate-500",children:"Match"})]}),e.jsx("h4",{className:"font-bold text-white text-lg group-hover:text-blue-400 transition",children:i.title}),e.jsx("p",{className:"text-slate-400 text-sm mb-4",children:i.company}),e.jsx("div",{className:"flex flex-wrap gap-2 mb-4",children:i.requiredSkills.map(l=>e.jsx("span",{className:"text-xs px-2 py-1 bg-white/5 rounded text-slate-300",children:l},l))}),e.jsx("button",{className:"w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition cursor-pointer",children:"View Details"})]},i.id))})]}):e.jsx("div",{className:"text-slate-500",children:"Create a portfolio to see matches."})},_=({portfolio:s})=>{const x=async()=>{if(!s)return;const{default:m}=await S(async()=>{const{default:n}=await import("./pdf-vendor-B1zU7fDV.js").then(a=>a.j);return{default:n}},[],import.meta.url),i=new m;i.setFontSize(22),i.text("Portfolio Resume",20,20),i.setFontSize(12),i.text(`ID: ${s.studentId}`,20,30),i.setFontSize(16),i.text("Professional Summary",20,45),i.setFontSize(11);const l=i.splitTextToSize(s.about||"",170);i.text(l,20,55);let t=55+l.length*5+10;i.setFontSize(16),i.text("Skills",20,t),t+=10,i.setFontSize(11);const r=(s.skills||[]).join(", ");i.text(r,20,t),t+=20,i.setFontSize(16),i.text("Projects",20,t),t+=10,(s.projects||[]).forEach(n=>{i.setFontSize(12),i.setFont(void 0,"bold"),i.text(n.title,20,t),i.setFont(void 0,"normal"),t+=6,i.setFontSize(10),i.text(n.desc||"",20,t),t+=12}),i.save(`${s.studentId}_resume.pdf`)};return e.jsxs("button",{onClick:x,disabled:!s,className:"flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed",children:[e.jsx(z,{size:18}),e.jsx("span",{children:"Download Resume PDF"})]})},O=({portfolio:s})=>{const x=()=>{if(!s)return"";const{about:l,skills:t,projects:r,certifications:n,templateId:a}=s,p=s.studentId||"portfolio";let b="";return a==="modern"?b=`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - ${p}</title>
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
            <p class="about">${l||"No description available."}</p>
        </header>

        <section class="bg-light">
            <div class="container">
                <h2>Featured Projects</h2>
                <div class="projects-grid">
                    ${r&&r.length>0?r.map(u=>`
                        <div class="project-card">
                            <h3>${u.title||"Untitled Project"}</h3>
                            <p>${u.desc||"No description available."}</p>
                        </div>
                    `).join(""):"<p>No projects available.</p>"}
                </div>
            </div>
        </section>

        <section>
            <div class="container">
                <h2>Skills & Certifications</h2>
                <div class="skills">
                    ${t&&t.length>0?t.map(u=>`<span class="skill-tag">${u}</span>`).join(""):"<p>No skills listed.</p>"}
                </div>
                <div class="certifications">
                    ${n&&n.length>0?n.map(u=>`
                        <div class="cert-item">
                            <span class="cert-name">${u.name||"Unnamed Certification"}</span>
                            <span class="cert-issuer">${u.issuer||"Unknown Issuer"}</span>
                        </div>
                    `).join(""):"<p>No certifications available.</p>"}
                </div>
            </div>
        </section>
    </div>
</body>
</html>`:b=`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - ${p}</title>
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
            <p class="about">${l||"No description available."}</p>
        </header>

        <section>
            <h2>Projects</h2>
            ${r&&r.length>0?r.map(u=>`
                <div class="project">
                    <h3>${u.title||"Untitled Project"}</h3>
                    <p>${u.desc||"No description available."}</p>
                </div>
            `).join(""):"<p>No projects available.</p>"}
        </section>

        <section>
            <h2>Skills</h2>
            <p class="skills">${t&&t.length>0?t.join(" • "):"No skills listed."}</p>
        </section>

        <section>
            <h2>Awards</h2>
            <ul>
                ${n&&n.length>0?n.map(u=>`
                    <li><strong>${u.name||"Unnamed Certification"}</strong> - ${u.issuer||"Unknown Issuer"}</li>
                `).join(""):"<li>No certifications available.</li>"}
            </ul>
        </section>
    </div>
</body>
</html>`,b},m=async()=>{if(!s)return;const{default:l}=await S(async()=>{const{default:h}=await import("./pdf-vendor-B1zU7fDV.js").then(j=>j.j);return{default:h}},[],import.meta.url),t=new l("p","mm","a4"),r=t.internal.pageSize.getWidth(),n=20;let a=n;t.setFontSize(24),t.setFont(void 0,"bold"),t.text("Portfolio",n,a),a+=10,t.setFontSize(12),t.setFont(void 0,"normal"),t.text(`Student ID: ${s.studentId||"N/A"}`,n,a),a+=15,t.setFontSize(18),t.setFont(void 0,"bold"),t.text("About",n,a),a+=10,t.setFontSize(11),t.setFont(void 0,"normal");const p=t.splitTextToSize(s.about||"No description available.",r-2*n);t.text(p,n,a),a+=p.length*6+10,a>250&&(t.addPage(),a=n),t.setFontSize(18),t.setFont(void 0,"bold"),t.text("Skills",n,a),a+=10,t.setFontSize(11),t.setFont(void 0,"normal");const b=(s.skills||[]).length>0?(s.skills||[]).join(", "):"No skills listed.",u=t.splitTextToSize(b,r-2*n);t.text(u,n,a),a+=u.length*6+15,t.setFontSize(18),t.setFont(void 0,"bold"),t.text("Projects",n,a),a+=10,(s.projects||[]).forEach((h,j)=>{a>250&&(t.addPage(),a=n),t.setFontSize(14),t.setFont(void 0,"bold"),t.text(h.title||`Project ${j+1}`,n,a),a+=8,t.setFontSize(10),t.setFont(void 0,"normal");const d=t.splitTextToSize(h.desc||"No description available.",r-2*n);t.text(d,n,a),a+=d.length*5+10}),s.certifications&&s.certifications.length>0&&(a>250&&(t.addPage(),a=n),t.setFontSize(18),t.setFont(void 0,"bold"),t.text("Certifications",n,a),a+=10,s.certifications.forEach(h=>{a>250&&(t.addPage(),a=n),t.setFontSize(12),t.setFont(void 0,"bold"),t.text(h.name||"Unnamed Certification",n,a),a+=7,t.setFontSize(10),t.setFont(void 0,"normal"),t.text(`Issued by: ${h.issuer||"Unknown"}`,n+5,a),a+=10})),t.save(`${s.studentId||"portfolio"}_portfolio.pdf`)},i=()=>{if(!s)return;const l=x(),t=new Blob([l],{type:"text/html"}),r=URL.createObjectURL(t),n=document.createElement("a");n.href=r,n.download=`${s.studentId||"portfolio"}_portfolio.html`,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(r)};return s?e.jsxs("div",{className:"space-y-4",children:[e.jsxs("h3",{className:"text-lg font-bold text-white mb-4 flex items-center gap-2",children:[e.jsx(N,{size:20}),e.jsx("span",{children:"Download Portfolio"})]}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsxs("button",{onClick:m,className:"flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed",children:[e.jsx(P,{size:18}),e.jsx("span",{children:"Download as PDF"})]}),e.jsxs("button",{onClick:i,className:"flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed",children:[e.jsx(N,{size:18}),e.jsx("span",{children:"Download as HTML"})]})]}),e.jsx("p",{className:"text-sm text-slate-400",children:"Download your portfolio as a PDF or standalone HTML file that can be shared offline."})]}):null},V=()=>{var n,a;const{user:s}=R(),{getStudentPortfolio:x,loading:m}=k(),i=x(s==null?void 0:s.id),[l,t]=g.useState("overview");if(m)return e.jsx("div",{className:"text-white text-center py-16",children:"Loading portfolio..."});const r=({icon:p,label:b,value:u,color:h})=>e.jsxs("div",{className:"glass-card p-6 rounded-xl flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-slate-400 text-sm mb-1",children:b}),e.jsx("p",{className:"text-2xl font-bold text-white",children:u})]}),e.jsx("div",{className:`p-3 rounded-lg bg-${h}-500/20 text-${h}-400`,children:e.jsx(p,{size:24})})]});return e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-4",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold text-white mb-2",children:"My Portfolio"}),e.jsx("p",{className:"text-slate-400",children:"Manage your digital presence and career opportunities."})]}),e.jsx("div",{className:"flex gap-4",children:i&&(s==null?void 0:s.id)&&e.jsxs(e.Fragment,{children:[e.jsxs(w,{to:`/portfolio/view/${s.id}`,target:"_blank",className:"flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all",title:"Open Public Website",children:[e.jsx(I,{size:18}),e.jsx("span",{children:"View Website"})]}),e.jsxs(w,{to:"/portfolio-editor",className:"flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium shadow-lg shadow-blue-500/25 transition-all",children:[e.jsx(A,{size:18}),e.jsx("span",{children:"Edit Portfolio"})]})]})})]}),i?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex gap-6 border-b border-white/10",children:[e.jsx("button",{onClick:()=>t("overview"),className:`pb-4 px-2 text-sm font-medium border-b-2 transition ${l==="overview"?"border-blue-500 text-blue-400":"border-transparent text-slate-400 hover:text-white"}`,children:"Overview"}),e.jsx("button",{onClick:()=>t("analysis"),className:`pb-4 px-2 text-sm font-medium border-b-2 transition ${l==="analysis"?"border-blue-500 text-blue-400":"border-transparent text-slate-400 hover:text-white"}`,children:"Analysis & Suggestions"}),e.jsx("button",{onClick:()=>t("opportunities"),className:`pb-4 px-2 text-sm font-medium border-b-2 transition ${l==="opportunities"?"border-blue-500 text-blue-400":"border-transparent text-slate-400 hover:text-white"}`,children:"Opportunities"})]}),l==="overview"&&e.jsxs("div",{className:"space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:[e.jsx(r,{icon:E,label:"Profile Score",value:i.score||"N/A",color:"green"}),e.jsx(r,{icon:L,label:"Achievements",value:((n=i.certifications)==null?void 0:n.length)||0,color:"purple"}),e.jsx(r,{icon:P,label:"Projects",value:((a=i.projects)==null?void 0:a.length)||0,color:"orange"})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"glass-panel p-6 rounded-xl",children:[e.jsx("h3",{className:"text-lg font-bold text-white mb-4",children:"Quick Actions"}),e.jsx("div",{className:"flex flex-wrap gap-4",children:e.jsx(_,{portfolio:i})})]}),e.jsx("div",{className:"glass-panel p-6 rounded-xl",children:e.jsx(O,{portfolio:i})})]})]}),l==="analysis"&&e.jsx("div",{className:"animate-in fade-in slide-in-from-bottom-4 duration-500",children:e.jsx("div",{className:"max-w-4xl mx-auto",children:e.jsx(Y,{portfolio:i})})}),l==="opportunities"&&e.jsx("div",{className:"animate-in fade-in slide-in-from-bottom-4 duration-500",children:e.jsx(U,{portfolio:i})})]}):e.jsxs("div",{className:"glass-panel p-12 rounded-2xl text-center",children:[e.jsx("div",{className:"w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6",children:e.jsx(M,{size:40})}),e.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"Start Your Journey"}),e.jsx("p",{className:"text-slate-400 max-w-md mx-auto mb-8",children:"Create a professional digital portfolio to showcase your skills, projects, and achievements to potential employers."}),e.jsx(w,{to:"/portfolio-editor",className:"inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all hover:scale-105 shadow-xl shadow-blue-500/20",children:"Build Portfolio"})]})]})};export{V as default};
