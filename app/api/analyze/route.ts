export const runtime = "nodejs";
export const maxDuration = 120;

import { ANALYSIS_TYPES, analyzeWithGemini, GeminiAnalysisError, type GeminiAnalysisType } from "@/lib/gemini";
import { DocumentExtractionError, loadDocumentForAnalysis } from "@/lib/document-extractor";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        //Check auth
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Please sign in" }, { status: 401 });
        }
        //Get request data
        const { documentId, organizationId, analysisType = "summary" } = await request.json();
        if (!documentId || !organizationId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        if (!ANALYSIS_TYPES.includes(analysisType)) {
            return NextResponse.json({ error: "Invalid analysis type" }, { status: 400 });
        }
        //Find document
        const document = await prisma.document.findFirst({
            where: {
                id: documentId,
                organization: {
                    clerkOrgId: organizationId,
                    members: {
                        some: {
                            user: { clerkUserId: userId },
                        },
                    },
                },
            },
        });
        if (!document) {
            return NextResponse.json({ error: "Document not found or no access" }, { status: 404 });
        }
        //Get the real content: (PDF, scanned PDF, Word, Excel, PowerPoint, ...)
        const prepared = await loadDocumentForAnalysis(document);
        //Analysis using gemini ai
        const result = await analyzeWithGemini(prepared, analysisType as GeminiAnalysisType);
        //Save result ot DB
        const updateDocument = await prisma.document.update({
            where: {
                id: documentId,
            },
            data: {
                aiSummary: result.analysis,
                aiKeywords: result.keywords,
                sentiment: analysisType,
            }
        })
        return NextResponse.json({
            success: true,
            summary: result.analysis,
            keywords: result.keywords,
            document: {
                id: updateDocument.id,
                name: updateDocument.name,
                aiSummary: updateDocument.aiSummary
            }
        });

    } catch (error: unknown) {
        console.error("Analysis error", error);
        if (error instanceof DocumentExtractionError) {
            return NextResponse.json({ error: error.message }, { status: 422 });
        }
        if (error instanceof GeminiAnalysisError) {
            return NextResponse.json({ error: error.message }, { status: 502 });
        }
        const msg = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: msg || "Analysis failed" }, { status: 500 });
    }

}
