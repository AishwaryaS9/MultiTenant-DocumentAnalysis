"use client";
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

    const [selectedAnalysisType, setSelectedAnalysisType] =
        useState<AnalysisType>("summary");

    const [expandedSummaries, setExpandedSummaries] = useState<Set<string>>(
        new Set()
    );

    const handleAnalyze = async (documentId: string) => {
        if (!organization) return;

        setIsAnalyzing(documentId);

        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    documentId,
                    organizationId: organization.id,
                    analysisType: selectedAnalysisType,
                }),
            });

            if (response.ok) {
                const analysisTypeLabel = analysisTypes.find(
                    (type) => type.value === selectedAnalysisType
                )?.label;

                toast.success(
                    `${analysisTypeLabel || "Document"} analysis completed successfully!`
                );

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
    };

    const handleDelete = async (documentId: string) => {
        if (!confirm("Are you sure you want to delete this document?")) return;

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
    };

    const toggleSummary = (documentId: string) => {
        const newExpanded = new Set(expandedSummaries);

        if (newExpanded.has(documentId)) {
            newExpanded.delete(documentId);
        } else {
            newExpanded.add(documentId);
        }

        setExpandedSummaries(newExpanded);
    };

    const fetchDocuments = async () => {
        if (!organization) return;

        setIsLoading(true);

        try {
            const response = await fetch(
                `/api/documents?organizationId=${organization.id}`
            );

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
    };

    useEffect(() => {
        fetchDocuments();
    }, [organization]);

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#fafafa]">
            {/* Ambient Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-125 h-125 bg-orange-100 rounded-full blur-3xl opacity-20" />
                <div className="absolute bottom-0 right-1/4 w-100 h-100 bg-blue-100 rounded-full blur-3xl opacity-20" />
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
                {/* Header */}
                <div className="relative overflow-hidden rounded-[32px] border border-white/40 bg-white/70 backdrop-blur-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
                    <div className="absolute inset-0 bg-linear-to-br from-orange-50/40 via-transparent to-transparent" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
                                Documents
                            </h1>

                            <p className="mt-3 flex items-center gap-2 text-slate-500 font-medium">
                                <Building className="w-4 h-4" />
                                Managing assets for{" "}
                                <span className="text-slate-900">
                                    {organization?.name}
                                </span>
                            </p>
                        </div>

                        <DocumentUploadDialog onUploadSuccess={fetchDocuments} />
                    </div>
                </div>

                {/* Stats */}
                {documents.length > 0 && !isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            title="Total Assets"
                            value={documents.length}
                            icon={<FileText className="w-5 h-5 text-orange-600" />}
                            gradient="from-orange-50 to-orange-100/50"
                        />

                        <StatCard
                            title="Analyzed"
                            value={documents.filter((d) => d.aiSummary).length}
                            icon={<Brain className="w-5 h-5 text-emerald-600" />}
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
                            icon={<HardDrive className="w-5 h-5 text-blue-600" />}
                            gradient="from-blue-50 to-indigo-50"
                        />
                    </div>
                )}

                {/* File Header */}
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-semibold tracking-tight text-[#1A1A1A] flex items-center gap-3">
                        Files
                        <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-sm">
                            {documents.length}
                        </span>
                    </h2>
                </div>

                {/* Loading */}
                {isLoading ? (
                    <div className="rounded-[32px] border border-white/40 bg-white/70 backdrop-blur-xl py-24 flex flex-col items-center justify-center shadow-xl">
                        <Loader2 className="h-10 w-10 animate-spin text-slate-400" />

                        <p className="mt-4 text-slate-500 font-medium">
                            Retrieving vault assets...
                        </p>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="rounded-[32px] border border-white/40 bg-white/70 backdrop-blur-xl py-20 px-6 text-center shadow-xl">
                        <div className="w-24 h-24 mx-auto rounded-3xl bg-linear-to-br from-orange-100 to-orange-50 flex items-center justify-center shadow-lg">
                            <FilePlus className="w-10 h-10 text-orange-500" />
                        </div>

                        <h3 className="mt-6 text-2xl font-semibold text-[#1A1A1A]">
                            Your vault is empty
                        </h3>

                        <p className="mt-3 max-w-md mx-auto text-slate-500 leading-relaxed">
                            Upload documents to start generating AI insights,
                            summaries, and sentiment analysis.
                        </p>

                        <div className="mt-8">
                            <DocumentUploadDialog onUploadSuccess={fetchDocuments} />
                        </div>
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
                )}
            </div>
        </div>
    );
}