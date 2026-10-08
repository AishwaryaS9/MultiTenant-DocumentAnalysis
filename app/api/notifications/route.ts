import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


const MAX_NOTIFICATIONS = 20;

// GET /api/notifications -> latest notifications + unread count for the signed-in user
export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
        select: { id: true },
    });

    // User not synced to the DB yet: nothing to show, not an error.
    if (!user) {
        return NextResponse.json({ notifications: [], unreadCount: 0 });
    }

    const [notifications, unreadCount] = await Promise.all([
        prisma.notification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: MAX_NOTIFICATIONS,
        }),
        prisma.notification.count({
            where: { userId: user.id, readAt: null },
        }),
    ]);

    return NextResponse.json({ notifications, unreadCount });
}

// PATCH /api/notifications  body: { ids?: string[] }
// Marks the given notifications as read, or all unread ones when `ids` is omitted.
export async function PATCH(req: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let ids: string[] | undefined;

    try {
        const body = await req.json();
        if (body?.ids !== undefined) {
            if (!Array.isArray(body.ids) || body.ids.some((id: unknown) => typeof id !== "string")) {
                return NextResponse.json({ error: "ids must be an array of strings" }, { status: 400 });
            }
            ids = body.ids;
        }
    } catch {
        // empty body -> mark all as read
    }

    const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
        select: { id: true },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Always scoped to the current user, so ids belonging to others are ignored.
    const result = await prisma.notification.updateMany({
        where: {
            userId: user.id,
            readAt: null,
            ...(ids ? { id: { in: ids } } : {}),
        },
        data: { readAt: new Date() },
    });

    return NextResponse.json({ success: true, updated: result.count });
}
