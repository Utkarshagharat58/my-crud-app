import React, { useState, useEffect } from "react";
import axios from "axios";
import StockPerformanceChart from "./StockChart"; // Updated component import

// Define the type for the data structure
interface StockData {
  date: string;
  stock_1: number;
  stock_3: number;
}

const App: React.FC = () => {
  const [data, setData] = useState<StockData[]>([]); // State for raw stock data
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
    new Date(),
  ]); // State for the selected date range

  useEffect(() => {
    // Fetch data from your server
    axios
      .get<StockData[]>("http://localhost:5000/api/stock_data") // API endpoint
      .then((response) => {
        setData(response.data); // Set the fetched data
        setIsLoading(false); // Data loaded successfully
      })
      .catch((err) => {
        setError(err.message); // Set the error if any
        setIsLoading(false); // Finished loading
      });
  }, []);

  // Function to handle date range change
  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setDateRange([startDate, endDate]); // Update the date range
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Stock Performance</h1>

      {/* Render the StockPerformanceChart */}
      <StockPerformanceChart
        data={data}
        isLoading={isLoading}
        error={error || ""}
        dateRange={dateRange} // Pass date range to filter data in the chart
        setDateRange={handleDateRangeChange} // Pass the setDateRange function
      />
    </div>
  );
};

export default App;
