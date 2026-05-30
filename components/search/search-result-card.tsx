"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, ChevronDown, ChevronUp, Download, FileText, Sparkles, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchResultProps } from "@/types";
import ReactMarkdown from "react-markdown";

export function SearchResultCard({ document }: SearchResultProps) {
    const [expanded, setExpanded] = useState(false);

    const summary = document.aiSummary?.trim() || "";
    const shouldShowToggle = summary.length > 260;

    const formattedDate = new Date(document.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const fileSize = document.fileSize ? `${(document.fileSize / 1024 / 1024).toFixed(1)} MB` : "Unknown size";
    const userInitial = document.user?.name?.charAt(0)?.toUpperCase() || "U";

    return (
        <Card
            role="article"
            aria-label={`Search result card for ${document.name}`}
            className="group relative w-full max-w-full overflow-hidden rounded-[24px] sm:rounded-[32px] border border-white/60 bg-white/75 backdrop-blur-2xl">
            <CardContent className="relative p-4 sm:p-6 md:p-8">

                {/* HEADER */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                    <div className="flex items-start gap-4 sm:gap-5 min-w-0 w-full">

                        {/* ICON */}
                        <div aria-hidden="true"
                            className="relative flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl text-orange-600 shadow-sm">
                            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-white text-[9px]
                             sm:text-[10px] font-black border border-slate-100 text-slate-900">
                                AI
                            </span>
                        </div>

                        {/* INFO */}
                        <div className="min-w-0 w-full space-y-3">

                            <div className="min-w-0">
                                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 wrap-break-word leading-tight">
                                    {document.name}
                                </h2>

                                <p className="mt-1 text-xs sm:text-sm text-slate-500 truncate max-w-full">
                                    AI indexed and searchable workspace document
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 max-w-full">
                                <Badge className="rounded-full border-0 bg-amber-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold text-amber-700">
                                    {document.fileType}
                                </Badge>

                                <Badge variant="secondary" className="rounded-full bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs text-slate-600">
                                    {fileSize}
                                </Badge>
                            </div>

                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto"
                        role="group"
                        aria-label="Document actions">
                        {shouldShowToggle && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setExpanded(!expanded)}
                                aria-expanded={expanded}
                                aria-controls="ai-summary"
                                aria-label={expanded ? "Collapse AI summary and show less content" : "Expand AI summary and read more content"}
                                className="h-8 sm:h-7 w-full sm:w-auto justify-center sm:justify-start gap-1.5 rounded-md px-3 sm:px-2.5 text-xs 
                                font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-1 
                                focus-visible:ring-slate-800 focus-visible:ring-offset-1"
                            >
                                {expanded ? (
                                    <>
                                        <span>Show less</span>
                                        <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                                    </>
                                ) : (
                                    <>
                                        <span>Read more</span>
                                        <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                                    </>
                                )}
                            </Button>
                        )}

                        {document.fileUrl && (
                            <Button
                                variant="outline"
                                asChild
                                aria-label={`Download document file named ${document.name}`}
                                className="h-10 sm:h-11 w-full sm:w-auto justify-center rounded-2xl px-4 sm:px-5 bg-slate-50/50 border-slate-200/80 hover:bg-slate-100 
                                text-slate-700 font-semibold text-sm transition-all active:scale-[0.99] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-1"
                            >
                                <Link href={document.fileUrl} target="_blank" className="flex items-center justify-center w-full sm:w-auto">
                                    <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                                    Download
                                </Link>
                            </Button>
                        )}
                    </div>

                </div>

                {/* AI SUMMARY */}
                {summary ? (
                    <section className="mt-6 sm:mt-7 rounded-2xl sm:rounded-3xl border border-slate-50 bg-gray-50/50 p-4 sm:p-5">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="rounded-full bg-amber-100 p-1.5" aria-hidden="true">
                                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                            </div>

                            <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                                AI Summary
                            </span>
                        </div>

                        <div className={`text-xs sm:text-sm leading-6 sm:leading-8 text-slate-700 prose prose-sm max-w-none transition-all duration-300 ${expanded ? "" : "line-clamp-4"}`}
                            aria-live="polite">
                            <ReactMarkdown>{summary}</ReactMarkdown>
                        </div>
                    </section>
                ) : (
                    <div className="mt-6 sm:mt-7" role="status" aria-live="polite">
                        <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-dashed border-slate-200 bg-slate-50/40 px-4 py-8 sm:px-6 sm:py-10 text-center">
                            <div className="relative mb-4 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white">
                                {document.status === "failed" ? (
                                    <FileText className="h-5 w-5 text-rose-500" />
                                ) : (
                                    <Sparkles className="h-5 w-5 animate-pulse text-amber-500" />
                                )}
                            </div>

                            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                                {document.status === "failed" ? "Analysis Failed" : "No Analysis Yet"}
                            </h4>

                            <p className="mt-2 max-w-md text-[11px] sm:text-xs leading-relaxed text-slate-400">
                                {document.status === "failed"
                                    ? "Could not analyze for summary. The file may be too small or contain unsupported formatting."
                                    : "Unlock summaries, insights, keywords, and semantic search by running the AI processor."}
                            </p>
                        </div>
                    </div>
                )}

                {/* KEYWORDS */}
                {document.aiKeywords?.length > 0 && (
                    <div className="mt-5 sm:mt-6 flex flex-wrap gap-2">
                        {document.aiKeywords.slice(0, 8).map((keyword: string) => (
                            <Badge
                                key={keyword}
                                variant="secondary"
                                className="rounded-full border border-slate-200 bg-white/70 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs text-slate-600"
                            >
                                {keyword}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* FOOTER */}
                <footer className="mt-6 sm:mt-7 flex flex-col gap-4 border-t border-slate-100 pt-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-xs sm:text-sm text-slate-500">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold">
                                {userInitial}
                            </div>
                            <div className="flex items-center gap-1.5 min-w-0">
                                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span className="truncate max-w-35 sm:max-w-none">
                                    {document.user?.name || "Unknown"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span>{formattedDate}</span>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-amber-700 w-fit">
                        <Sparkles className="h-3.5 w-3.5" />
                        AI Enhanced Search
                    </div>
                </footer>
            </CardContent>
        </Card >
    );
}