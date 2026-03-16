import{j as e,D as I,e as z,F as D,f as S,g as E,U as B,h as R,B as U,E as M,P as _,i as L,T as Y,A as O}from"./ui-vendor-DoynUqvb.js";import{r as y,L as P}from"./react-vendor-BUEQUwh2.js";import{u as T,a as W}from"./index-Ki5O-ItR.js";import{_ as C}from"./pdf-vendor-BiIMC7Av.js";const q=({portfolio:s})=>{const{analyzePortfolio:g}=T(),x=y.useMemo(()=>g(s),[s,g]),[i,m]=y.useState([]),[c,o]=y.useState(""),[u,t]=y.useState(!1),p=y.useRef(null),l=y.useRef(null);y.useEffect(()=>{if(i.length===0&&s){const r=[{id:Date.now(),type:"bot",text:`Hello! I'm your Portfolio Assistant. I can help you improve your portfolio and answer questions about it. ${x.length>0?"I have some suggestions for you:":"Your portfolio looks great!"}`}];x.length>0?x.forEach((n,a)=>{r.push({id:Date.now()+a+1,type:"bot",text:`ðŸ’¡ ${n}`})}):r.push({id:Date.now()+1,type:"bot",text:"Your portfolio is well-structured! Feel free to ask me any questions about improving it further."}),m(r)}},[s,x]),y.useEffect(()=>{var d;(d=p.current)==null||d.scrollIntoView({behavior:"smooth"})},[i,u]);const w=d=>{const r=d.toLowerCase();if(r.includes("suggest")||r.includes("improve")||r.includes("help"))return x.length>0?`Based on your portfolio, here are my recommendations:

${x.map((a,j)=>`${j+1}. ${a}`).join(`

`)}

Would you like me to elaborate on any of these?`:"Your portfolio looks great! To make it even better, consider adding more detailed project descriptions, showcasing your best work prominently, and keeping your skills section updated.";if(r.includes("skill")){const a=(s==null?void 0:s.skills)||[];return a.length===0?"I notice you haven't added any skills yet. Adding relevant skills helps employers quickly understand your expertise. Consider adding technical skills, programming languages, tools, and soft skills that match your projects and career goals.":`You have ${a.length} skill${a.length>1?"s":""} listed: ${a.join(", ")}. That's a good start! Consider adding more specific skills related to your projects, or skills that are in demand for your target roles.`}if(r.includes("project")){const a=(s==null?void 0:s.projects)||[];return a.length===0?"Projects are crucial for showcasing your practical experience! Add projects that demonstrate your skills, problem-solving abilities, and technical expertise. Include a clear title, description, technologies used, and if possible, links to live demos or GitHub repositories.":`You have ${a.length} project${a.length>1?"s":""} listed. Great! To make them stand out more, ensure each project has:
- A clear, descriptive title
- Detailed description of what it does
- Technologies/tools used
- Your role and contributions
- Links to demos or code (if available)`}if(r.includes("about")||r.includes("summary")||r.includes("bio")){const a=(s==null?void 0:s.about)||"";return!a||a.length<50?`Your "About" section is your first impression! Write a compelling professional summary (50+ words) that highlights:
- Who you are professionally
- Your key skills and interests
- What makes you unique
- Your career goals or what you're looking for

This helps visitors quickly understand your value proposition.`:`Your "About" section looks good! Make sure it's engaging and clearly communicates your professional identity. Consider updating it regularly to reflect your latest achievements and goals.`}if(r.includes("certif")||r.includes("certificate")){const a=(s==null?void 0:s.certifications)||[];return a.length===0?`Certifications add credibility to your portfolio! Consider adding:
- Professional certifications
- Online course completions
- Workshop or training certificates
- Academic achievements

These show your commitment to continuous learning and professional development.`:`You have ${a.length} certification${a.length>1?"s":""} listed. Excellent! Certifications validate your skills and show employers that you're committed to professional growth.`}if(r.includes("template")||r.includes("design")||r.includes("look")){const a=(s==null?void 0:s.templateId)||"modern";return`You're currently using the "${{modern:"Modern Minimal",academic:"Academic Professional",btech:"BTech General","btech-bedimcode-1":"BTech Classic (Bedimcode style)","btech-bedimcode-2":"BTech Sections (Qualification style)","btech-cs":"BTech Computer Science","btech-cs-unicons":"BTech CS Unicons Sections","btech-mech":"BTech Mechanical","btech-mech-wajiha":"Mechanical Portfolio Classic","btech-eee":"BTech Electrical","btech-ece":"BTech Electronics","btech-robo":"BTech Robotics","barch-red":"BArch Red Studio","barch-cs":"BArch Computer Science","barch-mech":"BArch Mechanical","barch-eee":"BArch Electrical","barch-ece":"BArch Electronics","barch-robo":"BArch Robotics","barch-portfolio-a":"BArch Portfolio Book","barch-portfolio-b":"BArch Slate Journal"}[a]||"Modern Minimal"}" template. Each template has its own unique style tailored for your program and department.

You can change templates anytime in the Portfolio Editor!`}if(r.includes("what")&&(r.includes("missing")||r.includes("need"))){const a=[];return(!(s!=null&&s.about)||s.about.length<50)&&a.push("a detailed About section"),(!(s!=null&&s.skills)||s.skills.length===0)&&a.push("Skills section"),(!(s!=null&&s.projects)||s.projects.length===0)&&a.push("Projects"),(!(s!=null&&s.certifications)||s.certifications.length===0)&&a.push("Certifications"),a.length>0?`Your portfolio could benefit from:

${a.map((j,k)=>`${k+1}. ${j}`).join(`
`)}

These elements help create a complete and professional portfolio that showcases your full potential!`:"Your portfolio has all the essential elements! Consider adding more details, updating content regularly, and showcasing your best work prominently."}const n=["That's a great question! Based on your portfolio, I'd recommend focusing on showcasing your best projects prominently and keeping your skills section updated.","I can help you with portfolio improvements, suggestions, or answer questions about your current portfolio. Try asking about skills, projects, certifications, or how to improve specific sections.",`Feel free to ask me about:
- How to improve your portfolio
- What sections need work
- Skills and projects
- Certifications
- Portfolio design and templates`];return n[Math.floor(Math.random()*n.length)]},f=async()=>{if(!c.trim()||u)return;const d={id:Date.now(),type:"user",text:c.trim()};m(r=>[...r,d]),o(""),t(!0),setTimeout(()=>{const r={id:Date.now()+1,type:"bot",text:w(d.text)};m(n=>[...n,r]),t(!1)},800)},N=d=>{d.key==="Enter"&&!d.shiftKey&&(d.preventDefault(),f())};return s?e.jsxs("div",{className:"flex flex-col h-[600px] bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden",children:[e.jsx("div",{className:"p-4 border-b border-slate-700 bg-gradient-to-r from-blue-600/20 to-purple-600/20",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-blue-600/20 rounded-lg",children:e.jsx(S,{className:"text-blue-400",size:20})}),e.jsxs("div",{children:[e.jsxs("h3",{className:"font-bold text-white flex items-center gap-2",children:["Portfolio Assistant",e.jsx(E,{className:"text-yellow-400",size:16})]}),e.jsx("p",{className:"text-xs text-slate-400",children:"Ask me anything about your portfolio"})]})]})}),e.jsxs("div",{className:"flex-1 overflow-y-auto p-4 space-y-4",children:[i.map(d=>e.jsxs("div",{className:`flex gap-3 ${d.type==="user"?"justify-end":"justify-start"}`,children:[d.type==="bot"&&e.jsx("div",{className:"flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center",children:e.jsx(S,{className:"text-blue-400",size:16})}),e.jsx("div",{className:`max-w-[80%] rounded-2xl px-4 py-2 ${d.type==="user"?"bg-blue-600 text-white":"bg-slate-800 text-slate-100 border border-slate-700"}`,children:e.jsx("p",{className:"text-sm whitespace-pre-line",children:d.text})}),d.type==="user"&&e.jsx("div",{className:"flex-shrink-0 w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center",children:e.jsx(B,{className:"text-purple-400",size:16})})]},d.id)),u&&e.jsxs("div",{className:"flex gap-3 justify-start",children:[e.jsx("div",{className:"flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center",children:e.jsx(S,{className:"text-blue-400",size:16})}),e.jsx("div",{className:"bg-slate-800 text-slate-100 border border-slate-700 rounded-2xl px-4 py-2",children:e.jsxs("div",{className:"flex gap-1",children:[e.jsx("div",{className:"w-2 h-2 bg-slate-400 rounded-full animate-bounce",style:{animationDelay:"0ms"}}),e.jsx("div",{className:"w-2 h-2 bg-slate-400 rounded-full animate-bounce",style:{animationDelay:"150ms"}}),e.jsx("div",{className:"w-2 h-2 bg-slate-400 rounded-full animate-bounce",style:{animationDelay:"300ms"}})]})})]}),e.jsx("div",{ref:p})]}),e.jsxs("div",{className:"p-4 border-t border-slate-700 bg-slate-900/50",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx("input",{ref:l,type:"text",value:c,onChange:d=>o(d.target.value),onKeyPress:N,placeholder:"Ask about your portfolio...",className:"flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500",disabled:u}),e.jsx("button",{onClick:f,disabled:!c.trim()||u,className:"px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",children:e.jsx(R,{size:18})})]}),e.jsx("p",{className:"text-xs text-slate-500 mt-2",children:'Try: "How can I improve my portfolio?" or "What skills should I add?"'})]})]}):e.jsx("div",{className:"p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400",children:e.jsx("p",{children:"Create a portfolio first to get personalized suggestions and chat with your Portfolio Assistant!"})})},H=({portfolio:s})=>{const{opportunities:g}=T(),x=y.useMemo(()=>{var m;if(!s)return[];const i=new Set(((m=s.skills)==null?void 0:m.map(c=>c.toLowerCase()))||[]);return g.filter(c=>c.requiredSkills.length===0?!0:c.requiredSkills.some(o=>i.has(o.toLowerCase())))},[s,g]);return s?e.jsxs("div",{className:"space-y-6",children:[e.jsxs("h3",{className:"text-xl font-bold text-white flex items-center gap-2",children:[e.jsx(U,{className:"text-blue-400"}),e.jsx("span",{children:"Recommended For You"})]}),x.length===0?e.jsx("p",{className:"text-slate-500",children:"No matching opportunities found based on your current skills."}):e.jsx("div",{className:"grid md:grid-cols-2 gap-4",children:x.map(i=>e.jsxs("div",{className:"glass-card p-6 rounded-xl border border-white/10 group",children:[e.jsxs("div",{className:"flex justify-between items-start mb-2",children:[e.jsx("span",{className:`text-xs px-2 py-1 rounded ${i.type==="Internship"?"bg-blue-500/20 text-blue-400":"bg-purple-500/20 text-purple-400"}`,children:i.type}),e.jsx("span",{className:"text-xs text-slate-500",children:"Match"})]}),e.jsx("h4",{className:"font-bold text-white text-lg group-hover:text-blue-400 transition",children:i.title}),e.jsx("p",{className:"text-slate-400 text-sm mb-4",children:i.company}),e.jsx("div",{className:"flex flex-wrap gap-2 mb-4",children:i.requiredSkills.map(m=>e.jsx("span",{className:"text-xs px-2 py-1 bg-white/5 rounded text-slate-300",children:m},m))}),e.jsx("button",{className:"w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition cursor-pointer",children:"View Details"})]},i.id))})]}):e.jsx("div",{className:"text-slate-500",children:"Create a portfolio to see matches."})},V=({portfolio:s})=>{const g=async()=>{if(!s)return;const{default:x}=await C(async()=>{const{default:u}=await import("./pdf-vendor-BiIMC7Av.js").then(t=>t.j);return{default:u}},[],import.meta.url),i=new x;i.setFontSize(22),i.text("Portfolio Resume",20,20),i.setFontSize(12),i.text(`ID: ${s.studentId}`,20,30),i.setFontSize(16),i.text("Professional Summary",20,45),i.setFontSize(11);const m=i.splitTextToSize(s.about||"",170);i.text(m,20,55);let c=55+m.length*5+10;i.setFontSize(16),i.text("Skills",20,c),c+=10,i.setFontSize(11);const o=(s.skills||[]).join(", ");i.text(o,20,c),c+=20,i.setFontSize(16),i.text("Projects",20,c),c+=10,(s.projects||[]).forEach(u=>{i.setFontSize(12),i.setFont(void 0,"bold"),i.text(u.title,20,c),i.setFont(void 0,"normal"),c+=6,i.setFontSize(10),i.text(u.desc||"",20,c),c+=12}),i.save(`${s.studentId}_resume.pdf`)};return e.jsxs("button",{onClick:g,disabled:!s,className:"flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed",children:[e.jsx(I,{size:18}),e.jsx("span",{children:"Download Resume PDF"})]})},G=({portfolio:s})=>{const g=()=>{if(!s)return null;try{const o=localStorage.getItem(`dps_preview_draft_${s.studentId}`);if(!o)return s;const u=JSON.parse(o);if(u&&typeof u=="object")return{...s,...u,studentId:s.studentId}}catch(o){console.warn("Failed to read local draft for download:",o)}return s},x=o=>String(o||"").startsWith("barch-")?{cover:"Architecture Portfolio",bg:"#e9e2d7",page:"#fbf7f1",text:"#1f1a16",muted:"#6f6253",accent:"#7c4a2e",font:"Georgia, 'Times New Roman', serif"}:String(o||"").startsWith("btech-")?{cover:"BTech Portfolio",bg:"#0b1220",page:"#111c32",text:"#e2e8f0",muted:"#94a3b8",accent:"#38bdf8",font:"'Segoe UI', Tahoma, sans-serif"}:o==="academic"?{cover:"Academic Portfolio",bg:"#f8fafc",page:"#ffffff",text:"#111827",muted:"#4b5563",accent:"#111827",font:"Georgia, 'Times New Roman', serif"}:{cover:"Student Portfolio",bg:"#f1f5f9",page:"#ffffff",text:"#0f172a",muted:"#475569",accent:"#2563eb",font:"'Segoe UI', Tahoma, sans-serif"},i=()=>{const o=g();if(!o)return"";const{about:u,skills:t,projects:p,certifications:l,templateId:w}=o,f=o.studentId||"portfolio",N=o.meta&&typeof o.meta=="object"?o.meta:{},d=N.fullName||f,r=N.role||"Student Portfolio",n=x(w);return`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - ${f}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: ${n.font}; background: ${n.bg}; color: ${n.text}; }
        .book { max-width: 210mm; margin: 0 auto; }
        .page {
            width: 210mm;
            min-height: 297mm;
            padding: 18mm;
            background: ${n.page};
            border-bottom: 1px solid ${n.muted};
            page-break-after: always;
            break-after: page;
        }
        .page:last-child { page-break-after: auto; break-after: auto; }
        .cover { display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(160deg, ${n.page}, ${n.bg}); }
        .smallcaps { letter-spacing: .2em; text-transform: uppercase; font-size: 11px; color: ${n.muted}; }
        h1 { font-size: 48px; line-height: 1.05; margin-top: 12px; }
        h2 { font-size: 30px; margin-bottom: 14px; }
        .muted { color: ${n.muted}; }
        .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
        .chip { border: 1px solid ${n.muted}; border-radius: 999px; padding: 5px 11px; font-size: 12px; }
        .cert { padding: 10px 0; border-bottom: 1px solid ${n.muted}; }
        .project-title { font-size: 36px; line-height: 1.1; margin-bottom: 10px; }
        .project-meta { margin-top: 12px; font-size: 13px; letter-spacing: .08em; text-transform: uppercase; color: ${n.muted}; }
        .project-image {
            margin-top: 16px;
            width: 100%;
            height: 140mm;
            object-fit: cover;
            border: 1px solid ${n.muted};
            background: ${n.bg};
        }
        .no-image {
            margin-top: 16px;
            width: 100%;
            height: 140mm;
            border: 1px dashed ${n.muted};
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${n.muted};
            font-size: 13px;
        }
        .linkline { margin-top: 8px; font-size: 12px; color: ${n.muted}; overflow-wrap: anywhere; }
        a { color: ${n.accent}; }
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
                <p class="smallcaps">${n.cover}</p>
                <h1>${d}</h1>
                <p style="margin-top:10px; font-size:18px;" class="muted">${r}</p>
            </div>
            <p class="smallcaps">Digital Portfolio System</p>
        </section>

        <section class="page">
            <p class="smallcaps">Profile</p>
            <h2>About</h2>
            <p class="muted" style="line-height:1.8;">${u||"No description available."}</p>

            <h2 style="margin-top:28px;">Skills</h2>
            <div class="chips">
                ${t&&t.length>0?t.map(a=>`<span class="chip">${a}</span>`).join(""):'<p class="muted">No skills listed.</p>'}
            </div>

            <h2 style="margin-top:28px;">Certifications</h2>
            <div>
                ${l&&l.length>0?l.map(a=>`
                    <div class="cert">
                        <strong>${a.name||"Unnamed Certification"}</strong>
                        <div class="muted">${a.issuer||"Unknown Issuer"}</div>
                    </div>
                `).join(""):'<p class="muted">No certifications available.</p>'}
            </div>
        </section>

        ${p&&p.length>0?p.map((a,j)=>`
            <section class="page">
                <p class="smallcaps">Project ${j+1}</p>
                <h2 class="project-title">${a.title||`Project ${j+1}`}</h2>
                <p class="muted" style="line-height:1.8;">${a.desc||"No description available."}</p>
                <p class="project-meta">${a.year||"Year not specified"}${a.tech?` • ${a.tech}`:""}</p>
                ${a.repoUrl?`<p class="linkline">Repository: <a href="${a.repoUrl}" target="_blank" rel="noopener noreferrer">${a.repoUrl}</a></p>`:""}
                ${a.pdfUrl?`<p class="linkline">Project PDF: <a href="${a.pdfUrl}" target="_blank" rel="noopener noreferrer">${a.pdfName||"Open PDF"}</a></p>`:""}
                ${a.image||a.imageUrl?`<img class="project-image" src="${a.image||a.imageUrl}" alt="${a.title||`Project ${j+1}`}" />`:'<div class="no-image">Add project image URL to show board here</div>'}
            </section>
        `).join(""):`
            <section class="page">
                <p class="smallcaps">Projects</p>
                <h2>Selected Works</h2>
                <p class="muted">No projects available.</p>
            </section>
        `}
    </main>
</body>
</html>`},m=async()=>{const o=g();if(!o)return;const{default:u}=await C(async()=>{const{default:h}=await import("./pdf-vendor-BiIMC7Av.js").then($=>$.j);return{default:h}},[],import.meta.url),t=new u("p","mm","a4"),p=t.internal.pageSize.getWidth(),l=20,w=(o==null?void 0:o.templateId)||"",f=o!=null&&o.meta&&typeof o.meta=="object"?o.meta:{},N=f.fullName||o.studentId||"Student",d=f.role||"Student Portfolio",r=x(w);t.setFontSize(30),t.setFont(void 0,"bold"),t.text(r.cover,l,52),t.setFontSize(22),t.text(N,l,70),t.setFontSize(12),t.setFont(void 0,"normal"),t.text(d,l,80),t.addPage();let n=l;t.setFontSize(18),t.setFont(void 0,"bold"),t.text("About",l,n),n+=10,t.setFontSize(11),t.setFont(void 0,"normal");const a=t.splitTextToSize(o.about||"No description available.",p-2*l);t.text(a,l,n),n+=a.length*6+12,t.setFontSize(16),t.setFont(void 0,"bold"),t.text("Skills",l,n),n+=8,t.setFontSize(10),t.setFont(void 0,"normal");const j=(o.skills||[]).length>0?o.skills.join(", "):"No skills listed.",k=t.splitTextToSize(j,p-2*l);t.text(k,l,n),n+=k.length*5+12,t.setFontSize(16),t.setFont(void 0,"bold"),t.text("Certifications",l,n),n+=8,t.setFontSize(10),t.setFont(void 0,"normal"),(o.certifications||[]).forEach(h=>{n>260&&(t.addPage(),n=l),t.text(`- ${h.name||"Unnamed Certification"} (${h.issuer||"Unknown Issuer"})`,l,n),n+=6}),(o.projects||[]).forEach((h,$)=>{t.addPage();let b=l;if(t.setFontSize(11),t.setFont(void 0,"normal"),t.text(`Project ${$+1}`,l,b),b+=8,t.setFontSize(18),t.setFont(void 0,"bold"),t.text(h.title||`Project ${$+1}`,l,b),b+=10,t.setFontSize(10),t.setFont(void 0,"normal"),h.year&&(t.text(`Year: ${h.year}`,l,b),b+=6),h.tech){const v=t.splitTextToSize(`Tech/Tools: ${h.tech}`,p-2*l);t.text(v,l,b),b+=v.length*5+4}if(h.repoUrl){const v=t.splitTextToSize(`Repository: ${h.repoUrl}`,p-2*l);t.text(v,l,b),b+=v.length*5+4}if(h.pdfUrl){const v=t.splitTextToSize(`Project PDF: ${h.pdfName||h.pdfUrl}`,p-2*l);t.text(v,l,b),b+=v.length*5+4}const A=t.splitTextToSize(h.desc||"No description available.",p-2*l);t.text(A,l,b)});const F=t.getNumberOfPages();for(let h=1;h<=F;h+=1)t.setPage(h),t.setFontSize(9),t.setFont(void 0,"normal"),t.text(`Page ${h} of ${F}`,p-l,290,{align:"right"});t.save(`${o.studentId||"portfolio"}_portfolio.pdf`)},c=()=>{const o=g();if(!o)return;const u=i(),t=new Blob([u],{type:"text/html"}),p=URL.createObjectURL(t),l=document.createElement("a");l.href=p,l.download=`${o.studentId||"portfolio"}_portfolio.html`,document.body.appendChild(l),l.click(),document.body.removeChild(l),URL.revokeObjectURL(p)};return s?e.jsxs("div",{className:"space-y-4",children:[e.jsxs("h3",{className:"text-lg font-bold text-white mb-4 flex items-center gap-2",children:[e.jsx(z,{size:20}),e.jsx("span",{children:"Download Portfolio"})]}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsxs("button",{onClick:m,className:"flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed",children:[e.jsx(D,{size:18}),e.jsx("span",{children:"Download as PDF"})]}),e.jsxs("button",{onClick:c,className:"flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed",children:[e.jsx(z,{size:18}),e.jsx("span",{children:"Download as HTML"})]})]}),e.jsx("p",{className:"text-sm text-slate-400",children:"Download your portfolio as a PDF or standalone HTML file that can be shared offline."})]}):null},Z=()=>{var u,t;const{user:s}=W(),{getStudentPortfolio:g,loading:x}=T(),i=g(s==null?void 0:s.id),[m,c]=y.useState("overview");if(x)return e.jsx("div",{className:"text-white text-center py-16",children:"Loading portfolio..."});const o=({icon:p,label:l,value:w,color:f})=>e.jsxs("div",{className:"glass-card p-6 rounded-xl flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-slate-400 text-sm mb-1",children:l}),e.jsx("p",{className:"text-2xl font-bold text-white",children:w})]}),e.jsx("div",{className:`p-3 rounded-lg bg-${f}-500/20 text-${f}-400`,children:e.jsx(p,{size:24})})]});return e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-4",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold text-white mb-2",children:"My Portfolio"}),e.jsx("p",{className:"text-slate-400",children:"Manage your digital presence and career opportunities."})]}),e.jsx("div",{className:"flex gap-4",children:i&&(s==null?void 0:s.id)&&e.jsxs(e.Fragment,{children:[e.jsxs(P,{to:`/portfolio/view/${s.id}`,target:"_blank",className:"flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all",title:"Open Public Website",children:[e.jsx(M,{size:18}),e.jsx("span",{children:"View Website"})]}),e.jsxs(P,{to:"/portfolio-editor",className:"flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium shadow-lg shadow-blue-500/25 transition-all",children:[e.jsx(_,{size:18}),e.jsx("span",{children:"Edit Portfolio"})]})]})})]}),i?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex gap-6 border-b border-white/10",children:[e.jsx("button",{onClick:()=>c("overview"),className:`pb-4 px-2 text-sm font-medium border-b-2 transition ${m==="overview"?"border-blue-500 text-blue-400":"border-transparent text-slate-400 hover:text-white"}`,children:"Overview"}),e.jsx("button",{onClick:()=>c("analysis"),className:`pb-4 px-2 text-sm font-medium border-b-2 transition ${m==="analysis"?"border-blue-500 text-blue-400":"border-transparent text-slate-400 hover:text-white"}`,children:"Analysis & Suggestions"}),e.jsx("button",{onClick:()=>c("opportunities"),className:`pb-4 px-2 text-sm font-medium border-b-2 transition ${m==="opportunities"?"border-blue-500 text-blue-400":"border-transparent text-slate-400 hover:text-white"}`,children:"Opportunities"})]}),m==="overview"&&e.jsxs("div",{className:"space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:[e.jsx(o,{icon:Y,label:"Profile Score",value:i.score||"N/A",color:"green"}),e.jsx(o,{icon:O,label:"Achievements",value:((u=i.certifications)==null?void 0:u.length)||0,color:"purple"}),e.jsx(o,{icon:D,label:"Projects",value:((t=i.projects)==null?void 0:t.length)||0,color:"orange"})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"glass-panel p-6 rounded-xl",children:[e.jsx("h3",{className:"text-lg font-bold text-white mb-4",children:"Quick Actions"}),e.jsx("div",{className:"flex flex-wrap gap-4",children:e.jsx(V,{portfolio:i})})]}),e.jsx("div",{className:"glass-panel p-6 rounded-xl",children:e.jsx(G,{portfolio:i})})]}),e.jsxs("div",{className:"glass-panel p-6 rounded-xl",children:[e.jsx("h3",{className:"text-lg font-bold text-white mb-3",children:"Faculty Suggestion"}),e.jsx("p",{className:"text-slate-300 whitespace-pre-line",children:i.facultyFeedback||"No faculty suggestion yet."})]})]}),m==="analysis"&&e.jsx("div",{className:"animate-in fade-in slide-in-from-bottom-4 duration-500",children:e.jsx("div",{className:"max-w-4xl mx-auto",children:e.jsx(q,{portfolio:i})})}),m==="opportunities"&&e.jsx("div",{className:"animate-in fade-in slide-in-from-bottom-4 duration-500",children:e.jsx(H,{portfolio:i})})]}):e.jsxs("div",{className:"glass-panel p-12 rounded-2xl text-center",children:[e.jsx("div",{className:"w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6",children:e.jsx(L,{size:40})}),e.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"Start Your Journey"}),e.jsx("p",{className:"text-slate-400 max-w-md mx-auto mb-8",children:"Create a professional digital portfolio to showcase your skills, projects, and achievements to potential employers."}),e.jsx(P,{to:"/portfolio-editor",className:"inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all hover:scale-105 shadow-xl shadow-blue-500/20",children:"Build Portfolio"})]})]})};export{Z as default};
