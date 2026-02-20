import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('dps_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user data:", error);
                localStorage.removeItem('dps_user');
            }
        }
        setLoading(false);
    }, []);

    const login = (email, role, name) => {
        const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            role, // 'student', 'faculty', 'admin', 'expert'
            name
        };
        setUser(newUser);
        localStorage.setItem('dps_user', JSON.stringify(newUser));
        return newUser;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('dps_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
