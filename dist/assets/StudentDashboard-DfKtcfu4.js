import{j as e,D as z,e as N,F as P,f as v,g as $,U as T,h as C,B as D,E as I,P as M,i as A,T as E,k as R,A as Y}from"./ui-vendor-8ieiN50w.js";import{r as g,L as w}from"./react-vendor-G9Mz0Wnd.js";import{u as k,a as L}from"./index-C6LQPL_A.js";import{_ as S}from"./pdf-vendor-BInbrGm8.js";const U=({portfolio:s})=>{const{analyzePortfolio:h}=k(),d=g.useMemo(()=>h(s),[s,h]),[n,c]=g.useState([]),[t,u]=g.useState(""),[i,a]=g.useState(!1),x=g.useRef(null),b=g.useRef(null);g.useEffect(()=>{if(n.length===0&&s){const r=[{id:Date.now(),type:"bot",text:`Hello! I'm your Portfolio Assistant. I can help you improve your portfolio and answer questions about it. ${d.length>0?"I have some suggestions for you:":"Your portfolio looks great!"}`}];d.length>0?d.forEach((f,o)=>{r.push({id:Date.now()+o+1,type:"bot",text:`💡 ${f}`})}):r.push({id:Date.now()+1,type:"bot",text:"Your portfolio is well-structured! Feel free to ask me any questions about improving it further."}),c(r)}},[s,d]),g.useEffect(()=>{var l;(l=x.current)==null||l.scrollIntoView({behavior:"smooth"})},[n,i]);const m=l=>{const r=l.toLowerCase();if(r.includes("suggest")||r.includes("improve")||r.includes("help"))return d.length>0?`Based on your portfolio, here are my recommendations:

${d.map((o,y)=>`${y+1}. ${o}`).join(`

`)}

Would you like me to elaborate on any of these?`:"Your portfolio looks great! To make it even better, consider adding more detailed project descriptions, showcasing your best work prominently, and keeping your skills section updated.";if(r.includes("skill")){const o=(s==null?void 0:s.skills)||[];return o.length===0?"I notice you haven't added any skills yet. Adding relevant skills helps employers quickly understand your expertise. Consider adding technical skills, programming languages, tools, and soft skills that match your projects and career goals.":`You have ${o.length} skill${o.length>1?"s":""} listed: ${o.join(", ")}. That's a good start! Consider adding more specific skills related to your projects, or skills that are in demand for your target roles.`}if(r.includes("project")){const o=(s==null?void 0:s.projects)||[];return o.length===0?"Projects are crucial for showcasing your practical experience! Add projects that demonstrate your skills, problem-solving abilities, and technical expertise. Include a clear title, description, technologies used, and if possible, links to live demos or GitHub repositories.":`You have ${o.length} project${o.length>1?"s":""} listed. Great! To make them stand out more, ensure each project has:
- A clear, descriptive title
- Detailed description of what it does
- Technologies/tools used
- Your role and contributions
- Links to demos or code (if available)`}if(r.includes("about")||r.includes("summary")||r.includes("bio")){const o=(s==null?void 0:s.about)||"";return!o||o.length<50?`Your "About" section is your first impression! Write a compelling professional summary (50+ words) that highlights:
- Who you are professionally
- Your key skills and interests
- What makes you unique
- Your career goals or what you're looking for

This helps visitors quickly understand your value proposition.`:`Your "About" section looks good! Make sure it's engaging and clearly communicates your professional identity. Consider updating it regularly to reflect your latest achievements and goals.`}if(r.includes("certif")||r.includes("certificate")){const o=(s==null?void 0:s.certifications)||[];return o.length===0?`Certifications add credibility to your portfolio! Consider adding:
- Professional certifications
- Online course completions
- Workshop or training certificates
- Academic achievements

These show your commitment to continuous learning and professional development.`:`You have ${o.length} certification${o.length>1?"s":""} listed. Excellent! Certifications validate your skills and show employers that you're committed to professional growth.`}if(r.includes("template")||r.includes("design")||r.includes("look")){const o=(s==null?void 0:s.templateId)||"modern";return`You're currently using the "${{modern:"Modern Minimal",creative:"Creative Bold",academic:"Academic Professional"}[o]||"Modern Minimal"}" template. Each template has its own style:
- Modern Minimal: Clean and professional
- Creative Bold: Eye-catching and dynamic
- Academic Professional: Structured and detailed

You can change templates anytime in the Portfolio Editor!`}if(r.includes("what")&&(r.includes("missing")||r.includes("need"))){const o=[];return(!(s!=null&&s.about)||s.about.length<50)&&o.push("a detailed About section"),(!(s!=null&&s.skills)||s.skills.length===0)&&o.push("Skills section"),(!(s!=null&&s.projects)||s.projects.length===0)&&o.push("Projects"),(!(s!=null&&s.certifications)||s.certifications.length===0)&&o.push("Certifications"),o.length>0?`Your portfolio could benefit from:

${o.map((y,F)=>`${F+1}. ${y}`).join(`
`)}

These elements help create a complete and professional portfolio that showcases your full potential!`:"Your portfolio has all the essential elements! Consider adding more details, updating content regularly, and showcasing your best work prominently."}const f=["That's a great question! Based on your portfolio, I'd recommend focusing on showcasing your best projects prominently and keeping your skills section updated.","I can help you with portfolio improvements, suggestions, or answer questions about your current portfolio. Try asking about skills, projects, certifications, or how to improve specific sections.",`Feel free to ask me about:
- How to improve your portfolio
- What sections need work
- Skills and projects
- Certifications
- Portfolio design and templates`];return f[Math.floor(Math.random()*f.length)]},p=async()=>{if(!t.trim()||i)return;const l={id:Date.now(),type:"user",text:t.trim()};c(r=>[...r,l]),u(""),a(!0),setTimeout(()=>{const r={id:Date.now()+1,type:"bot",text:m(l.text)};c(f=>[...f,r]),a(!1)},800)},j=l=>{l.key==="Enter"&&!l.shiftKey&&(l.preventDefault(),p())};return s?e.jsxs("div",{className:"flex flex-col h-[600px] bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden",children:[e.jsx("div",{className:"p-4 border-b border-slate-700 bg-gradient-to-r from-blue-600/20 to-purple-600/20",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-blue-600/20 rounded-lg",children:e.jsx(v,{className:"text-blue-400",size:20})}),e.jsxs("div",{children:[e.jsxs("h3",{className:"font-bold text-white flex items-center gap-2",children:["Portfolio Assistant",e.jsx($,{className:"text-yellow-400",size:16})]}),e.jsx("p",{className:"text-xs text-slate-400",children:"Ask me anything about your portfolio"})]})]})}),e.jsxs("div",{className:"flex-1 overflow-y-auto p-4 space-y-4",children:[n.map(l=>e.jsxs("div",{className:`flex gap-3 ${l.type==="user"?"justify-end":"justify-start"}`,children:[l.type==="bot"&&e.jsx("div",{className:"flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center",children:e.jsx(v,{className:"text-blue-400",size:16})}),e.jsx("div",{className:`max-w-[80%] rounded-2xl px-4 py-2 ${l.type==="user"?"bg-blue-600 text-white":"bg-slate-800 text-slate-100 border border-slate-700"}`,children:e.jsx("p",{className:"text-sm whitespace-pre-line",children:l.text})}),l.type==="user"&&e.jsx("div",{className:"flex-shrink-0 w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center",children:e.jsx(T,{className:"text-purple-400",size:16})})]},l.id)),i&&e.jsxs("div",{className:"flex gap-3 justify-start",children:[e.jsx("div",{className:"flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center",children:e.jsx(v,{className:"text-blue-400",size:16})}),e.jsx("div",{className:"bg-slate-800 text-slate-100 border border-slate-700 rounded-2xl px-4 py-2",children:e.jsxs("div",{className:"flex gap-1",children:[e.jsx("div",{className:"w-2 h-2 bg-slate-400 rounded-full animate-bounce",style:{animationDelay:"0ms"}}),e.jsx("div",{className:"w-2 h-2 bg-slate-400 rounded-full animate-bounce",style:{animationDelay:"150ms"}}),e.jsx("div",{className:"w-2 h-2 bg-slate-400 rounded-full animate-bounce",style:{animationDelay:"300ms"}})]})})]}),e.jsx("div",{ref:x})]}),e.jsxs("div",{className:"p-4 border-t border-slate-700 bg-slate-900/50",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx("input",{ref:b,type:"text",value:t,onChange:l=>u(l.target.value),onKeyPress:j,placeholder:"Ask about your portfolio...",className:"flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500",disabled:i}),e.jsx("button",{onClick:p,disabled:!t.trim()||i,className:"px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",children:e.jsx(C,{size:18})})]}),e.jsx("p",{className:"text-xs text-slate-500 mt-2",children:'Try: "How can I improve my portfolio?" or "What skills should I add?"'})]})]}):e.jsx("div",{className:"p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400",children:e.jsx("p",{children:"Create a portfolio first to get personalized suggestions and chat with your Portfolio Assistant!"})})},_=({portfolio:s})=>{const{opportunities:h}=k(),d=g.useMemo(()=>{var c;if(!s)return[];const n=new Set(((c=s.skills)==null?void 0:c.map(t=>t.toLowerCase()))||[]);return h.filter(t=>t.requiredSkills.length===0?!0:t.requiredSkills.some(u=>n.has(u.toLowerCase())))},[s,h]);return s?e.jsxs("div",{className:"space-y-6",children:[e.jsxs("h3",{className:"text-xl font-bold text-white flex items-center gap-2",children:[e.jsx(D,{className:"text-blue-400"}),e.jsx("span",{children:"Recommended For You"})]}),d.length===0?e.jsx("p",{className:"text-slate-500",children:"No matching opportunities found based on your current skills."}):e.jsx("div",{className:"grid md:grid-cols-2 gap-4",children:d.map(n=>e.jsxs("div",{className:"glass-card p-6 rounded-xl border border-white/10 group",children:[e.jsxs("div",{className:"flex justify-between items-start mb-2",children:[e.jsx("span",{className:`text-xs px-2 py-1 rounded ${n.type==="Internship"?"bg-blue-500/20 text-blue-400":"bg-purple-500/20 text-purple-400"}`,children:n.type}),e.jsx("span",{className:"text-xs text-slate-500",children:"Match"})]}),e.jsx("h4",{className:"font-bold text-white text-lg group-hover:text-blue-400 transition",children:n.title}),e.jsx("p",{className:"text-slate-400 text-sm mb-4",children:n.company}),e.jsx("div",{className:"flex flex-wrap gap-2 mb-4",children:n.requiredSkills.map(c=>e.jsx("span",{className:"text-xs px-2 py-1 bg-white/5 rounded text-slate-300",children:c},c))}),e.jsx("button",{className:"w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition cursor-pointer",children:"View Details"})]},n.id))})]}):e.jsx("div",{className:"text-slate-500",children:"Create a portfolio to see matches."})},O=({portfolio:s})=>{const h=async()=>{if(!s)return;const{default:d}=await S(async()=>{const{default:i}=await import("./pdf-vendor-BInbrGm8.js").then(a=>a.j);return{default:i}},[],import.meta.url),n=new d;n.setFontSize(22),n.text("Portfolio Resume",20,20),n.setFontSize(12),n.text(`ID: ${s.studentId}`,20,30),n.setFontSize(16),n.text("Professional Summary",20,45),n.setFontSize(11);const c=n.splitTextToSize(s.about||"",170);n.text(c,20,55);let t=55+c.length*5+10;n.setFontSize(16),n.text("Skills",20,t),t+=10,n.setFontSize(11);const u=(s.skills||[]).join(", ");n.text(u,20,t),t+=20,n.setFontSize(16),n.text("Projects",20,t),t+=10,(s.projects||[]).forEach(i=>{n.setFontSize(12),n.setFont(void 0,"bold"),n.text(i.title,20,t),n.setFont(void 0,"normal"),t+=6,n.setFontSize(10),n.text(i.desc||"",20,t),t+=12}),n.save(`${s.studentId}_resume.pdf`)};return e.jsxs("button",{onClick:h,disabled:!s,className:"flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed",children:[e.jsx(z,{size:18}),e.jsx("span",{children:"Download Resume PDF"})]})},W=({portfolio:s})=>{const h=()=>{if(!s)return"";const{about:c,skills:t,projects:u,certifications:i,templateId:a}=s,x=s.studentId||"portfolio";let b="";return a==="modern"?b=`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - ${x}</title>
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
            <p class="about">${c||"No description available."}</p>
        </header>

        <section class="bg-light">
            <div class="container">
                <h2>Featured Projects</h2>
                <div class="projects-grid">
                    ${u&&u.length>0?u.map(m=>`
                        <div class="project-card">
                            <h3>${m.title||"Untitled Project"}</h3>
                            <p>${m.desc||"No description available."}</p>
                        </div>
                    `).join(""):"<p>No projects available.</p>"}
                </div>
            </div>
        </section>

        <section>
            <div class="container">
                <h2>Skills & Certifications</h2>
                <div class="skills">
                    ${t&&t.length>0?t.map(m=>`<span class="skill-tag">${m}</span>`).join(""):"<p>No skills listed.</p>"}
                </div>
                <div class="certifications">
                    ${i&&i.length>0?i.map(m=>`
                        <div class="cert-item">
                            <span class="cert-name">${m.name||"Unnamed Certification"}</span>
                            <span class="cert-issuer">${m.issuer||"Unknown Issuer"}</span>
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
    <title>Portfolio - ${x}</title>
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
            <p class="about">${c||"No description available."}</p>
        </header>

        <section>
            <h2>Projects</h2>
            ${u&&u.length>0?u.map(m=>`
                <div class="project">
                    <h3>${m.title||"Untitled Project"}</h3>
                    <p>${m.desc||"No description available."}</p>
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
                ${i&&i.length>0?i.map(m=>`
                    <li><strong>${m.name||"Unnamed Certification"}</strong> - ${m.issuer||"Unknown Issuer"}</li>
                `).join(""):"<li>No certifications available.</li>"}
            </ul>
        </section>
    </div>
</body>
</html>`,b},d=async()=>{if(!s)return;const{default:c}=await S(async()=>{const{default:p}=await import("./pdf-vendor-BInbrGm8.js").then(j=>j.j);return{default:p}},[],import.meta.url),t=new c("p","mm","a4"),u=t.internal.pageSize.getWidth(),i=20;let a=i;t.setFontSize(24),t.setFont(void 0,"bold"),t.text("Portfolio",i,a),a+=10,t.setFontSize(12),t.setFont(void 0,"normal"),t.text(`Student ID: ${s.studentId||"N/A"}`,i,a),a+=15,t.setFontSize(18),t.setFont(void 0,"bold"),t.text("About",i,a),a+=10,t.setFontSize(11),t.setFont(void 0,"normal");const x=t.splitTextToSize(s.about||"No description available.",u-2*i);t.text(x,i,a),a+=x.length*6+10,a>250&&(t.addPage(),a=i),t.setFontSize(18),t.setFont(void 0,"bold"),t.text("Skills",i,a),a+=10,t.setFontSize(11),t.setFont(void 0,"normal");const b=(s.skills||[]).length>0?(s.skills||[]).join(", "):"No skills listed.",m=t.splitTextToSize(b,u-2*i);t.text(m,i,a),a+=m.length*6+15,t.setFontSize(18),t.setFont(void 0,"bold"),t.text("Projects",i,a),a+=10,(s.projects||[]).forEach((p,j)=>{a>250&&(t.addPage(),a=i),t.setFontSize(14),t.setFont(void 0,"bold"),t.text(p.title||`Project ${j+1}`,i,a),a+=8,t.setFontSize(10),t.setFont(void 0,"normal");const l=t.splitTextToSize(p.desc||"No description available.",u-2*i);t.text(l,i,a),a+=l.length*5+10}),s.certifications&&s.certifications.length>0&&(a>250&&(t.addPage(),a=i),t.setFontSize(18),t.setFont(void 0,"bold"),t.text("Certifications",i,a),a+=10,s.certifications.forEach(p=>{a>250&&(t.addPage(),a=i),t.setFontSize(12),t.setFont(void 0,"bold"),t.text(p.name||"Unnamed Certification",i,a),a+=7,t.setFontSize(10),t.setFont(void 0,"normal"),t.text(`Issued by: ${p.issuer||"Unknown"}`,i+5,a),a+=10})),t.save(`${s.studentId||"portfolio"}_portfolio.pdf`)},n=()=>{if(!s)return;const c=h(),t=new Blob([c],{type:"text/html"}),u=URL.createObjectURL(t),i=document.createElement("a");i.href=u,i.download=`${s.studentId||"portfolio"}_portfolio.html`,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(u)};return s?e.jsxs("div",{className:"space-y-4",children:[e.jsxs("h3",{className:"text-lg font-bold text-white mb-4 flex items-center gap-2",children:[e.jsx(N,{size:20}),e.jsx("span",{children:"Download Portfolio"})]}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsxs("button",{onClick:d,className:"flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed",children:[e.jsx(P,{size:18}),e.jsx("span",{children:"Download as PDF"})]}),e.jsxs("button",{onClick:n,className:"flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed",children:[e.jsx(N,{size:18}),e.jsx("span",{children:"Download as HTML"})]})]}),e.jsx("p",{className:"text-sm text-slate-400",children:"Download your portfolio as a PDF or standalone HTML file that can be shared offline."})]}):null},G=()=>{var u,i;const{user:s}=L(),{getStudentPortfolio:h}=k(),d=h(s==null?void 0:s.id),[n,c]=g.useState("overview"),t=({icon:a,label:x,value:b,color:m})=>e.jsxs("div",{className:"glass-card p-6 rounded-xl flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-slate-400 text-sm mb-1",children:x}),e.jsx("p",{className:"text-2xl font-bold text-white",children:b})]}),e.jsx("div",{className:`p-3 rounded-lg bg-${m}-500/20 text-${m}-400`,children:e.jsx(a,{size:24})})]});return e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-4",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold text-white mb-2",children:"My Portfolio"}),e.jsx("p",{className:"text-slate-400",children:"Manage your digital presence and career opportunities."})]}),e.jsx("div",{className:"flex gap-4",children:d&&(s==null?void 0:s.id)&&e.jsxs(e.Fragment,{children:[e.jsxs(w,{to:`/portfolio/view/${s.id}`,target:"_blank",className:"flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all",title:"Open Public Website",children:[e.jsx(I,{size:18}),e.jsx("span",{children:"View Website"})]}),e.jsxs(w,{to:"/portfolio-editor",className:"flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium shadow-lg shadow-blue-500/25 transition-all",children:[e.jsx(M,{size:18}),e.jsx("span",{children:"Edit Portfolio"})]})]})})]}),d?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex gap-6 border-b border-white/10",children:[e.jsx("button",{onClick:()=>c("overview"),className:`pb-4 px-2 text-sm font-medium border-b-2 transition ${n==="overview"?"border-blue-500 text-blue-400":"border-transparent text-slate-400 hover:text-white"}`,children:"Overview"}),e.jsx("button",{onClick:()=>c("analysis"),className:`pb-4 px-2 text-sm font-medium border-b-2 transition ${n==="analysis"?"border-blue-500 text-blue-400":"border-transparent text-slate-400 hover:text-white"}`,children:"Analysis & Suggestions"}),e.jsx("button",{onClick:()=>c("opportunities"),className:`pb-4 px-2 text-sm font-medium border-b-2 transition ${n==="opportunities"?"border-blue-500 text-blue-400":"border-transparent text-slate-400 hover:text-white"}`,children:"Opportunities"})]}),n==="overview"&&e.jsxs("div",{className:"space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",children:[e.jsx(t,{icon:E,label:"Profile Score",value:d.score||"N/A",color:"green"}),e.jsx(t,{icon:R,label:"Views",value:Math.floor(Math.random()*50),color:"blue"}),e.jsx(t,{icon:Y,label:"Achievements",value:((u=d.certifications)==null?void 0:u.length)||0,color:"purple"}),e.jsx(t,{icon:P,label:"Projects",value:((i=d.projects)==null?void 0:i.length)||0,color:"orange"})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"glass-panel p-6 rounded-xl",children:[e.jsx("h3",{className:"text-lg font-bold text-white mb-4",children:"Quick Actions"}),e.jsx("div",{className:"flex flex-wrap gap-4",children:e.jsx(O,{portfolio:d})})]}),e.jsx("div",{className:"glass-panel p-6 rounded-xl",children:e.jsx(W,{portfolio:d})})]})]}),n==="analysis"&&e.jsx("div",{className:"animate-in fade-in slide-in-from-bottom-4 duration-500",children:e.jsx("div",{className:"max-w-4xl mx-auto",children:e.jsx(U,{portfolio:d})})}),n==="opportunities"&&e.jsx("div",{className:"animate-in fade-in slide-in-from-bottom-4 duration-500",children:e.jsx(_,{portfolio:d})})]}):e.jsxs("div",{className:"glass-panel p-12 rounded-2xl text-center",children:[e.jsx("div",{className:"w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6",children:e.jsx(A,{size:40})}),e.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"Start Your Journey"}),e.jsx("p",{className:"text-slate-400 max-w-md mx-auto mb-8",children:"Create a professional digital portfolio to showcase your skills, projects, and achievements to potential employers."}),e.jsx(w,{to:"/portfolio-editor",className:"inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all hover:scale-105 shadow-xl shadow-blue-500/20",children:"Build Portfolio"})]})]})};export{G as default};
