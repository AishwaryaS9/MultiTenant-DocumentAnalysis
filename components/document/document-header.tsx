import { Building, FolderOpen } from "lucide-react";
import DocumentUploadDialog from "@/components/document/document-upload-dialog";
import { DocumentsHeaderProps } from "@/types";
import { cn } from "@/lib/utils";

export default function DocumentHeader({ organizationName, onUploadSuccess }: DocumentsHeaderProps) {
    return (
        <div className={cn(
            "group relative overflow-hidden rounded-[28px]",
            "border border-white/60 bg-white/90 backdrop-blur-xl",
            "p-8 shadow-[0_10px_40px_rgba(15,23,42,0.04)]"
        )}>
            {/* Mesh Grid Pattern — matches Stat Cards */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-size-[24px_24px] opacity-40" />

            {/* Sophisticated Ambient Light Leaks */}
            <div className="absolute -top-20 right-1/3 h-40 w-40 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -bottom-20 left-10 h-40 w-40 rounded-full blur-2xl" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                {/* Text Content */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center text-slate-700">
                            <FolderOpen className="w-5 h-5" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-none">
                            Documents
                        </h1>
                    </div>

                    {/* Organization Meta Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-500">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>Managing workspace for</span>
                        <span className="font-bold text-orange-600  bg-clip-text">
                            {organizationName}
                        </span>
                    </div>
                </div>

                {/* Upload Action Button Wrapper */}
                <div className="flex items-center self-start sm:self-center shrink-0">
                    <DocumentUploadDialog onUploadSuccess={onUploadSuccess} />
                </div>
            </div>
        </div>
    );
}