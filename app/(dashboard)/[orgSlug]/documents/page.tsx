"use client"
import { useEffect, useState } from "react";
import DocumentUploadDialog from "@/components/document/document-upload-dialog";
import { useOrganization } from "@clerk/nextjs";
import { AnalysisType, Document } from "@/types";
import { toast } from "sonner";
import { analysisTypes, formatFileSize } from "@/app/data/data";
import { Brain, Building, FilePlus, FileText, HardDrive, Loader2 } from "lucide-react";
import DocumentCard from "@/components/document/document-card";
import StatCard from "@/components/dashboard/stat-card";

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
        <div className="max-w-7xl mx-auto space-y-10 py-6 px-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 p-6 rounded-2xl border border-slate-200 backdrop-blur-sm shadow-sm">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">Documents</h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2 font-medium">
                        <Building className="w-4 h-4" />
                        Managing assets for <span className="text-slate-900">{organization?.name}</span>
                    </p>
                </div>
                <DocumentUploadDialog onUploadSuccess={fetchDocuments} />
            </div>


            {/* Stats Bar */}
            {documents.length > 0 && !isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Assets"
                        value={documents.length}
                        icon={<FileText className="w-5 h-5 text-blue-600" />}
                        gradient="from-blue-50 to-indigo-50"
                    />
                    <StatCard
                        title="Analyzed"
                        value={documents.filter(d => d.aiSummary).length}
                        icon={<Brain className="w-5 h-5 text-emerald-600" />}
                        gradient="from-emerald-50 to-teal-50"
                    />
                    <StatCard
                        title="Storage Used"
                        value={formatFileSize(documents.reduce((acc, doc) => acc + (doc.fileSize || 0), 0))}
                        icon={<HardDrive className="w-5 h-5 text-amber-600" />}
                        gradient="from-amber-50 to-orange-50"
                    />
                </div>
            )}
            {/* Document List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        Files
                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                            {documents.length}
                        </span>
                    </h2>
                </div>

                {isLoading ? (
                    <div className="bg-white border rounded-3xl py-24 flex flex-col items-center justify-center space-y-4 shadow-sm">
                        <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
                        <p className="text-slate-500 font-medium animate-pulse">Retrieving vault assets...</p>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl py-20 flex flex-col items-center text-center px-4">
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6">
                            <FilePlus className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Your vault is empty</h3>
                        <p className="text-slate-500 max-w-sm mt-2">
                            Upload documents to start generating AI insights, summaries, and sentiment analysis.
                        </p>
                        <div className="mt-8">
                            <DocumentUploadDialog onUploadSuccess={fetchDocuments} />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
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
                )}
            </div>
        </div>
    );
}

