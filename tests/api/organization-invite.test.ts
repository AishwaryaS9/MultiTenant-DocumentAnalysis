import { beforeEach, describe, expect, it, vi } from "vitest";

const {
    mockAuth,
    mockClerkClient,
    mockCreateInvitation,
    mockFindOrganization,
    mockFindMembership,
    mockFindUser,
} = vi.hoisted(() => ({
    mockAuth: vi.fn(),
    mockClerkClient: vi.fn(),
    mockCreateInvitation: vi.fn(),
    mockFindOrganization: vi.fn(),
    mockFindMembership: vi.fn(),
    mockFindUser: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
    auth: mockAuth,
    clerkClient: mockClerkClient,
}));

vi.mock("@/lib/prisma", () => ({
    prisma: {
        organization: {
            findUnique: mockFindOrganization,
        },
        organizationMember: {
            findFirst: mockFindMembership,
        },
        user: {
            findUnique: mockFindUser,
        },
    },
}));

import { POST } from "@/app/api/organizations/invite/route";

describe("POST /api/organizations/invite", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        process.env.NEXT_PUBLIC_APP_URL = "https://example.test";

        mockAuth.mockResolvedValue({
            userId: "user_pavan",
            orgId: "org_backend",
        });

        mockFindOrganization.mockResolvedValue({
            id: "db_org_backend",
            clerkOrgId: "org_backend",
            name: "Backend Engineering",
        });

        mockFindMembership.mockResolvedValue({
            role: "owner",
        });

        mockFindUser.mockResolvedValue({
            id: "db_user_bharath",
            clerkOrgId: "user_bharath",
            email: "bharath@example.com",
        });

        mockCreateInvitation.mockResolvedValue({
            id: "invitation_123",
            status: "pending",
        });

        mockClerkClient.mockResolvedValue({
            organizations: {
                createOrganizationInvitation: mockCreateInvitation,
            },
        });
    });

    it("sets a dedicated redirect URL for accepting organization invitations", async () => {
        const request = new Request(
            "http://localhost:3000/api/organizations/invite",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: "bharath@example.com",
                    role: "org:member",
                }),
            }
        );

        const response = await POST(request);

        expect(response.status).toBe(200);

        expect(mockCreateInvitation).toHaveBeenCalledWith(
            expect.objectContaining({
                organizationId: "org_backend",
                inviterUserId: "user_pavan",
                emailAddress: "bharath@example.com",
                role: "org:member",
                redirectUrl:
                    "https://example.test/accept-invitation",
            })
        );
    });
});