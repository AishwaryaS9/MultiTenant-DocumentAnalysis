import { beforeEach, describe, expect, it, vi } from "vitest";

const {
    mockAuth,
    mockFindOrganization,
    mockFindOrganizationMember,
    mockFindManyDocuments,
} = vi.hoisted(() => ({
    mockAuth: vi.fn(),
    mockFindOrganization: vi.fn(),
    mockFindOrganizationMember: vi.fn(),
    mockFindManyDocuments: vi.fn(),
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
        },
        document: {
            findMany: mockFindManyDocuments,
        },
    },
}));

vi.mock("@/lib/blob", () => ({
    uploadToBlob: vi.fn(),
}));

import { GET } from "@/app/api/documents/route";

describe("GET /api/documents", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns 401 when the user is not authenticated", async () => {
        mockAuth.mockResolvedValue({
            userId: null,
        });

        const request = new Request(
            "http://localhost:3000/api/documents?organizationId=org_A"
        );

        const response = await GET(request);
        const body = await response.json();

        expect(response.status).toBe(401);
        expect(body).toEqual({
            error: "Unauthorized"
        });

        expect(mockFindOrganization).not.toHaveBeenCalled();
        expect(mockFindManyDocuments).not.toHaveBeenCalled();
    });

    it("returns 400 when organizationId is missing", async () => {
        mockAuth.mockResolvedValue({
            userId: "user_A",
        });

        const request = new Request("http://localhost:3000/api/documents");
        const response = await GET(request);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.error).toBe(
            "Organization ID is required fields"
        );
    });

    it("returns 404 when the organization does not exist", async () => {
        mockAuth.mockResolvedValue({
            userId: "user_A",
        });
        mockFindOrganization.mockResolvedValue(null);

        const request = new Request(
            "http://localhost:3000/api/documents?organizationId=org_unknown"
        );
        const response = await GET(request);
        const body = await response.json();

        expect(response.status).toBe(404);
        expect(body).toEqual({
            error: "Organization not found",
        });
        expect(mockFindManyDocuments).not.toHaveBeenCalled();
    });

    it("allows a member to retrieve documents from their organization", async () => {
        mockAuth.mockResolvedValue({
            userId: "user_A",
        });

        mockFindOrganization.mockResolvedValue({
            id: "db_org_A",
            clerkOrgId: "org_A",
            name: "Organization A",
        });

        mockFindOrganizationMember.mockResolvedValue({
            id: "membership_A",
        });

        mockFindManyDocuments.mockResolvedValue([
            {
                id: "doc_A1",
                name: "Document A1",
            },
        ]);

        const request = new Request(
            "http://localhost:3000/api/documents?organizationId=org_A"
        );

        const response = await GET(request);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.documents).toHaveLength(1);
        expect(body.documents[0].id).toBe("doc_A1");

        expect(mockFindOrganizationMember).toHaveBeenCalledWith({
            where: {
                organizationId: "db_org_A",
                user: {
                    clerkUserId: "user_A",
                },
            },
        });

        expect(mockFindManyDocuments).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    organizationId: "db_org_A",
                },
            })
        );
    });

    it("DENIES a user from retrieving another organization's documents", async () => {
        mockAuth.mockResolvedValue({
            userId: "user_A",
        });

        mockFindOrganization.mockResolvedValue({
            id: "db_org_B",
            clerkOrgId: "org_B",
            name: "Organization B",
        });

        mockFindOrganizationMember.mockResolvedValue(null);

        mockFindManyDocuments.mockResolvedValue([
            {
                id: "secret_doc_B1",
                name: "Secret Organization B Document",
            },
        ]);

        const request = new Request(
            "http://localhost:3000/api/documents?organizationId=org_B"
        );

        const response = await GET(request);
        const body = await response.json();

        expect(response.status).toBe(403);
        expect(body.error).toBe(
            "You do not have permission to access this organization"
        );

        expect(mockFindManyDocuments).not.toHaveBeenCalled();
    });
});