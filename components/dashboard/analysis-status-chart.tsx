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

    const safeData = data && data.length > 0 ? data : [
        { name: "Analyzed", value: 0 },
        { name: "Pending", value: 0 }
    ];

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-full flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-4">
                AI Analysis Status
            </h3>

            <div className="h-72 w-full relative flex-1 flex items-center justify-center">
                {!isMounted ? (
                    <div className="h-44 w-44 rounded-full border-8 border-slate-100 animate-pulse" />
                ) : (
                    <div className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={safeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60} 
                                    outerRadius={85}
                                    paddingAngle={4}
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {safeData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: '13px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
}