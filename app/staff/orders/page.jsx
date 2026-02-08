"use client";

import { useState } from "react"; // Added useState
import { OrderQueue } from "@/components/dashboard/order-queue";
import { OrderEntry } from "@/components/orders/order-entry";
import { ActiveOrder } from "@/components/orders/active-order";

export default function OrdersPage() {
    const [cartItems, setCartItems] = useState([]);

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
                    <OrderEntry onAdd={addToCart} />
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
