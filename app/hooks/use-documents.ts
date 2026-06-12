"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useOrganization } from "@clerk/nextjs";
import { analysisTypes } from "@/app/data/data";
import { useGetDocumentsQuery, useAnalyzeDocumentMutation, useDeleteDocumentMutation } from "@/app/store/services/documentsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import type { AnalysisType } from "@/types";

export function useDocuments() {
    const { organization } = useOrganization();
    const organizationId = organization?.id;

    const { data: documents = [], isLoading, refetch } = useGetDocumentsQuery(organizationId ?? skipToken);

    const [analyzeDocument] = useAnalyzeDocumentMutation();

    const [deleteDocument] = useDeleteDocumentMutation();

    const [selectedAnalysisTypes, setSelectedAnalysisTypes] =
        useState<Record<string, AnalysisType>>({});

    const [expandedSummaries, setExpandedSummaries] =
        useState<Record<string, boolean>>({});

    const [analyzingId, setAnalyzingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const setDocumentAnalysisType = (
        documentId: string,
        type: AnalysisType
    ) => {
        setSelectedAnalysisTypes((prev) => ({
            ...prev,
            [documentId]: type,
        }));
    };

    const handleAnalyze = async (documentId: string) => {
        try {
            setAnalyzingId(documentId);

            const analysisType =
                selectedAnalysisTypes[documentId] || "summary";

            await analyzeDocument({
                documentId,
                organizationId: organizationId!,
                analysisType,
            }).unwrap();

            const analysisTypeLabel = analysisTypes.find(
                (type) => type.value === analysisType
            )?.label;

            toast.success(
                `${analysisTypeLabel || "Document"} analysis completed`
            );

            setExpandedSummaries((prev) => ({
                ...prev,
                [documentId]: true,
            }));
        } catch {
            toast.error("Analysis failed");
        } finally {
            setAnalyzingId(null);
        }
    };

    const handleDelete = async (documentId: string) => {
        try {
            setDeletingId(documentId);

            await deleteDocument({ documentId }).unwrap();

            toast.success("Document deleted");
        } catch {
            toast.error("Delete failed");
        } finally {
            setDeletingId(null);
        }
    };

    const toggleSummary = (documentId: string) => {
        setExpandedSummaries((prev) => ({
            ...prev,
            [documentId]: !prev[documentId],
        }));
    };
  return {
        organization,
        documents,
        isLoading,
        refetch,
        analyzingId,
        deletingId,
        selectedAnalysisTypes,
        expandedSummaries,
        setDocumentAnalysisType,
        handleAnalyze,
        handleDelete,
        toggleSummary,
    };
}