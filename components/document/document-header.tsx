import { Search, Upload } from "lucide-react";
import Link from "next/link";
import DocumentUploadDialog from "@/components/document/document-upload-dialog";
import { DocumentsHeaderProps } from "@/types";
import { Button } from "@/components/ui/button";

export default function DocumentHeader({ organizationName, onUploadSuccess, orgSlug }: DocumentsHeaderProps) {
    return (
        <header
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 w-full"
            aria-label="Documents page header">
            {/* Page Info */}
            <div className="flex flex-col gap-1 min-w-0" aria-label="Documents information">
                <div className="flex items-center gap-2">
                    <span
                        className="text-xs font-bold uppercase tracking-wider text-orange-600 truncate"
                        aria-label={`Workspace ${organizationName}`}>
                        {organizationName}
                    </span>
                </div>

                <div className="flex items-baseline gap-3 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight truncate">
                        Documents
                    </h1>
                </div>

                <p className="text-sm text-slate-500">
                    Upload, search, and manage your organization's documents.
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap" aria-label="Documents actions">
                <Link
                    href={`/${orgSlug}/search`}
                    aria-label="Search organization documents">
                    <Button
                        variant="outline"
                        className="rounded-xl font-medium text-slate-700 bg-white hover:bg-slate-50 border-slate-200 shadow-sm cursor-pointer min-h-10 px-4 flex items-center gap-2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-600">
                        <Search className="w-4 h-4 shrink-0 text-slate-500" aria-hidden="true" />
                        <span>Search Documents</span>
                    </Button>
                </Link>

                <DocumentUploadDialog onUploadSuccess={onUploadSuccess}>
                    <Button
                        aria-label="Upload document"
                        className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 flex items-center gap-2 font-medium text-sm cursor-pointer min-h-10 shadow-sm focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-900">
                        <Upload className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>Upload Document</span>
                    </Button>
                </DocumentUploadDialog>
            </div>
        </header>
    );
}