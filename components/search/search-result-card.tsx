import Link from "next/link";
import { Calendar, FileText, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchResultProps } from "@/types";

export function SearchResultCard({
    document,
}: SearchResultProps) {
    const plainSummary = document.aiSummary
        ?.replace(/[#*_`>-]/g, "")
        .replace(/\n/g, " ")
        .slice(0, 240);

    return (
        <Card className="group relative bg-white/90 border border-slate-100 rounded-[28px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-amber-50/0 via-amber-50/50 to-orange-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardContent className="relative p-7 space-y-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
                            <FileText className="w-5 h-5 text-amber-600" />
                        </div>

                        <div>
                            <h2 className="font-black text-slate-900 text-xl leading-tight">
                                {document.name}
                            </h2>

                            <div className="flex items-center gap-2 mt-2">
                                <Badge>
                                    {document.fileType}
                                </Badge>

                                <span className="text-xs text-slate-400">
                                    {document.fileSize
                                        ? `${(
                                            document.fileSize /
                                            1024 /
                                            1024
                                        ).toFixed(1)} MB`
                                        : "Unknown size"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {document.fileUrl && (
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-2xl"
                        >
                            <Link
                                href={document.fileUrl}
                                target="_blank"
                            >
                                Download
                            </Link>
                        </Button>
                    )}
                </div>

                {plainSummary && (
                    <div className="rounded-2xl bg-amber-50/60 border border-amber-100/50 p-4">
                        <p className="text-sm leading-7 text-slate-700">
                            {plainSummary}...
                        </p>
                    </div>
                )}

                {document.aiKeywords?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {document.aiKeywords
                            .slice(0, 8)
                            .map((keyword: string) => (
                                <Badge
                                    key={keyword}
                                    variant="secondary"
                                    className="rounded-full"
                                >
                                    #{keyword}
                                </Badge>
                            ))}
                    </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100/80">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            {document.user?.name || "Unknown"}
                        </div>

                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />

                            {new Date(
                                document.createdAt
                            ).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="text-xs font-medium text-amber-600">
                        AI indexed document
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}