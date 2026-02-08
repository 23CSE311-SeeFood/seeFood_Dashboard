"use client";

import { Search, SlidersHorizontal, Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ProductGrid() {
    const categories = ["Appetizers", "Seafood platters", "Fish", "Shrimp", "Crab", "Squid", "Rice", "Drinks", "Dessert"];

    const products = [
        {
            id: 1,
            name: "Spicy Shrimp Rice",
            price: 8.99,
            category: "Seafood",
            image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=400&q=80",
        },
        {
            id: 2,
            name: "Garlic fried butter",
            price: 8.99,
            category: "Sweet chili",
            image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=400&q=80",
        },
        {
            id: 3,
            name: "Thai hot seafood",
            price: 8.99,
            category: "Creamy",
            image: "https://images.unsplash.com/photo-1548943487-a2e4e43b485c?auto=format&fit=crop&w=400&q=80",
        },
        {
            id: 4,
            name: "Spicy Shrimp Rice",
            price: 8.99,
            category: "Seafood",
            image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=400&q=80",
        },
        {
            id: 5,
            name: "Spicy Shrimp Rice",
            price: 8.99,
            category: "Seafood",
            image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=400&q=80",
        },
        {
            id: 6,
            name: "Spicy Shrimp Rice",
            price: 8.99,
            category: "Seafood",
            image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=400&q=80",
        },
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Product Lists</h2>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search for food"
                            className="pl-10 w-64 h-10 bg-white border-gray-200"
                        />
                    </div>
                    <Button variant="outline" className="h-10 px-3 bg-white border-gray-200">
                        <SlidersHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2">
                {categories.map((cat, idx) => (
                    <Button
                        key={idx}
                        variant={idx === 0 ? "default" : "outline"}
                        className={`whitespace-nowrap rounded-full ${
                            idx === 0 ? "bg-emerald-600 text-white hover:bg-emerald-700 border-0" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        {cat}
                    </Button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2 pb-20">
                {products.map((product) => (
                    <Card key={product.id} className="rounded-2xl flex flex-col hover:shadow-md transition-shadow overflow-hidden">
                        <CardContent className="p-4 flex flex-col flex-1">
                            <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">$ {product.price} / serving</p>
                                    <p className="text-xs text-gray-400">{product.category}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-auto">
                                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                                    <Button variant="ghost" size="icon" className="size-8 p-1 hover:bg-white rounded-md">
                                        <Minus className="w-4 h-4 text-gray-500" />
                                    </Button>
                                    <span className="w-8 text-center text-sm font-medium text-gray-900">0</span>
                                    <Button variant="ghost" size="icon" className="size-8 p-1 hover:bg-white rounded-md">
                                        <Plus className="w-4 h-4 text-gray-500" />
                                    </Button>
                                </div>
                                <Button variant="outline" className="flex-1 border-gray-200 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50">
                                    Add to cart
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
