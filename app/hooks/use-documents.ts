"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useOrganization } from "@clerk/nextjs";
import { AnalysisType, Document } from "@/types";
import { analysisTypes } from "@/app/data/data";

export function useDocuments() {
    const { organization } = useOrganization();

    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
    const [selectedAnalysisTypes, setSelectedAnalysisTypes] = useState<Record<string, AnalysisType>>({});
    const [expandedSummaries, setExpandedSummaries] = useState<Record<string, boolean>>({});
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const fetchDocuments = useCallback(async () => {
        if (!organization) return;

        setIsLoading(true);

        try {
            const response = await fetch(
                `/api/documents?organizationId=${organization.id}`
            );

            if (response.ok) {
                const data = await response.json();

                setDocuments(data.documents);

                setSelectedAnalysisTypes((prev) => {
                    const updated = { ...prev };

                    data.documents.forEach((doc: Document) => {
                        if (!updated[doc.id]) {
                            updated[doc.id] = "summary";
                        }
                    });

                    return updated;
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load documents");
        } finally {
            setIsLoading(false);
        }
    }, [organization]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);


    const setDocumentAnalysisType = (
        documentId: string,
        type: AnalysisType
    ) => {
        setSelectedAnalysisTypes((prev) => ({
            ...prev,
            [documentId]: type,
        }));
    };

    const handleAnalyze = useCallback(
        async (documentId: string) => {
            if (!organization) return;

            setIsAnalyzing(documentId);

            try {
                const analysisType =
                    selectedAnalysisTypes[documentId] || "summary";

                const response = await fetch("/api/analyze", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        documentId,
                        organizationId: organization.id,
                        analysisType,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Analysis failed");
                }

                const analysisTypeLabel = analysisTypes.find(
                    (type) => type.value === analysisType
                )?.label;

                toast.success(
                    `${analysisTypeLabel || "Document"} analysis completed`
                );

                await fetchDocuments();

                setExpandedSummaries((prev) => ({
                    ...prev,
                    [documentId]: true,
                }));
            } catch (error) {
                console.error(error);
                toast.error("Analysis failed");
            } finally {
                setIsAnalyzing(null);
            }
        },
        [
            organization,
            selectedAnalysisTypes,
            fetchDocuments,
        ]
    );

    const toggleSummary = useCallback(
        (documentId: string) => {
            setExpandedSummaries((prev) => ({
                ...prev,
                [documentId]: !prev[documentId],
            }));
        },
        []
    );

    const handleDelete = useCallback(
        async (documentId: string) => {
            try {
                setIsDeleting(documentId);

                const response = await fetch(
                    `/api/documents/${documentId}`,
                    {
                        method: "DELETE",
                    }
                );

                if (!response.ok) {
                    throw new Error("Delete failed");
                }

                toast.success("Document deleted");

                setSelectedAnalysisTypes((prev) => {
                    const updated = { ...prev };
                    delete updated[documentId];
                    return updated;
                });

                await fetchDocuments();
            } catch (error) {
                console.error(error);
                toast.error("Delete failed");
            } finally {
                setIsDeleting(null);
            }
        },
        [fetchDocuments]
    );

    return {
        organization,
        documents,
        isLoading,
        isAnalyzing,
        selectedAnalysisTypes,
        expandedSummaries,
        setDocumentAnalysisType,
        fetchDocuments,
        handleAnalyze,
        handleDelete,
        toggleSummary,
        isDeleting,
    };
}