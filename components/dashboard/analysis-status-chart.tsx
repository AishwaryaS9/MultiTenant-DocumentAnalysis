"use client";

import { AnalysisStatusChartProps } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = [
    "#3b82f6", // blue
    "#cbd5e1", // slate
];

export default function AnalysisStatusChart({ data }: AnalysisStatusChartProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-full">
            <h3 className="text-lg font-semibold mb-4">
                AI Analysis Status
            </h3>

            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            dataKey="value"
                            nameKey="name"
                            label
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={index}
                                    fill={
                                        COLORS[
                                        index % COLORS.length
                                        ]
                                    }
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}