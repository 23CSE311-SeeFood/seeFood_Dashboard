"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { SalesChart } from "@/components/sales/weekly-sales-chart";

export function SalesDashboard({ todaySales, weeklySales, monthlySales }) {
    return (
        <div className="flex flex-col gap-4 h-full overflow-hidden">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">Sales Reports</h2>
                    <TrendingUp className="w-6 h-6 text-[#B1464A]" />
                </div>
                <p className="text-sm text-gray-500">Monitor your sales performance across different time periods</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 flex-shrink-0">
                <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <p className="text-xs text-gray-600 font-semibold uppercase">Today's Total</p>
                    <p className="text-2xl font-bold text-[#B1464A] mt-2">
                        ₹{todaySales.reduce((sum, d) => sum + d.sales, 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {todaySales.reduce((sum, d) => sum + d.orders, 0)} orders
                    </p>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                    <p className="text-xs text-gray-600 font-semibold uppercase">Weekly Total</p>
                    <p className="text-2xl font-bold text-[#B1464A] mt-2">
                        ₹{weeklySales.reduce((sum, d) => sum + d.sales, 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {weeklySales.reduce((sum, d) => sum + d.orders, 0)} orders
                    </p>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                    <p className="text-xs text-gray-600 font-semibold uppercase">Monthly Total</p>
                    <p className="text-2xl font-bold text-[#B1464A] mt-2">
                        ₹{monthlySales.reduce((sum, d) => sum + d.sales, 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {monthlySales.reduce((sum, d) => sum + d.orders, 0)} orders
                    </p>
                </Card>
            </div>

            {/* ApexCharts Sales Chart - Takes remaining space */}
            <div className="flex-1 overflow-hidden">
                <SalesChart weeklySales={weeklySales} monthlySales={monthlySales} />
            </div>
        </div>
    );
}
