export type AnalysisType =
    | "summary"
    | "qa"
    | "sentiment"
    | "entities"
    | "extract";

export interface Document {
    id: string;
    name: string;
    status?: 'idle' | 'analyzing' | 'failed' | 'success';
    fileUrl?: string;
    fileSize?: number;
    fileType?: string;
    aiSummary?: string;
    aiKeywords: string[];
    sentiment?: string;
    createdAt: string;
    user: {
        name?: string;
        email: string;
    };
}

export interface DocumentCardProps {
    document: Document;
    isAnalyzing: boolean;
    selectedAnalysisType: AnalysisType;
    onAnalysisTypeChange: (type: AnalysisType) => void;
    onAnalyze: (documentId: string) => void;
    onDelete: (documentId: string) => void;
    onToggleSummary: (documentId: string) => void;
    expandedSummaries: Set<string>;
    formatFileSize: (bytes?: number) => string;
}

export interface DocumentUploadDialogProps {
    onUploadSuccess?: () => void;
    trigger?: React.ReactNode;
}