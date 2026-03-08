import React from 'react';
import { NODE_TYPES } from './designSchema';
import { useDesignStore } from './designStore.jsx';

const NodeView = ({ node, selected, onSelect, onDragStart }) => {
    const baseStyle = {
        position: 'absolute',
        left: node.x,
        top: node.y,
        width: node.w,
        height: node.h,
        transform: `rotate(${node.rotation || 0}deg)`,
        zIndex: node.zIndex || 0,
        display: node.visible === false ? 'none' : 'block',
        outline: selected ? '2px solid #2563eb' : '1px dashed transparent',
        cursor: node.locked ? 'not-allowed' : 'move',
        userSelect: 'none',
    };

    if (node.type === NODE_TYPES.TEXT) {
        return (
            <div
                style={baseStyle}
                onMouseDown={onDragStart}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(node.id);
                }}
            >
                <div
                    contentEditable
                    suppressContentEditableWarning
                    style={{
                        width: '100%',
                        height: '100%',
                        outline: 'none',
                        whiteSpace: 'pre-wrap',
                        ...((node.text && node.text.style) || {}),
                    }}
                >
                    {(node.text && node.text.content) || ''}
                </div>
            </div>
        );
    }

    if (node.type === NODE_TYPES.SHAPE) {
        const fill = node?.shape?.fill || '#cbd5e1';
        const radius = node?.shape?.radius || 0;
        return (
            <div
                style={{
                    ...baseStyle,
                    background: fill,
                    borderRadius: radius,
                }}
                onMouseDown={onDragStart}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(node.id);
                }}
            />
        );
    }

    if (node.type === NODE_TYPES.IMAGE) {
        return (
            <div
                style={{ ...baseStyle, overflow: 'hidden', borderRadius: 8, background: '#e2e8f0' }}
                onMouseDown={onDragStart}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(node.id);
                }}
            >
                {node?.image?.src ? (
                    <img src={node.image.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : null}
            </div>
        );
    }

    return (
        <div
            style={{ ...baseStyle, background: '#f1f5f9' }}
            onMouseDown={onDragStart}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(node.id);
            }}
        />
    );
};

const DesignCanvas = () => {
    const { document, updateNode } = useDesignStore();
    const page = document.pages[0];
    const [selectedId, setSelectedId] = React.useState(null);
    const dragRef = React.useRef(null);

    const startDrag = (id, e) => {
        const node = document.nodes[id];
        if (!node || node.locked) return;
        dragRef.current = {
            id,
            startX: e.clientX,
            startY: e.clientY,
            origX: node.x,
            origY: node.y,
        };
    };

    React.useEffect(() => {
        const onMove = (e) => {
            if (!dragRef.current) return;
            const d = dragRef.current;
            const dx = e.clientX - d.startX;
            const dy = e.clientY - d.startY;
            updateNode(d.id, { x: Math.round(d.origX + dx), y: Math.round(d.origY + dy) });
        };
        const onUp = () => {
            dragRef.current = null;
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
    }, [updateNode]);

    return (
        <div className="overflow-auto rounded-xl border border-slate-300 bg-slate-100 p-6">
            <div
                style={{
                    width: page.width,
                    height: page.height,
                    position: 'relative',
                    background: page.background || '#fff',
                    boxShadow: '0 20px 45px rgba(15, 23, 42, 0.12)',
                    margin: '0 auto',
                }}
                onClick={() => setSelectedId(null)}
            >
                {page.nodeIds.map((id) => {
                    const node = document.nodes[id];
                    if (!node) return null;
                    return (
                        <NodeView
                            key={id}
                            node={node}
                            selected={selectedId === id}
                            onSelect={setSelectedId}
                            onDragStart={(e) => startDrag(id, e)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default DesignCanvas;
