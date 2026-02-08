"use client";

import {
    LayoutDashboard,
    ShoppingBag,
    ChefHat,
    FileText,
    Box,
    Users,
    Settings,
    HelpCircle,
    LogOut,
    ChevronDown,
    Plus
} from "lucide-react";
import { useAuth } from "@/components/global/auth-provider";
import { cn } from "@/lib/utils";

export function Sidebar() {
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", active: false },
        { icon: ShoppingBag, label: "Orders", active: true },
        { icon: ChefHat, label: "Menu Management", badge: "8", active: false },
        { icon: FileText, label: "Sales Reports", active: false },
        { icon: Box, label: "Inventory Reports", active: false },
        { icon: Users, label: "Customer Directory", active: false },
    ];

    return (
        <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
            {/* Brand / Restaurant Selector */}
            <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-[#B1464A] rounded-lg flex items-center justify-center text-white font-bold">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <span className="font-bold text-lg tracking-tight">Foodcode</span>
                </div>


            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-4 space-y-1">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        className={cn(
                            "w-full flex items-center justify-between p-3 rounded-xl text-sm transition-colors",
                            item.active
                                ? "bg-[#B1464A]/10 text-[#B1464A] font-bold"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </div>
                        {item.badge && (
                            <span className="bg-[#B1464A]/20 text-[#B1464A] text-xs px-2 py-0.5 rounded-full font-medium">
                                {item.badge}
                            </span>
                        )}
                    </button>
                ))}

                <div className="pt-8 pb-2">
                    <button className="w-full flex items-center gap-3 p-3 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                        <HelpCircle className="w-5 h-5" />
                        <span>Help center</span>
                    </button>
                </div>
            </div>

            {/* User / Sign Out */}
            <div className="p-4 border-t border-gray-100">
                <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-400 mb-3">Switch account</div>

                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                            {/* Placeholder Avatar */}
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Antonio" alt="User" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">Antonio Erlangga</div>
                            <div className="text-xs text-gray-400 truncate">antonioerl@gmail.com</div>
                        </div>
                    </div>

                    <button className="w-full py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 mb-3">
                        <Plus className="w-3 h-3" />
                        Add account
                    </button>

                    <button
                        onClick={logout}
                        className="w-full text-center text-xs text-red-500 hover:text-red-600 font-medium"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );
}
