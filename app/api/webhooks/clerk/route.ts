import { headers } from "next/headers";
import { Webhook } from "svix";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const WEBHOOK_SECRET =
        process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error(
            "Missing CLERK_WEBHOOK_SECRET"
        );
    }

    const headerPayload = await headers();

    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp =
        headerPayload.get("svix-timestamp");
    const svix_signature =
        headerPayload.get("svix-signature");

    if (
        !svix_id ||
        !svix_timestamp ||
        !svix_signature
    ) {
        return new Response("Missing headers", {
            status: 400,
        });
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
    } catch (err) {
        console.error("Webhook verification failed", err);

        return new Response("Invalid signature", {
            status: 400,
        });
    }

    const eventType = evt.type;

    console.log("CLERK WEBHOOK:", eventType);

    // USER CREATED
    if (eventType === "user.created") {
        const data = evt.data;

        const email =
            data.email_addresses?.[0]?.email_address;

        if (!email) {
            return new Response("No email", {
                status: 400,
            });
        }

        await prisma.user.upsert({
            where: {
                clerkUserId: data.id,
            },
            update: {},
            create: {
                clerkUserId: data.id,
                email,
                name:
                    `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            },
        });

        console.log("USER SYNCED");
    }

    // MEMBERSHIP CREATED
    if (
        eventType ===
        "organizationMembership.created"
    ) {
        const data = evt.data;

        console.log(
            "MEMBERSHIP CREATED",
            JSON.stringify(data, null, 2)
        );

        const organization =
            await prisma.organization.findUnique({
                where: {
                    clerkOrgId:
                        data.organization.id,
                },
            });

        console.log(
            "FULL MEMBERSHIP EVENT:",
            JSON.stringify(data, null, 2)
        );

        if (!organization) {
            console.log(
                "ORG NOT FOUND",
                data.organization.id
            );

            return new Response("Org missing", {
                status: 404,
            });
        }

        const email = data.public_user_data.identifier;

        let user = await prisma.user.findUnique({
            where: {
                clerkUserId: data.public_user_data.user_id,
            },
        });

        if (!user && email) {
            user = await prisma.user.findUnique({
                where: {
                    email,
                },
            });
        }

        // If user still doesn't exist, create immediately
        if (!user) {
            user = await prisma.user.create({
                data: {
                    clerkUserId:
                        data.public_user_data.user_id,
                    email,
                    name:
                        data.public_user_data.first_name ||
                        "User",
                },
            });

            console.log("USER AUTO-CREATED");
        }

        // If found by email but missing clerk id
        if (!user.clerkUserId) {
            user = await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    clerkUserId:
                        data.public_user_data.user_id,
                },
            });
        }

        const normalizedRole =
            data.role.replace("org:", "");

        await prisma.organizationMember.upsert({
            where: {
                organizationId_userId: {
                    organizationId:
                        organization.id,
                    userId: user.id,
                },
            },
            update: {
                role: normalizedRole,
            },
            create: {
                organizationId:
                    organization.id,
                userId: user.id,
                role: normalizedRole,
            },
        });

        console.log(
            "MEMBERSHIP SYNCED SUCCESSFULLY"
        );
    }

    return new Response("OK", {
        status: 200,
    });
}