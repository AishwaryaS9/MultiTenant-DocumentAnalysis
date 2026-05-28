export type AnalysisType =
    | "summary"
    | "qa"
    | "sentiment"
    | "entities"
    | "extract";


//Document
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
    isDeleting?: boolean;
    selectedAnalysisType: AnalysisType;
    onAnalysisTypeChange: (
        value: AnalysisType
    ) => void;
    onAnalyze: (documentId: string) => void;
    // onDelete: (documentId: string) => void;
    onDelete: (documentId: string) => Promise<void>;
    onToggleSummary: (documentId: string) => void;
    expandedSummaries: Record<string, boolean>;
}

export interface DocumentUploadDialogProps {
    onUploadSuccess?: () => void;
    trigger?: React.ReactNode;
}

export interface DocumentItemProps {
    doc: {
        id: string;
        name: string;
        createdAt: Date;
        aiSummary: string | null;
    };
}

export interface DocumentsHeaderProps {
    organizationName?: string;
    onUploadSuccess: () => void;
    orgSlug: string;
}


export interface RecentDocumentsProps {
    documents: any[];
    orgSlug: string;
}

export interface DocumentsListProps {
    documents: Document[];
    isAnalyzing: string | null;
    isDeleting: string | null;
    expandedSummaries: Record<string, boolean>;
    onAnalyze: (id: string) => void;
    // onDelete: (id: string) => void;
    onDelete: (id: string) => Promise<void>;
    onToggleSummary: (id: string) => void;
    selectedAnalysisTypes: Record<string, AnalysisType>;
    onAnalysisTypeChange: (
        documentId: string,
        value: AnalysisType
    ) => void;
}

export interface DocumentsStatsProps {
    documents: Document[];
}

export interface EmptyDocumentsProps {
    onUploadSuccess: () => void;
}

export interface DeleteDocumentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isDeleting?: boolean;
    documentName?: string;
}


//Dashboard
export interface DashboardHeaderProps {
    orgName: string;
    role: string;
    // documentCount: number;
    orgSlug: string;
}

export interface EmptyDashboardProps {
    orgName: string;
    orgSlug: string;
    role: string;
}

//Search
export interface SearchHeaderProps {
    query: string;
    resultsCount: number;
}

export interface SearchFormProps {
    query: string;
}

export interface NoResultsStateProps {
    query: string;
}

export interface SearchResultProps {
    document: any;
}

export interface SearchPageProps {
    params: Promise<{
        orgSlug: string;
    }>;
    searchParams: Promise<{
        query?: string;
    }>;
}


//Workspace
export interface DesktopWorkspaceSwitcherProps {
    organization: any;
    user: any;
    memberships: any[];
    setActive?: (params: { organization: string }) => Promise<void>;
    onSwitch?: () => void;
}

export interface MobileWorkspaceSwitcherProps {
    organization: any;
    user: any;
    memberships: any[];
    setActive?: (params: { organization: string }) => Promise<void>;
    onSwitch?: () => void;
}