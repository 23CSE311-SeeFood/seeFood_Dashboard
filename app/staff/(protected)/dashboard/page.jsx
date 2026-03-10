"use client";

import { useEffect, useState } from "react";
import { OrderQueue } from "@/components/dashboard/order-queue";
import { ProductGrid } from "@/components/dashboard/product-grid";
import { menuItems } from "@/lib/menu-data";

export default function DashboardPage() {
    const [allMenuItems, setAllMenuItems] = useState(menuItems);

    // Load merged items from both original and newly added items
    const loadMergedItems = () => {
        try {
            const newItems = localStorage.getItem("food_items");
            const parsedNewItems = newItems ? JSON.parse(newItems) : [];
            
            // Merge: original items + newly added items
            const merged = [...menuItems, ...parsedNewItems];
            
            // Remove duplicates by id
            const uniqueItems = Array.from(new Map(merged.map(item => [item.id, item])).values());
            
            setAllMenuItems(uniqueItems);
        } catch (error) {
            console.warn("Failed to load merged items", error);
            setAllMenuItems(menuItems);
        }
    };

    useEffect(() => {
        loadMergedItems();

        // Listen for changes to food_items in localStorage (from other pages/tabs)
        const handleStorageChange = (e) => {
            if (e.key === "food_items" && e.newValue !== null) {
                loadMergedItems();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <div className="flex w-full h-full">
            {/* Middle Section */}
            <div className="flex-1 flex flex-col min-w-0 p-8 overflow-hidden">
                <OrderQueue />
                <div className="flex-1 min-h-0">
                    <ProductGrid items={allMenuItems} />
                </div>
            </div>
        </div>
    );
}
