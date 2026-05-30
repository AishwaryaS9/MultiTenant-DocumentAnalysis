"use client";

import { useState } from "react";
import { AnalysisType, DocumentCardProps } from "@/types";
import { Brain, Calendar, Download, File, FileText, Loader2, Sparkles, Trash2, User, Maximize2, Activity, Tag } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import ReactMarkdown from "react-markdown";
import DeleteDocumentModal from "@/components/document/delete-document-modal";
import { analysisTypes, formatFileSize } from "@/app/data/data";
import { cn } from "@/lib/utils";
import { generateAnalysisPDF } from "@/lib/generate-analysis-pdf";

export default function DocumentCard({
    document: doc,
    isAnalyzing,
    isDeleting,
    selectedAnalysisType,
    onAnalysisTypeChange,
    onAnalyze,
    onDelete,
    onToggleSummary,
    expandedSummaries,
}: DocumentCardProps) {
    const isExpanded = expandedSummaries[doc.id];

    const [deleteModalOpen, setDeleteModalOpen] =
        useState(false);

    const getAnalysisIcon = (
        type: AnalysisType
    ) => {
        const analysisType = analysisTypes.find(
            (t) => t.value === type
        );

        const Icon =
            analysisType?.icon || Sparkles;

        return (
            <Icon
                className="h-4 w-4"
                aria-hidden="true"
            />
        );
    };

    return (
        <article
            className="group relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-linear-to-b from-white to-slate-50/50 p-4 sm:p-5
             lg:p-6 backdrop-blur-xs transition-all duration-300 hover:border-slate-300 hover:bg-white"
            aria-labelledby={`document-title-${doc.id}`}
            aria-describedby={`document-meta-${doc.id}`}>
            {/* Decorative Glow */}
            <div className="absolute -right-24 -top-24 -z-10 h-48 w-48 rounded-full blur-2xl transition-all duration-700 ease-out group-hover:scale-125 group-hover:opacity-100"
                aria-hidden="true"
            />

            <div className="flex flex-col gap-5 lg:gap-6 xl:flex-row xl:items-start">

                {/* LEFT CONTENT */}
                <div className="flex-1 min-w-0 space-y-5">

                    {/* HEADER */}
                    <div className="flex items-start gap-3 sm:gap-4">

                        {/* FILE ICON */}
                        <div
                            className="relative flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl text-slate-900 shadow-sm transition-all duration-500"
                            aria-hidden="true">
                            <FileText className="h-6 w-6" />

                            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border
                             border-slate-100 bg-white text-[10px] font-black text-slate-900 shadow-3xs">
                                AI
                            </span>
                        </div>

                        {/* TITLE + META */}
                        <div className="min-w-0 flex-1 space-y-1.5">

                            {/* TITLE */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">

                                <h3
                                    id={`document-title-${doc.id}`}
                                    className="truncate text-base sm:text-lg font-bold tracking-tight text-slate-900"
                                >
                                    {doc.name}
                                </h3>

                                {doc.sentiment && (
                                    <span
                                        aria-label={`Document sentiment is ${doc.sentiment}`}
                                        className={cn(
                                            "inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
                                            doc.sentiment ===
                                            "positive" &&
                                            "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",

                                            doc.sentiment ===
                                            "negative" &&
                                            "border-rose-500/20 bg-rose-500/10 text-rose-700",

                                            doc.sentiment ===
                                            "neutral" &&
                                            "border-slate-500/20 bg-slate-500/10 text-slate-700"
                                        )}
                                    >
                                        <Activity
                                            className="h-3 w-3"
                                            aria-hidden="true"
                                        />

                                        {doc.sentiment}
                                    </span>
                                )}
                            </div>

                            {/* META */}
                            <div
                                id={`document-meta-${doc.id}`}
                                className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 text-xs sm:text-sm font-medium text-slate-500"
                                aria-label="Document metadata"
                            >
                                <div className="flex items-center gap-1.5">
                                    <User
                                        className="h-4 w-4 shrink-0 text-slate-400"
                                        aria-hidden="true"
                                    />

                                    <span className="truncate max-w-30">
                                        {doc.user.name ||
                                            doc.user.email}
                                    </span>
                                </div>

                                <span className="text-slate-300">
                                    •
                                </span>

                                <div className="flex items-center gap-1.5">
                                    <Calendar
                                        className="h-4 w-4 shrink-0 text-slate-400"
                                        aria-hidden="true"
                                    />

                                    <span>
                                        {new Date(
                                            doc.createdAt
                                        ).toLocaleDateString()}
                                    </span>
                                </div>

                                {doc.fileSize && (
                                    <>
                                        <span className="text-slate-300">
                                            •
                                        </span>

                                        <div className="flex items-center gap-1.5">
                                            <File
                                                className="h-4 w-4 shrink-0 text-slate-400"
                                                aria-hidden="true"
                                            />

                                            <span>
                                                {formatFileSize(
                                                    doc.fileSize
                                                )}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* AI ANALYSIS */}
                    {doc.aiSummary ? (
                        <section
                            className="rounded-xl border border-slate-200/70 bg-white p-4 sm:p-5 shadow-xs"
                            aria-label="AI generated document analysis"
                        >

                            {/* ANALYSIS HEADER */}
                            <div className="mb-3.5 flex flex-col gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">

                                <div className="flex flex-wrap items-center gap-2.5">

                                    <div
                                        className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500 text-white shadow-2xs"
                                        aria-hidden="true"
                                    >
                                        <Brain className="h-4 w-4" />
                                    </div>

                                    <div>
                                        <span className="text-sm font-bold tracking-tight text-slate-900">
                                            AI Analysis
                                        </span>

                                        <div className="text-sm text-slate-500">
                                            Generated insights
                                        </div>
                                    </div>

                                    <div className="rounded-full bg-black px-3 py-1 text-xs font-medium tracking-wide text-white">
                                        Gemini AI
                                    </div>
                                </div>

                                {doc.aiSummary.length >
                                    200 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                onToggleSummary(
                                                    doc.id
                                                )
                                            }
                                            aria-label={
                                                isExpanded
                                                    ? "Collapse AI analysis summary"
                                                    : "Expand AI analysis summary"
                                            }
                                            className="h-8 sm:h-7 gap-1.5 rounded-md px-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-300"
                                        >
                                            <span>
                                                {isExpanded
                                                    ? "Show less"
                                                    : "Read more"}
                                            </span>

                                            <Maximize2
                                                className={cn(
                                                    "h-3 w-3 transition-transform duration-200",
                                                    isExpanded &&
                                                    "rotate-180"
                                                )}
                                                aria-hidden="true"
                                            />
                                        </Button>
                                    )}
                            </div>

                            {/* SUMMARY */}
                            <div className="prose prose-sm max-w-none wrap-break-word text-sm leading-relaxed text-slate-600 transition-all duration-200" aria-live="polite">
                                <ReactMarkdown>
                                    {isExpanded
                                        ? doc.aiSummary
                                        : doc.aiSummary
                                            .length > 200
                                            ? `${doc.aiSummary.substring(
                                                0,
                                                200
                                            )}...`
                                            : doc.aiSummary}
                                </ReactMarkdown>
                            </div>

                            {/* KEYWORDS */}
                            {doc.aiKeywords.length >
                                0 && (
                                    <div
                                        className="mt-4 border-t border-slate-100 pt-3.5"
                                        aria-label="Document keywords"
                                    >
                                        <div className="mb-3 flex items-center gap-2">
                                            <Tag
                                                className="h-3 w-3 text-slate-500"
                                                aria-hidden="true"
                                            />

                                            <span className="text-[12px] font-semibold text-slate-700">
                                                Key Topics
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5">
                                            {doc.aiKeywords.slice(0, 5).map((keyword, idx) => (
                                                <Badge key={idx}
                                                    variant="outline"
                                                    className="rounded-md border-slate-200/60 bg-slate-50/50 px-2 py-0.5 text-xs font-semibold text-slate-600">
                                                    {keyword}
                                                </Badge>
                                            )
                                            )}

                                            {doc.aiKeywords.length > 5 && (
                                                <span className="ml-1 self-center text-xs font-semibold text-slate-400">
                                                    +
                                                    {doc.aiKeywords.length - 5}{" "}
                                                    topics
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                        </section>
                    ) : (
                        <section
                            className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/30 py-6 sm:py-8 px-4 text-center"
                            aria-label={
                                doc.status ===
                                    "failed"
                                    ? "Document analysis failed"
                                    : "Document analysis unavailable"
                            }
                        >
                            <div
                                className="relative mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-100 bg-white shadow-3xs"
                                aria-hidden="true"
                            >
                                {doc.status === "failed" ? (
                                    <FileText className="h-5 w-5 text-rose-500" />
                                ) : (
                                    <Sparkles className="h-5 w-5 animate-pulse text-amber-500" />
                                )}
                            </div>

                            <h4 className="text-sm font-bold text-slate-800">
                                {doc.status === "failed" ? "Analysis Failed" : "No Analysis Yet"}
                            </h4>

                            <p className="mt-1 max-w-sm text-xs leading-normal text-slate-400">
                                {doc.status ===
                                    "failed"
                                    ? "Could not analyze for summary. The file might be too small or contain unsupported formatting."
                                    : "Unlock key insights, summaries, and sentiment analysis by running the AI processor."}
                            </p>
                        </section>
                    )}
                </div>

                {/* RIGHT PANEL */}
                <aside className="flex w-full shrink-0 flex-col items-stretch justify-start gap-3 sm:gap-3.5 xl:w-56 xl:border-l xl:border-slate-200/80 xl:pl-6"
                    aria-label="Document actions">

                    {/* DOWNLOAD */}
                    {doc.fileUrl && (
                        <Button
                            variant="outline"
                            size="default"
                            onClick={() => window.open(doc.fileUrl, "_blank")}
                            aria-label={`Download ${doc.name}`}
                            className="h-10 sm:h-9 w-full justify-center rounded-xl border-slate-200/80 px-4 text-sm font-semibold text-slate-700
                             transition-all hover:bg-slate-50 active:scale-[0.99] focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-300"
                        >
                            <Download
                                className="mr-2.5 h-4 w-4 shrink-0 text-slate-400"
                                aria-hidden="true"
                            />

                            <span>
                                Download File
                            </span>
                        </Button>
                    )}

                    {/* EXPORT */}
                    {doc.aiSummary && (
                        <Button
                            variant="outline"
                            size="default"
                            onClick={() =>
                                generateAnalysisPDF(
                                    {
                                        name: doc.name,
                                        createdAt:
                                            doc.createdAt,
                                        aiSummary:
                                            doc.aiSummary,
                                        aiKeywords:
                                            doc.aiKeywords,
                                        sentiment:
                                            doc.sentiment,
                                        user: doc.user,
                                    }
                                )
                            }
                            aria-label={`Export AI insights for ${doc.name}`}
                            className="h-10 sm:h-9 w-full justify-center rounded-xl border-orange-200/60 bg-orange-50/20 px-4 text-sm font-semibold text-orange-700 transition-all hover:bg-orange-50 active:scale-[0.99] focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-orange-300"
                        >
                            <Sparkles
                                className="mr-2.5 h-4 w-4 shrink-0 text-orange-500"
                                aria-hidden="true"
                            />

                            <span>
                                Export Insights
                            </span>
                        </Button>
                    )}

                    <div
                        className="my-1 hidden h-px w-full bg-slate-100 xl:block"
                        aria-hidden="true"
                    />

                    {/* SELECT */}
                    <div className="flex w-full flex-col gap-2">
                        <span className="px-0.5 text-[11px] font-black uppercase tracking-wider text-slate-400">
                            {doc.aiSummary
                                ? "Re-analyze with"
                                : "Analyze with"}
                        </span>

                        <Select
                            value={selectedAnalysisType}
                            onValueChange={(value: AnalysisType) => onAnalysisTypeChange(value)}>
                            <SelectTrigger
                                aria-label="Select AI analysis type"
                                className="h-10 sm:h-9 w-full rounded-lg border-slate-200/80 px-4 text-sm font-semibold shadow-xs transition-all
                                 active:scale-[0.99] focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-300">
                                <SelectValue>
                                    <div className="flex items-center gap-2 truncate">
                                        {getAnalysisIcon(
                                            selectedAnalysisType
                                        )}

                                        <span className="truncate">
                                            {analysisTypes.find((type) => type.value === selectedAnalysisType)?.label}
                                        </span>
                                    </div>
                                </SelectValue>
                            </SelectTrigger>

                            <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                {analysisTypes.map((type) => (
                                    <SelectItem
                                        key={type.value}
                                        value={type.value}
                                        className="rounded-lg text-sm font-medium">
                                        <span>
                                            {type.label}
                                        </span>
                                    </SelectItem>
                                )
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* ANALYZE */}
                    <Button onClick={() => onAnalyze(doc.id)}
                        disabled={isAnalyzing}
                        aria-label={
                            doc.aiSummary
                                ? `Re-analyze ${doc.name}`
                                : `Analyze ${doc.name}`
                        }
                        className={cn(
                            "flex h-10 sm:h-9 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold transition-all shadow-xs active:scale-[0.99] cursor-pointer focus-visible:ring-1 focus-visible:ring-offset-1",
                            doc.aiSummary
                                ? "bg-slate-900 text-white hover:bg-black"
                                : "bg-orange-400 text-white hover:bg-orange-600"
                        )}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" aria-hidden="true" />

                                <span>
                                    {doc.aiSummary ? "Re-analyzing..." : "Analyzing..."}
                                </span>
                            </>
                        ) : (
                            <>
                                <Brain className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />

                                <span>
                                    {doc.aiSummary ? "Re-analyze" : "Analyze"}
                                </span>
                            </>
                        )}
                    </Button>

                    {/* DELETE */}
                    <Button
                        variant="ghost"
                        size="default"
                        onClick={() => setDeleteModalOpen(true)}
                        aria-label={`Delete ${doc.name}`}
                        className="h-10 sm:h-9 w-full justify-center rounded-xl bg-rose-50 px-4 text-sm font-semibold text-rose-500
                         transition-colors hover:bg-rose-100 hover:text-rose-600 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-rose-300">
                        <Trash2
                            className="mr-2.5 h-4 w-4 shrink-0"
                            aria-hidden="true"
                        />

                        <span>Delete</span>
                    </Button>
                </aside>
            </div>

            <DeleteDocumentModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                documentName={doc.name}
                isDeleting={isDeleting}
                onConfirm={async () => {
                    await onDelete(doc.id);
                    setDeleteModalOpen(false);
                }}
            />
        </article>
    );
}