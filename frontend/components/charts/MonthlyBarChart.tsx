"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/utils";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface MonthlyPoint {
  _id: { year: number; month: number };
}

export function MonthlyBarChart<T extends MonthlyPoint>({
  data,
  dataKey,
  color = "var(--color-signal-500)",
  label = "Amount",
}: {
  data: T[];
  dataKey: keyof T;
  color?: string;
  label?: string;
}) {
  const chartData = data.map((d) => ({
    label: `${MONTH_LABELS[d._id.month - 1]} '${String(d._id.year).slice(2)}`,
    value: Number(d[dataKey]) || 0,
  }));

  if (!chartData.length) {
    return <p className="py-10 text-center text-sm text-ink-soft/50">Not enough paid bookings yet to chart.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ left: 4, right: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--color-ink-soft)" }} axisLine={{ stroke: "var(--color-line)" }} tickLine={false} />
        <YAxis
          tick={{ fontSize: 12, fill: "var(--color-ink-soft)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => formatCurrency(v).replace(".00", "")}
          width={70}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value) || 0), label]}
          contentStyle={{ border: "1px solid var(--color-line)", borderRadius: 4, fontSize: 13 }}
        />
        <Bar dataKey="value" fill={color} radius={[3, 3, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
