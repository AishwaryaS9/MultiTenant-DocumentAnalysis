import { DocumentsListProps } from "@/types";
import DocumentCard from "@/components/document/document-card";

export default function DocumentList({
    documents,
    isAnalyzing,
    isDeleting,
    selectedAnalysisTypes,
    expandedSummaries,
    onAnalyze,
    onDelete,
    onToggleSummary,
    onAnalysisTypeChange,
}: DocumentsListProps) {
    return (
        <div className="space-y-6" aria-label="Organization documents list">
            {documents.map((doc) => (
                <DocumentCard
                    key={doc.id}
                    document={doc}
                    isAnalyzing={isAnalyzing === doc.id}
                    isDeleting={isDeleting === doc.id}
                    selectedAnalysisType={
                        selectedAnalysisTypes[doc.id] || "summary"
                    }
                    onAnalysisTypeChange={(value) =>
                        onAnalysisTypeChange(doc.id, value)
                    }
                    onAnalyze={onAnalyze}
                    onDelete={onDelete}
                    onToggleSummary={onToggleSummary}
                    expandedSummaries={expandedSummaries}
                />
            ))}
        </div>
    );
}