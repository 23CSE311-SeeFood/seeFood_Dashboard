"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";

export function PredictionsDashboard({ next7Days, categoryPrediction }) {
    const renderTrendChart = (data) => {
        const max = Math.max(...data.map(d => d.predicted));

        return (
            <Card className="p-6 h-full flex flex-col overflow-hidden">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex-shrink-0">Sales Forecast (Next 7 Days)</h3>
                <div className="flex-1 flex items-end justify-between gap-2 overflow-hidden">
                    {data.map((item, idx) => {
                        const height = (item.predicted / max) * 100;
                        const trendColor = item.trend === "up" ? "from-emerald-500 to-green-400" : 
                                        item.trend === "down" ? "from-red-500 to-pink-400" : 
                                        "from-blue-500 to-cyan-400";
                        
                        return (
                            <div key={idx} className="flex flex-col items-center gap-2 flex-1 h-full">
                                <div className="flex-1" />
                                <div
                                    className={`w-full bg-gradient-to-t ${trendColor} rounded-t-lg transition-all hover:opacity-80 relative`}
                                    style={{ height: `${height}%`, minHeight: "10px" }}
                                    title={`Predicted: ₹${item.predicted.toLocaleString()}`}
                                >
                                    {item.trend === "up" && (
                                        <TrendingUp className="w-3 h-3 text-white absolute -top-4 right-1" />
                                    )}
                                </div>
                                <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">{item.day}</span>
                                <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                                    ₹{(item.predicted / 1000).toFixed(0)}k
                                </span>
                            </div>
                        );
                    })}
                </div>
            </Card>
        );
    };

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
                {renderTrendChart(next7Days)}
            </div>

            {/* Category Predictions */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex-shrink-0">Category Forecast</h3>
                <div className="flex gap-4 overflow-x-hidden flex-1">
                    {categoryPrediction.map((cat, idx) => {
                        const growth = ((cat.predicted - cat.current) / cat.current * 100).toFixed(1);
                        const isPositive = growth > 0;

                        return (
                            <Card key={idx} className="p-4 border-l-4 border-l-[#B1464A] hover:shadow-md transition-shadow flex-shrink-0 w-64">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-800 text-sm">{cat.category}</h4>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs text-gray-500">Currently:</span>
                                            <span className="text-sm font-bold text-gray-700">
                                                ₹{(cat.current / 1000).toFixed(1)}k
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
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

            {/* Insights */}
            <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 flex-shrink-0">
                <div className="flex gap-3">
                    <Zap className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Trend Insight</p>
                        <p className="text-xs text-gray-600 mt-1">
                            📈 Overall sales are expected to increase by 12-15% next week. Lunch and Dinner categories show the strongest growth potential.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
