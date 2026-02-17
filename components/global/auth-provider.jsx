'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const router = useRouter();

    // Load session from localStorage on mount
    useEffect(() => {
        const savedSession = localStorage.getItem('seefood_session');
        if (savedSession) {
            try {
                setUser(JSON.parse(savedSession));
            } catch (error) {
                console.warn("Invalid saved session. Clearing local session.", error);
                localStorage.removeItem('seefood_session');
            }
        }
        setIsInitialized(true);
    }, []);

    const login = ({ role, username, token, device = "TERM-01", shift = "MORNING-A" }) => {
        const session = {
            role, // 'admin', 'cashier', 'operator'
            username, // Using email as the username/identifier
            token, // Auth token when provided by API
            device,
            shift,
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
        <AuthContext.Provider value={{ user, login, logout, isInitialized }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
