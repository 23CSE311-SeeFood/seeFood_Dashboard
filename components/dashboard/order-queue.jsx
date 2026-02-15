"use client";

import { Eye, ChevronRight, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

    const getStatusVariant = (status) => {
        switch (status) {
            case "ready":
                return "default";
            case "cooking":
                return "secondary";
            case "canceled":
                return "destructive";
            default:
                return "outline";
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
                    <Card key={idx} className="min-w-[300px] rounded-xl flex-shrink-0">
                        <CardContent className="p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-500 text-sm">{order.id}</span>
                                <Badge variant={getStatusVariant(order.status)} className="px-3 py-1">
                                    {getStatusLabel(order.status)}
                                </Badge>
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
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
