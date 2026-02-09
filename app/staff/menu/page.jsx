"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/dashboard/product-grid";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { menuItems } from "@/lib/menu-data";

export default function MenuPage() {
    const [activeSlot, setActiveSlot] = useState("Morning");

    const timeSlots = ["Morning", "Afternoon", "Evening", "Night"];

    // Data imported from shared source
    const allProducts = menuItems;

    const filteredProducts = allProducts.filter(product =>
        product.timeSlots.includes(activeSlot)
    );

    return (
        <div className="flex w-full h-full p-8 overflow-hidden">
            <div className="flex-1 flex flex-col min-w-0 h-full gap-6">
                <div className="flex flex-col gap-4">
                    <Card className="border-0 shadow-none bg-transparent">
                        <CardHeader className="p-0">
                            <CardTitle className="text-2xl text-gray-800">Menu Management</CardTitle>
                            <CardDescription>View and manage all food items by time of day</CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Time Slot Tabs */}
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-max">
                        {timeSlots.map((slot) => (
                            <Button
                                key={slot}
                                onClick={() => setActiveSlot(slot)}
                                variant="ghost"
                                className={`px-6 py-2 rounded-md transition-all ${activeSlot === slot
                                    ? "bg-white text-[#B1464A] shadow-sm font-bold"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                                    }`}
                            >
                                {slot}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 min-h-0">
                    <ProductGrid items={filteredProducts} />
                </div>
            </div>
        </div>
    );
}
