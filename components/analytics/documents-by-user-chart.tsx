"use client";

import { getTicks, getUserInitials } from "@/lib/utils";
import { DocumentsByUserChartProps } from "@/types";

export default function DocumentsByUserChart({ data }: DocumentsByUserChartProps) {
    const chartId = "documents-by-user-chart";
    const descriptionId = `${chartId}-description`;

    const totalUploads = data.reduce((sum, item) => sum + item.uploads, 0);
    const hasData = data.length > 0 && totalUploads > 0;
    const maxUploads = Math.max(...data.map((item) => item.uploads), 1);
    const ticks = getTicks(maxUploads);

    return (
        <section
            role="figure"
            aria-labelledby={chartId}
            aria-describedby={descriptionId}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7"
        >
            {/* Header */}
            <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                    <h3
                        id={chartId}
                        className="chart-title"
                    >
                        Documents by user
                    </h3>
                    <p className="chart-subtitle">
                        Documents uploaded in the last 30 days
                    </p>
                </div>

                <span className="shrink-0 rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary/80">
                    {totalUploads} total
                </span>
            </div>

            <div id={descriptionId} className="sr-only">
                Documents uploaded by users. Total uploads: {totalUploads}.
                {data.map((item) => ` ${item.user}: ${item.uploads} uploads.`)}
            </div>

            {!hasData ? (
                <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
                    <div className="px-4 text-center">
                        <p className="text-sm font-medium text-slate-600">
                            No user activity available
                        </p>
                        <p className="chart-subtitle">
                            Upload documents to see contributor statistics.
                        </p>
                    </div>
                </div>
            ) : (
                <div aria-hidden="true">
                    <ul className="space-y-4">
                        {data.map((item, index) => {
                            const isTop = index === 0;
                            const width = (item.uploads / maxUploads) * 100;
                            const isOthers = /^other/i.test(item.user);
                            const members = (item as { members?: number }).members;
                            const avatarLabel =
                                isOthers && members
                                    ? `+${members}`
                                    : getUserInitials(item.user);
                            return (
                                <li
                                    key={item.user}
                                    className="grid grid-cols-[auto_1fr_2rem] items-center gap-x-4 sm:grid-cols-[11rem_1fr_2rem]"
                                >
                                    {/* Avatar + name */}
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isTop
                                                ? "bg-neutral-900 text-white"
                                                : "bg-orange-50 text-primary"
                                                }`}
                                        >
                                            {avatarLabel}
                                        </span>
                                        <span className="hidden truncate text-xs font-normal text-slate-700 sm:block">
                                            {item.user}
                                        </span>
                                    </div>

                                    {/* Bar */}
                                    <div className="h-9 overflow-hidden rounded-lg bg-[#F5F1EC]">
                                        <div
                                            className="flex h-full items-center justify-end rounded-lg bg-primary pr-3"
                                            style={{ width: `${width}%` }}
                                        >
                                            <span className="text-xs font-bold text-white">
                                                {item.uploads}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Value */}
                                    <span className="text-right text-xs font-semibold text-slate-700">
                                        {item.uploads}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Axis */}
                    <div className="mt-6 grid grid-cols-[auto_1fr_2rem] gap-x-4 sm:grid-cols-[11rem_1fr_2rem]">
                        <span className="size-11 sm:hidden" />
                        <span className="hidden sm:block" />
                        <div className="relative h-6 border-t border-slate-200">
                            {ticks.map((tick) => {
                                const left = (tick / maxUploads) * 100;
                                return (
                                    <span
                                        key={tick}
                                        className="absolute top-2 text-[10px] font-medium text-slate-400"
                                        style={{
                                            left: `${left}%`,
                                            transform:
                                                tick === 0
                                                    ? "none"
                                                    : "translateX(-50%)",
                                        }}
                                    >
                                        {tick}
                                    </span>
                                );
                            })}
                        </div>
                        <span />
                    </div>
                </div>
            )}
        </section>
    );
}