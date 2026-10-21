import Link from "next/link";
import { FileText, Loader } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RecentDocumentsProps } from "@/types";
import { timeAgo } from "@/lib/utils";

export default function RecentDocuments({ documents, orgSlug }: RecentDocumentsProps) {
    return (
        <Card
            className="gap-0 overflow-hidden rounded-xl py-0 lg:col-span-2"
            role="region"
            aria-label="Recent documents section"
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-8 sm:py-6">
                <div className="min-w-0">
                    <h3 className="truncate chart-title">
                        Recent documents
                    </h3>
                    <p className="chart-subtitle">
                        Your latest knowledge base activity
                    </p>
                </div>

                <Link
                    href={`/${orgSlug}/documents`}
                    aria-label="View all organization documents"
                    className="shrink-0 text-sm font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40"
                >
                    View all
                </Link>
            </div>

            {/* Rows */}
            <ul className="divide-y divide-slate-100 border-t border-slate-100" role="list">
                {documents.map((doc) => {
                    const isAnalyzed = Boolean(doc.aiSummary);
                    const Icon = isAnalyzed ? FileText : Loader;

                    return (
                        <li key={doc.id}>
                            <div
                                className="group flex items-center gap-4 px-5 py-2 transition-colors hover:bg-slate-50/70 sm:px-8"
                            >
                                {/* Icon tile */}
                                <div
                                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${isAnalyzed
                                        ? "bg-feature-pill text-primary"
                                        : "bg-orange-100 text-orange-600"
                                        }`}
                                >
                                    <Icon className="size-4.5" />
                                </div>

                                {/* Title + subtitle */}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-slate-900 capitalize">
                                        {doc.name}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-slate-500">
                                        {doc.user?.name ?? doc.user?.email ?? "Unknown uploader"}
                                    </p>
                                </div>

                                {/* Status pill + time + chevron */}
                                <div className="flex shrink-0 items-center gap-3">
                                    <span
                                        className={`hidden rounded-lg px-2.5 py-1 text-xs font-medium sm:inline-block ${isAnalyzed
                                            ? "bg-green-100 text-green-600"
                                            : "bg-orange-50 text-orange-700"
                                            }`}
                                    >
                                        {isAnalyzed ? "Analyzed" : "Pending"}
                                    </span>

                                    <span className="hidden whitespace-nowrap text-sm text-slate-400 sm:inline">
                                        {timeAgo(doc.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </Card>
    );
}