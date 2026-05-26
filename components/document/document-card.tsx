"use client";
import { useState } from "react";
import { AnalysisType, DocumentCardProps } from "@/types";
import {
    Brain,
    Calendar,
    Download,
    File,
    FileText,
    Loader2,
    Sparkles,
    Trash2,
    User,
    Maximize2,
    Activity,
    Tag
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import ReactMarkdown from "react-markdown";
import DeleteDocumentModal from "@/components/document/delete-document-modal";
import { analysisTypes, formatFileSize } from "@/app/data/data";
import { jsPDF } from "jspdf";
import { cn } from "@/lib/utils";

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

    const getAnalysisIcon = (type: AnalysisType) => {
        const analysisType = analysisTypes.find((t) => t.value === type);
        const Icon = analysisType?.icon || Sparkles;
        return <Icon className="h-4 w-4" />;
    };

    // --- PDF GENERATION PIPELINE ---
    const handleDownloadPDF = () => {
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 20;
        const maxContentWidth = pageWidth - (margin * 2);
        let currentY = 25;

        pdf.setFillColor(249, 115, 22);
        pdf.rect(0, 0, pageWidth, 4, "F");

        pdf.setFont("Helvetica", "bold");
        pdf.setFontSize(20);
        pdf.setTextColor(26, 26, 26);
        const titleLines = pdf.splitTextToSize(`AI Analysis Report: ${doc.name}`, maxContentWidth);
        pdf.text(titleLines, margin, currentY);
        currentY += (titleLines.length * 7) + 4;

        pdf.setFont("Helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(100, 116, 139);
        pdf.text(`Analyzed By: Gemini AI`, margin, currentY);
        pdf.text(`Date: ${new Date(doc.createdAt).toLocaleDateString()}`, pageWidth - margin - 40, currentY);
        currentY += 6;

        pdf.text(`Uploaded By: ${doc.user.name || doc.user.email}`, margin, currentY);
        if (doc.sentiment) {
            pdf.text(`Overall Sentiment: ${doc.sentiment.toUpperCase()}`, pageWidth - margin - 40, currentY);
        }
        currentY += 12;

        pdf.setDrawColor(226, 232, 240);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 12;

        pdf.setFont("Helvetica", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(26, 26, 26);
        pdf.text("Executive Insights Summary", margin, currentY);
        currentY += 8;

        pdf.setFont("Helvetica", "normal");
        pdf.setFontSize(11);
        pdf.setTextColor(51, 65, 85);

        const cleanSummaryText = doc.aiSummary ? doc.aiSummary.replace(/[*#`_-]/g, "") : "No summary available.";
        const summaryLines = pdf.splitTextToSize(cleanSummaryText, maxContentWidth);

        summaryLines.forEach((line: string) => {
            if (currentY > 275) { pdf.addPage(); currentY = 25; }
            pdf.text(line, margin, currentY);
            currentY += 6.5;
        });

        if (doc.aiKeywords && doc.aiKeywords.length > 0) {
            currentY += 10;
            if (currentY > 260) { pdf.addPage(); currentY = 25; }

            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(13);
            pdf.setTextColor(26, 26, 26);
            pdf.text("Key Topics Identified", margin, currentY);
            currentY += 8;

            pdf.setFont("Helvetica", "normal");
            pdf.setFontSize(10);
            pdf.setTextColor(71, 85, 105);

            const keywordsString = doc.aiKeywords.join(", ");
            const keywordsLines = pdf.splitTextToSize(keywordsString, maxContentWidth);

            keywordsLines.forEach((line: string) => {
                if (currentY > 275) { pdf.addPage(); currentY = 25; }
                pdf.text(line, margin, currentY);
                currentY += 6;
            });
        }

        pdf.save(`AI_Analysis_${doc.name.replace(/\.[^/.]+$/, "")}.pdf`);
    };

    return (
        <div className="group relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-linear-to-b from-white to-slate-50/50
         p-6 backdrop-blur-xs transition-all duration-300 hover:border-slate-300 hover:bg-white">
            {/* Context Ambient Aura */}
            <div className="absolute -right-24 -top-24 -z-10 h-48 w-48 rounded-full blur-2xl transition-all duration-700 ease-out group-hover:scale-125 group-hover:opacity-100" />

            {/* Changed from xl:items-stretch to xl:items-start to decouple right column height from left column layout shifts */}
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start">

                {/* LEFT CORE COLUMN */}
                <div className="flex-1 space-y-5 min-w-0">

                    {/* Document Header Line Info */}
                    <div className="flex items-start gap-4">
                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-orange-500 shadow-sm transition-all duration-500 ">
                            <FileText className="h-6 w-6" />
                            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black border border-slate-100 text-slate-900 shadow-3xs">
                                AI
                            </span>
                        </div>

                        <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                                <h3 className="truncate text-lg font-bold tracking-tight text-slate-900 mix-blend-maximize">
                                    {doc.name}
                                </h3>
                                {doc.sentiment && (
                                    <span className={cn(
                                        "inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-semibold border uppercase tracking-wider",
                                        doc.sentiment === "positive" && "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 ",
                                        doc.sentiment === "negative" && "bg-rose-500/10 text-rose-700 border-rose-500/20 ",
                                        doc.sentiment === "neutral" && "bg-slate-500/10 text-slate-700 border-slate-500/20 "
                                    )}>
                                        <Activity className="h-3 w-3" />
                                        {doc.sentiment}
                                    </span>
                                )}
                            </div>

                            {/* Minimal Metadata Bar */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-slate-500 ">
                                <div className="flex items-center gap-1.5">
                                    <User className="h-4 w-4 shrink-0 text-slate-400" />
                                    <span className="truncate max-w-30">{doc.user.name || doc.user.email}</span>
                                </div>
                                <span className="text-slate-300 ">•</span>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
                                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                                </div>
                                {doc.fileSize && (
                                    <>
                                        <span className="text-slate-300 ">•</span>
                                        <div className="flex items-center gap-1.5">
                                            <File className="h-4 w-4 shrink-0 text-slate-400" />
                                            <span>{formatFileSize(doc.fileSize)}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* AI INTERACTION PANEL */}
                    {doc.aiSummary ? (
                        <div className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-xs">
                            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 mb-3.5">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500 text-white shadow-2xs">
                                        <Brain className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold tracking-tight text-slate-900">
                                            AI Analysis
                                        </span>
                                        <div className="text-sm text-slate-500">Generated insights</div>
                                    </div>

                                    <div className="px-3 py-1 rounded-full bg-black text-white text-xs font-medium tracking-wide">
                                        Gemini AI
                                    </div>
                                </div>

                                {doc.aiSummary.length > 200 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onToggleSummary(doc.id)}
                                        className="h-7 gap-1.5 rounded-md px-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    >
                                        <span>{isExpanded ? "Show less" : "Read more"}</span>
                                        <Maximize2 className={cn("h-3 w-3 transition-transform duration-200", isExpanded && "rotate-180")} />
                                    </Button>
                                )}
                            </div>

                            {/* Standard Block Wrapper with Native Transition Support */}
                            <div className="prose prose-sm max-w-none text-slate-600 text-sm leading-relaxed transition-all duration-200">
                                <ReactMarkdown>
                                    {isExpanded
                                        ? doc.aiSummary
                                        : doc.aiSummary.length > 200
                                            ? `${doc.aiSummary.substring(0, 200)}...`
                                            : doc.aiSummary}
                                </ReactMarkdown>
                            </div>

                            {/* Tags Architecture */}
                            {doc.aiKeywords.length > 0 && (
                                <div className="mt-4 pt-3.5 border-t border-slate-100">
                                    {/* Heading */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <Tag className="h-3 w-3 text-slate-500" />

                                        <span className="text-[12px] font-semibold text-slate-700">
                                            Key Topics
                                        </span>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {doc.aiKeywords.slice(0, 5).map((keyword, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="outline"
                                                className="rounded-md border-slate-200/60 bg-slate-50/50 px-2 py-0.5 text-xs font-semibold text-slate-600"
                                            >
                                                {keyword}
                                            </Badge>
                                        ))}

                                        {doc.aiKeywords.length > 5 && (
                                            <span className="text-xs font-semibold text-slate-400 self-center ml-1">
                                                +{doc.aiKeywords.length - 5} topics
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Empty/Idle Dashboard Processing State */
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/30 py-8 px-4 text-center">
                            <div className="relative mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-100 shadow-3xs">
                                {doc.status === "failed" ? (
                                    <FileText className="h-5 w-5 text-rose-500" />
                                ) : (
                                    <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
                                )}
                            </div>
                            <h4 className="text-sm font-bold text-slate-800">
                                {doc.status === "failed" ? "Analysis Failed"
                                    : "No Analysis Yet"}
                            </h4>
                            <p className="mt-1 max-w-sm text-xs leading-normal text-slate-400">
                                {doc.status === "failed"
                                    ? "Could not analyze for summary. The file might be too small or contain unsupported formatting."
                                    : "Unlock key insights, summaries, and sentiment analysis by running the AI processor."}
                            </p>
                        </div>
                    )}
                </div>

                {/* RIGHT SYSTEM CONTROL PANEL */}
                <div className="flex flex-col gap-3.5 xl:w-56 xl:border-l xl:border-slate-200/80 xl:pl-6 shrink-0 w-full items-stretch justify-start">
                    {doc.fileUrl && (
                        <Button
                            variant="outline"
                            size="default"
                            onClick={() => window.open(doc.fileUrl, "_blank")}
                            className="w-full justify-center h-9 px-4 rounded-xl border-slate-200/80 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all active:scale-[0.99]"
                        >
                            <Download className="h-4 w-4 mr-2.5 text-slate-400 shrink-0" />
                            <span>Download File</span>
                        </Button>
                    )}

                    {doc.aiSummary && (
                        <Button
                            variant="outline"
                            size="default"
                            onClick={handleDownloadPDF}
                            className="w-full justify-center h-9 px-4 rounded-xl border-orange-200/60 bg-orange-50/20 text-orange-700 hover:bg-orange-50 font-semibold text-sm transition-all active:scale-[0.99]"
                        >
                            {/* <ArrowUpRight className="h-4 w-4 mr-2.5 text-orange-500 shrink-0" /> */}
                            <Sparkles className="h-4 w-4 mr-2.5 text-orange-500 shrink-0" />
                            <span>Export Insights</span>
                        </Button>
                    )}

                    <div className="w-full h-px bg-slate-100 hidden xl:block my-1" />

                    {/* Selector Framework block */}
                    <div className="flex flex-col gap-2 w-full">
                        <span className="text-[11px] uppercase font-black tracking-wider text-slate-400 px-0.5">
                            {doc.aiSummary ? "Re-analyze with" : "Analyze with"}
                        </span>
                        <Select
                            value={selectedAnalysisType}
                            onValueChange={(value: AnalysisType) =>
                                onAnalysisTypeChange(value)
                            }
                        >
                            <SelectTrigger
                                className="w-full rounded-lg h-9 px-4 border-slate-200/80 shadow-xs font-semibold text-sm transition-all active:scale-[0.99]">
                                {/* <SelectValue /> */}
                                <SelectValue>
                                    <div className="flex items-center gap-2 truncate">
                                        {getAnalysisIcon(selectedAnalysisType)}
                                        <span className="truncate">
                                            {
                                                analysisTypes.find(
                                                    (type) => type.value === selectedAnalysisType
                                                )?.label
                                            }
                                        </span>
                                    </div>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-xl border-slate-200">
                                {analysisTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value} className="rounded-lg text-sm font-medium">
                                        <span>{type.label}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={() => onAnalyze(doc.id)}
                        disabled={isAnalyzing}
                        className={cn(
                            "w-full h-9 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-[0.99]",
                            doc.aiSummary
                                ? "bg-slate-900 text-white hover:bg-black"
                                : "bg-orange-400 text-white hover:bg-orange-600"
                        )}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin shrink-0" />
                                <span>{doc.aiSummary ? "Re-analyzing..." : "Analyzing..."}</span>
                            </>
                        ) : (
                            <>
                                <Brain className="h-4 w-4 mr-2 shrink-0" />
                                <span>{doc.aiSummary ? "Re-analyze" : "Analyze"}</span>
                            </>
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        size="default"
                        className="w-full justify-center h-9 px-4 rounded-xl text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 font-semibold text-sm transition-colors"
                        onClick={() => setDeleteModalOpen(true)}
                    >
                        <Trash2 className="w-4 h-4 mr-2.5 shrink-0" />
                        <span>Delete</span>
                    </Button>
                </div>
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
        </div>
    );
}