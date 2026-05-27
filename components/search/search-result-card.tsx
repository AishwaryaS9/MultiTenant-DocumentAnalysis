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

    const formattedDate = new Date(
        document.createdAt
    ).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const fileSize = document.fileSize
        ? `${(document.fileSize / 1024 / 1024).toFixed(1)} MB`
        : "Unknown size";

    const userInitial =
        document.user?.name?.charAt(0)?.toUpperCase() || "U";

    return (
        <Card className="group relative overflow-hidden rounded-[32px] border border-white/60 bg-white/75 backdrop-blur-2xl">
            <CardContent className="relative p-7 md:p-8">
                {/* Header */}
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-5">
                        {/* Icon */}

                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-orange-600 shadow-sm transition-all duration-500 ">
                            <FileText className="h-6 w-6" />
                            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black border border-slate-100 text-slate-900 shadow-3xs">
                                AI
                            </span>
                        </div>
                        {/* Info */}
                        <div className="space-y-3">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                    {document.name}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    AI indexed and searchable workspace document
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <Badge className="rounded-full border-0 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                    {document.fileType}
                                </Badge>

                                <Badge variant="secondary"
                                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                                    {fileSize}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {shouldShowToggle && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setExpanded(!expanded)}
                                className="h-7 gap-1.5 rounded-md px-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900">

                                {expanded ? (
                                    <>
                                        <span>Show less</span>
                                        <ChevronUp className="h-3.5 w-3.5" />
                                    </>
                                ) : (
                                    <>
                                        <span>Read more</span>
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    </>
                                )}
                            </Button>
                        )}
                        {document.fileUrl && (
                            <Button
                                variant="outline"
                                asChild
                                className="h-11 rounded-2xl px-5 bg-slate-50/50 border-slate-200/80 hover:bg-slate-100
                                 text-slate-700 font-semibold text-sm transition-all active:scale-[0.99]">
                                <Link href={document.fileUrl} target="_blank">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Link>
                            </Button>
                        )}


                    </div>
                </div>

                {/* AI Summary */}
                {summary ? (
                    <div className="mt-7 rounded-3xl border border-slate-50 bg-gray-50/50 p-5 transition-all duration-500">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="rounded-full bg-amber-100 p-1.5">
                                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                            </div>

                            <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                                AI Summary
                            </span>
                        </div>

                        <div className={`text-sm leading-8 text-slate-700 prose prose-sm max-w-none prose-p:my-0 prose-headings:my-2 
                        prose-ul:my-2 prose-li:my-0 transition-all duration-300 ${expanded ? "" : "line-clamp-4"}`}>
                            <ReactMarkdown>
                                {summary}
                            </ReactMarkdown>
                        </div>
                    </div>
                ) : (
                    <div className="mt-7">
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/40 px-6 py-10 text-center">
                            <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-3xs">
                                {document.status === "failed" ? (
                                    <FileText className="h-5 w-5 text-rose-500" />
                                ) : (
                                    <Sparkles className="h-5 w-5 animate-pulse text-amber-500" />
                                )}
                            </div>

                            <h4 className="text-sm font-bold text-slate-800">
                                {document.status === "failed"
                                    ? "Analysis Failed"
                                    : "No Analysis Yet"}
                            </h4>

                            <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-400">
                                {document.status === "failed"
                                    ? "Could not analyze for summary. The file may be too small or contain unsupported formatting."
                                    : "Unlock summaries, insights, keywords, and semantic search by running the AI processor."}
                            </p>
                        </div>
                    </div>
                )}
                {document.aiKeywords?.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                        {document.aiKeywords
                            .slice(0, 8)
                            .map((keyword: string) => (
                                <Badge
                                    key={keyword}
                                    variant="secondary"
                                    className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs 
                                    font-medium text-slate-600 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700">
                                    {keyword}
                                </Badge>
                            ))}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-7 flex flex-col gap-4 border-t border-slate-100 pt-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br
                             from-slate-100 to-slate-200 text-xs font-bold text-slate-700">
                                {userInitial}
                            </div>

                            <div className="flex items-center gap-1.5">
                                <User className="h-4 w-4" />
                                <span>
                                    {document.user?.name || "Unknown"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span>{formattedDate}</span>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-200
                     bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700">
                        <Sparkles className="h-3.5 w-3.5" />
                        AI Enhanced Search
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}