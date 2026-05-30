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
        isDeleting,
        selectedAnalysisTypes,
        expandedSummaries,
        setDocumentAnalysisType,
        fetchDocuments,
        handleAnalyze,
        handleDelete,
        toggleSummary,
    } = useDocuments();

    return (
        <main className="relative min-h-screen overflow-hidden bg-slate-50/50" role="main" aria-label="Documents dashboard">
            <AmbientBackground />

            <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 py-6 sm:py-8 space-y-8 sm:space-y-10">
                <DocumentHeader
                    organizationName={organization?.name}
                    onUploadSuccess={fetchDocuments}
                    orgSlug={organization?.slug || ""}
                />

                {documents.length > 0 && !isLoading && (
                    <section aria-label="Document statistics">
                        <DocumentStats documents={documents} />
                    </section>
                )}

                <section aria-live="polite" aria-busy={isLoading}>
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
                            isDeleting={isDeleting}
                            selectedAnalysisTypes={selectedAnalysisTypes}
                            expandedSummaries={expandedSummaries}
                            onAnalyze={handleAnalyze}
                            onDelete={handleDelete}
                            onToggleSummary={toggleSummary}
                            onAnalysisTypeChange={setDocumentAnalysisType}
                        />
                    )}
                </section>
            </div>
        </main>
    );
}