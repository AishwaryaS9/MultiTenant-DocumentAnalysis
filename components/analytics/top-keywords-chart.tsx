"use client";

import { TopKeywordsChartProps } from "@/types";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function TopKeywordsChart({ data }: TopKeywordsChartProps) {
    const chartId = "top-keywords-chart";
    const descriptionId = `${chartId}-description`;

    const totalKeywordUses = data.reduce(
        (sum, item) => sum + item.count,
        0
    );

    return (
        <section
            role="figure"
            aria-labelledby={chartId}
            aria-describedby={descriptionId}
            className="w-full max-w-2xl rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6"
        >
            <div className="mb-6">
                <h3
                    id={chartId}
                    className="text-lg font-semibold text-slate-900"
                >
                    Top Keywords
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                    Most frequent search terms and volume.
                </p>
            </div>

            <div id={descriptionId} className="sr-only">
                Top keywords chart. Total keyword uses:
                {" "}
                {totalKeywordUses}.
                {data.map(
                    (item) =>
                        ` ${item.keyword}: ${item.count} uses.`
                )}
            </div>

            <div className="h-87.5 w-full text-sm">
                {data.length === 0 ? (
                    <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
                        <div className="text-center">
                            <p className="text-sm font-medium text-slate-600">
                                No keywords available
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Upload and analyze documents to generate keyword insights.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div aria-hidden="true" className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                layout="vertical"
                                margin={{
                                    top: 5,
                                    right: 20,
                                    left: 24,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    horizontal
                                    vertical={false}
                                    stroke="#f1f5f9"
                                />

                                <XAxis
                                    type="number"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#94a3b8", fontSize: 13 }}
                                />

                                <YAxis
                                    dataKey="keyword"
                                    type="category"
                                    width={160}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: "#64748b",
                                        fontWeight: 500,
                                        fontSize: 13,
                                    }}
                                />

                                <Tooltip
                                    cursor={{ fill: "#f8fafc" }}
                                    content={({ active, payload }) => {
                                        if (
                                            active &&
                                            payload &&
                                            payload.length
                                        ) {
                                            return (
                                                <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-xl">
                                                    <p className="mb-0.5 text-slate-400">
                                                        {payload[0].payload.keyword}
                                                    </p>

                                                    <p className="text-sm font-semibold">
                                                        {payload[0].value}{" "}
                                                        <span className="text-xs font-normal text-slate-400">
                                                            uses
                                                        </span>
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />

                                <Bar
                                    dataKey="count"
                                    fill="#059669"
                                    background={{
                                        fill: "#f8fafc",
                                        radius: 6,
                                    }}
                                    radius={[0, 6, 6, 0]}
                                    maxBarSize={24}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </section>
    );
}