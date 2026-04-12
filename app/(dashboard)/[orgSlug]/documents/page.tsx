"use client"
import { useEffect, useState } from "react";
import DocumentUploadDialog from "@/components/document/document-upload-dialog";
import { useOrganization } from "@clerk/nextjs";
import { AnalysisType, Document } from "@/types";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { analysisTypes, formatFileSize } from "@/app/data/data";
import { FileText, Loader, Loader2 } from "lucide-react";
import DocumentCard from "@/components/document/document-card";

export default function DocumentsPage() {
    const { organization } = useOrganization();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
    const [selectedAnalysisType, setSelectedAnalysisType] = useState<AnalysisType>("summary");
    const [expandedSummaries, setExpandedSummaries] = useState<Set<string>>(new Set())

    const handleAnalyze = async (documentId: string) => {
        if (!organization) return;
        setIsAnalyzing(documentId);
        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    documentId,
                    organizationId: organization.id,
                    analysisType: selectedAnalysisType
                })
            });
            if (response.ok) {
                const data = await response.json();
                const analysisTypeLabel = analysisTypes.find((type) => type.value === selectedAnalysisType)?.label;
                toast.success(`${analysisTypeLabel || "Document"} analysis completedd successfully!`)
                fetchDocuments();
                setExpandedSummaries((prev) => new Set(prev).add(documentId));
            } else {
                const error = await response.json();
                toast.error(error.error || "Analysis failed");
            }
        } catch (error) {
            console.error("Analysis error:", error);
            toast.error("Analysis failed");
        } finally {
            setIsAnalyzing(null);
        }
    }

    const handleDelete = async (documentId: string) => {
        if (!confirm("Are you sure you wany to delete this document?")) return;
        try {
            const response = await fetch(`/api/documents/${documentId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                toast.success("Document deleted successfully");
                fetchDocuments();
            } else {
                toast.error("Failed to delete document");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete document");
        }
    }

    const toggleSummary = (documentId: string) => {
        const newExpanded = new Set(expandedSummaries);
        if (newExpanded.has(documentId)) {
            newExpanded.delete(documentId)
        } else {
            newExpanded.add(documentId);
        }
        setExpandedSummaries(newExpanded);
    }

    const fetchDocuments = async () => {
        if (!organization) return;
        setIsLoading(true);
        try {
            const response = await fetch(`/api/documents?organizationId=${organization.id}`)
            if (response.ok) {
                const data = await response.json();
                setDocuments(data.documents);
            }
        } catch (error) {
            console.error("Failed to fetch documents", error);
            toast.error("Failed to load documents");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchDocuments();
    }, [organization]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Documents</h1>
                    <p className="text-gray-600">Upload and analyze documents in {organization?.name}</p>
                </div>
                {/* Upload Dialog */}
                <DocumentUploadDialog onUploadSuccess={fetchDocuments} />
            </div>
            {/* Stats Bar */}
            {documents.length > 0 && !isLoading &&
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold">
                                    {documents.length}
                                </div>
                                <p className="text-sm text-gray-500">Total Documents</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600">
                                    {documents.filter((d) => d.aiSummary).length}
                                </div>
                                <p className="text-sm text-gray-500">Analyzed</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600">
                                    {
                                        formatFileSize(documents.reduce((acc, doc) => acc + (doc.fileSize || 0), 0))
                                    }
                                </div>
                                <p className="text-sm text-gray-500">Total Size</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            }
            {/* Document List */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Documents ({documents.length})
                        {isLoading && (
                            <Loader className="h-4 w-4 inline ml-2 animate-spin" />
                        )}
                    </CardTitle>
                    <CardDescription>
                        {documents.filter((d) => d.aiSummary).length} analyzed •{" "}
                        {documents.filter((d) => !d.aiSummary).length} pending
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <>
                            <div className="text-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                                <p className="text-gray-600">Loading documents...</p>
                            </div>
                        </>
                    ) : (
                        documents.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600">No documents uploaded yet</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Upload your first document to get started
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {documents.map((doc) => (
                                    <DocumentCard
                                        key={doc.id}
                                        document={doc}
                                        isAnalyzing={isAnalyzing === doc.id}
                                        selectedAnalysisType={selectedAnalysisType}
                                        onAnalysisTypeChange={setSelectedAnalysisType}
                                        onAnalyze={handleAnalyze}
                                        onDelete={handleDelete}
                                        onToggleSummary={toggleSummary}
                                        expandedSummaries={expandedSummaries}
                                        formatFileSize={formatFileSize}
                                    />
                                ))}
                            </div>
                        )
                    )}
                </CardContent>
            </Card>
        </div >
    );
}