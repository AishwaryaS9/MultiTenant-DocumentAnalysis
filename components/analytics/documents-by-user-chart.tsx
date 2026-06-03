"use client";

import { DocumentsByUserChartProps } from "@/types";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function DocumentsByUserChart({ data }: DocumentsByUserChartProps) {
    const chartId = "documents-by-user-chart";
    const descriptionId = `${chartId}-description`;

    const totalUploads = data.reduce(
        (sum, item) => sum + item.uploads,
        0
    );

    return (
        <section
            role="figure"
            aria-labelledby={chartId}
            aria-describedby={descriptionId}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            <h3
                id={chartId}
                className="mb-4 text-lg font-semibold"
            >
                Documents by User
            </h3>

            <div id={descriptionId} className="sr-only">
                Documents uploaded by users. Total uploads: {totalUploads}.
                {data.map(
                    (item) =>
                        ` ${item.user}: ${item.uploads} uploads.`
                )}
            </div>

            <div className="h-72 sm:h-85">
                <div aria-hidden="true" className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{
                                top: 5,
                                right: 20,
                                left: 10,
                                bottom: 20,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                type="number"
                                label={{
                                    value: "Uploads",
                                    position: "insideBottom",
                                    offset: -15,
                                }}
                            />

                            <YAxis
                                type="category"
                                dataKey="user"
                                width={120}
                            />

                            <Tooltip
                                cursor={{ fill: "#FFF7ED" }}
                            />

                            <Bar
                                dataKey="uploads"
                                radius={[0, 6, 6, 0]}
                                maxBarSize={40}
                                fill="#F97316"
                            />

                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
}