import { Brain, FileText, HardDrive } from "lucide-react";
import StatCard from "@/components/dashboard/stat-card";
import { DocumentsStatsProps } from "@/types";
import { formatFileSize } from "@/app/data/data";

export default function DocumentStats({ documents }: DocumentsStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                title="Total Assets"
                value={documents.length}
                icon={
                    <FileText className="w-5 h-5 text-orange-600" />
                }
                gradient="from-orange-50 to-orange-100/50"
            />

            <StatCard
                title="Analyzed"
                value={
                    documents.filter((d) => d.aiSummary).length
                }
                icon={
                    <Brain className="w-5 h-5 text-emerald-600" />
                }
                gradient="from-emerald-50 to-teal-50"
            />

            <StatCard
                title="Storage Used"
                value={formatFileSize(
                    documents.reduce(
                        (acc, doc) => acc + (doc.fileSize || 0),
                        0
                    )
                )}
                icon={
                    <HardDrive className="w-5 h-5 text-blue-600" />
                }
                gradient="from-blue-50 to-indigo-50"
            />
        </div>
    );
}