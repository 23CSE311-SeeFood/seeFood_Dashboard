export const downloadSalesReport = (salesData, predictionData) => {
  const timestamp = new Date().toLocaleString();
  
  let csvContent = "SALES REPORT\n";
  csvContent += `Generated on: ${timestamp}\n\n`;

  // Today's Sales
  csvContent += "TODAY'S SALES\n";
  csvContent += "Time,Sales (₹),Orders\n";
  salesData.today.forEach(item => {
    csvContent += `${item.time},${item.sales},${item.orders}\n`;
  });
  csvContent += `Total,${salesData.today.reduce((sum, item) => sum + item.sales, 0)},${salesData.today.reduce((sum, item) => sum + item.orders, 0)}\n\n`;

  // Weekly Sales
  csvContent += "WEEKLY SALES\n";
  csvContent += "Day,Sales (₹),Orders\n";
  salesData.weekly.forEach(item => {
    csvContent += `${item.day},${item.sales},${item.orders}\n`;
  });
  csvContent += `Total,${salesData.weekly.reduce((sum, item) => sum + item.sales, 0)},${salesData.weekly.reduce((sum, item) => sum + item.orders, 0)}\n\n`;

  // Monthly Sales
  csvContent += "MONTHLY SALES\n";
  csvContent += "Week,Sales (₹),Orders\n";
  salesData.monthly.forEach(item => {
    csvContent += `${item.week},${item.sales},${item.orders}\n`;
  });
  csvContent += `Total,${salesData.monthly.reduce((sum, item) => sum + item.sales, 0)},${salesData.monthly.reduce((sum, item) => sum + item.orders, 0)}\n\n`;

  // Predictions
  csvContent += "7-DAY FORECAST\n";
  csvContent += "Day,Predicted Sales (₹)\n";
  predictionData.next7Days.forEach(item => {
    csvContent += `${item.day},${item.sales}\n`;
  });
  csvContent += "\n";

  // Category Predictions
  csvContent += "CATEGORY PREDICTIONS\n";
  csvContent += "Category,Current Sales (₹),Predicted Sales (₹),Growth (%)\n";
  predictionData.categoryPrediction.forEach(item => {
    csvContent += `${item.category},${item.current},${item.predicted},${item.growth}\n`;
  });

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `sales-report-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
