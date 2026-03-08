export const NODE_TYPES = {
    TEXT: 'text',
    IMAGE: 'image',
    SHAPE: 'shape',
    CONTAINER: 'container',
};

const newId = (() => {
    let seq = 0;
    return (prefix = 'node') => `${prefix}_${Date.now()}_${seq++}`;
})();

export const createEmptyDocument = () => ({
    version: 1,
    templateId: 'blank',
    templateVersion: 1,
    themeTokens: {
        primary: '#2563eb',
        background: '#f8fafc',
        text: '#0f172a',
    },
    pages: [
        {
            id: 'page_1',
            name: 'Page 1',
            width: 1200,
            height: 1700,
            background: '#ffffff',
            nodeIds: [],
        },
    ],
    nodes: {},
});

export const addNode = (doc, pageId, node) => {
    const id = node.id || newId(node.type || 'node');
    const nextNode = {
        id,
        type: NODE_TYPES.CONTAINER,
        x: 0,
        y: 0,
        w: 100,
        h: 40,
        rotation: 0,
        zIndex: 0,
        visible: true,
        locked: false,
        ...node,
    };
    const nextPages = doc.pages.map((p) => (p.id === pageId ? { ...p, nodeIds: [...p.nodeIds, id] } : p));
    return {
        ...doc,
        pages: nextPages,
        nodes: {
            ...doc.nodes,
            [id]: nextNode,
        },
    };
};

export const createBasicPortfolioTemplate = ({ fullName = 'Your Name', about = 'Write about yourself.' } = {}) => {
    let doc = createEmptyDocument();
    doc = { ...doc, templateId: 'basic-portfolio' };
    doc = addNode(doc, 'page_1', {
        type: NODE_TYPES.TEXT,
        x: 80,
        y: 80,
        w: 700,
        h: 80,
        text: {
            content: fullName,
            style: { fontSize: 52, fontWeight: 700, color: '#0f172a' },
        },
    });
    doc = addNode(doc, 'page_1', {
        type: NODE_TYPES.TEXT,
        x: 80,
        y: 180,
        w: 1000,
        h: 120,
        text: {
            content: about,
            style: { fontSize: 22, fontWeight: 400, color: '#334155' },
        },
    });
    doc = addNode(doc, 'page_1', {
        type: NODE_TYPES.SHAPE,
        x: 80,
        y: 340,
        w: 260,
        h: 8,
        shape: { kind: 'rect', fill: '#2563eb', radius: 99 },
    });
    return doc;
};

const addTextNode = (doc, pageId, opts) =>
    addNode(doc, pageId, {
        type: NODE_TYPES.TEXT,
        x: opts.x,
        y: opts.y,
        w: opts.w,
        h: opts.h,
        text: {
            content: opts.content || '',
            style: opts.style || {},
        },
    });

const addCard = (doc, pageId, { x, y, w, h, fill = '#ffffff', radius = 16 }) =>
    addNode(doc, pageId, {
        type: NODE_TYPES.SHAPE,
        x,
        y,
        w,
        h,
        shape: { kind: 'rect', fill, radius },
    });

export const createUniconsDocumentFromPortfolio = (portfolio = {}) => {
    const meta = portfolio?.meta || {};
    const sectionVisibility = { ...(meta.sectionVisibility || {}) };
    const visible = (key) => sectionVisibility[key] !== false;

    let doc = createEmptyDocument();
    doc = {
        ...doc,
        templateId: 'btech-cs-unicons',
        themeTokens: {
            primary: '#2563eb',
            background: '#f7f9fc',
            text: '#0f172a',
        },
        pages: [{ ...doc.pages[0], background: '#f7f9fc' }],
    };

    const pageId = 'page_1';
    let y = 60;

    doc = addCard(doc, pageId, { x: 40, y, w: 1120, h: 220, fill: '#ffffff', radius: 24 });
    doc = addTextNode(doc, pageId, {
        x: 80,
        y: y + 34,
        w: 700,
        h: 56,
        content: meta.fullName || 'B.Tech CSE Student',
        style: { fontSize: 46, fontWeight: 700, color: '#0f172a' },
    });
    doc = addTextNode(doc, pageId, {
        x: 80,
        y: y + 104,
        w: 800,
        h: 40,
        content: meta.role || 'Frontend Developer',
        style: { fontSize: 24, fontWeight: 500, color: '#334155' },
    });
    y += 260;

    if (visible('about')) {
        doc = addCard(doc, pageId, { x: 40, y, w: 1120, h: 180, fill: '#ffffff', radius: 18 });
        doc = addTextNode(doc, pageId, { x: 70, y: y + 18, w: 300, h: 30, content: 'About', style: { fontSize: 28, fontWeight: 700, color: '#0f172a' } });
        doc = addTextNode(doc, pageId, {
            x: 70,
            y: y + 62,
            w: 1040,
            h: 96,
            content: portfolio.about || 'Write your about section here.',
            style: { fontSize: 18, fontWeight: 400, color: '#334155' },
        });
        y += 210;
    }

    if (visible('skills')) {
        doc = addCard(doc, pageId, { x: 40, y, w: 1120, h: 150, fill: '#ffffff', radius: 18 });
        doc = addTextNode(doc, pageId, { x: 70, y: y + 18, w: 300, h: 30, content: 'Skills', style: { fontSize: 28, fontWeight: 700, color: '#0f172a' } });
        doc = addTextNode(doc, pageId, {
            x: 70,
            y: y + 66,
            w: 1040,
            h: 60,
            content: Array.isArray(portfolio.skills) ? portfolio.skills.join('  •  ') : '',
            style: { fontSize: 18, fontWeight: 500, color: '#1e40af' },
        });
        y += 180;
    }

    if (visible('projects')) {
        const projects = Array.isArray(portfolio.projects) ? portfolio.projects.slice(0, 3) : [];
        doc = addCard(doc, pageId, { x: 40, y, w: 1120, h: 340, fill: '#ffffff', radius: 18 });
        doc = addTextNode(doc, pageId, { x: 70, y: y + 18, w: 400, h: 30, content: 'Portfolio Projects', style: { fontSize: 28, fontWeight: 700, color: '#0f172a' } });
        projects.forEach((p, i) => {
            doc = addTextNode(doc, pageId, {
                x: 80,
                y: y + 70 + i * 84,
                w: 460,
                h: 30,
                content: p?.title || `Project ${i + 1}`,
                style: { fontSize: 22, fontWeight: 700, color: '#0f172a' },
            });
            doc = addTextNode(doc, pageId, {
                x: 80,
                y: y + 106 + i * 84,
                w: 980,
                h: 30,
                content: p?.desc || 'Describe this project.',
                style: { fontSize: 16, fontWeight: 400, color: '#475569' },
            });
        });
        y += 370;
    }

    if (visible('certifications')) {
        const certs = Array.isArray(portfolio.certifications) ? portfolio.certifications.slice(0, 4) : [];
        doc = addCard(doc, pageId, { x: 40, y, w: 1120, h: 220, fill: '#ffffff', radius: 18 });
        doc = addTextNode(doc, pageId, { x: 70, y: y + 18, w: 500, h: 30, content: 'Certifications', style: { fontSize: 28, fontWeight: 700, color: '#0f172a' } });
        certs.forEach((c, i) => {
            doc = addTextNode(doc, pageId, {
                x: 80,
                y: y + 66 + i * 34,
                w: 980,
                h: 28,
                content: `${c?.name || 'Certification'} - ${c?.issuer || 'Issuer'}`,
                style: { fontSize: 16, fontWeight: 500, color: '#334155' },
            });
        });
    }

    return doc;
};
