import { images } from "@/assets";
import { AnalysisType } from "@/types";
import { Building2, FileUp, Hash, List, MessageCircle, MessageSquare, Sparkles, UserPlus, Zap } from "lucide-react";

export const steps = [
    {
        title: "Create Your Workspace",
        description:
            "Set up your Docinate account in seconds and personalize your AI-powered document hub.",
        icon: UserPlus,
    },
    {
        title: "Collaborate with Your Team",
        description:
            "Invite teammates, organize projects, and manage all your documents in one secure workspace.",
        icon: Building2,
    },
    {
        title: "Upload & Organize Documents",
        description:
            "Drag and drop PDFs, reports, contracts, or research files for instant processing and indexing.",
        icon: FileUp,
    },
    {
        title: "Unlock Instant AI Insights",
        description:
            "Receive summaries, key highlights, trends, and actionable insights within seconds.",
        icon: Zap,
    },
];
export const allowedTypes = [
    "text/plain",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
    "text/markdown",
];

export const analysisTypes: {
    value: AnalysisType;
    label: string;
    description: string;
    icon: React.ComponentType<any>;
}[] = [
        {
            value: "summary",
            label: "Summary",
            description: "Generate comprehensive document summary",
            icon: Sparkles,
        },
        {
            value: "qa",
            label: "Q&A",
            description: "Generate questions and answers from document",
            icon: MessageCircle,
        },
        {
            value: "sentiment",
            label: "Sentiment",
            description: "Analyze tone and emotional sentiment",
            icon: MessageSquare,
        },
        {
            value: "entities",
            label: "Entities",
            description: "Extract names, places, organizations",
            icon: Hash,
        },
        {
            value: "extract",
            label: "Extract",
            description: "Extract structured information",
            icon: List,
        },
    ];

// Format file size
export const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " bytes";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};


export const testimonials = [
    { text: "Such an innovative solution", avatar: "🚀" },
    { text: "If you are worried about your data or privacy this is the way to go", avatar: "🔒" },
    { text: "This application is impressive", avatar: "✨" },
    { text: "For sure a keeper", avatar: "👤" },
    { text: "Such Power features - applying a prompt to each section", avatar: "🔥" },
    { text: "I purchased and Love it!", avatar: "⭐" },
];


export const features = [
    {
        badge: "DEEP DIVE",
        title: "Go deeper than ever into long documents",
        description: "Our AI intelligently breaks down documents and creates multiple search indexes for more accurate, thorough analysis.",
        // image: images.feature_deep_dive,
        image: images.feature_one,
        bgColor: "bg-white",
    },
    {
        badge: "FLOW AI",
        title: "Smaller inputs to AI enable greater precision",
        description: "Our AI intelligently breaks down documents and creates multiple search indexes for more accurate and thorough analysis.",
        // image: images.feature_flow_ai,
        image: images.feature_two,
        bgColor: "bg-white",
    },
    {
        badge: "TABLE AI",
        title: "Easily manage and analyze multiple documents",
        description: "Visualize complex analysis with ease—AI works on every document and returns results in a structured table.",
        // image: images.feature_table_ai,
        image: images.feature_three,
        bgColor: "bg-white",
    },
    {
        badge: "LOCAL LLM SUPPORT",
        title: "Run document analysis without sending data to the cloud",
        description: "Perfect for users focused on data privacy and security.",
        // image: images.feature_local_llm,
        image: images.feature_four,
        bgColor: "bg-white",
    },
];

export const searchSuggestions = [
    "Invoices",
    "Contracts",
    "Reports",
    "Meeting Notes",
    "AI Keywords",
]