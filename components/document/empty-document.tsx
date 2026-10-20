import { BarChart3, FileText, Search, Sparkles, Upload } from "lucide-react";
import DocumentUploadDialog from "@/components/document/document-upload-dialog";
import { Button } from "../ui/button";

const BENEFITS = [
    { icon: Sparkles, title: "AI summary", description: "Instant key takeaways" },
    { icon: BarChart3, title: "Key topics", description: "Important themes found" },
    { icon: Search, title: "Search", description: "Ask anything instantly" },
];

export default function EmptyDocuments() {
    return (
        <section
            role="region"
            aria-label="Empty documents state"
            className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-card px-6 pb-12 pt-16 text-center"
        >
            {/* soft background circle */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 -top-[215px] h-[475px] w-[475px] -translate-x-1/2 rounded-full bg-feature-pill"
            />

            {/* illustration */}
            <div className="relative mx-auto mb-6 h-[105px] w-[135px]" aria-hidden="true">
                {/* folder tab */}
                <div className="absolute left-[30px] top-[20px] h-[18px] w-[38px] rounded-t-md bg-lightPeach" />
                {/* folder body */}
                <div className="absolute left-[15px] top-[30px] flex h-[75px] w-[105px] items-center justify-center rounded-xl border border-lightPeach/60 bg-lightPeach/40">
                    <FileText className="h-7 w-7 text-primary" strokeWidth={1.75} />
                </div>
                {/* search chip */}
                <div className="absolute left-0 top-[22px] flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card shadow-sm">
                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                {/* sparkle badge */}
                <div className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                    <Sparkles className="h-4 w-4" />
                </div>
            </div>

            <div className="relative space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                    Start analyzing
                </p>
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-[26px]">
                    Your assets is empty
                </h2>
                <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
                    Upload a document to get an AI summary, key topics, and instant search
                    across everything you add.
                </p>
            </div>

            <div className="relative mt-8 flex flex-col items-center gap-3">
                <DocumentUploadDialog>
                    <Button
                        className="h-12 cursor-pointer rounded-xl bg-primary px-7 text-base font-medium text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
                        aria-label="Upload document"
                    >
                        <Upload className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />
                        Upload Document
                    </Button>
                </DocumentUploadDialog>

                <p className="mt-2 text-[11px] text-muted-foreground">
                    Your summary and topics appear as soon as the document is processed.
                </p>
            </div>

            {/* benefits */}
            <ul
                className="relative mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-3 text-left sm:grid-cols-3"
                aria-label="What you get after uploading"
            >
                {BENEFITS.map(({ icon: Icon, title, description }) => (
                    <li
                        key={title}
                        className="rounded-2xl border border-lightPeach/60 bg-feature-pill/50 p-5"
                    >
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-lightPeach/50 text-primary"
                            aria-hidden="true"
                        >
                            <Icon className="h-4 w-4" />
                        </div>
                        <p className="mt-4 text-sm font-semibold text-foreground">{title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}