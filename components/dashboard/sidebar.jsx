"use client";

import {
    LayoutDashboard,
    ShoppingBag,
    ChefHat,
    ClipboardPlus,
    FileText,
    Box,
    Users,
    UserPlus,
    Settings,
    HelpCircle,
    Plus
} from "lucide-react";
import { useAuth } from "@/components/global/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const profile = {
        name: user?.name || (user?.username ? user.username.split("@")[0] : "Staff Member"),
        email: user?.email || user?.username || "staff@seefood.com",
        role: user?.role ?? "staff",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            user?.email ?? user?.username ?? "seefood"
        )}`,
    };

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/staff/dashboard" },
        { icon: ShoppingBag, label: "Orders", href: "/staff/orders" },
        { icon: ChefHat, label: "Menu Management", href: "/staff/menu" },
        { icon: ClipboardPlus, label: "Add Item", href: "/staff/items" },
        { icon: UserPlus, label: "Register Cashier", href: "/staff/cashiers" },
        { icon: FileText, label: "Sales Reports", href: "/staff/sales" },
        { icon: Box, label: "Inventory Reports", href: "/staff/inventory" },
        { icon: Users, label: "Customer Directory", href: "/staff/customers" },
    ];

    const visibleMenuItems =
        user?.role === "cashier"
            ? menuItems.filter((item) => ["/staff/dashboard", "/staff/orders"].includes(item.href))
            : user?.role === "admin"
                ? menuItems
                : menuItems.filter((item) => item.href !== "/staff/items" && item.href !== "/staff/cashiers");

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
                {visibleMenuItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={index}
                            href={item.href}
                            className={cn(
                                "w-full flex items-center justify-between p-3 rounded-xl text-sm transition-colors",
                                isActive
                                    ? "bg-[#B1464A]/10 text-[#B1464A] font-bold"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </div>
                            {item.badge && (
                                <Badge variant="secondary" className="bg-[#B1464A]/20 text-[#B1464A] text-xs px-2 py-0.5">
                                    {item.badge}
                                </Badge>
                            )}
                        </Link>
                    );
                })}

                <div className="pt-8 pb-2">
                    <Button variant="ghost" className="w-full justify-start gap-3 p-3 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-50 text-sm h-auto font-normal">
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 p-3 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-50 text-sm h-auto font-normal">
                        <HelpCircle className="w-5 h-5" />
                        <span>Help center</span>
                    </Button>
                </div>
            </div>

            {/* User / Sign Out */}
            <div className="p-4 border-t border-gray-100">
                <Card className="bg-gray-50 border-0 shadow-none">
                    <CardContent className="p-4">
                        <div className="text-xs text-gray-400 mb-3">Active session</div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                <img src={profile.avatar} alt="User" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{profile.name}</div>
                                <div className="text-xs text-gray-400 truncate">{profile.email}</div>
                                <div className="text-[11px] text-gray-400 capitalize">{profile.role}</div>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full py-2 bg-white border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 h-auto mb-3">
                            <Plus className="w-3 h-3 mr-2" />
                            Add account
                        </Button>
                        <Button
                            variant="link"
                            onClick={logout}
                            className="w-full text-center text-xs text-red-500 hover:text-red-600 font-medium h-auto p-0"
                        >
                            Sign out
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
