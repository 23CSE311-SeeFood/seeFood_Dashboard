"use client";

import { RoleGuard } from "@/components/global/role-guard";
import { Sidebar } from "@/components/dashboard/sidebar";

const allowedRoles = ["admin", "cashier", "operator"];

export default function ProtectedStaffLayout({ children }) {
    return (
        <RoleGuard allowedRoles={allowedRoles}>
            <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
                <Sidebar />
                <main className="flex-1 flex overflow-hidden">
                    {children}
                </main>
            </div>
        </RoleGuard>
    );
}
