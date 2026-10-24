import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(req: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = new URL(req.url).searchParams;
    const limitParam = Number(params.get("limit"));
    const pageParam = Number(params.get("page"));
    const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : null;
    const unreadOnly = params.get("unread") === "true";
    const limit =
        Number.isInteger(limitParam) && limitParam > 0
            ? Math.min(limitParam, MAX_LIMIT)
            : DEFAULT_LIMIT;

    const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
        select: { id: true },
    });

    if (!user) {
        return NextResponse.json(
            page
                ? { notifications: [], unreadCount: 0, totalCount: 0, allCount: 0 }
                : { notifications: [], unreadCount: 0 }
        );
    }

    const [notifications, unreadCount, allCount] = await Promise.all([
        prisma.notification.findMany({
            where: { userId: user.id, ...(unreadOnly ? { readAt: null } : {}) },
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            take: limit,
            ...(page ? { skip: (page - 1) * limit } : {}),
        }),
        prisma.notification.count({
            where: { userId: user.id, readAt: null },
        }),
        page ? prisma.notification.count({ where: { userId: user.id } }) : Promise.resolve(0),
    ]);

    if (!page) {
        return NextResponse.json({ notifications, unreadCount });
    }

    return NextResponse.json({
        notifications,
        unreadCount,
        totalCount: unreadOnly ? unreadCount : allCount,
        allCount,
    });
}

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