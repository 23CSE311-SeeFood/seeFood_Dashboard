"use client";

import { ProductGrid } from "@/components/dashboard/product-grid";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MenuPage() {
    return (
        <div className="flex w-full h-full p-8 overflow-hidden">
            <div className="flex-1 flex flex-col min-w-0 h-full">
                <Card className="mb-6 border-0 shadow-none bg-transparent">
                    <CardHeader className="p-0">
                        <CardTitle className="text-2xl text-gray-800">Menu Management</CardTitle>
                        <CardDescription>View and manage all food items</CardDescription>
                    </CardHeader>
                </Card>
                <div className="flex-1 min-h-0">
                    <ProductGrid />
                </div>
            </div>
        </div>
    );
}
