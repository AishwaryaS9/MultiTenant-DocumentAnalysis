import { LucideIcon } from "lucide-react";
import React from "react";

export type AnalysisType =
    | "summary"
    | "qa"
    | "sentiment"
    | "entities"
    | "extract";

//Landing section
export interface DifferentiatorProps {
    num: string;
    icon: LucideIcon;
    title: string;
    description: string;
}

//Document
export interface Document {
    id: string;
    name: string;
    status?: 'idle' | 'analyzing' | 'failed' | 'success';
    fileUrl?: string | null;
    fileSize?: number | null;
    fileType?: string | null;
    aiSummary?: string | null;
    aiKeywords: string[];
    sentiment?: string | null;
    createdAt: string | Date;
    user: {
        name?: string | null;
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
    // onUploadSuccess?: () => void;
    onUploadSuccess?: () => Promise<void> | void;
    children?: React.ReactNode;
}

export interface DocumentItemProps {
    doc: {
        id: string;
        name: string;
        createdAt: string | Date;
        aiSummary?: string | null;
    };
}

export interface DocumentsHeaderProps {
    organizationName?: string;
    onUploadSuccess: () => void;
    orgSlug: string;
}


export interface RecentDocumentsProps {
    documents: Document[];
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

export interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description?: string;
    gradient?: string;
    progress?: number;
};

//Dashboard
export interface DashboardHeaderProps {
    orgName: string;
    role: string;
    // documentCount: number;
    orgSlug: string;
}

export interface AIProgressCardProps {
    percentage: number;
}

export interface AIInsightCardProps {
    role: string;
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
    document: Document;
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
    organization?: Organization | null;
    user?: User | null;
    memberships: Membership[];
    setActive?: (params: { organization: string }) => Promise<void>;
    onSwitch?: () => void;
}

export interface MobileWorkspaceSwitcherProps {
    organization?: Organization | null;
    user?: User | null;
    memberships: Membership[];
    setActive?: (params: { organization: string }) => Promise<void>;
    onSwitch?: () => void;
}

//Organization
export interface Organization {
    id: string;
    name: string;
    // slug?: string;
    slug?: string | null;
    clerkOrgId?: string;
}

export interface User {
    id?: string;
    name?: string | null;
    firstName?: string | null;
    email?: string | null;
}

export interface Membership {
    id?: string;
    role: string;
    organization: Organization;
}

export interface OrganizationMembersProps {
    params: Promise<{ orgSlug: string }>;
    searchParams: Promise<{
        search?: string;
        role?: string;
        sort?: string;
        page?: string;
    }>;
}

export interface OrganizationMember {
    id?: string;
    organizationId?: string;
    role: string;
    user: {
        clerkUserId: string;
        createdAt: string | Date;
        email?: string | null;
        name?: string | null;
        id: string;
    };
}


export interface Testimonial {
    text: string;
    avatar?: React.ReactNode;
}

export interface ClerkWebhookEventData {
    id?: string;
    email_addresses?: Array<{ email_address?: string }>;
    first_name?: string;
    last_name?: string;
    organization?: {
        id?: string;
    };
    organization_id?: string;
    public_user_data?: {
        user_id?: string;
        identifier?: string;
        first_name?: string;
        last_name?: string;
    };
    user_id?: string;
    email_address?: string;
    role?: string;
}

export interface ClerkWebhookEvent {
    type: string;
    data: ClerkWebhookEventData;
}

export interface GenerateAnalysisPDFParams {
    name: string;
    createdAt: string | Date;
    aiSummary?: string | null;
    aiKeywords?: string[];
    sentiment?: string | null;
    user?: {
        name?: string | null;
        email: string;
    };
}

//Analytics
export interface AnalyticsCardProps {
    totalAnalyzed: number;
    aiCoverage: number;
    activeUsers: number;
    pendingAnalysis: number;
}

export interface DocumentTypesChartProps {
    title: string;
    data: {
        name: string;
        value: number;
    }[];
}

export interface DocumentsByUserChartProps {
    data: {
        user: string;
        uploads: number;
    }[];
}

export interface DocumentsChartProps {
    data: {
        day: string;
        documents: number;
    }[];
}

export interface TopKeywordsChartProps {
    data: {
        keyword: string;
        count: number;
    }[];
}

export interface AnalysisStatusChartProps {
    data: {
        name: string;
        value: number;
    }[];
}
