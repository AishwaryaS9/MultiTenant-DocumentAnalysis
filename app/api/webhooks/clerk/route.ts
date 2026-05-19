import { headers } from "next/headers";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Missing CLERK_WEBHOOK_SECRET");
    }

    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Missing headers", { status: 400 });
    }

    const payload = await req.text();
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: any;

    try {
        evt = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });

        console.log('EVENT-CLERK', JSON.stringify(evt))
    } catch (err) {
        console.error("Webhook verification failed", err);
        return new Response("Invalid signature", { status: 400 });
    }

    const eventType = evt.type;
    console.log("CLERK WEBHOOK RECEIVED:", eventType);

    // 1. USER CREATED SYNC
    if (eventType === "user.created") {
        const data = evt.data;
        const email = data.email_addresses?.[0]?.email_address;

        if (!email) {
            return new Response("No email found in user payload", { status: 400 });
        }

        await prisma.user.upsert({
            where: { clerkUserId: data.id },
            update: {
                email,
                name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            },
            create: {
                clerkUserId: data.id,
                email,
                name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            },
        });

        console.log(`User ${data.id} synchronized successfully.`);
    }


    if (
        eventType === "organizationMembership.created" ||
        eventType === "organizationMembership.updated" ||
        eventType === "organizationInvitation.accepted"
    ) {
        const data = evt.data;

        console.log("ORG EVENT:", eventType);

        // Clerk org ID
        const targetClerkOrgId =
            data.organization?.id || data.organization_id;

        if (!targetClerkOrgId) {
            console.error("Missing organization ID");
            return new Response("Missing org id", { status: 400 });
        }

        // Find organization in Prisma
        const organization = await prisma.organization.findUnique({
            where: {
                clerkOrgId: targetClerkOrgId,
            },
        });

        if (!organization) {
            console.error(
                `Organization ${targetClerkOrgId} not found`
            );

            return new Response(
                "Organization not found",
                { status: 404 }
            );
        }

        // Extract user info safely
        const clerkUserId =
            data.public_user_data?.user_id ||
            data.user_id;

        const email =
            data.public_user_data?.identifier ||
            data.email_address;

        // Invitation accepted fires BEFORE membership is finalized sometimes
        if (!clerkUserId) {
            console.log(
                "Waiting for organizationMembership.created..."
            );

            return new Response("OK", { status: 200 });
        }

        // Find existing user
        let user = await prisma.user.findUnique({
            where: {
                clerkUserId,
            },
        });

        console.log("USER", user)

        // Fallback via email
        if (!user && email) {
            user = await prisma.user.findUnique({
                where: {
                    email,
                },
            });
        }

        // Create user if missing
        if (!user) {
            user = await prisma.user.create({
                data: {
                    clerkUserId,
                    email:
                        email ||
                        `${clerkUserId}@temp.clerk.local`,
                    name:
                        `${data.public_user_data?.first_name || ""} ${data.public_user_data?.last_name || ""
                            }`.trim() || "User",
                },
            });

            console.log("Created missing user");
        }

        // Normalize Clerk role
        const rawRole = data.role || "org:member";

        const normalizedRole = rawRole
            .replace("org:", "")
            .toLowerCase();

        // Upsert membership
        await prisma.organizationMember.upsert({
            where: {
                organizationId_userId: {
                    organizationId: organization.id,
                    userId: user.id,
                },
            },
            update: {
                role: normalizedRole,
            },
            create: {
                organizationId: organization.id,
                userId: user.id,
                role: normalizedRole,
            },
        });

        console.log(
            `Membership synced: ${user.email} -> ${organization.name}`
        );
    }

    return new Response("OK", { status: 200 });
}