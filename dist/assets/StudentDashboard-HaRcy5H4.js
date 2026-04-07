import{j as e,D as I,e as z,F as A,f as P,g as E,U as R,h as M,B,E as _,P as U,i as L,T as Y,A as W}from"./ui-vendor-Xxv5wJWH.js";import{r as y,L as S}from"./react-vendor-BUEQUwh2.js";import{u as D,a as O}from"./index-CNcA4ilk.js";import{_ as T}from"./pdf-vendor-BiIMC7Av.js";const H=({portfolio:t})=>{const{analyzePortfolio:x}=D(),m=y.useMemo(()=>x(t),[t,x]),[a,u]=y.useState([]),[c,i]=y.useState(""),[d,h]=y.useState(!1),g=y.useRef(null),r=y.useRef(null);y.useEffect(()=>{if(a.length===0&&t){const o=[{id:Date.now(),type:"bot",text:`Hello! I'm your Portfolio Assistant. I can help you improve your portfolio and answer questions about it. ${m.length>0?"I have some suggestions for you:":"Your portfolio looks great!"}`}];m.length>0?m.forEach((n,s)=>{o.push({id:Date.now()+s+1,type:"bot",text:`ðŸ’¡ ${n}`})}):o.push({id:Date.now()+1,type:"bot",text:"Your portfolio is well-structured! Feel free to ask me any questions about improving it further."}),u(o)}},[t,m]),y.useEffect(()=>{var l;(l=g.current)==null||l.scrollIntoView({behavior:"smooth"})},[a,d]);const j=l=>{const o=l.toLowerCase();if(o.includes("suggest")||o.includes("improve")||o.includes("help"))return m.length>0?`Based on your portfolio, here are my recommendations:

${m.map((s,f)=>`${f+1}. ${s}`).join(`

`)}

Would you like me to elaborate on any of these?`:"Your portfolio looks great! To make it even better, consider adding more detailed project descriptions, showcasing your best work prominently, and keeping your skills section updated.";if(o.includes("skill")){const s=(t==null?void 0:t.skills)||[];return s.length===0?"I notice you haven't added any skills yet. Adding relevant skills helps employers quickly understand your expertise. Consider adding technical skills, programming languages, tools, and soft skills that match your projects and career goals.":`You have ${s.length} skill${s.length>1?"s":""} listed: ${s.join(", ")}. That's a good start! Consider adding more specific skills related to your projects, or skills that are in demand for your target roles.`}if(o.includes("project")){const s=(t==null?void 0:t.projects)||[];return s.length===0?"Projects are crucial for showcasing your practical experience! Add projects that demonstrate your skills, problem-solving abilities, and technical expertise. Include a clear title, description, technologies used, and if possible, links to live demos or GitHub repositories.":`You have ${s.length} project${s.length>1?"s":""} listed. Great! To make them stand out more, ensure each project has:
- A clear, descriptive title
- Detailed description of what it does
- Technologies/tools used
- Your role and contributions
- Links to demos or code (if available)`}if(o.includes("about")||o.includes("summary")||o.includes("bio")){const s=(t==null?void 0:t.about)||"";return!s||s.length<50?`Your "About" section is your first impression! Write a compelling professional summary (50+ words) that highlights:
- Who you are professionally
- Your key skills and interests
- What makes you unique
- Your career goals or what you're looking for

This helps visitors quickly understand your value proposition.`:`Your "About" section looks good! Make sure it's engaging and clearly communicates your professional identity. Consider updating it regularly to reflect your latest achievements and goals.`}if(o.includes("certif")||o.includes("certificate")){const s=(t==null?void 0:t.certifications)||[];return s.length===0?`Certifications add credibility to your portfolio! Consider adding:
- Professional certifications
- Online course completions
- Workshop or training certificates
- Academic achievements

These show your commitment to continuous learning and professional development.`:`You have ${s.length} certification${s.length>1?"s":""} listed. Excellent! Certifications validate your skills and show employers that you're committed to professional growth.`}if(o.includes("template")||o.includes("design")||o.includes("look")){const s=(t==null?void 0:t.templateId)||"modern";return`You're currently using the "${{modern:"Modern Minimal",academic:"Academic Professional",btech:"BTech General","btech-bedimcode-1":"BTech Classic (Bedimcode style)","btech-bedimcode-2":"BTech Sections (Qualification style)","btech-cs":"BTech Computer Science","btech-cs-unicons":"BTech CS Unicons Sections","btech-mech":"BTech Mechanical","btech-mech-wajiha":"Mechanical Portfolio Classic","btech-eee":"BTech Electrical","btech-ece":"BTech Electronics","btech-robo":"BTech Robotics","barch-red":"BArch Red Studio","barch-cs":"BArch Computer Science","barch-mech":"BArch Mechanical","barch-eee":"BArch Electrical","barch-ece":"BArch Electronics","barch-robo":"BArch Robotics","barch-portfolio-a":"BArch Portfolio Book","barch-portfolio-b":"BArch Slate Journal"}[s]||"Modern Minimal"}" template. Each template has its own unique style tailored for your program and department.

You can change templates anytime in the Portfolio Editor!`}if(o.includes("what")&&(o.includes("missing")||o.includes("need"))){const s=[];return(!(t!=null&&t.about)||t.about.length<50)&&s.push("a detailed About section"),(!(t!=null&&t.skills)||t.skills.length===0)&&s.push("Skills section"),(!(t!=null&&t.projects)||t.projects.length===0)&&s.push("Projects"),(!(t!=null&&t.certifications)||t.certifications.length===0)&&s.push("Certifications"),s.length>0?`Your portfolio could benefit from:

${s.map((f,w)=>`${w+1}. ${f}`).join(`
`)}

These elements help create a complete and professional portfolio that showcases your full potential!`:"Your portfolio has all the essential elements! Consider adding more details, updating content regularly, and showcasing your best work prominently."}const n=["That's a great question! Based on your portfolio, I'd recommend focusing on showcasing your best projects prominently and keeping your skills section updated.","I can help you with portfolio improvements, suggestions, or answer questions about your current portfolio. Try asking about skills, projects, certifications, or how to improve specific sections.",`Feel free to ask me about:
- How to improve your portfolio
- What sections need work
- Skills and projects
- Certifications
- Portfolio design and templates`];return n[Math.floor(Math.random()*n.length)]},p=async()=>{if(!c.trim()||d)return;const l={id:Date.now(),type:"user",text:c.trim()};u(o=>[...o,l]),i(""),h(!0),setTimeout(()=>{const o={id:Date.now()+1,type:"bot",text:j(l.text)};u(n=>[...n,o]),h(!1)},800)},b=l=>{l.key==="Enter"&&!l.shiftKey&&(l.preventDefault(),p())};return t?e.jsxs("div",{className:"flex flex-col h-[600px] bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden",children:[e.jsx("div",{className:"p-4 border-b border-slate-700 bg-gradient-to-r from-blue-600/20 to-purple-600/20",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-blue-600/20 rounded-lg",children:e.jsx(P,{className:"text-blue-400",size:20})}),e.jsxs("div",{children:[e.jsxs("h3",{className:"font-bold text-white flex items-center gap-2",children:["Portfolio Assistant",e.jsx(E,{className:"text-yellow-400",size:16})]}),e.jsx("p",{className:"text-xs text-slate-400",children:"Ask me anything about your portfolio"})]})]})}),e.jsxs("div",{className:"flex-1 overflow-y-auto p-4 space-y-4",children:[a.map(l=>e.jsxs("div",{className:`flex gap-3 ${l.type==="user"?"justify-end":"justify-start"}`,children:[l.type==="bot"&&e.jsx("div",{className:"flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center",children:e.jsx(P,{className:"text-blue-400",size:16})}),e.jsx("div",{className:`max-w-[80%] rounded-2xl px-4 py-2 ${l.type==="user"?"bg-blue-600 text-white":"bg-slate-800 text-slate-100 border border-slate-700"}`,children:e.jsx("p",{className:"text-sm whitespace-pre-line",children:l.text})}),l.type==="user"&&e.jsx("div",{className:"flex-shrink-0 w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center",children:e.jsx(R,{className:"text-purple-400",size:16})})]},l.id)),d&&e.jsxs("div",{className:"flex gap-3 justify-start",children:[e.jsx("div",{className:"flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center",children:e.jsx(P,{className:"text-blue-400",size:16})}),e.jsx("div",{className:"bg-slate-800 text-slate-100 border border-slate-700 rounded-2xl px-4 py-2",children:e.jsxs("div",{className:"flex gap-1",children:[e.jsx("div",{className:"w-2 h-2 bg-slate-400 rounded-full animate-bounce",style:{animationDelay:"0ms"}}),e.jsx("div",{className:"w-2 h-2 bg-slate-400 rounded-full animate-bounce",style:{animationDelay:"150ms"}}),e.jsx("div",{className:"w-2 h-2 bg-slate-400 rounded-full animate-bounce",style:{animationDelay:"300ms"}})]})})]}),e.jsx("div",{ref:g})]}),e.jsxs("div",{className:"p-4 border-t border-slate-700 bg-slate-900/50",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx("input",{ref:r,type:"text",value:c,onChange:l=>i(l.target.value),onKeyPress:b,placeholder:"Ask about your portfolio...",className:"flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500",disabled:d}),e.jsx("button",{onClick:p,disabled:!c.trim()||d,className:"px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",children:e.jsx(M,{size:18})})]}),e.jsx("p",{className:"text-xs text-slate-500 mt-2",children:'Try: "How can I improve my portfolio?" or "What skills should I add?"'})]})]}):e.jsx("div",{className:"p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400",children:e.jsx("p",{children:"Create a portfolio first to get personalized suggestions and chat with your Portfolio Assistant!"})})},q=({portfolio:t})=>{const{opportunities:x}=D(),m=y.useMemo(()=>{var u;if(!t)return[];const a=new Set(((u=t.skills)==null?void 0:u.map(c=>c.toLowerCase()))||[]);return x.filter(c=>c.requiredSkills.length===0?!0:c.requiredSkills.some(i=>a.has(i.toLowerCase())))},[t,x]);return t?e.jsxs("div",{className:"space-y-6",children:[e.jsxs("h3",{className:"text-xl font-bold text-white flex items-center gap-2",children:[e.jsx(B,{className:"text-blue-400"}),e.jsx("span",{children:"Recommended For You"})]}),m.length===0?e.jsx("p",{className:"text-slate-500",children:"No matching opportunities found based on your current skills."}):e.jsx("div",{className:"grid md:grid-cols-2 gap-4",children:m.map(a=>e.jsxs("div",{className:"glass-card p-6 rounded-xl border border-white/10 group",children:[e.jsxs("div",{className:"flex justify-between items-start mb-2",children:[e.jsx("span",{className:`text-xs px-2 py-1 rounded ${a.type==="Internship"?"bg-blue-500/20 text-blue-400":"bg-purple-500/20 text-purple-400"}`,children:a.type}),e.jsx("span",{className:"text-xs text-slate-500",children:"Match"})]}),e.jsx("h4",{className:"font-bold text-white text-lg group-hover:text-blue-400 transition",children:a.title}),e.jsx("p",{className:"text-slate-400 text-sm mb-4",children:a.company}),e.jsx("div",{className:"flex flex-wrap gap-2 mb-4",children:a.requiredSkills.map(u=>e.jsx("span",{className:"text-xs px-2 py-1 bg-white/5 rounded text-slate-300",children:u},u))}),e.jsx("button",{className:"w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition cursor-pointer",children:"View Details"})]},a.id))})]}):e.jsx("div",{className:"text-slate-500",children:"Create a portfolio to see matches."})},G=({portfolio:t})=>{const x=async()=>{if(!t)return;const{default:m}=await T(async()=>{const{default:d}=await import("./pdf-vendor-BiIMC7Av.js").then(h=>h.j);return{default:d}},[],import.meta.url),a=new m;a.setFontSize(22),a.text("Portfolio Resume",20,20),a.setFontSize(12),a.text(`ID: ${t.studentId}`,20,30),a.setFontSize(16),a.text("Professional Summary",20,45),a.setFontSize(11);const u=a.splitTextToSize(t.about||"",170);a.text(u,20,55);let c=55+u.length*5+10;a.setFontSize(16),a.text("Skills",20,c),c+=10,a.setFontSize(11);const i=(t.skills||[]).join(", ");a.text(i,20,c),c+=20,a.setFontSize(16),a.text("Projects",20,c),c+=10,(t.projects||[]).forEach(d=>{a.setFontSize(12),a.setFont(void 0,"bold"),a.text(d.title,20,c),a.setFont(void 0,"normal"),c+=6,a.setFontSize(10),a.text(d.desc||"",20,c),c+=12}),a.save(`${t.studentId}_resume.pdf`)};return e.jsxs("button",{onClick:x,disabled:!t,className:"flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed",children:[e.jsx(I,{size:18}),e.jsx("span",{children:"Download Resume PDF"})]})},V=({portfolio:t})=>{const x=()=>{if(!t)return null;try{const i=localStorage.getItem(`dps_preview_draft_${t.studentId}`);if(!i)return t;const d=JSON.parse(i);if(d&&typeof d=="object")return{...t,...d,studentId:t.studentId}}catch(i){console.warn("Failed to read local draft for download:",i)}return t},m=i=>String(i||"").startsWith("barch-")?{cover:"Architecture Portfolio",bg:"#e9e2d7",page:"#fbf7f1",text:"#1f1a16",muted:"#6f6253",accent:"#7c4a2e",font:"Georgia, 'Times New Roman', serif"}:String(i||"").startsWith("btech-")?{cover:"BTech Portfolio",bg:"#0b1220",page:"#111c32",text:"#e2e8f0",muted:"#94a3b8",accent:"#38bdf8",font:"'Segoe UI', Tahoma, sans-serif"}:i==="academic"?{cover:"Academic Portfolio",bg:"#f8fafc",page:"#ffffff",text:"#111827",muted:"#4b5563",accent:"#111827",font:"Georgia, 'Times New Roman', serif"}:{cover:"Student Portfolio",bg:"#f1f5f9",page:"#ffffff",text:"#0f172a",muted:"#475569",accent:"#2563eb",font:"'Segoe UI', Tahoma, sans-serif"},a=()=>{const i=x();if(!i)return"";const{about:d,skills:h,projects:g,certifications:r,templateId:j}=i,p=i.studentId||"portfolio",b=i.meta&&typeof i.meta=="object"?i.meta:{},l=b.fullName||p,o=b.role||"Student Portfolio",n=m(j);return`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - ${p}</title>
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
                <h1>${l}</h1>
                <p style="margin-top:10px; font-size:18px;" class="muted">${o}</p>
            </div>
            <p class="smallcaps">Digital Portfolio System</p>
        </section>

        <section class="page">
            <p class="smallcaps">Profile</p>
            <h2>About</h2>
            <p class="muted" style="line-height:1.8;">${d||"No description available."}</p>

            <h2 style="margin-top:28px;">Skills</h2>
            <div class="chips">
                ${h&&h.length>0?h.map(s=>`<span class="chip">${s}</span>`).join(""):'<p class="muted">No skills listed.</p>'}
            </div>

            <h2 style="margin-top:28px;">Certifications</h2>
            <div>
                ${r&&r.length>0?r.map(s=>`
                    <div class="cert">
                        <strong>${s.name||"Unnamed Certification"}</strong>
                        <div class="muted">${s.issuer||"Unknown Issuer"}</div>
                    </div>
                `).join(""):'<p class="muted">No certifications available.</p>'}
            </div>
        </section>

        ${g&&g.length>0?g.map((s,f)=>`
            <section class="page">
                <p class="smallcaps">Project ${f+1}</p>
                <h2 class="project-title">${s.title||`Project ${f+1}`}</h2>
                <p class="muted" style="line-height:1.8;">${s.desc||"No description available."}</p>
                <p class="project-meta">${s.year||"Year not specified"}${s.tech?` • ${s.tech}`:""}</p>
                ${s.repoUrl?`<p class="linkline">Repository: <a href="${s.repoUrl}" target="_blank" rel="noopener noreferrer">${s.repoUrl}</a></p>`:""}
                ${s.pdfUrl?`<p class="linkline">Project PDF: <a href="${s.pdfUrl}" target="_blank" rel="noopener noreferrer">${s.pdfName||"Open PDF"}</a></p>`:""}
                ${s.image||s.imageUrl?`<img class="project-image" src="${s.image||s.imageUrl}" alt="${s.title||`Project ${f+1}`}" />`:'<div class="no-image">Add project image URL to show board here</div>'}
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
</html>`},u=async()=>{const i=x();if(!i)return;const[{default:d},{default:h}]=await Promise.all([T(()=>import("./canvas-vendor-CBrSDip1.js"),[],import.meta.url),T(()=>import("./pdf-vendor-BiIMC7Av.js").then(p=>p.j),[],import.meta.url)]),g=`${window.location.origin}/portfolio/view/${i.studentId}?t=${Date.now()}`,r=document.createElement("iframe");r.style.position="fixed",r.style.left="-10000px",r.style.top="0",r.style.width="1440px",r.style.height="2200px",r.style.border="0",r.style.opacity="0",r.src=g,document.body.appendChild(r);const j=()=>{try{r.remove()}catch{}};try{await new Promise(($,F)=>{r.onload=()=>$(),r.onerror=()=>F(new Error("Failed to load portfolio template for PDF export."))}),await new Promise($=>window.setTimeout($,1200));const p=r.contentWindow,b=r.contentDocument||(p==null?void 0:p.document),l=(b==null?void 0:b.querySelector(".min-h-screen"))||(b==null?void 0:b.body);if(!l)throw new Error("Could not render the portfolio template for PDF export.");const o=await d(l,{scale:2,useCORS:!0,backgroundColor:"#ffffff",windowWidth:Math.max(l.scrollWidth||1440,1440),windowHeight:Math.max(l.scrollHeight||2200,2200)}),n=new h("p","mm","a4"),s=n.internal.pageSize.getWidth(),f=n.internal.pageSize.getHeight(),w=s,v=o.height*w/o.width,C=o.toDataURL("image/png");let N=v,k=0;for(n.addImage(C,"PNG",0,k,w,v),N-=f;N>0;)k=N-v,n.addPage(),n.addImage(C,"PNG",0,k,w,v),N-=f;n.save(`${i.studentId||"portfolio"}_portfolio.pdf`)}finally{j()}},c=()=>{const i=x();if(!i)return;const d=a(),h=new Blob([d],{type:"text/html"}),g=URL.createObjectURL(h),r=document.createElement("a");r.href=g,r.download=`${i.studentId||"portfolio"}_portfolio.html`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(g)};return t?e.jsxs("div",{className:"space-y-4",children:[e.jsxs("h3",{className:"text-lg font-bold text-white mb-4 flex items-center gap-2",children:[e.jsx(z,{size:20}),e.jsx("span",{children:"Download Portfolio"})]}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsxs("button",{onClick:u,className:"flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed",children:[e.jsx(A,{size:18}),e.jsx("span",{children:"Download as PDF"})]}),e.jsxs("button",{onClick:c,className:"flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed",children:[e.jsx(z,{size:18}),e.jsx("span",{children:"Download as HTML"})]})]}),e.jsx("p",{className:"text-sm text-slate-400",children:"Download your portfolio as a PDF or standalone HTML file that can be shared offline."})]}):null},Z=()=>{var d,h;const{user:t}=O(),{getStudentPortfolio:x,loading:m}=D(),a=x(t==null?void 0:t.id),[u,c]=y.useState("overview");if(m)return e.jsx("div",{className:"text-white text-center py-16",children:"Loading portfolio..."});const i=({icon:g,label:r,value:j,color:p})=>e.jsxs("div",{className:"glass-card p-6 rounded-xl flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-slate-400 text-sm mb-1",children:r}),e.jsx("p",{className:"text-2xl font-bold text-white",children:j})]}),e.jsx("div",{className:`p-3 rounded-lg bg-${p}-500/20 text-${p}-400`,children:e.jsx(g,{size:24})})]});return e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-4",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold text-white mb-2",children:"My Portfolio"}),e.jsx("p",{className:"text-slate-400",children:"Manage your digital presence and career opportunities."})]}),e.jsx("div",{className:"flex gap-4",children:a&&(t==null?void 0:t.id)&&e.jsxs(e.Fragment,{children:[e.jsxs(S,{to:`/portfolio/view/${t.id}`,target:"_blank",className:"flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all",title:"Open Public Website",children:[e.jsx(_,{size:18}),e.jsx("span",{children:"View Website"})]}),e.jsxs(S,{to:"/portfolio-editor",className:"flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium shadow-lg shadow-blue-500/25 transition-all",children:[e.jsx(U,{size:18}),e.jsx("span",{children:"Edit Portfolio"})]})]})})]}),a?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex gap-6 border-b border-white/10",children:[e.jsx("button",{onClick:()=>c("overview"),className:`pb-4 px-2 text-sm font-medium border-b-2 transition ${u==="overview"?"border-blue-500 text-blue-400":"border-transparent text-slate-400 hover:text-white"}`,children:"Overview"}),e.jsx("button",{onClick:()=>c("analysis"),className:`pb-4 px-2 text-sm font-medium border-b-2 transition ${u==="analysis"?"border-blue-500 text-blue-400":"border-transparent text-slate-400 hover:text-white"}`,children:"Analysis & Suggestions"}),e.jsx("button",{onClick:()=>c("opportunities"),className:`pb-4 px-2 text-sm font-medium border-b-2 transition ${u==="opportunities"?"border-blue-500 text-blue-400":"border-transparent text-slate-400 hover:text-white"}`,children:"Opportunities"})]}),u==="overview"&&e.jsxs("div",{className:"space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:[e.jsx(i,{icon:Y,label:"Profile Score",value:a.score||"N/A",color:"green"}),e.jsx(i,{icon:W,label:"Achievements",value:((d=a.certifications)==null?void 0:d.length)||0,color:"purple"}),e.jsx(i,{icon:A,label:"Projects",value:((h=a.projects)==null?void 0:h.length)||0,color:"orange"})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"glass-panel p-6 rounded-xl",children:[e.jsx("h3",{className:"text-lg font-bold text-white mb-4",children:"Quick Actions"}),e.jsx("div",{className:"flex flex-wrap gap-4",children:e.jsx(G,{portfolio:a})})]}),e.jsx("div",{className:"glass-panel p-6 rounded-xl",children:e.jsx(V,{portfolio:a})})]}),e.jsxs("div",{className:"glass-panel p-6 rounded-xl",children:[e.jsx("h3",{className:"text-lg font-bold text-white mb-3",children:"Faculty Suggestion"}),e.jsx("p",{className:"text-slate-300 whitespace-pre-line",children:a.facultyFeedback||"No faculty suggestion yet."})]})]}),u==="analysis"&&e.jsx("div",{className:"animate-in fade-in slide-in-from-bottom-4 duration-500",children:e.jsx("div",{className:"max-w-4xl mx-auto",children:e.jsx(H,{portfolio:a})})}),u==="opportunities"&&e.jsx("div",{className:"animate-in fade-in slide-in-from-bottom-4 duration-500",children:e.jsx(q,{portfolio:a})})]}):e.jsxs("div",{className:"glass-panel p-12 rounded-2xl text-center",children:[e.jsx("div",{className:"w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6",children:e.jsx(L,{size:40})}),e.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"Start Your Journey"}),e.jsx("p",{className:"text-slate-400 max-w-md mx-auto mb-8",children:"Create a professional digital portfolio to showcase your skills, projects, and achievements to potential employers."}),e.jsx(S,{to:"/portfolio-editor",className:"inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all hover:scale-105 shadow-xl shadow-blue-500/20",children:"Build Portfolio"})]})]})};export{Z as default};
