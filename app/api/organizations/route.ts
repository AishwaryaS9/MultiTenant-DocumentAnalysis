import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

function normalizeOrgName(name: string) {
    return name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function generateSlug(name: string) {
    return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
}

export async function POST(request: Request) {
    try {
        const { userId, } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();

        const { name } = body;

        if (!name?.trim()) {
            return NextResponse.json(
                {
                    error: "Workspace name required",
                },
                { status: 400 }
            );
        }

        const normalizedName =
            normalizeOrgName(name);

        const generatedSlug =
            generateSlug(name);

        /**
         * FIND USER
         */
        const user =
            await prisma.user.findUnique({
                where: {
                    clerkUserId: userId,
                },
            });

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        /**
         * CHECK DUPLICATES IN PRISMA
         */
        const existingOrganization =
            await prisma.organization.findFirst({
                where: {
                    OR: [
                        {
                            normalizedName,
                        },
                        {
                            slug: generatedSlug,
                            // slug: slug,
                        },
                    ],
                },
            });

        if (existingOrganization) {
            return NextResponse.json(
                {
                    error:
                        "Workspace already exists",
                },
                { status: 409 }
            );
        }

        /**
         * CHECK DUPLICATES IN CLERK
         */
        const clerk = await clerkClient();

        const clerkOrganizations =
            await clerk.organizations.getOrganizationList(
                {
                    limit: 100,
                }
            );

        const existingClerkOrg =
            clerkOrganizations.data.find(
                (org) =>
                    normalizeOrgName(
                        org.name
                    ) === normalizedName
            );

        if (existingClerkOrg) {
            return NextResponse.json(
                {
                    error:
                        "Workspace already exists",
                },
                { status: 409 }
            );
        }

        /**
         * CREATE CLERK ORGANIZATION
         */
        const clerkOrg =
            await clerk.organizations.createOrganization(
                {
                    name: name.trim(),
                    createdBy: userId,
                }
            );



        /**
         * CREATE DATABASE ORGANIZATION
         */
        const organization =
            await prisma.organization.create({
                data: {
                    clerkOrgId: clerkOrg.id,
                    name: name.trim(),
                    normalizedName,
                    slug: clerkOrg.slug!, // <- use Clerk slug
                },
            });

        /**
         * CREATE OWNER MEMBERSHIP
         */
        await prisma.organizationMember.create({
            data: {
                userId: user.id,
                organizationId:
                    organization.id,
                role: "owner",
                // role: "admin"
            },
        });

        return NextResponse.json({
            success: true,
            organization,
            message:
                "Workspace created successfully",
        });

    } catch (error: unknown) {
        console.error(
            "Organization POST Error:",
            error
        );

        const err = error as any;

        /**
         * UNIQUE CONSTRAINT
         */
        if (err?.code === "P2002") {
            return NextResponse.json(
                {
                    error:
                        "Workspace already exists",
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            {
                error:
                    err?.message ||
                    String(error) ||
                    "Failed to create workspace",
            },
            { status: 500 }
        );
    }
}