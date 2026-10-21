"use client";

import { ChevronRight, FileText, MoreHorizontal } from "lucide-react";
import { DocStatus, DocumentItem, DocumentRowProps } from "@/types";
import { cn, fileExtension, formatDate, formatFileSize } from "@/lib/utils";

export function getDocStatus(doc: DocumentItem, isAnalyzing: boolean): DocStatus {
    const raw = String(doc.status ?? "").toLowerCase();
    if (isAnalyzing || raw === "processing") return "processing";
    if (raw === "failed") return "failed";
    if (doc.aiSummary) return "analyzed";
    return "pending";
}

export const statusStyles: Record<DocStatus, { label: string; className: string }> = {
    analyzed: { label: "Analyzed", className: "bg-emerald-50 text-emerald-700" },
    processing: { label: "Processing", className: "bg-orange-50 text-orange-600" },
    pending: { label: "Pending", className: "bg-slate-100 text-slate-600" },
    failed: { label: "Failed", className: "bg-rose-50 text-rose-600" },
};

export function getUpdatedAt(doc: DocumentItem): number {
    const value = (doc as { updatedAt?: string | Date }).updatedAt ?? doc.createdAt;
    return new Date(value).getTime();
}

export default function DocumentRow({ doc, status, isOpen, onToggle, panelId, children }: DocumentRowProps) {
    const badge = statusStyles[status];
    const owner = doc.user.name || doc.user.email;

    return (
        <li className="border-b border-slate-100 last:border-b-0">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={cn(
                    "group grid w-full grid-cols-[1fr_auto] items-center gap-x-4 px-4 py-4 text-left transition-colors sm:px-6",
                    "md:grid-cols-[minmax(0,1fr)_160px_130px_120px_24px] md:gap-x-6",
                    "hover:bg-orange-50/30 focus-visible:bg-orange-50/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-orange-300",
                    isOpen && "bg-orange-50/30"
                )}
            >
                {/* FILE */}
                <span className="flex min-w-0 items-center gap-4">
                    <span
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 transition-colors group-hover:bg-orange-100"
                        aria-hidden="true"
                    >
                        <FileText className="h-5 w-5" />
                    </span>

                    <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-slate-900 capitalize">
                            {doc.name}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-slate-500">
                            {fileExtension(doc.name)}
                            {doc.fileSize ? ` · ${formatFileSize(doc.fileSize)}` : ""}
                            <span className="md:hidden">
                                {` · ${owner} · ${formatDate(doc.createdAt)}`}
                            </span>
                        </span>
                    </span>
                </span>

                {/* OWNER */}
                <span className="hidden truncate text-sm text-slate-600 md:block">{owner}</span>

                {/* DATE */}
                <span className="hidden text-sm text-slate-500 md:block">
                    {formatDate(doc.createdAt)}
                </span>

                {/* STATUS */}
                <span className="flex items-center justify-self-end md:justify-self-start">
                    <span
                        className={cn(
                            "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide",
                            badge.className
                        )}
                    >
                        {badge.label}
                    </span>
                </span>

                {/* CHEVRON */}
                <span className="hidden justify-self-end text-slate-400 md:block" aria-hidden="true">
                    {status === "processing" && !isOpen ? (
                        <MoreHorizontal className="h-4 w-4" />
                    ) : (
                        <ChevronRight
                            className={cn(
                                "h-4 w-4 transition-transform duration-200 motion-reduce:transition-none",
                                isOpen && "rotate-90 text-orange-500"
                            )}
                        />
                    )}
                </span>
            </button>

            <div
                id={panelId}
                role="region"
                aria-label={`${doc.name} details`}
                className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
            >
                <div
                    className={cn(
                        "overflow-hidden",
                        isOpen ? "visible" : "invisible transition-[visibility] delay-300"
                    )}
                >
                    {children}
                </div>
            </div>
        </li>
    );
}