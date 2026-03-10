"use client";

import { useState, useEffect } from "react";
import { OrderQueue } from "@/components/dashboard/order-queue";
import { OrderEntry } from "@/components/orders/order-entry";
import { ActiveOrder } from "@/components/orders/active-order";
import { menuItems } from "@/lib/menu-data";

export default function OrdersPage() {
    const [cartItems, setCartItems] = useState([]);
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

    const addToCart = (item, qty) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i =>
                    i.id === item.id ? { ...i, qty: i.qty + qty } : i
                );
            }
            return [...prev, { ...item, qty }];
        });
    };

    const updateQty = (id, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className="flex w-full h-full">
            {/* Middle Section */}
            <div className="flex-1 flex flex-col min-w-0 p-8 overflow-hidden gap-6">
                <OrderQueue />
                <div className="flex-1 min-h-0">
                    <OrderEntry onAdd={addToCart} items={allMenuItems} />
                </div>
            </div>

            {/* Right Section - New Order (Interactive) */}
            <ActiveOrder
                items={cartItems}
                onUpdateQty={updateQty}
                onRemove={removeItem}
            />
        </div>
    );
}
