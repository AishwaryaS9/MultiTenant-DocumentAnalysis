import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId, orgId } = await auth();

        // User must be signed in and inside an active org
        if (!userId || !orgId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();

        const email = body.email?.trim();
        const role = body.role || "org:member";
        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Find organization from Prisma
        const organization = await prisma.organization.findUnique({
            where: {
                clerkOrgId: orgId,
            },
        });

        if (!organization) {
            return NextResponse.json(
                { error: "Organization not found" },
                { status: 404 }
            );
        }

        // Check if current user belongs to org
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
                { error: "You are not a member of this organization" },
                { status: 403 }
            );
        }

        // Only owner/admin can invite
        const allowedRoles = ["admin", "owner"];

        if (!allowedRoles.includes(membership.role)) {
            return NextResponse.json(
                { error: "Insufficient permissions" },
                { status: 403 }
            );
        }


        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!existingUser) {
            return NextResponse.json(
                {
                    error:
                        "User must create an account before being invited",
                },
                { status: 400 }
            );
        }


        // Get Clerk instance
        const client = await clerkClient();

        // Create invitation in Clerk
        const invitation =
            await client.organizations.createOrganizationInvitation({
                organizationId: orgId,
                inviterUserId: userId,
                emailAddress: email,
                role,
            });

        return NextResponse.json({
            success: true,
            invitation,
            message: "Invitation sent successfully",
        });
    } catch (error: unknown) {
        console.error("INVITE_API_ERROR", error);
        const err = error as any;

        return NextResponse.json(
            {
                error:
                    err?.errors?.[0]?.longMessage ||
                    err?.message ||
                    String(error) ||
                    "Failed to send invitation",
            },
            { status: 500 }
        );
    }
}