export const runtime = "nodejs";
import { uploadToBlob } from "@/lib/blob";
import { analyzeWithGemini } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const name = formData.get("name") as string;
        const content = formData.get("content") as string;
        const clerkOrgId = formData.get("organizationId") as string;
        const file = formData.get("file") as File;

        if (!clerkOrgId || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const organization = await prisma.organization.findUnique({
            where: { clerkOrgId: clerkOrgId }
        });
        if (!organization) {
            return NextResponse.json({ error: "Organization not found" }, { status: 404 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
            include: {
                memberships: {
                    where: {
                        organizationId: organization.id
                    },
                    include: {
                        organization: true,
                    }
                }
            }
        });
        if (!user || user.memberships.length === 0) {
            return NextResponse.json({ error: "You do not have permission to access this organization" }, { status: 403 });
        }
        let fileUrl = null;
        let fileSize = null;
        let fileType = null;
        let extractedContent = content;

        //Upload file to vercel blob
        if (file && file.size > 0) {
            const blob = await uploadToBlob(file, clerkOrgId, userId);
            fileUrl = blob.url;
            fileSize = file.size;
            fileType = file.type;
            if (!extractedContent && file.type.includes("text")) {
                extractedContent = await file.text();
            }
        }

        let aiSummary = null;
        let aiKeywords: string[] = [];

        if (extractedContent) {
            const aiResult = await analyzeWithGemini(
                extractedContent,
                "summary"
            );

            aiSummary = aiResult.analysis;
            aiKeywords = aiResult.keywords;
        }

        const document = await prisma.document.create({
            data: {
                name, content: extractedContent || null,
                fileUrl,
                fileSize: fileSize || 0,
                fileType: fileType || "unknown",
                organizationId: organization.id,
                userId: user.id,
                aiSummary,
                aiKeywords,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                organization: {
                    select: {
                        name: true,
                        clerkOrgId: true
                    }
                }
            }
        });
        return NextResponse.json({
            success: true, message: "Document uploaded successfully",
            document: {
                id: document.id,
                name: document.name,
                fileUrl: document.fileUrl,
                organization: document.organization.name,
                clerkOrgId: document.organization.clerkOrgId,
                uploadedBy: document.user.name
            }
        }
        )
    } catch (error: unknown) {
        console.error("Document upload error", error);
        const msg = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: msg || "Failed to upload document" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // url format --->  /api/documents?organizationId=${organization.id}
        const { searchParams } = new URL(request.url);
        const clerkOrgId = searchParams.get("organizationId");

        if (!clerkOrgId) {
            return NextResponse.json({ error: "Organization ID is required fields" }, { status: 400 });
        }

        const organization = await prisma.organization.findUnique({
            where: { clerkOrgId },
        });

        if (!organization) {
            return NextResponse.json({ error: "Organization not found" }, { status: 404 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
            include: {
                memberships: {
                    where: {
                        organizationId: organization.id
                    },
                    include: {
                        organization: true,
                    }
                }
            }
        });

        //Get documents for organization
        const documents = await prisma.document.findMany({
            where: { organizationId: organization.id },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    },
                },
                organization: {
                    select: {
                        name: true,
                        clerkOrgId: true
                    },
                },
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({
            documents,
            metadata: {
                organization: organization.name,
                clerkOrgId: organization.clerkOrgId,
                documentCount: documents.length
            }
        });

    } catch (error: unknown) {
        console.error("Get documents error", error);
        const msg = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: msg || "Failed to get documents" }, { status: 500 });
    }
}