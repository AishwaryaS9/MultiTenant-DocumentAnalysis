"use client";

import { useId, useMemo, useState } from "react";
import { FileSearch, Search } from "lucide-react";
import { DocumentsListProps, SortKey, StatusFilter } from "@/types";
import DocumentCard from "@/components/document/document-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import DocumentRow, { getDocStatus, getUpdatedAt } from "./document-row";
import { sortOptions, statusOptions } from "@/app/data/data";

const triggerClass =
    "h-11 w-auto min-w-0 gap-2 rounded-xl border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 shadow-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-0";

export default function DocumentList({
    documents,
    isAnalyzing,
    isDeleting,
    selectedAnalysisTypes,
    expandedSummaries,
    onAnalyze,
    onDelete,
    onToggleSummary,
    onAnalysisTypeChange,
}: DocumentsListProps) {
    const baseId = useId();
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [sortBy, setSortBy] = useState<SortKey>("updated");
    const [openId, setOpenId] = useState<string | null>(null);

    const visibleDocs = useMemo(() => {
        const q = query.trim().toLowerCase();

        return documents
            .filter((doc) => {
                const status = getDocStatus(doc, isAnalyzing === doc.id);
                if (statusFilter !== "all" && status !== statusFilter) return false;
                if (!q) return true;
                return (
                    doc.name.toLowerCase().includes(q) ||
                    (doc.user.name ?? "").toLowerCase().includes(q) ||
                    doc.user.email.toLowerCase().includes(q)
                );
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "oldest":
                        return getUpdatedAt(a) - getUpdatedAt(b);
                    case "name":
                        return a.name.localeCompare(b.name);
                    case "size":
                        return (b.fileSize ?? 0) - (a.fileSize ?? 0);
                    default:
                        return getUpdatedAt(b) - getUpdatedAt(a);
                }
            });
    }, [documents, query, statusFilter, sortBy, isAnalyzing]);

    return (
        <section
            aria-label="Organization documents"
            className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white"
        >
            {/* TOOLBAR */}
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="relative w-full sm:max-w-md">
                    <Search
                        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        aria-hidden="true"
                    />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search documents..."
                        aria-label="Search documents"
                        className="h-12 w-full rounded-2xl bg-stone-100 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-200"
                    />
                </div>

                <div className="flex items-center gap-2.5">
                    <Select
                        value={statusFilter}
                        onValueChange={(v) => setStatusFilter(v as StatusFilter)}
                    >
                        <SelectTrigger aria-label="Filter by status" className={triggerClass}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {statusOptions.map((o) => (
                                <SelectItem key={o.value} value={o.value} className="text-xs">
                                    <span className="text-xs">{o.label}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
                        <SelectTrigger aria-label="Sort documents" className={triggerClass}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {sortOptions.map((o) => (
                                <SelectItem key={o.value} value={o.value} className="text-xs">
                                    <span className="text-xs">{o.label}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* ROWS */}
            {visibleDocs.length > 0 ? (
                <ul className="border-t border-slate-100">
                    {visibleDocs.map((doc) => {
                        const isOpen = openId === doc.id;

                        return (
                            <DocumentRow
                                key={doc.id}
                                doc={doc}
                                status={getDocStatus(doc, isAnalyzing === doc.id)}
                                isOpen={isOpen}
                                onToggle={() => setOpenId(isOpen ? null : doc.id)}
                                panelId={`${baseId}-panel-${doc.id}`}
                            >
                                <DocumentCard
                                    document={doc}
                                    isAnalyzing={isAnalyzing === doc.id}
                                    isDeleting={isDeleting === doc.id}
                                    selectedAnalysisType={
                                        selectedAnalysisTypes[doc.id] || "summary"
                                    }
                                    onAnalysisTypeChange={(value) =>
                                        onAnalysisTypeChange(doc.id, value)
                                    }
                                    onAnalyze={onAnalyze}
                                    onDelete={async (id: string) => {
                                        await onDelete(id);
                                        setOpenId(null);
                                    }}
                                    onToggleSummary={onToggleSummary}
                                    expandedSummaries={expandedSummaries}
                                />
                            </DocumentRow>
                        );
                    })}
                </ul>
            ) : (
                <div className="flex flex-col items-center gap-2 border-t border-slate-100 px-6 py-16 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                        <FileSearch className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">No documents found</h3>
                    <p className="max-w-xs text-sm text-slate-500">
                        {documents.length === 0
                            ? "Upload a document to see it here."
                            : "Try a different search term or clear the status filter."}
                    </p>
                </div>
            )}
        </section>
    );
}