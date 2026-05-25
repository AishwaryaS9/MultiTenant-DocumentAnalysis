import { Building } from "lucide-react";
import DocumentUploadDialog from "@/components/document/document-upload-dialog";
import { DocumentsHeaderProps } from "@/types";

export default function DocumentHeader({ organizationName, onUploadSuccess }: DocumentsHeaderProps) {
    return (
        <div className="relative overflow-hidden rounded-[32px] border border-white/40 bg-white/70 backdrop-blur-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
                        Documents
                    </h1>

                    <p className="mt-3 flex items-center gap-2 text-slate-500 font-medium">
                        <Building className="w-4 h-4" />
                        Managing assets for
                        <span className="text-amber-600 font-semibold">
                            {organizationName}
                        </span>
                    </p>
                </div>

                <DocumentUploadDialog
                    onUploadSuccess={onUploadSuccess}
                />
            </div>
        </div>
    );
}