import { Loader2 } from "lucide-react";

export default function LoadingDocuments() {
    return (
        <div className="rounded-[32px] border border-white/40 bg-white/70 backdrop-blur-xl py-24 flex flex-col items-center justify-center shadow-xl">
            <Loader2 className="h-10 w-10 animate-spin text-slate-400" />

            <p className="mt-4 text-slate-500 font-medium">
                Retrieving vault assets...
            </p>
        </div>
    );
}