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
    selectedAnalysisType: AnalysisType;
    onAnalysisTypeChange: (type: AnalysisType) => void;
    onAnalyze: (documentId: string) => void;
    onDelete: (documentId: string) => void;
    onToggleSummary: (documentId: string) => void;
    expandedSummaries: Set<string>;
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
}


export interface RecentDocumentsProps {
    documents: any[];
    orgSlug: string;
}

export interface DocumentsListProps {
    documents: Document[];
    isAnalyzing: string | null;
    selectedAnalysisType: AnalysisType;
    expandedSummaries: Set<string>;
    onAnalyze: (id: string) => void;
    onDelete: (id: string) => void;
    onToggleSummary: (id: string) => void;
    onAnalysisTypeChange: (value: AnalysisType) => void;
}

export interface DocumentsStatsProps {
    documents: Document[];
}

export interface EmptyDocumentsProps {
    onUploadSuccess: () => void;
}

//Dashboard
export interface DashboardHeaderProps {
    orgName: string;
    role: string;
    documentCount: number;
    orgSlug: string;
}

export interface EmptyDashboardProps {
    orgName: string;
    orgSlug: string;
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