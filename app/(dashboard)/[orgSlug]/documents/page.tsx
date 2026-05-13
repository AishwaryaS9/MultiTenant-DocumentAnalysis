"use client";
import { useDocuments } from "@/app/hooks/use-documents";
import AmbientBackground from "@/components/document/ambient-background";
import DocumentHeader from "@/components/document/document-header";
import DocumentList from "@/components/document/document-list";
import DocumentStats from "@/components/document/document-stats";
import EmptyDocuments from "@/components/document/empty-document";
import LoadingDocuments from "@/components/document/loading-documents";

export default function DocumentsPage() {
    const {
        organization,
        documents,
        isLoading,
        isAnalyzing,
        selectedAnalysisType,
        expandedSummaries,
        setSelectedAnalysisType,
        fetchDocuments,
        handleAnalyze,
        handleDelete,
        toggleSummary,
    } = useDocuments();

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#fafafa]">
            <AmbientBackground />

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

                <DocumentHeader
                    organizationName={organization?.name}
                    onUploadSuccess={fetchDocuments}
                />

                {documents.length > 0 && !isLoading && (
                    <DocumentStats documents={documents} />
                )}

                {isLoading ? (
                    <LoadingDocuments />
                ) : documents.length === 0 ? (
                    <EmptyDocuments
                        onUploadSuccess={fetchDocuments}
                    />
                ) : (
                    <DocumentList
                        documents={documents}
                        isAnalyzing={isAnalyzing}
                        selectedAnalysisType={selectedAnalysisType}
                        expandedSummaries={expandedSummaries}
                        onAnalyze={handleAnalyze}
                        onDelete={handleDelete}
                        onToggleSummary={toggleSummary}
                        onAnalysisTypeChange={
                            setSelectedAnalysisType
                        }
                    />
                )}
            </div>
        </div>
    );
}