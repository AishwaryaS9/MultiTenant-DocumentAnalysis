"use client";

import { useState } from "react";
import { AnalysisType, DocumentCardProps } from "@/types";
import {
    Activity,
    Brain,
    Calendar,
    Check,
    ChevronDown,
    Copy,
    Download,
    File,
    FileText,
    Loader2,
    Sparkles,
    Tag,
    Trash2,
    User,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import ReactMarkdown from "react-markdown";
import DeleteDocumentModal from "@/components/document/delete-document-modal";
import { analysisTypes } from "@/app/data/data";
import { cn, formatFileSize } from "@/lib/utils";
import { generateAnalysisPDF } from "@/lib/generate-analysis-pdf";

const SUMMARY_PREVIEW_LENGTH = 200;
const VISIBLE_KEYWORDS = 5;

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
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const summary = doc.aiSummary ?? "";
    const isLongSummary = summary.length > SUMMARY_PREVIEW_LENGTH;
    const keywords = doc.aiKeywords ?? [];

    const getAnalysisIcon = (type: AnalysisType) => {
        const Icon = analysisTypes.find((t) => t.value === type)?.icon || Sparkles;
        return <Icon className="h-4 w-4" aria-hidden="true" />;
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(summary);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
        }
    };

    return (
        <article
            className="border-t border-slate-100 bg-slate-50/60 p-4 sm:p-6"
            aria-labelledby={`document-title-${doc.id}`}
        >
            <h3 id={`document-title-${doc.id}`} className="sr-only">
                {doc.name}
            </h3>

            <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
                {/* LEFT CONTENT */}
                <div className="min-w-0 flex-1 space-y-4">
                    {/* META */}
                    <div
                        className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500"
                        aria-label="Document metadata"
                    >
                        <span className="flex items-center gap-1.5">
                            <User className="h-4 w-4 text-slate-400" aria-hidden="true" />
                            <span className="max-w-48 truncate">
                                {doc.user.name || doc.user.email}
                            </span>
                        </span>

                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-slate-400" aria-hidden="true" />
                            {new Date(doc.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>

                        {doc.fileSize ? (
                            <span className="flex items-center gap-1.5">
                                <File className="h-4 w-4 text-slate-400" aria-hidden="true" />
                                {formatFileSize(doc.fileSize)}
                            </span>
                        ) : null}

                        {doc.sentiment && (
                            <span
                                aria-label={`Document sentiment is ${doc.sentiment}`}
                                className={cn(
                                    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                                    doc.sentiment === "positive" && "bg-emerald-50 text-emerald-700",
                                    doc.sentiment === "negative" && "bg-rose-50 text-rose-700",
                                    doc.sentiment === "neutral" && "bg-slate-100 text-slate-700"
                                )}
                            >
                                <Activity className="h-3 w-3" aria-hidden="true" />
                                {doc.sentiment}
                            </span>
                        )}
                    </div>

                    {/* AI ANALYSIS */}
                    {doc.aiSummary ? (
                        <section
                            className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:p-5"
                            aria-label="AI generated document analysis"
                        >
                            <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white"
                                        aria-hidden="true"
                                    >
                                        <Brain className="h-4 w-4" />
                                    </div>
                                    <div className="leading-tight">
                                        <p className="text-sm font-semibold text-slate-900">
                                            AI analysis
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Generated by Gemini
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopy}
                                    aria-label="Copy analysis to clipboard"
                                    className="h-8 gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                >
                                    {copied ? (
                                        <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                                    ) : (
                                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                                    )}
                                    {copied ? "Copied" : "Copy"}
                                </Button>
                            </div>

                            <div
                                className="prose prose-sm max-w-none text-sm leading-relaxed text-slate-600 wrap-break-word"
                                aria-live="polite"
                            >
                                <ReactMarkdown>
                                    {isExpanded || !isLongSummary
                                        ? summary
                                        : `${summary.substring(0, SUMMARY_PREVIEW_LENGTH)}...`}
                                </ReactMarkdown>
                            </div>

                            {isLongSummary && (
                                <button
                                    type="button"
                                    onClick={() => onToggleSummary(doc.id)}
                                    aria-expanded={!!isExpanded}
                                    className="mt-2 inline-flex items-center gap-1 rounded-md text-xs font-semibold text-orange-600 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                                >
                                    {isExpanded ? "Show less" : "Read more"}
                                    <ChevronDown
                                        className={cn(
                                            "h-3.5 w-3.5 transition-transform duration-200 motion-reduce:transition-none",
                                            isExpanded && "rotate-180"
                                        )}
                                        aria-hidden="true"
                                    />
                                </button>
                            )}

                            {keywords.length > 0 && (
                                <div className="mt-4 border-t border-slate-100 pt-3.5">
                                    <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-slate-700">
                                        <Tag className="h-3 w-3 text-slate-500" aria-hidden="true" />
                                        Key topics
                                    </div>

                                    <div className="flex flex-wrap gap-1.5">
                                        {keywords.slice(0, VISIBLE_KEYWORDS).map((keyword, idx) => (
                                            <Badge
                                                key={`${keyword}-${idx}`}
                                                variant="outline"
                                                className="rounded-full border-orange-100 bg-orange-50/60 px-2.5 py-0.5 text-xs font-medium text-orange-700"
                                            >
                                                {keyword}
                                            </Badge>
                                        ))}

                                        {keywords.length > VISIBLE_KEYWORDS && (
                                            <span className="ml-1 self-center text-xs font-medium text-slate-400">
                                                +{keywords.length - VISIBLE_KEYWORDS} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </section>
                    ) : (
                        <section
                            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center"
                            aria-label={
                                doc.status === "failed"
                                    ? "Document analysis failed"
                                    : "Document analysis unavailable"
                            }
                        >
                            <div
                                className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50"
                                aria-hidden="true"
                            >
                                {doc.status === "failed" ? (
                                    <FileText className="h-5 w-5 text-rose-500" />
                                ) : (
                                    <Sparkles
                                        className={cn(
                                            "h-5 w-5 text-orange-500",
                                            isAnalyzing && "animate-pulse"
                                        )}
                                    />
                                )}
                            </div>

                            <h4 className="text-sm font-semibold text-slate-800">
                                {doc.status === "failed"
                                    ? "Analysis failed"
                                    : isAnalyzing
                                        ? "Analyzing your document"
                                        : "No analysis yet"}
                            </h4>

                            <p className="mt-1 max-w-sm text-xs leading-normal text-slate-500">
                                {doc.status === "failed"
                                    ? "We couldn't analyze this file. It may be too short or use unsupported formatting. Try a different analysis type."
                                    : "Choose an analysis type and select Analyze to get a summary, key topics and sentiment."}
                            </p>
                        </section>
                    )}
                </div>

                {/* RIGHT PANEL */}
                <aside
                    className="flex w-full shrink-0 flex-col gap-3 xl:w-60 xl:border-l xl:border-slate-200/80 xl:pl-6"
                    aria-label="Document actions"
                >
                    {doc.fileUrl && (
                        <Button
                            variant="outline"
                            onClick={() => window.open(doc.fileUrl!, "_blank", "noopener,noreferrer")}
                            aria-label={`Download ${doc.name}`}
                            className="h-10 w-full justify-center rounded-xl border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            <Download className="mr-2 h-4 w-4 text-slate-400" aria-hidden="true" />
                            Download file
                        </Button>
                    )}

                    {doc.aiSummary && (
                        <Button
                            variant="outline"
                            onClick={() =>
                                generateAnalysisPDF({
                                    name: doc.name,
                                    createdAt: doc.createdAt,
                                    aiSummary: doc.aiSummary,
                                    aiKeywords: doc.aiKeywords,
                                    sentiment: doc.sentiment,
                                    user: doc.user,
                                })
                            }
                            aria-label={`Export AI insights for ${doc.name}`}
                            className="h-10 w-full justify-center rounded-xl border-orange-200 bg-orange-50/50 text-sm font-semibold text-orange-600 hover:bg-orange-50"
                        >
                            <Sparkles className="mr-2 h-4 w-4 text-orange-500" aria-hidden="true" />
                            Export insights
                        </Button>
                    )}

                    <div className="my-1 hidden h-px w-full bg-slate-200/70 xl:block" aria-hidden="true" />

                    <div className="flex flex-col gap-2">
                        <span className="px-0.5 text-xs font-semibold text-slate-500">
                            {doc.aiSummary ? "Re-analyze with" : "Analyze with"}
                        </span>

                        <Select
                            value={selectedAnalysisType}
                            onValueChange={(value: AnalysisType) => onAnalysisTypeChange(value)}
                            disabled={isAnalyzing}
                        >
                            <SelectTrigger
                                aria-label="Select AI analysis type"
                                className="h-10 w-full rounded-xl border-slate-200 bg-white px-3.5 text-sm font-semibold shadow-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-0"
                            >
                                <SelectValue>
                                    <div className="flex items-center gap-2 truncate">
                                        {getAnalysisIcon(selectedAnalysisType)}
                                        <span className="truncate">
                                            {analysisTypes.find((t) => t.value === selectedAnalysisType)?.label}
                                        </span>
                                    </div>
                                </SelectValue>
                            </SelectTrigger>

                            <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                {analysisTypes.map((type) => (
                                    <SelectItem
                                        key={type.value}
                                        value={type.value}
                                        className="rounded-lg text-sm font-medium"
                                    >
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={() => onAnalyze(doc.id)}
                        disabled={isAnalyzing}
                        aria-label={doc.aiSummary ? `Re-analyze ${doc.name}` : `Analyze ${doc.name}`}
                        className={cn(
                            "h-10 w-full rounded-xl text-sm font-semibold text-white shadow-none transition-colors focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-1",
                            doc.aiSummary
                                ? "bg-slate-900 hover:bg-black"
                                : "bg-orange-500 hover:bg-orange-600"
                        )}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                {doc.aiSummary ? "Re-analyzing..." : "Analyzing..."}
                            </>
                        ) : (
                            <>
                                <Brain className="mr-2 h-4 w-4" aria-hidden="true" />
                                {doc.aiSummary ? "Re-analyze" : "Analyze"}
                            </>
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={() => setDeleteModalOpen(true)}
                        aria-label={`Delete ${doc.name}`}
                        className="h-10 w-full justify-center rounded-xl bg-rose-50 text-sm font-semibold text-rose-600 hover:bg-rose-100 hover:text-rose-700 focus-visible:ring-2 focus-visible:ring-rose-300"
                    >
                        <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                        Delete
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