"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Dynamic import to avoid SSR issues with ApexCharts
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function SalesChart({ weeklySales, monthlySales }) {
    const [chartType, setChartType] = useState("week");
    const [selectedPeriod, setSelectedPeriod] = useState(0);
    const [chartData, setChartData] = useState({
        series: [],
        options: {},
    });

    // Generate period options (current and previous 5)
    const getWeekOptions = () => {
        const options = [];
        const today = new Date();
        for (let i = 0; i < 6; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i * 7);
            const weekNum = Math.ceil((date.getDate() - date.getDay()) / 7);
            const yearMonth = date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
            options.push({
                value: i,
                label: i === 0 ? `Current Week (${yearMonth})` : `${i} Week${i > 1 ? "s" : ""} Ago (${yearMonth})`,
            });
        }
        return options;
    };

    const getMonthOptions = () => {
        const options = [];
        const today = new Date();
        for (let i = 0; i < 6; i++) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthYear = date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
            options.push({
                value: i,
                label: i === 0 ? `Current Month (${monthYear})` : `${i} Month${i > 1 ? "s" : ""} Ago (${monthYear})`,
            });
        }
        return options;
    };

    useEffect(() => {
        const data = chartType === "week" ? weeklySales : monthlySales;
        if (!data || data.length === 0) return;

        const days = data.map((item) => item.day || item.week);
        const sales = data.map((item) => item.sales);

        setChartData({
            series: [
                {
                    name: "Sales (₹)",
                    data: sales,
                },
            ],
            options: {
                chart: {
                    type: "bar",
                    height: 400,
                    toolbar: {
                        show: true,
                        tools: {
                            download: true,
                            selection: true,
                            zoom: true,
                            zoomin: true,
                            zoomout: true,
                            pan: true,
                            reset: true,
                        },
                    },
                },
                colors: ["#B1464A"],
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: "60%",
                        borderRadius: 6,
                        dataLabels: {
                            position: "top",
                        },
                    },
                },
                dataLabels: {
                    enabled: true,
                    offsetY: -20,
                    style: {
                        fontSize: "12px",
                        colors: ["#B1464A"],
                        fontWeight: 600,
                    },
                    formatter: function (val) {
                        return "₹" + (val / 1000).toFixed(0) + "k";
                    },
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ["transparent"],
                },
                xaxis: {
                    categories: days,
                    labels: {
                        style: {
                            fontSize: "12px",
                            fontWeight: 500,
                            colors: "#6B7280",
                        },
                    },
                },
                yaxis: {
                    title: {
                        text: "Sales Amount (₹)",
                        style: {
                            color: "#374151",
                            fontSize: "13px",
                            fontWeight: 600,
                        },
                    },
                    labels: {
                        formatter: function (val) {
                            return "₹" + (val / 1000).toFixed(0) + "k";
                        },
                        style: {
                            colors: "#6B7280",
                            fontSize: "12px",
                        },
                    },
                    axisBorder: {
                        show: false,
                    },
                    axisTicks: {
                        show: false,
                    },
                },
                grid: {
                    borderColor: "#E5E7EB",
                    yaxis: {
                        lines: {
                            show: true,
                        },
                    },
                    xaxis: {
                        lines: {
                            show: false,
                        },
                    },
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return "₹" + val.toLocaleString();
                        },
                    },
                    theme: "light",
                },
                states: {
                    hover: {
                        filter: {
                            type: "darken",
                            value: 0.15,
                        },
                    },
                    active: {
                        filter: {
                            type: "darken",
                            value: 0.15,
                        },
                    },
                },
                responsive: [
                    {
                        breakpoint: 1024,
                        options: {
                            plotOptions: {
                                bar: {
                                    columnWidth: "65%",
                                },
                            },
                        },
                    },
                    {
                        breakpoint: 640,
                        options: {
                            chart: {
                                height: 300,
                            },
                            plotOptions: {
                                bar: {
                                    columnWidth: "75%",
                                },
                            },
                            xaxis: {
                                labels: {
                                    style: {
                                        fontSize: "10px",
                                    },
                                },
                            },
                        },
                    },
                ],
            },
        });
    }, [weeklySales, monthlySales, chartType, selectedPeriod]);

    const periodOptions = chartType === "week" ? getWeekOptions() : getMonthOptions();

    return (
        <Card className="p-6 w-full h-full flex flex-col overflow-hidden">
            <div className="mb-4 flex-shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Sales Analysis</h3>
                        <p className="text-sm text-gray-500 mt-1">Interactive chart with multiple view options</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Report Type Toggle */}
                        <div className="flex gap-2">
                            <Button
                                onClick={() => {
                                    setChartType("week");
                                    setSelectedPeriod(0);
                                }}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    chartType === "week"
                                        ? "bg-[#B1464A] text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                Weekly
                            </Button>
                            <Button
                                onClick={() => {
                                    setChartType("month");
                                    setSelectedPeriod(0);
                                }}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    chartType === "month"
                                        ? "bg-[#B1464A] text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                Monthly
                            </Button>
                        </div>

                        {/* Period Selector */}
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
                            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:border-gray-400 focus:outline-none focus:border-[#B1464A]"
                        >
                            {periodOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                {chartData.series.length > 0 ? (
                    <ApexChart
                        type="bar"
                        series={chartData.series}
                        options={chartData.options}
                        height={"100%"}
                    />
                ) : (
                    <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                        <p className="text-gray-400">No data available</p>
                    </div>
                )}
            </div>
        </Card>
    );
}
