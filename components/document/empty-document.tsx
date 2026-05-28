import { FilePlus } from "lucide-react";
import DocumentUploadDialog from "@/components/document/document-upload-dialog";
import { EmptyDocumentsProps } from "@/types";

export default function EmptyDocuments({ onUploadSuccess }: EmptyDocumentsProps) {
    return (
        <div className="rounded-[32px] border border-white/40 bg-white/70 backdrop-blur-xl py-20 px-6 text-center shadow-xl">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-linear-to-br from-orange-100 to-orange-50 flex items-center justify-center shadow-sm">
                <FilePlus className="w-10 h-10 text-orange-500" />
            </div>

            <h3 className="mt-6 text-2xl font-semibold text-strong">
                Your vault is empty
            </h3>

            <p className="mt-3 max-w-md mx-auto text-slate-500 leading-relaxed">
                Upload documents to start generating AI insights.
            </p>

            <div className="mt-8">
                <DocumentUploadDialog
                    onUploadSuccess={onUploadSuccess}
                />
            </div>
        </div>
    );
}