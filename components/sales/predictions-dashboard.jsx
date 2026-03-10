"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { PredictionsTrendChart } from "@/components/sales/predictions-trend-chart";

export function PredictionsDashboard({ next7Days, categoryPrediction }) {

    return (
        <div className="flex flex-col gap-4 h-full overflow-hidden">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">Predictions</h2>
                    <Zap className="w-6 h-6 text-yellow-500" />
                </div>
                <p className="text-sm text-gray-500">AI-powered sales forecasting and category insights</p>
            </div>

            {/* Trend Chart */}
            <div className="flex-1 overflow-hidden">
                <PredictionsTrendChart data={next7Days} />
            </div>

            {/* Category Predictions */}
            <div className="flex flex-col flex-shrink-0">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Category Forecast</h3>
                <div className="flex gap-3 overflow-x-auto">
                    {categoryPrediction.map((cat, idx) => {
                        const growth = ((cat.predicted - cat.current) / cat.current * 100).toFixed(1);
                        const isPositive = growth > 0;

                        return (
                            <Card key={idx} className="p-3 border-l-4 border-l-[#B1464A] hover:shadow-md transition-shadow flex-shrink-0 w-64">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-800 text-sm">{cat.category}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500">Currently:</span>
                                            <span className="text-sm font-bold text-gray-700">
                                                ₹{(cat.current / 1000).toFixed(1)}k
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-gray-500">Predicted:</span>
                                            <span className="text-sm font-bold text-[#B1464A]">
                                                ₹{(cat.predicted / 1000).toFixed(1)}k
                                            </span>
                                        </div>
                                    </div>
                                    <Badge
                                        className={`flex-shrink-0 h-fit text-xs font-bold ${
                                            isPositive
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {isPositive ? "↑" : "↓"} {Math.abs(growth)}%
                                    </Badge>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
