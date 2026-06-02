import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ orgSlug: string }> }
) {
    const { orgSlug } = await params;

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") ?? "";
    const role = searchParams.get("role") ?? "";
    const sort = searchParams.get("sort") ?? "newest";

    const organization = await prisma.organization.findUnique({
        where: { slug: orgSlug },
        select: {
            id: true,
            name: true,
        },
    });

    if (!organization) {
        return NextResponse.json(
            { error: "Organization not found" },
            { status: 404 }
        );
    }

    const where = {
        organizationId: organization.id,
        ...(role && role !== "all" && { role }),
        ...(search && {
            user: {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        email: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                ],
            },
        }),
    };

    const orderBy =
        sort === "name"
            ? { user: { name: "asc" as const } }
            : sort === "oldest"
                ? { user: { createdAt: "asc" as const } }
                : { user: { createdAt: "desc" as const } };

    const members = await prisma.organizationMember.findMany({
        where,
        include: {
            user: true,
        },
        orderBy,
    });

    return NextResponse.json({
        organization: {
            id: organization.id,
            name: organization.name,
        },
        members,
        totalCount: members.length,
    });
}