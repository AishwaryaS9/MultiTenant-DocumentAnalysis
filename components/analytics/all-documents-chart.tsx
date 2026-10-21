"use client";

import { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { DocumentsChartData, DocumentsRange } from "@/lib/analytics";
import { RANGE_OPTIONS } from "@/app/data/data";

interface DocumentsChartProps {
    data: DocumentsChartData;
    defaultRange?: DocumentsRange;
}

export default function AllDocumentsChart({
    data,
    defaultRange = "week",
}: DocumentsChartProps) {
    const [range, setRange] = useState<DocumentsRange>(defaultRange);

    const chartId = "documents-processed-chart";
    const descriptionId = `${chartId}-description`;
    const selectId = `${chartId}-range`;

    const current = RANGE_OPTIONS.find((o) => o.value === range)!;
    const chartData = data[range];

    const totalDocuments = chartData.reduce(
        (sum, item) => sum + (item.documents ?? 0),
        0
    );
    const hasData = totalDocuments > 0;

    return (
        <section
            role="figure"
            aria-labelledby={chartId}
            aria-describedby={descriptionId}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs"
        >
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h3 id={chartId} className="chart-title">
                        Analysis activity
                    </h3>
                    <p className="chart-subtitle">
                        {current.subtitle}
                        <span className="ml-1 font-medium text-slate-700">
                            · {totalDocuments.toLocaleString()} total
                        </span>
                    </p>
                </div>

                <div>
                    <label htmlFor={selectId} className="sr-only">
                        Select time range
                    </label>
                    <select
                        id={selectId}
                        value={range}
                        onChange={(e) => setRange(e.target.value as DocumentsRange)}
                        className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-base text-slate-700 shadow-xs
                         hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-1"
                    >
                        {RANGE_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div id={descriptionId} className="sr-only">
                {current.label} document activity. Total documents processed:{" "}
                {totalDocuments}.
                {chartData
                    .filter((item) => item.documents !== null)
                    .map((item) => ` ${item.label}: ${item.documents} documents.`)}
            </div>

            <div className="h-64 sm:h-72">
                {!hasData ? (
                    <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
                        <div className="px-4 text-center">
                            <p className="text-sm font-medium text-slate-600">
                                No activity {current.label.toLowerCase()}
                            </p>
                            <p className="chart-subtitle">
                                Run analyses to populate this chart.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div aria-hidden="true" className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorDocuments" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid vertical={false} stroke="#F1F5F9" />

                                <XAxis
                                    dataKey="label"
                                    tick={{ fontSize: 10, fill: "#94A3B8" }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                    interval={range === "month" ? 2 : 0}
                                />

                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fontSize: 10, fill: "#94A3B8" }}
                                    axisLine={false}
                                    tickLine={false}
                                    domain={[0, "auto"]}
                                />

                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#FFFFFF",
                                        borderColor: "#E2E8F0",
                                        borderRadius: "0.75rem",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    }}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="documents"
                                    stroke="#F97316"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#colorDocuments)"
                                    activeDot={{
                                        r: 6,
                                        fill: "#FFFFFF",
                                        stroke: "#F97316",
                                        strokeWidth: 3,
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </section>
    );
}