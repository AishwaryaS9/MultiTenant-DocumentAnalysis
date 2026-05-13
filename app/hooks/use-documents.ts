"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useOrganization } from "@clerk/nextjs";
import { AnalysisType, Document } from "@/types";
import { analysisTypes } from "@/app/data/data";

export function useDocuments() {
    const { organization } = useOrganization();

    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);

    const [selectedAnalysisType, setSelectedAnalysisType] =
        useState<AnalysisType>("summary");

    const [expandedSummaries, setExpandedSummaries] =
        useState<Set<string>>(new Set());

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
            console.error(error);
            toast.error("Failed to load documents");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [organization]);

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
                    `${analysisTypeLabel || "Document"} analysis completed`
                );

                fetchDocuments();

                setExpandedSummaries(
                    (prev) => new Set(prev).add(documentId)
                );
            }
        } catch (error) {
            console.error(error);
            toast.error("Analysis failed");
        } finally {
            setIsAnalyzing(null);
        }
    };

    const handleDelete = async (documentId: string) => {
        try {
            const response = await fetch(
                `/api/documents/${documentId}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                toast.success("Document deleted");
                fetchDocuments();
            }
        } catch (error) {
            console.error(error);
            toast.error("Delete failed");
        }
    };

    const toggleSummary = (documentId: string) => {
        const updated = new Set(expandedSummaries);

        if (updated.has(documentId)) {
            updated.delete(documentId);
        } else {
            updated.add(documentId);
        }

        setExpandedSummaries(updated);
    };

    return {
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
    };
}