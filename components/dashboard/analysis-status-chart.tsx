"use client";

import { useEffect, useState } from "react";
import { AnalysisStatusChartProps } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Sparkles } from "lucide-react";

const SEGMENTS = [
    { name: "Analyzed", fill: "url(#analyzedGradient)", dot: "#ef6439" },
    { name: "Pending", fill: "#fed1b7", dot: "#fed1b7" },
];

const RADIAN = Math.PI / 180;

function SliceLabel({ cx, cy, midAngle, innerRadius, outerRadius, value, index }: any) {
    if (!value) return null;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-sm font-bold"
            fill={index === 0 ? "#ffffff" : "#9a3412"}
        >
            {value}
        </text>
    );
}

function ChartTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0];

    return (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
            <p className="text-xs font-medium text-slate-500">{name}</p>
            <p className="text-xs font-medium text-slate-900">
                {value} {value === 1 ? "document" : "documents"}
            </p>
        </div>
    );
}

export default function AnalysisStatusChart({ data }: AnalysisStatusChartProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const analyzed = data?.find((d) => d.name === "Analyzed")?.value ?? 0;
    const pending = data?.find((d) => d.name === "Pending")?.value ?? 0;
    const total = analyzed + pending;


    const chartData = [
        { name: "Analyzed", value: analyzed },
        { name: "Pending", value: pending },
    ];

    return (
        <div className="flex h-full flex-col p-6 border card-outline">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="chart-title">
                        Documents by status
                    </h3>
                    <p className="chart-subtitle">
                        {total} documents in your workspace
                    </p>
                </div>
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-feature-pill">
                    <Sparkles className="size-4 text-primary" />
                </div>
            </div>

            {/* Pie */}
            <div className="mt-4 h-60">
                {!isMounted ? (
                    <div className="flex h-full items-center justify-center">
                        <div className="size-44 animate-pulse rounded-full bg-slate-100" />
                    </div>
                ) : total === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3">
                        <div className="size-44 rounded-full bg-slate-100" />
                        <p className="text-sm text-slate-500">No documents yet</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <defs>
                                <linearGradient
                                    id="analyzedGradient"
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="1"
                                >
                                    <stop offset="0%" stopColor="#ef6439" />
                                    <stop offset="100%" stopColor="#fea36e" />
                                </linearGradient>
                            </defs>

                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                                nameKey="name"
                                stroke="#ffffff"
                                strokeWidth={3}
                                labelLine={false}
                                label={<SliceLabel />}
                                animationDuration={800}
                            >
                                {chartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={SEGMENTS[index].fill} />
                                ))}
                            </Pie>

                            <Tooltip content={<ChartTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Legend (counts only) */}
            <ul className="mt-4 grid grid-cols-2 gap-3">
                {chartData.map((item, index) => (
                    <li
                        key={item.name}
                        className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5"
                    >
                        <span className="flex items-center gap-2 text-xs font-medium text-slate-700">
                            <span
                                className="size-2.5 rounded-full"
                                style={{ backgroundColor: SEGMENTS[index].dot }}
                            />
                            {item.name}
                        </span>
                        <span className="text-xs font-medium text-slate-900">
                            {item.value}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}