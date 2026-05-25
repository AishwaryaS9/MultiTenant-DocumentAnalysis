import { analyzeWithGemini } from "@/lib/gemini";
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
        const { documentId, organizationId, analysisType } = await request.json();
        if (!documentId || !organizationId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
        //Get content
        const content = document.content || document.name;
        if (!content) {
            return NextResponse.json({ error: "Document has no content to analyze" }, { status: 400 });
        }
        //Analysis using gemini ai
        const result = await analyzeWithGemini(content, analysisType);
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
        // return response
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

    } catch (error: any) {
        console.error("Analysis error", error);
        return NextResponse.json({ error: error.message || "Analysis failed" }, { status: 500 });
    }

}