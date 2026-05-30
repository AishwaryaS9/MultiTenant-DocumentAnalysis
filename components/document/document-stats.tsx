import { Brain, FileText, HardDrive } from "lucide-react";
import StatCard from "@/components/dashboard/stat-card";
import { DocumentsStatsProps } from "@/types";
import { formatFileSize } from "@/app/data/data";

export default function DocumentStats({ documents }: DocumentsStatsProps) {
    const totalDocs = documents.length;

    const analyzedDocs = documents.filter((d) => d.aiSummary).length;

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

    const storageProgress =
        (totalStorageBytes / MAX_STORAGE_CAP) * 100;

    return (
        <section
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6"
            aria-label="Document statistics overview"
        >
            <StatCard
                title="Total Assets"
                value={totalDocs}
                description="Documents uploaded into your workspace"
                icon={<FileText className="w-5 h-5 text-orange-600" aria-hidden="true" />}
                gradient="from-orange-400 via-orange-500 to-amber-400"
                progress={totalDocsProgress}
            />

            <StatCard
                title="Analyzed"
                value={analyzedDocs}
                description="AI processed reports and summaries"
                icon={<Brain className="w-5 h-5 text-emerald-600" aria-hidden="true" />}
                gradient="from-emerald-400 via-emerald-500 to-teal-400"
                progress={analyzedProgress}
            />

            <StatCard
                title="Storage Used"
                value={formatFileSize(totalStorageBytes)}
                description="Total cloud storage consumption"
                icon={<HardDrive className="w-5 h-5 text-blue-600" aria-hidden="true" />}
                gradient="from-blue-400 via-blue-500 to-indigo-400"
                progress={storageProgress}
            />
        </section>
    );
}