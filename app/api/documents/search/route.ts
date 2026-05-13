export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);

        const query = searchParams.get("query") || "";
        const clerkOrgId = searchParams.get("organizationId");
        const page = Number(searchParams.get("page") || "1");
        const limit = Number(searchParams.get("limit") || "10");

        if (!clerkOrgId) {
            return NextResponse.json(
                { error: "Organization ID is required" },
                { status: 400 }
            );
        }

        if (!query.trim()) {
            return NextResponse.json(
                { error: "Search query is required" },
                { status: 400 }
            );
        }

        // Find organization
        const organization = await prisma.organization.findUnique({
            where: {
                clerkOrgId,
            },
        });

        if (!organization) {
            return NextResponse.json(
                { error: "Organization not found" },
                { status: 404 }
            );
        }

        // Verify user membership
        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId,
            },
            include: {
                memberships: {
                    where: {
                        organizationId: organization.id,
                    },
                },
            },
        });

        if (!user || user.memberships.length === 0) {
            return NextResponse.json(
                {
                    error: "You do not have permission to access this organization",
                },
                { status: 403 }
            );
        }

        const skip = (page - 1) * limit;

        // Search documents
        const documents = await prisma.document.findMany({
            where: {
                organizationId: organization.id,
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        content: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        aiKeywords: {
                            has: query,
                        },
                    },
                ],
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        });

        // Total count
        const totalDocuments = await prisma.document.count({
            where: {
                organizationId: organization.id,
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        content: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        aiKeywords: {
                            has: query,
                        },
                    },
                ],
            },
        });

        return NextResponse.json({
            success: true,
            query,
            documents,
            pagination: {
                page,
                limit,
                totalDocuments,
                totalPages: Math.ceil(totalDocuments / limit),
            },
        });

    } catch (error: any) {
        console.error("Search documents error:", error);

        return NextResponse.json(
            {
                error: error.message || "Failed to search documents",
            },
            { status: 500 }
        );
    }
}