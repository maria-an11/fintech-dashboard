import type { MonthlyTotal } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface MonthlyChartProps {
  data: MonthlyTotal[];
}

export default function MonthlyChart({ data }: MonthlyChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No data available
      </div>
    );
  }

  const dataChart = data
    .map((item) => ({
      month: format(new Date(item.month), "MMM yyyy"),
      total: item.total,
    }))
    .reverse();

  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <BarChart data={dataChart} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-gray-300 dark:stroke-gray-600"
        />
        <XAxis
          dataKey="month"
          className="text-gray-600 dark:text-gray-400"
          tick={{ fill: "currentColor" }}
          height={40}
        />
        <YAxis
          className="text-gray-600 dark:text-gray-400"
          tick={{ fill: "currentColor" }}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--background)",
            border: "1px solid var(--foreground)",
            borderRadius: "8px",
          }}
          formatter={(value: number) => [
            `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            "Total",
          ]}
        />
        <Bar dataKey="total" fill="#4e878c" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
