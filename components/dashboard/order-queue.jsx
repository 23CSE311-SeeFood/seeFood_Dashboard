"use client";

import { Eye, ChevronRight, Box } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrderQueue() {
    const orders = [
        {
            id: "#12DOB-3A",
            customer: "Anggito Dwi Pratama",
            time: "12-01-2025, 11:30 pm",
            items: 5,
            table: "2c",
            status: "ready", // ready, cooking, canceled
        },
        {
            id: "#12DOB-3B",
            customer: "Dwi Lestari Salsabila",
            time: "12-01-2025, 11:30 pm",
            items: 5,
            table: "2c",
            status: "cooking",
        },
        {
            id: "#12DOB-3C",
            customer: "Devano Cahyo Anggara",
            time: "12-01-2025, 11:30 pm",
            items: 5,
            table: "2c",
            status: "canceled",
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "ready":
                return "bg-emerald-100 text-emerald-700";
            case "cooking":
                return "bg-amber-100 text-amber-700";
            case "canceled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "ready": return "Ready to serve";
            case "cooking": return "On Cooking";
            case "canceled": return "Canceled";
            default: return status;
        }
    };

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Order queues</h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="border-gray-200 text-gray-500 hover:bg-gray-50">
                        <Eye className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                        <ChevronRight className="w-4 h-4 mr-1" />
                        View All
                    </Button>
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {orders.map((order, idx) => (
                    <div key={idx} className="min-w-[300px] bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-500 text-sm">{order.id}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {getStatusLabel(order.status)}
                            </span>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900">{order.customer}</h3>
                            <p className="text-xs text-gray-400">{order.time}</p>
                        </div>

                        <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-2 py-1 rounded-md">
                                <Box className="w-3.5 h-3.5" />
                                <span>{order.items} Items</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-2 py-1 rounded-md">
                                <div className="w-3.5 h-3.5 border border-gray-400 rounded-sm"></div>
                                <span>Table {order.table}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
