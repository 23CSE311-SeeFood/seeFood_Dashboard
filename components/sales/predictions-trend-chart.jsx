"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

// Dynamic import to avoid SSR issues with ApexCharts
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function PredictionsTrendChart({ data }) {
    const [chartData, setChartData] = useState({
        series: [],
        options: {},
    });

    useEffect(() => {
        if (!data || data.length === 0) return;

        const days = data.map((item) => item.day);
        const predicted = data.map((item) => item.predicted);

        // Create color for each bar based on trend using brand colors
        const colors = data.map((item) => {
            if (item.trend === "up") return "#8f3739"; // darker brand color
            if (item.trend === "down") return "#d17a7e"; // lighter brand color
            return "#B1464A"; // brand color
        });

        setChartData({
            series: [
                {
                    name: "Predicted Sales (₹)",
                    data: predicted,
                },
            ],
            options: {
                chart: {
                    type: "bar",
                    height: 350,
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
                colors: colors,
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
                        colors: ["#374151"],
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
                        text: "Predicted Sales (₹)",
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
    }, [data]);

    return (
        <Card className="p-6 w-full h-full flex flex-col overflow-hidden">
            <div className="mb-4 flex-shrink-0">
                <h3 className="text-lg font-bold text-gray-800">Sales Forecast (Next 7 Days)</h3>
                <p className="text-sm text-gray-500 mt-1">Interactive forecast showing predicted daily sales with trend indicators</p>
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
