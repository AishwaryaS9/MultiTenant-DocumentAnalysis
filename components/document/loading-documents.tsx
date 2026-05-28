import { Loader2 } from "lucide-react";

export default function LoadingDocuments() {
    return (
        <div className="rounded-[32px] border border-white/40 bg-white/70 backdrop-blur-xl py-24 flex flex-col items-center justify-center shadow-xl">
            <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
            <div className="text-center space-y-1.5 z-10 px-6">
                <h3 className="text-base font-semibold tracking-tight text-slate-800 animate-pulse">
                    Retrieving vault assets
                </h3>
                <p className="text-xs text-slate-400 font-medium max-w-60 leading-relaxed mx-auto">
                    Securing connection and decrypting workspace data...
                </p>
            </div>
        </div>
    );
}