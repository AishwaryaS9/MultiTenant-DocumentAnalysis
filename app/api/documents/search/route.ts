import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        // 1. Authenticate the user
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Parse search parameters from URL
        const { searchParams } = new URL(request.url);
        const orgSlug = searchParams.get("orgSlug");
        const query = searchParams.get("query") || "";

        if (!orgSlug) {
            return NextResponse.json(
                { error: "Missing required parameter: orgSlug" },
                { status: 400 }
            );
        }

        // 3. Verify the organization exists
        const organization = await prisma.organization.findUnique({
            where: {
                slug: orgSlug,
            },
        });

        if (!organization) {
            return NextResponse.json({ error: "Organization not found" }, { status: 404 });
        }

        // 4. Verify user membership in the organization
        const membership = await prisma.organizationMember.findFirst({
            where: {
                organizationId: organization.id,
                user: {
                    clerkUserId: userId,
                },
            },
        });

        if (!membership) {
            return NextResponse.json(
                { error: "Forbidden: You are not a member of this organization" },
                { status: 403 }
            );
        }

        // 5. Fetch documents matching the query (or return empty array if no query)
        const documents = query
            ? await prisma.document.findMany({
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
                            aiSummary: {
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
                                hasSome: query.split(" "),
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
            })
            : [];

        // 6. Return results
        return NextResponse.json({ documents });
    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}