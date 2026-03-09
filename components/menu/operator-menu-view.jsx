"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function OperatorMenuView({ items, internalTimeSlots, itemAvailability, onItemClick }) {
    const [activeSlotIndex, setActiveSlotIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const activeSlot = internalTimeSlots[activeSlotIndex];

    // Filter by time slot
    const filteredBySlot = items.filter((item) =>
        item.timeSlots.includes(activeSlot)
    );

    // Derive unique categories
    const categories = ["All", ...new Set(filteredBySlot.map((item) => item.category))];

    // Filter by category
    const finalProducts = filteredBySlot.filter((product) => {
        const matchesCategory =
            selectedCategory === "All" || product.category === selectedCategory;
        return matchesCategory;
    });

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Menu Management</h2>
                <p className="text-sm text-gray-500">Tap on any item to toggle availability status</p>
            </div>

            {/* Time Slot Buttons */}
            <div className="flex gap-2">
                {internalTimeSlots.map((slot, index) => (
                    <Button
                        key={slot}
                        onClick={() => setActiveSlotIndex(index)}
                        className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                            activeSlotIndex === index
                                ? "bg-[#B1464A] text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {slot}
                    </Button>
                ))}
            </div>

            {/* Category Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                    <Button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        variant={selectedCategory === cat ? "default" : "outline"}
                        className={`rounded-full px-4 py-1 h-auto text-sm transition-all ${
                            selectedCategory === cat
                                ? "bg-[#B1464A] text-white border-0"
                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        {cat}
                    </Button>
                ))}
            </div>

            {/* Menu Items List */}
            <div className="flex-1 overflow-y-auto pr-2">
                {finalProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No items available for this selection</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {finalProducts.map((item) => {
                            const isAvailable = itemAvailability[item.id] !== false;
                            return (
                                <Card
                                    key={item.id}
                                    onClick={() => onItemClick(item)}
                                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        {/* Item Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-gray-800">
                                                    {item.name}
                                                </h3>
                                                <Badge
                                                    className={`text-xs font-bold ${
                                                        item.isVeg
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {item.isVeg ? "Veg" : "Non-Veg"}
                                                </Badge>
                                                {/* Availability Badge */}
                                                <Badge
                                                    className={`text-xs font-bold ml-auto ${
                                                        isAvailable
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {isAvailable ? "Available" : "Not Available"}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-xl font-bold text-[#B1464A]">
                                                ₹{item.price}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
