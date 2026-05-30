import { Loader2 } from "lucide-react";

export default function LoadingDocuments() {
    return (
        <section
            className="flex flex-col items-center justify-center rounded-[28px] border border-white/40 bg-white/70 px-5 py-16 sm:px-6 sm:py-20 backdrop-blur-md shadow-md"
            role="status"
            aria-live="polite"
            aria-label="Loading documents">
            <Loader2 className="h-9 w-9 sm:h-10 sm:w-10 animate-spin text-slate-400" aria-hidden="true" />

            <div className="z-10 mt-5 space-y-1.5 px-2 text-center">
                <h3 className="text-sm sm:text-base font-semibold tracking-tight text-slate-800 animate-pulse">
                    Retrieving vault assets
                </h3>

                <p className="mx-auto max-w-64 text-xs sm:text-sm leading-relaxed text-slate-400 font-medium">
                    Securing connection and decrypting workspace data...
                </p>
            </div>
        </section>
    );
}