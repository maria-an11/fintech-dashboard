import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { CategoryBreakdown } from "../types";
import { tintWithAccent } from "../lib/colorUtils";

interface CategoryBreakdownChartProps {
  data: CategoryBreakdown[];
}

export default function CategoryBreakdownChart({
  data,
}: CategoryBreakdownChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 480);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No data available
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.category_name,
    value: item.total,
    color: tintWithAccent(item.category_color),
  }));

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 320 : 380}>
      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Pie
          data={chartData}
          dataKey="value"
          cx="50%"
          cy={isMobile ? "45%" : "42%"}
          labelLine={false}
          label={isMobile ? false : ({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={isMobile ? 60 : 70}
          fill="#4e878c"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--background)",
            border: "1px solid var(--foreground)",
            color: "var(--foreground)",
            borderRadius: "8px",
          }}
          formatter={(value: number) =>
            `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
          }
          labelStyle={{ color: "var(--foreground)" }}
          itemStyle={{ color: "var(--foreground)" }}
        />
        <Legend
          wrapperStyle={{
            fontSize: isMobile ? "11px" : "13px",
            paddingTop: "4px",
            paddingBottom: "0",
          }}
          iconSize={isMobile ? 10 : 12}
          verticalAlign="bottom"
          layout="horizontal"
          align="center"
          formatter={(value) => (
            <span style={{ wordBreak: "break-word" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
