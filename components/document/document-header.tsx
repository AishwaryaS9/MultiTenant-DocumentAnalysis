import { Building, FolderOpen, Search, Upload } from "lucide-react";
import DocumentUploadDialog from "@/components/document/document-upload-dialog";
import { DocumentsHeaderProps } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DocumentHeader({ organizationName, onUploadSuccess, orgSlug }: DocumentsHeaderProps) {
    return (
        <header
            className={cn(
                "group relative overflow-hidden rounded-[28px]",
                "border border-white/60 bg-white/90 backdrop-blur-xl",
                "p-5 sm:p-6 lg:p-8 shadow-[0_10px_40px_rgba(15,23,42,0.04)]"
            )}
            role="banner"
            aria-label="Documents page header">
            {/* Mesh Grid Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" aria-hidden="true" />

            {/* Ambient Light */}
            <div className="absolute -top-20 right-1/3 h-40 w-40 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                aria-hidden="true" />

            <div className="absolute -bottom-20 left-10 h-40 w-40 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Left Content */}
                <div className="space-y-3 min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 items-center justify-center text-slate-700 shrink-0" aria-hidden="true">
                            <FolderOpen className="w-5 h-5" />
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-none truncate">
                            Documents
                        </h1>
                    </div>

                    {/* Organization Badge */}
                    <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-500">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />

                        <span>Managing workspace for</span>

                        <span className="font-bold text-orange-600 bg-clip-text wrap-break-word">
                            {organizationName}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto lg:self-center shrink-0">
                    {/* Search Button Link */}
                    <Link
                        href={`/${orgSlug}/search`}
                        aria-label="Search organization documents"
                        className="w-full sm:w-auto">
                        <Button
                            variant="outline"
                            className={cn(
                                "h-11 w-full sm:w-auto rounded-xl border-slate-200 bg-white/80 px-4 cursor-pointer",
                                "hover:bg-slate-50 hover:border-slate-100 hover:shadow-xs",
                                "focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-700"
                            )}>
                            <Search className="mr-2 h-4 w-4 text-slate-500 transition-transform duration-200 group-hover:scale-105 shrink-0" aria-hidden="true" />
                            <span className="font-medium text-slate-700">
                                Search Documents
                            </span>
                        </Button>
                    </Link>

                    {/* Upload Button Component */}
                    <div className="w-full sm:w-auto">
                        <DocumentUploadDialog onUploadSuccess={onUploadSuccess}>
                            <Button
                                className="h-11 w-full sm:w-auto rounded-xl bg-strong hover:bg-strong-dark px-4 text-sm font-medium text-white shadow-sm shadow-black/10 cursor-pointer focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-black"
                                aria-label="Upload document">
                                <Upload className="h-4 w-4 mr-2 shrink-0" aria-hidden="true" />
                                Upload Document
                            </Button>
                        </DocumentUploadDialog>
                    </div>
                </div>
            </div>
        </header>
    );
}