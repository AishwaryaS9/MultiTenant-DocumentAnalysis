import { beforeEach, describe, expect, it, vi } from "vitest";

const {
    mockAuth,
    mockFindOrganization,
    mockFindOrganizationMember,
    mockFindManyMembers,
} = vi.hoisted(() => ({
    mockAuth: vi.fn(),
    mockFindOrganization: vi.fn(),
    mockFindOrganizationMember: vi.fn(),
    mockFindManyMembers: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
    auth: mockAuth,
}));

vi.mock("@/lib/prisma", () => ({
    prisma: {
        organization: {
            findUnique: mockFindOrganization,
        },
        organizationMember: {
            findFirst: mockFindOrganizationMember,
            findMany: mockFindManyMembers,
        },
    },
}));

import { GET } from "@/app/api/organizations/[orgSlug]/members/route";

describe("GET /api/organizations/[orgSlug]/members", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns 401 when the user is not authenticated", async () => {
        mockAuth.mockResolvedValue({
            userId: null,
        });

        const request = new Request(
            "http://localhost:3000/api/organizations/org-a/members"
        );

        const response = await GET(request, {
            params: Promise.resolve({
                orgSlug: "org-a",
            }),
        });

        const body = await response.json();

        expect(response.status).toBe(401);
        expect(body).toEqual({
            error: "Unauthorized"
        });

        expect(mockFindOrganization).not.toHaveBeenCalled();
        expect(mockFindManyMembers).not.toHaveBeenCalled();
    });

    it("returns 404 when the organization does not exist", async () => {
        mockAuth.mockResolvedValue({
            userId: "user_A",
        });

        mockFindOrganization.mockResolvedValue(null);

        const request = new Request(
            "http://localhost:3000/api/organizations/org-unknown/members"
        );

        const response = await GET(request, {
            params: Promise.resolve({
                orgSlug: "org-unknown",
            }),
        });

        const body = await response.json();

        expect(response.status).toBe(404);
        expect(body).toEqual({
            error: "Organization not found",
        });

        expect(mockFindManyMembers).not.toHaveBeenCalled();
    });

    it("DENIES an authenticated user who is not a member of the organization", async () => {
        mockAuth.mockResolvedValue({
            userId: "user_A",
        });

        mockFindOrganization.mockResolvedValue({
            id: "db_org_B",
            slug: "org-b",
            name: "Organization B",
        });

        mockFindOrganizationMember.mockResolvedValue(null);
        mockFindManyMembers.mockResolvedValue([]);

        const request = new Request(
            "http://localhost:3000/api/organizations/org-b/members"
        );

        const response = await GET(request, {
            params: Promise.resolve({
                orgSlug: "org-b",
            }),
        });

        const body = await response.json();
        expect(response.status).toBe(403);
        expect(body.error).toBe(
            "You do not have permission to access this organization"
        );
        expect(mockFindManyMembers).not.toHaveBeenCalled();
    });

    it("allows an organization member to retrieve members", async () => {
        mockAuth.mockResolvedValue({
            userId: "user_A",
        });

        mockFindOrganization.mockResolvedValue({
            id: "db_org_A",
            slug: "org-a",
            name: "Organization A",
        });

        mockFindOrganizationMember.mockResolvedValue({
            id: "membership_A"
        });

        mockFindManyMembers.mockResolvedValue([
            {
                id: "membership_A",
                role: "owner",
                user: {
                    name: "User A",
                    email: "user-a@example.com",
                },
            },
        ]);

        const request = new Request(
            "http://localhost:3000/api/organizations/org-a/members"
        );

        const response = await GET(request, {
            params: Promise.resolve({
                orgSlug: "org-a",
            }),
        });

        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toBeDefined();
        expect(mockFindManyMembers).toHaveBeenCalled();
    });

    it("only selecys safe user fields", async () => {
        mockAuth.mockResolvedValue({
            userId: "user_A",
        });

        mockFindOrganization.mockResolvedValue({
            id: "db_org_A",
            name: "Organization A",
        });

        mockFindOrganizationMember.mockResolvedValue({
            id: "membership_A"
        });

        mockFindManyMembers.mockResolvedValue([
            {
                id: "membership_A",
                role: "owner",
                user: {
                    name: "User A",
                    email: "user-a@example.com",
                },
            },
        ]);

        const request = new Request(
            "http://localhost:3000/api/organizations/org-a/members"
        );

        const response = await GET(request, {
            params: Promise.resolve({
                orgSlug: "org-a",
            }),
        });

        expect(response.status).toBe(200);

        expect(mockFindManyMembers).toHaveBeenCalledWith(
            expect.objectContaining({
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            })
        );
    });
});