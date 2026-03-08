import { createContext, useContext, useMemo, useReducer } from 'react';
import { createBasicPortfolioTemplate } from './designSchema';

const DesignStoreContext = createContext(null);

const makeHistory = (present) => ({
    past: [],
    present,
    future: [],
});

const reducePresent = (present, action) => {
    if (action.type === 'SET_DOC') return action.payload;
    if (action.type === 'UPDATE_NODE') {
        const { id, patch } = action.payload;
        const prev = present.nodes[id];
        if (!prev) return present;
        return {
            ...present,
            nodes: {
                ...present.nodes,
                [id]: { ...prev, ...patch },
            },
        };
    }
    if (action.type === 'UPDATE_TEXT_CONTENT') {
        const { id, content } = action.payload;
        const prev = present.nodes[id];
        if (!prev || !prev.text) return present;
        return {
            ...present,
            nodes: {
                ...present.nodes,
                [id]: {
                    ...prev,
                    text: { ...(prev.text || {}), content },
                },
            },
        };
    }
    return present;
};

const historyReducer = (state, action) => {
    if (action.type === 'UNDO') {
        if (state.past.length === 0) return state;
        const previous = state.past[state.past.length - 1];
        return {
            past: state.past.slice(0, -1),
            present: previous,
            future: [state.present, ...state.future],
        };
    }
    if (action.type === 'REDO') {
        if (state.future.length === 0) return state;
        const next = state.future[0];
        return {
            past: [...state.past, state.present],
            present: next,
            future: state.future.slice(1),
        };
    }

    const nextPresent = reducePresent(state.present, action);
    if (nextPresent === state.present) return state;
    return {
        past: [...state.past, state.present],
        present: nextPresent,
        future: [],
    };
};

export const DesignStoreProvider = ({ children, initialDocument = null }) => {
    const startDoc = initialDocument || createBasicPortfolioTemplate();
    const [history, dispatch] = useReducer(historyReducer, makeHistory(startDoc));

    const value = useMemo(
        () => ({
            document: history.present,
            canUndo: history.past.length > 0,
            canRedo: history.future.length > 0,
            setDocument: (doc) => dispatch({ type: 'SET_DOC', payload: doc }),
            updateNode: (id, patch) => dispatch({ type: 'UPDATE_NODE', payload: { id, patch } }),
            updateTextContent: (id, content) => dispatch({ type: 'UPDATE_TEXT_CONTENT', payload: { id, content } }),
            undo: () => dispatch({ type: 'UNDO' }),
            redo: () => dispatch({ type: 'REDO' }),
        }),
        [history]
    );

    return <DesignStoreContext.Provider value={value}>{children}</DesignStoreContext.Provider>;
};

export const useDesignStore = () => {
    const ctx = useContext(DesignStoreContext);
    if (!ctx) throw new Error('useDesignStore must be used inside DesignStoreProvider');
    return ctx;
};

