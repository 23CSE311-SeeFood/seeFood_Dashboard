"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { SalesDashboard } from "@/components/sales/sales-dashboard";
import { PredictionsDashboard } from "@/components/sales/predictions-dashboard";
import { salesData, predictionData } from "@/lib/sales-data";
import { downloadSalesReport } from "@/lib/download-utils";

export default function SalesPage() {
    const [activeTab, setActiveTab] = useState("report");

    const handleDownload = () => {
        downloadSalesReport(salesData, predictionData);
    };

    return (
        <div className="flex-1 flex flex-col h-full p-8 gap-6 overflow-hidden">
            {/* Header with Download Button */}
            <div className="flex justify-between items-center flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Sales Report</h1>
                    <p className="text-gray-500 text-sm mt-1">View sales analytics and predictions</p>
                </div>
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex-shrink-0"
                >
                    <Download size={18} />
                    <span className="font-medium">Download Report</span>
                </button>
            </div>

            {/* Toggle Tabs */}
            <div className="flex gap-2 flex-shrink-0">
                <button
                    onClick={() => setActiveTab("report")}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === "report"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Report
                </button>
                <button
                    onClick={() => setActiveTab("prediction")}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === "prediction"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Prediction
                </button>
            </div>

            {/* Content - Static View */}
            <div className="flex-1 overflow-hidden">
                {activeTab === "report" ? (
                    <div className="h-full overflow-hidden">
                        <SalesDashboard
                            todaySales={salesData.today}
                            weeklySales={salesData.weekly}
                            monthlySales={salesData.monthly}
                        />
                    </div>
                ) : (
                    <div className="h-full overflow-hidden">
                        <PredictionsDashboard
                            next7Days={predictionData.next7Days}
                            categoryPrediction={predictionData.categoryPrediction}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
