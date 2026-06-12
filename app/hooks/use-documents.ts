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

    const { data: documents = [], isLoading } =
        useGetDocumentsQuery(organizationId ?? skipToken);

    const [analyzeDocument, { isLoading: isAnalyzing }] =
        useAnalyzeDocumentMutation();

    const [deleteDocument, { isLoading: isDeleting }] =
        useDeleteDocumentMutation();

    const [selectedAnalysisTypes, setSelectedAnalysisTypes] =
        useState<Record<string, AnalysisType>>({});

    const [expandedSummaries, setExpandedSummaries] =
        useState<Record<string, boolean>>({});

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
        }
    };

    const handleDelete = async (documentId: string) => {
        try {
            await deleteDocument({ documentId }).unwrap();
            toast.success("Document deleted");
        } catch {
            toast.error("Delete failed");
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
        isAnalyzing,
        isDeleting,
        selectedAnalysisTypes,
        expandedSummaries,
        setDocumentAnalysisType,
        handleAnalyze,
        handleDelete,
        toggleSummary,
    };
}