import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockAuth, mockFindUser, mockFindMany, mockCount, mockUpdateMany } = vi.hoisted(() => ({
    mockAuth: vi.fn(),
    mockFindUser: vi.fn(),
    mockFindMany: vi.fn(),
    mockCount: vi.fn(),
    mockUpdateMany: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({ auth: mockAuth }));

vi.mock("@/lib/prisma", () => ({
    prisma: {
        user: { findUnique: mockFindUser },
        notification: {
            findMany: mockFindMany,
            count: mockCount,
            updateMany: mockUpdateMany,
        },
    },
}));

import { GET, PATCH } from "@/app/api/notifications/route";

const patch = (body?: unknown) =>
    new Request("http://localhost:3000/api/notifications", {
        method: "PATCH",
        body: body === undefined ? undefined : JSON.stringify(body),
    });

describe("/api/notifications", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("GET returns 401 when signed out", async () => {
        mockAuth.mockResolvedValue({ userId: null });
        const res = await GET();
        expect(res.status).toBe(401);
        expect(mockFindMany).not.toHaveBeenCalled();
    });

    it("GET returns an empty list when the user is not in the DB yet", async () => {
        mockAuth.mockResolvedValue({ userId: "clerk_1" });
        mockFindUser.mockResolvedValue(null);
        const res = await GET();
        expect(await res.json()).toEqual({ notifications: [], unreadCount: 0 });
    });

    it("GET only queries the signed-in user's notifications", async () => {
        mockAuth.mockResolvedValue({ userId: "clerk_1" });
        mockFindUser.mockResolvedValue({ id: "user_1" });
        mockFindMany.mockResolvedValue([{ id: "n1" }]);
        mockCount.mockResolvedValue(1);

        const res = await GET();
        const body = await res.json();

        expect(body).toEqual({ notifications: [{ id: "n1" }], unreadCount: 1 });
        expect(mockFindMany.mock.calls[0][0].where).toEqual({ userId: "user_1" });
        expect(mockCount.mock.calls[0][0].where).toEqual({ userId: "user_1", readAt: null });
    });

    it("PATCH returns 401 when signed out", async () => {
        mockAuth.mockResolvedValue({ userId: null });
        const res = await PATCH(patch({}));
        expect(res.status).toBe(401);
    });

    it("PATCH rejects a malformed ids payload", async () => {
        mockAuth.mockResolvedValue({ userId: "clerk_1" });
        const res = await PATCH(patch({ ids: "n1" }));
        expect(res.status).toBe(400);
        expect(mockUpdateMany).not.toHaveBeenCalled();
    });

    it("PATCH marks only the given ids, scoped to the current user", async () => {
        mockAuth.mockResolvedValue({ userId: "clerk_1" });
        mockFindUser.mockResolvedValue({ id: "user_1" });
        mockUpdateMany.mockResolvedValue({ count: 1 });

        const res = await PATCH(patch({ ids: ["n1"] }));

        expect(res.status).toBe(200);
        expect(mockUpdateMany.mock.calls[0][0].where).toEqual({
            userId: "user_1",
            readAt: null,
            id: { in: ["n1"] },
        });
    });

    it("PATCH with no body marks all unread as read", async () => {
        mockAuth.mockResolvedValue({ userId: "clerk_1" });
        mockFindUser.mockResolvedValue({ id: "user_1" });
        mockUpdateMany.mockResolvedValue({ count: 3 });

        const res = await PATCH(patch());

        expect(await res.json()).toEqual({ success: true, updated: 3 });
        expect(mockUpdateMany.mock.calls[0][0].where).toEqual({ userId: "user_1", readAt: null });
    });
});
