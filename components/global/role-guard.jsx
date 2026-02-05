'use client';

import { useAuth } from './auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function RoleGuard({ children, allowedRoles }) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/staff/login');
            return;
        }

        if (!allowedRoles.includes(user.role)) {
            alert("Unauthorized Access");
            router.push('/staff/login');
        }
    }, [user, allowedRoles, router]);

    if (!user || !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}
