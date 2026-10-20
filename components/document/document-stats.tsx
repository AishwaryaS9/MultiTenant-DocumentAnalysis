import { Brain, FileText, HardDrive, Loader } from "lucide-react";
import StatCard from "@/components/dashboard/stat-card";
import { DocumentsStatsProps } from "@/types";
import { formatFileSize } from "@/lib/utils";

export default function DocumentStats({ documents }: DocumentsStatsProps) {
    const totalDocs = documents.length;
    const analyzedDocs = documents.filter((d) => d.aiSummary).length;
    const processingDocs = documents.filter(
        (d) => d.aiSummary === null
    ).length;

    const totalStorageBytes = documents.reduce(
        (acc, doc) => acc + (doc.fileSize || 0),
        0
    );

    const MAX_DOCS_CAP = 100;
    const MAX_STORAGE_CAP = 50 * 1024 * 1024;

    const totalDocsProgress = (totalDocs / MAX_DOCS_CAP) * 100;

    const analyzedProgress =
        totalDocs > 0
            ? (analyzedDocs / totalDocs) * 100
            : 0;

    const processingProgress =
        totalDocs > 0
            ? (processingDocs / totalDocs) * 100
            : 0;

    const storageProgress =
        (totalStorageBytes / MAX_STORAGE_CAP) * 100;

    return (
        <section
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 xl:gap-6"
            aria-label="Document statistics overview"
        >
            <StatCard
                title="Total Assets"
                value={totalDocs}
                description="Documents uploaded into your workspace"
                icon={<FileText className="w-5 h-5 text-primary" aria-hidden="true" />}
                gradient="from-primary via-orange-500 to-amber-400"
                progress={totalDocsProgress}
            />

            <StatCard
                title="Analyzed"
                value={analyzedDocs}
                description="AI processed reports and summaries"
                icon={<Brain className="w-5 h-5 text-primary" aria-hidden="true" />}
                gradient="from-primary via-orange-500 to-amber-400"
                progress={analyzedProgress}
            />

            <StatCard
                title="Processing"
                value={processingDocs}
                description="Documents currently being analyzed"
                icon={<Loader className="w-5 h-5 text-primary" aria-hidden="true" />}
                gradient="from-primary via-orange-500 to-amber-400"
                progress={processingProgress}
            />

            <StatCard
                title="Storage Used"
                value={formatFileSize(totalStorageBytes)}
                description="Total cloud storage consumption"
                icon={<HardDrive className="w-5 h-5 text-primary" aria-hidden="true" />}
                gradient="from-primary via-orange-500 to-amber-400"
                progress={storageProgress}
            />
        </section>
    );
}