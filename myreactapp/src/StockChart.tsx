import React, { useState, useEffect } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";
import { format, parseISO, subMonths } from "date-fns";

// Define interfaces for the data structure
interface StockData {
  date: string;
  stock_1: number;
  stock_3: number;
  stock_3_DoD?: number; // Day-on-day change for Stock 3
}

interface ProcessedData extends StockData {
  formattedDate: string;
}

// Define the props interface including setDateRange
interface StockPerformanceChartProps {
  data: StockData[];
  isLoading: boolean;
  error: string;
  dateRange: [Date, Date];
  setDateRange: (startDate: Date, endDate: Date) => void; // Define setDateRange prop
}

/**
 * StockPerformanceChart Component
 * Displays a dual-axis chart showing Stock 1's performance and Stock 3's day-on-day change
 */
const StockPerformanceChart: React.FC<StockPerformanceChartProps> = ({
  data,
  isLoading,
  error,
  dateRange,
  setDateRange,
}) => {
  // Function to calculate day-on-day change
  const calculateDayOnDayChange = (data: StockData[]): ProcessedData[] => {
    return data.map((item, index) => {
      const previousDay =
        index > 0 ? data[index - 1].stock_3 : item.stock_3;
      const dodChange = ((item.stock_3 - previousDay) / previousDay) * 100;

      return {
        ...item,
        stock_3_DoD: index === 0 ? 0 : dodChange,
        formattedDate: format(parseISO(item.date), "MMM dd"),
      };
    });
  };

  const processedData = calculateDayOnDayChange(data);

  // Filter data based on date range
  const filteredData = processedData.filter(
    (item) =>
      new Date(item.date) >= dateRange[0] && new Date(item.date) <= dateRange[1]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] p-4">
      <h2 className="text-xl font-bold mb-4">Stock Performance Analysis</h2>

      {/* Date Range Picker */}
      <div className="mb-4 flex gap-4">
        <input
          type="date"
          value={dateRange[0].toISOString().split("T")[0]}
          onChange={(e) =>
            setDateRange(new Date(e.target.value), dateRange[1]) // Update the date range
          }
          className="border rounded-md px-2 py-1"
        />
        <input
          type="date"
          value={dateRange[1].toISOString().split("T")[0]}
          onChange={(e) =>
            setDateRange(dateRange[0], new Date(e.target.value)) // Update the date range
          }
          className="border rounded-md px-2 py-1"
        />
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={filteredData} // Use filtered data
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis
            dataKey="formattedDate"
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={{ fontSize: 12 }}
            label={{ value: "Stock 1 Price", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            label={{
              value: "Stock 3 DoD Change (%)",
              angle: 90,
              position: "insideRight",
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload) return null;
              return (
                <div className="bg-white p-3 border rounded-md shadow-lg">
                  <p className="font-bold">{payload[0]?.payload.formattedDate}</p>
                  <p className="text-blue-600">
                    Stock 1: $
                    {payload[0]?.value &&
                    !isNaN(Number(payload[0]?.value))
                      ? (Number(payload[0]?.value) as number).toFixed(2)
                      : "N/A"}
                  </p>
                  <p className="text-green-600">
                    Stock 3 DoD:{" "}
                    {payload[1]?.value &&
                    !isNaN(Number(payload[1]?.value))
                      ? (Number(payload[1]?.value) as number).toFixed(2)
                      : "N/A"}{" "}
                    %
                  </p>
                </div>
              );
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="stock_1"
            stroke="#2563eb"
            dot={false}
            name="Stock 1 Price"
          />
          <Bar
            yAxisId="right"
            dataKey="stock_3_DoD"
            fill="#22c55e"
            name="Stock 3 DoD Change"
            opacity={0.8}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockPerformanceChart;
