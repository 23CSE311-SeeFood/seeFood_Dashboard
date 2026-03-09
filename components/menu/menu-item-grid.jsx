"use client";

import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";

export function MenuItemGrid({ items, onItemClick, itemAvailability }) {
    if (!items || items.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No items available for this time slot</p>
            </div>
        );
    }

    return (
        <div className="space-y-2 overflow-y-auto pr-2">
            {items.map((item) => {
                const isAvailable = itemAvailability[item.id] !== false;
                
                return (
                    <Card
                        key={item.id}
                        onClick={() => onItemClick(item)}
                        className="overflow-hidden hover:shadow-lg transition-all cursor-pointer p-4 flex items-center justify-between"
                    >
                        {/* Item Info */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">
                                {item.name}
                            </h3>
                            <p className="text-lg font-bold text-[#B1464A] mt-1">
                                ₹{item.price}
                            </p>
                        </div>

                        {/* Availability Badge */}
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold text-white flex-shrink-0 ml-4 ${
                            isAvailable ? "bg-green-600" : "bg-red-600"
                        }`}>
                            {isAvailable ? (
                                <>
                                    <Check className="w-4 h-4" /> Available
                                </>
                            ) : (
                                <>
                                    <X className="w-4 h-4" /> Not Available
                                </>
                            )}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
