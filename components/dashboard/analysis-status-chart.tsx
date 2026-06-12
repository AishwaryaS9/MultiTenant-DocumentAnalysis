"use client";

import { useEffect, useState } from "react";
import { AnalysisStatusChartProps } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = [
    "#3b82f6", // blue
    "#cbd5e1", // slate
];

export default function AnalysisStatusChart({ data }: AnalysisStatusChartProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const safeData =
        data && data.length > 0 ? data : [
            { name: "Analyzed", value: 0 },
            { name: "Pending", value: 0 },
        ];

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-full">
            <h3 className="text-lg font-semibold mb-4">
                AI Analysis Status
            </h3>

            <div className="h-72">
                {!isMounted ? (
                    <div className="h-full w-full flex items-center justify-center">
                        <div className="h-44 w-44 rounded-full border-8 border-slate-100 animate-pulse" />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={safeData}
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                dataKey="value"
                                nameKey="name"
                                label
                            >
                                {safeData.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                wrapperStyle={{ fontSize: '13px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}