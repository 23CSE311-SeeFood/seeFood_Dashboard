'use client';

import { useAuth } from './auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function RoleGuard({ children, allowedRoles }) {
    const { user, isInitialized } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isInitialized) return;
        if (!user) {
            router.replace('/staff/login');
            return;
        }

        if (!allowedRoles.includes(user.role)) {
            alert("Unauthorized Access");
            router.replace('/staff/login');
        }
    }, [user, allowedRoles, router, isInitialized]);

    if (!isInitialized || !user || !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}
