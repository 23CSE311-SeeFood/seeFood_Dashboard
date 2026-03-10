// Sample sales data for visualization
export const salesData = {
    today: [
        { time: "08 AM", sales: 2400, orders: 12 },
        { time: "10 AM", sales: 3210, orders: 14 },
        { time: "12 PM", sales: 5890, orders: 28 },
        { time: "02 PM", sales: 4200, orders: 18 },
        { time: "04 PM", sales: 3800, orders: 16 },
        { time: "06 PM", sales: 6100, orders: 35 },
        { time: "08 PM", sales: 4900, orders: 22 },
    ],
    weekly: [
        { day: "Mon", sales: 18500, orders: 92 },
        { day: "Tue", sales: 21200, orders: 105 },
        { day: "Wed", sales: 19800, orders: 98 },
        { day: "Thu", sales: 24300, orders: 118 },
        { day: "Fri", sales: 28900, orders: 142 },
        { day: "Sat", sales: 32100, orders: 158 },
        { day: "Sun", sales: 29600, orders: 145 },
    ],
    monthly: [
        { week: "Week 1", sales: 142800, orders: 700 },
        { week: "Week 2", sales: 156300, orders: 765 },
        { week: "Week 3", sales: 168900, orders: 825 },
        { week: "Week 4", sales: 179200, orders: 880 },
    ],
};

export const predictionData = {
    next7Days: [
        { day: "Mon", predicted: 26000, trend: "up" },
        { day: "Tue", predicted: 28500, trend: "up" },
        { day: "Wed", predicted: 27200, trend: "stable" },
        { day: "Thu", predicted: 30100, trend: "up" },
        { day: "Fri", predicted: 33400, trend: "up" },
        { day: "Sat", predicted: 36200, trend: "up" },
        { day: "Sun", predicted: 32800, trend: "up" },
    ],
    categoryPrediction: [
        { category: "Breakfast", predicted: 5200, current: 4800 },
        { category: "Lunch", predicted: 18900, current: 17500 },
        { category: "Snacks", predicted: 8600, current: 7900 },
        { category: "Dinner", predicted: 14200, current: 13100 },
        { category: "Beverages", predicted: 4100, current: 3700 },
    ],
};
