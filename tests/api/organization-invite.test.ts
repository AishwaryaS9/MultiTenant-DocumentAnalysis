import { beforeEach, describe, expect, it, vi } from "vitest";

const {
    mockAuth,
    mockCreateInvitation,
    mockFindOrg,
    mockFindMember,
    mockFindUser,
    mockCreateNotification,
} = vi.hoisted(() => ({
    mockAuth: vi.fn(),
    mockCreateInvitation: vi.fn(),
    mockFindOrg: vi.fn(),
    mockFindMember: vi.fn(),
    mockFindUser: vi.fn(),
    mockCreateNotification: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
    auth: mockAuth,
    clerkClient: async () => ({
        organizations: { createOrganizationInvitation: mockCreateInvitation },
    }),
}));

vi.mock("@/lib/prisma", () => ({
    prisma: {
        organization: { findUnique: mockFindOrg },
        organizationMember: { findFirst: mockFindMember },
        user: { findUnique: mockFindUser },
    },
}));

vi.mock("@/lib/notifications", () => ({
    createInvitationNotification: mockCreateNotification,
}));

import { POST } from "@/app/api/organizations/invite/route";

const request = () =>
    new Request("https://app.example.com/api/organizations/invite", {
        method: "POST",
        headers: {
            origin: "https://app.example.com",
            "content-type": "application/json",
        },
        body: JSON.stringify({ email: "invitee@example.com" }),
    });

describe("POST /api/organizations/invite", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAuth.mockResolvedValue({ userId: "clerk_admin", orgId: "org_clerk_1" });
        mockFindOrg.mockResolvedValue({ id: "org_1", name: "Acme" });
        mockFindMember.mockResolvedValue({ role: "admin" });
        mockFindUser
            .mockResolvedValueOnce({ id: "user_invitee" }) // invitee lookup
            .mockResolvedValueOnce({ name: "Admin Person", email: "admin@example.com" }); // inviter lookup
        mockCreateInvitation.mockResolvedValue({ id: "orginv_1" });
    });

    it("creates the Clerk invitation and notifies the invitee", async () => {
        const res = await POST(request());

        expect(res.status).toBe(200);
        expect(mockCreateInvitation).toHaveBeenCalledWith(
            expect.objectContaining({
                emailAddress: "invitee@example.com",
                organizationId: "org_clerk_1",
            })
        );
        expect(mockCreateNotification).toHaveBeenCalledWith({
            userId: "user_invitee",
            organizationId: "org_1",
            organizationName: "Acme",
            invitationId: "orginv_1",
            inviterName: "Admin Person",
        });
    });

    it("does not notify when the caller is not an admin/owner", async () => {
        mockFindMember.mockResolvedValue({ role: "member" });

        const res = await POST(request());

        expect(res.status).toBe(403);
        expect(mockCreateInvitation).not.toHaveBeenCalled();
        expect(mockCreateNotification).not.toHaveBeenCalled();
    });
});
