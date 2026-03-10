"use client";

import { useAuth } from "@/components/global/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FoodItemManagement from "@/components/food-items/food-item-management";

export default function FoodItemsPage() {
    const { user, isInitialized } = useAuth();
    const router = useRouter();
    const [initialItems, setInitialItems] = useState([]);

    useEffect(() => {
        if (!isInitialized) return;

        // Redirect if not authenticated
        if (!user) {
            router.replace("/staff/login");
            return;
        }

        // Only admin can access this page
        if (user.role !== "admin") {
            router.replace("/staff/dashboard");
            return;
        }

        // Load items from localStorage or use defaults
        const savedItems = localStorage.getItem("food_items");
        if (savedItems) {
            try {
                setInitialItems(JSON.parse(savedItems));
            } catch (error) {
                console.warn("Failed to load food items", error);
                loadDefaultItems();
            }
        } else {
            loadDefaultItems();
        }
    }, [user, isInitialized, router]);

    const loadDefaultItems = () => {
        const defaultItems = [
            {
                id: 1,
                name: "Butter Chicken",
                price: 320,
                category: "Food",
                description: "Tender chicken in creamy tomato sauce",
                available: true
            },
            {
                id: 2,
                name: "Paneer Tikka",
                price: 280,
                category: "Food",
                description: "Grilled cottage cheese with spices",
                available: true
            },
            {
                id: 3,
                name: "Biryani",
                price: 250,
                category: "Food",
                description: "Aromatic rice with meat and spices",
                available: true
            },
            {
                id: 4,
                name: "Iced Coffee",
                price: 120,
                category: "Beverages",
                description: "Refreshing cold coffee",
                available: true
            },
            {
                id: 5,
                name: "Gulab Jamun",
                price: 80,
                category: "Desserts",
                description: "Sweet milk solids in sugar syrup",
                available: true
            },
        ];
        setInitialItems(defaultItems);
    };

    if (!isInitialized) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    return (
        <FoodItemManagement initialItems={initialItems} />
    );
}
