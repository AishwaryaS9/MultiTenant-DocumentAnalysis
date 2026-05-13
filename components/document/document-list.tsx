import { DocumentsListProps } from "@/types";
import DocumentCard from "@/components/document/document-card";

export default function DocumentList({
    documents,
    isAnalyzing,
    selectedAnalysisType,
    expandedSummaries,
    onAnalyze,
    onDelete,
    onToggleSummary,
    onAnalysisTypeChange,
}: DocumentsListProps) {
    return (
        <div className="space-y-6">
            {documents.map((doc) => (
                <DocumentCard
                    key={doc.id}
                    document={doc}
                    isAnalyzing={isAnalyzing === doc.id}
                    selectedAnalysisType={selectedAnalysisType}
                    onAnalysisTypeChange={onAnalysisTypeChange}
                    onAnalyze={onAnalyze}
                    onDelete={onDelete}
                    onToggleSummary={onToggleSummary}
                    expandedSummaries={expandedSummaries}
                />
            ))}
        </div>
    );
}