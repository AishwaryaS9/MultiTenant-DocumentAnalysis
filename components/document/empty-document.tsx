import { FilePlus, Upload } from "lucide-react";
import DocumentUploadDialog from "@/components/document/document-upload-dialog";
import { EmptyDocumentsProps } from "@/types";
import { Button } from "../ui/button";

export default function EmptyDocuments() {
    return (
        <section
            className="rounded-[28px] border border-white/40 bg-white/70 px-5 py-14 sm:px-6 sm:py-16 text-center backdrop-blur-md shadow-md"
            role="region"
            aria-label="Empty documents state">
            <div className="mx-auto flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-linear-to-br from-orange-100 to-orange-50 shadow-sm">
                <FilePlus className="h-8 w-8 sm:h-10 sm:w-10 text-orange-500" aria-hidden="true" />
            </div>

            <h2 className="mt-5 text-xl sm:text-2xl font-semibold text-strong">
                Your vault is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm sm:text-base leading-relaxed text-slate-500">
                Upload documents to start generating AI insights.
            </p>

            <div className="mt-7 flex justify-center w-auto">
                <DocumentUploadDialog >
                    <Button
                        className="h-10 rounded-xl bg-strong hover:bg-strong-dark px-4 text-sm font-medium text-white shadow-sm 
                        shadow-black/10 cursor-pointer focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-black"
                        aria-label="Upload document">
                        <Upload className="h-4 w-4 mr-2 shrink-0" aria-hidden="true" />
                        Upload Document
                    </Button>
                </DocumentUploadDialog>
            </div>
        </section>
    );
}