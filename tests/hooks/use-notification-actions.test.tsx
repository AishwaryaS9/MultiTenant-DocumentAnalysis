import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useNotificationActions } from "@/app/hooks/use-notification-actions";
import type { AppNotification } from "@/types";

const {
    mockUseOrganizationList,
    mockUseRouter,
    mockPush,
    mockMarkRead,
    mockAcceptA,
    mockAcceptB,
    mockToastSuccess,
    mockToastError,
} = vi.hoisted(() => ({
    mockUseOrganizationList: vi.fn(),
    mockUseRouter: vi.fn(),
    mockPush: vi.fn(),
    mockMarkRead: vi.fn(),
    mockAcceptA: vi.fn(),
    mockAcceptB: vi.fn(),
    mockToastSuccess: vi.fn(),
    mockToastError: vi.fn(),
}));

vi.mock("@clerk/nextjs", () => ({
    useOrganizationList: mockUseOrganizationList,
}));

vi.mock("next/navigation", () => ({
    useRouter: mockUseRouter,
}));

vi.mock("sonner", () => ({
    toast: {
        success: mockToastSuccess,
        error: mockToastError,
    },
}));

vi.mock("@/app/store/services/notificationsApi", () => ({
    useMarkNotificationsReadMutation: () => [mockMarkRead],
}));

const notification = {
    id: "notification-a",
    type: "ORG_INVITATION",
    invitationId: "invitation-a",
} as AppNotification;

describe("useNotificationActions", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockUseRouter.mockReturnValue({ push: mockPush });

        mockAcceptA.mockResolvedValue(undefined);
        mockAcceptB.mockResolvedValue(undefined);

        mockMarkRead.mockReturnValue({
            unwrap: () => Promise.resolve(undefined),
        });

        mockUseOrganizationList.mockReturnValue({
            isLoaded: true,
            userInvitations: {
                data: [
                    {
                        id: "invitation-a",
                        status: "pending",
                        publicOrganizationData: { name: "Organization A" },
                        accept: mockAcceptA,
                    },
                    {
                        id: "invitation-b",
                        status: "pending",
                        publicOrganizationData: { name: "Organization B" },
                        accept: mockAcceptB,
                    },
                ],
                isLoading: false,
                revalidate: vi.fn().mockResolvedValue(undefined),
            },
            userMemberships: {
                revalidate: vi.fn().mockResolvedValue(undefined),
            },
        });
    });

    it("accepts only the invitation by the notification", async () => {
        const { result } = renderHook(() =>
            useNotificationActions([notification]));
        await act(async () => {
            await result.current.accept(notification);
        });

        expect(mockAcceptA).toHaveBeenCalledOnce();
        expect(mockAcceptB).not.toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith("/select-org");
    });

    it("navigates after successful acceptance even if marking the notification read fails", async () => {
        const { result } = renderHook(() =>
            useNotificationActions([notification]));

        mockMarkRead.mockReturnValue({
            unwrap: () => Promise.reject(new Error("Notification update failed")),
        });

        await act(async () => {
            await result.current.accept(notification);
        });

        expect(mockAcceptA).toHaveBeenCalledOnce();
        expect(mockToastSuccess).toHaveBeenCalledWith("You joined Organization A");
        expect(mockPush).toHaveBeenCalledWith("/select-org");
        expect(mockToastError).not.toHaveBeenCalledWith(
            "Notification update failed"
        );
    });
});