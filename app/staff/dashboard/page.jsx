"use client";

import { OrderQueue } from "@/components/dashboard/order-queue";
import { ProductGrid } from "@/components/dashboard/product-grid";

export default function DashboardPage() {
    return (
        <div className="flex w-full h-full">
            {/* Middle Section */}
            <div className="flex-1 flex flex-col min-w-0 p-8 overflow-hidden">
                <OrderQueue />
                <div className="flex-1 min-h-0">
                    <ProductGrid />
                </div>
            </div>
        </div>
    );
}
