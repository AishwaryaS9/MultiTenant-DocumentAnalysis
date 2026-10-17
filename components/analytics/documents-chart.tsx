"use client";

import { DocumentsChartProps } from "@/types";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface ExtendedDocumentsChartProps extends DocumentsChartProps {
    timeRange?: string;
    onTimeRangeChange?: (range: string) => void;
}

export default function DocumentsChart({ data }: ExtendedDocumentsChartProps) {
    const chartId = "documents-processed-chart";
    const descriptionId = `${chartId}-description`;

    const totalDocuments = data.reduce(
        (sum, item) => sum + item.documents,
        0
    );

    const hasData = data.length > 0 && totalDocuments > 0;

    return (
        <section
            role="figure"
            aria-labelledby={chartId}
            aria-describedby={descriptionId}
            className="p-6 border card-outline"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 id={chartId} className="chart-title">
                        Analysis activity
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Documents Processed This Week
                    </p>
                </div>
            </div>

            <div id={descriptionId} className="sr-only">
                Analysis activity chart. Total documents processed:
                {" "}
                {totalDocuments}.
                {data.map(
                    (item) =>
                        ` ${item.day}: ${item.documents} documents.`
                )}
            </div>

            <div className="h-48 sm:h-56">
                {!hasData ? (
                    <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
                        <div className="px-4 text-center">
                            <p className="text-sm font-medium text-slate-600">
                                No activity recorded yet
                            </p>
                            <p className="chart-subtitle">
                                Start running analyses to populate this chart.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div aria-hidden="true" className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={data}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -20,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient id="colorDocuments" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#F97316" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    strokeDasharray="none"
                                    vertical={false}
                                    stroke="#F1F5F9"
                                />

                                <XAxis
                                    dataKey="day"
                                    tick={{ fontSize: 12, fill: "#94A3B8" }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />

                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fontSize: 12, fill: "#94A3B8" }}
                                    axisLine={false}
                                    tickLine={false}
                                    domain={[0, 'auto']}
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