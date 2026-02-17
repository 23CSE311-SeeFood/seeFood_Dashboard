'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const router = useRouter();

    // Load session from localStorage on mount
    useEffect(() => {
        const savedSession = localStorage.getItem('seefood_session');
        if (savedSession) {
            setUser(JSON.parse(savedSession));
        }
    }, []);

    const login = (role, username) => {
        const session = {
            role, // 'admin', 'cashier', 'operator'
            username,
            device: 'TERM-01', // Mock device ID
            shift: 'MORNING-A', // Mock shift
            loginTimestamp: new Date().toISOString(),
        };

        // Audit Log (Console for now, or in-memory)
        console.log(`[AUDIT] Login: ${username} as ${role} at ${session.loginTimestamp}`);

        setUser(session);
        localStorage.setItem('seefood_session', JSON.stringify(session));

        if (role === 'cashier') {
            router.push('/staff/cashier');
        } else {
            router.push('/staff/dashboard');
        }
    };

    const logout = () => {
        if (user) {
            console.log(`[AUDIT] Logout: ${user.username} at ${new Date().toISOString()}`);
        }
        setUser(null);
        localStorage.removeItem('seefood_session');
        router.push('/staff/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
