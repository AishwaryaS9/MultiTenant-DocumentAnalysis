import { beforeEach, describe, expect, it, vi } from "vitest";

const {
    mockWebhookVerify,
    mockDeleteMembership,
    mockUpsertMembership,
    mockUpsertUser,
    mockFindOrganization,
    mockFindUser,
} = vi.hoisted(() => ({
    mockWebhookVerify: vi.fn(),
    mockDeleteMembership: vi.fn(),
    mockUpsertMembership: vi.fn(),
    mockUpsertUser: vi.fn(),
    mockFindOrganization: vi.fn(),
    mockFindUser: vi.fn(),
}));

vi.mock("next/headers", () => ({
    headers: vi.fn().mockResolvedValue(
        new Headers({
            "svix-id": "msg_123",
            "svix-timestamp": "1234567890",
            "svix-signature": "signature",
        })
    ),
}));

vi.mock("svix", () => ({
    Webhook: class {
        verify = mockWebhookVerify;
    }
}));

vi.mock("@/lib/prisma", () => ({
    prisma: {
        organization: {
            findUnique: mockFindOrganization,
        },
        organizationMember: {
            deleteMany: mockDeleteMembership,
            upsert: mockUpsertMembership,
        },
        user: {
            findUnique: mockFindUser,
            upsert: mockUpsertUser,
        },
    },
}));

import { POST } from "@/app/api/webhooks/clerk/route";

describe('POST /api/webhooks/clerk', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.CLERK_WEBHOOK_SECRET = "test-secret";
    });

    it("removes a Prisma membership when Clerk sends organizationMembership.deleted", async () => {

        mockWebhookVerify.mockReturnValue({
            type: "organizationMembership.deleted",
            data: {
                id: "membership_clerk_123",
                organization: {
                    id: "org_clerk_123",
                },
                public_user_data: {
                    user_id: "user_clerk_123",
                },
            },
        });

        mockFindOrganization.mockResolvedValue({
            id: "db_org_123",
            name: "Test Organization",
        });

        mockFindUser.mockResolvedValue({
            id: "db_user_123",
            clerkUserId: "user_clerk_123",
            email: "user@example.com",
        });

        mockDeleteMembership.mockResolvedValue({
            count: 1,
        });

        const request = new Request(
            'http://localhost:3000/api/webhooks/clerk',
            {
                method: "POST",
                headers: {
                    "svix-id": "msg_123",
                    "svix-timestamp": "1234567890",
                    "svix-signature": "signature",
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    type: "organizationMembership.deleted",
                    data: {
                        id: "membership_clerk_123",
                    },
                }),
            }
        );

        const response = await POST(request);

        expect(response.status).toBe(200);

        expect(mockDeleteMembership).toHaveBeenCalledWith({
            where: {
                organizationId: "db_org_123",
                userId: "db_user_123",
            },
        });
    });
});