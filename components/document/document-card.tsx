"use client";
import { AnalysisType, DocumentCardProps } from "@/types";
import { Brain, Calendar, Download, File, FileText, Loader2, Sparkles, Tag, Trash, User } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import ReactMarkdown from "react-markdown";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { analysisTypes, formatFileSize } from "@/app/data/data";
import { jsPDF } from "jspdf";

export default function DocumentCard({
    document: doc,
    isAnalyzing,
    selectedAnalysisType,
    onAnalysisTypeChange,
    onAnalyze,
    onDelete,
    onToggleSummary,
    expandedSummaries,
}: DocumentCardProps) {
    const isExpanded = expandedSummaries[doc.id];

    const getAnalysisIcon = (type: AnalysisType) => {
        const analysisType = analysisTypes.find((t) => t.value === type);
        const Icon = analysisType?.icon || Sparkles;
        return <Icon className="h-4 w-4" />;
    };

    // --- PDF GENERATION FUNCTION ---
    const handleDownloadPDF = () => {
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 20;
        const maxContentWidth = pageWidth - (margin * 2);
        let currentY = 25;

        // 1. Decorative Header Accent Top-Bar
        pdf.setFillColor(249, 115, 22); // Orange Accent Theme Match
        pdf.rect(0, 0, pageWidth, 4, "F");

        // 2. Document Title
        pdf.setFont("Helvetica", "bold");
        pdf.setFontSize(20);
        pdf.setTextColor(26, 26, 26);
        const titleLines = pdf.splitTextToSize(`AI Analysis Report: ${doc.name}`, maxContentWidth);
        pdf.text(titleLines, margin, currentY);
        currentY += (titleLines.length * 7) + 4;

        // 3. Metadata Header block
        pdf.setFont("Helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(100, 116, 139); // Slate-500 color
        pdf.text(`Analyzed By: Gemini AI`, margin, currentY);
        pdf.text(`Date: ${new Date(doc.createdAt).toLocaleDateString()}`, pageWidth - margin - 40, currentY);
        currentY += 6;

        pdf.text(`Uploaded By: ${doc.user.name || doc.user.email}`, margin, currentY);
        if (doc.sentiment) {
            pdf.text(`Overall Sentiment: ${doc.sentiment.toUpperCase()}`, pageWidth - margin - 40, currentY);
        }
        currentY += 12;

        // Divider Line
        pdf.setDrawColor(226, 232, 240); // Slate-200
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 12;

        // 4. Summary Content Section
        pdf.setFont("Helvetica", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(26, 26, 26);
        pdf.text("Executive Insights Summary", margin, currentY);
        currentY += 8;

        pdf.setFont("Helvetica", "normal");
        pdf.setFontSize(11);
        pdf.setTextColor(51, 65, 85); // Text Gray-700

        // Strip markdown characters out or parse cleanly text lines
        const cleanSummaryText = doc.aiSummary ? doc.aiSummary.replace(/[*#`_-]/g, "") : "No summary available.";
        const summaryLines = pdf.splitTextToSize(cleanSummaryText, maxContentWidth);

        // Loop through lines to avoid dropping below the page edge boundary safely
        summaryLines.forEach((line: string) => {
            if (currentY > 275) {
                pdf.addPage();
                currentY = 25;
            }
            pdf.text(line, margin, currentY);
            currentY += 6.5; // Line spacing
        });

        // 5. Key Keywords/Topics Section
        if (doc.aiKeywords && doc.aiKeywords.length > 0) {
            currentY += 10;
            if (currentY > 260) {
                pdf.addPage();
                currentY = 25;
            }

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
                if (currentY > 275) {
                    pdf.addPage();
                    currentY = 25;
                }
                pdf.text(line, margin, currentY);
                currentY += 6;
            });
        }

        // Save file natively via browser download pipeline
        pdf.save(`AI_Analysis_${doc.name.replace(/\.[^/.]+$/, "")}.pdf`);
    };

    return (
        <div className="group relative overflow-hidden rounded-[32px] border border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.10)] p-7">
            {/* Glow */}
            <div className="absolute inset-0  pointer-events-none" />
            <div className="relative z-10 flex flex-col xl:flex-row gap-8">
                {/* Left */}
                <div className="flex-1">
                    <div className="flex gap-5">
                        {/* Icon */}
                        <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl  border border-gray-50 shadow-inner">
                            <FileText className="h-6 w-6 text-orange-600" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-semibold tracking-tight text-[#1A1A1A]">
                                        {doc.name}
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <User className="h-3.5 w-3.5" />
                                            {doc.user.name || doc.user.email}
                                        </span>

                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(doc.createdAt).toLocaleDateString()}
                                        </span>

                                        {doc.fileSize && (
                                            <span className="flex items-center gap-1">
                                                <File className="h-3.5 w-3.5" />
                                                {formatFileSize(doc.fileSize)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {doc.sentiment && (
                                    <Badge className="rounded-full px-4 py-1 bg-black text-white border-none capitalize">
                                        {doc.sentiment}
                                    </Badge>
                                )}
                            </div>

                            {/* AI Summary */}
                            {doc.aiSummary ? (
                                <div className="mt-6 relative overflow-hidden rounded-3xl border border-gray-50 p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                                    <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-30" />
                                    <div className="relative z-10 flex items-center justify-between gap-4 mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                                <Brain className="h-5 w-5 text-orange-600" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-[#1A1A1A]">AI Analysis</div>
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
                                                className="rounded-xl hover:bg-orange-100"
                                            >
                                                {isExpanded ? "Show less" : "Read more"}
                                            </Button>
                                        )}
                                    </div>

                                    <div className="relative z-10 prose prose-sm max-w-none text-slate-700 text-sm leading-7">
                                        <ReactMarkdown>
                                            {isExpanded
                                                ? doc.aiSummary
                                                : doc.aiSummary.length > 200
                                                    ? `${doc.aiSummary.substring(0, 200)}...`
                                                    : doc.aiSummary}
                                        </ReactMarkdown>
                                    </div>
                                    {doc.aiKeywords.length > 0 && (
                                        <div className="relative z-10 mt-6 pt-5 border-t border-orange-100">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Tag className="h-4 w-4 text-slate-500" />

                                                <span className="text-sm font-medium text-slate-700">
                                                    Key Topics
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {doc.aiKeywords.slice(0, 8).map((keyword, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="px-3 py-1.5 rounded-full bg-white/80 border border-slate-200 text-sm text-slate-700 shadow-sm"
                                                    >
                                                        {keyword}
                                                    </div>
                                                ))}

                                                {doc.aiKeywords.length > 8 && (
                                                    <div className="px-3 py-1.5 rounded-full border border-slate-200 text-sm text-slate-500">
                                                        +{doc.aiKeywords.length - 8} more
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Placeholder State (Empty or Failed) */
                                <div className="mt-6 rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/50 p-8 flex flex-col items-center justify-center text-center transition-colors hover:bg-slate-50">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4">
                                        {doc.status === "failed" ? (
                                            <FileText className="h-6 w-6 text-slate-400" />
                                        ) : (
                                            <Sparkles className="h-6 w-6 text-orange-400" />
                                        )}
                                    </div>

                                    <div className="max-w-70">
                                        <h4 className="text-sm font-semibold text-slate-900">
                                            {doc.status === "failed" ? "Analysis Failed" : "No Analysis Yet"}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                            {doc.status === "failed"
                                                ? "Could not analyze for summary. The file might be too small or contain unsupported formatting."
                                                : "Unlock key insights, summaries, and sentiment analysis by running the AI processor."
                                            }
                                        </p>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onAnalyze(doc.id)}
                                        disabled={isAnalyzing}
                                        className="mt-4 text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-medium"
                                    >
                                        {isAnalyzing ? (
                                            <><Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> Processing...</>
                                        ) : (
                                            doc.status === "failed" ? "Try Again" : "Get Started"
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="xl:w-47.5 xl:border-l xl:border-slate-200/60 xl:pl-5 flex flex-col items-start space-y-3">
                    {/* Download Raw File */}
                    {doc.fileUrl && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(doc.fileUrl, "_blank")}
                            className="w-42.5 rounded-xl border-slate-200/80 hover:bg-slate-50 h-9 text-sm font-medium shadow-xs"
                        >
                            <Download className="h-3.5 w-3.5 mr-2" />
                            Download File
                        </Button>
                    )}

                    {/* NEW: Download Generated AI Analysis Result As PDF */}
                    {doc.aiSummary && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadPDF}
                            className="w-42.5 rounded-xl border-orange-200 bg-orange-50/50 text-orange-700 hover:bg-orange-50 h-9 text-sm font-medium shadow-xs"
                        >
                            {/* <Download className="h-3.5 w-3.5 mr-2" /> */}
                            <Sparkles className="h-3.5 w-3.5 mr-2 text-orange-600" />
                            Export Insights
                        </Button>
                    )}

                    {/* Analysis Section */}
                    <div className="space-y-2.5 w-42.5">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-semibold px-1">
                            {doc.aiSummary ? "Re-analyze with" : "Analyze with"}
                        </div>

                        <Select
                            value={selectedAnalysisType}
                            onValueChange={(value: AnalysisType) =>
                                onAnalysisTypeChange(value)
                            }
                        >
                            <SelectTrigger
                                className="rounded-xl h-9 border-slate-200/80 text-sm shadow-xs w-42.5"
                            >
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

                            <SelectContent className="rounded-xl border-slate-200">
                                {analysisTypes.map((type) => (
                                    <SelectItem
                                        key={type.value}
                                        value={type.value}
                                        className="rounded-lg"
                                    >
                                        <div className="flex items-center gap-2 text-sm">
                                            <type.icon className="h-4 w-4" />
                                            {type.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            onClick={() => onAnalyze(doc.id)}
                            disabled={isAnalyzing}
                            className="w-42.5 rounded-xl bg-[#1A1A1A] hover:bg-black text-white h-9 text-sm font-medium shadow-xs shadow-black/5 active:scale-[0.98] transition-all"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                                    {doc.aiSummary ? "Re-analyzing..." : "Analyzing..."}
                                </>
                            ) : (
                                <>
                                    <Brain className="h-3.5 w-3.5 mr-2" />
                                    {doc.aiSummary ? "Re-analyze" : "Analyze"}
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Delete */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-42.5 rounded-xl text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 h-9 text-sm font-medium"
                        onClick={() => onDelete(doc.id)}
                    >
                        <Trash className="w-3.5 h-3.5 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}