"use client";

import { Sidebar } from "@/components/dashboard/sidebar";

export default function MenuLayout({ children }) {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            <Sidebar />
            <main className="flex-1 flex overflow-hidden">
                {children}
            </main>
        </div>
    );
}
