import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import InvitationLinkHandler from "@/components/notifications/invitation-link-handler";

const {
    mockUseUser,
    mockGetInvitations,
    mockUseRouter,
    mockReplace,
    mockToastInfo,
} = vi.hoisted(() => ({
    mockUseUser: vi.fn(),
    mockGetInvitations: vi.fn(),
    mockUseRouter: vi.fn(),
    mockReplace: vi.fn(),
    mockToastInfo: vi.fn(),
}));

vi.mock("@clerk/nextjs", () => ({
    useUser: mockUseUser,
}));

vi.mock("next/navigation", () => ({
    useRouter: mockUseRouter,
}));

vi.mock("sonner", () => ({
    toast: {
        info: mockToastInfo,
    },
}));

const INVITE_URL =
    "/?__clerk_ticket=ticket-for-org-a&__clerk_status=sign_in";

const signedInUser = () =>
    mockUseUser.mockReturnValue({
        isLoaded: true,
        isSignedIn: true,
        user: {
            getOrganizationInvitations: mockGetInvitations,
        },
    });

describe("InvitationLinkHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockUseRouter.mockReturnValue({
            replace: mockReplace,
        });

        window.history.replaceState({}, "", INVITE_URL);

        mockGetInvitations.mockResolvedValue({ data: [] });

        signedInUser();
    });

    it("does not automatically accept or fetch pending invitations", async () => {
        render(<InvitationLinkHandler />);

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith("/notifications");
        });

        expect(mockGetInvitations).not.toHaveBeenCalled();
    });

    it("sends a signed-in user to notifications with an informational toast", async () => {
        render(<InvitationLinkHandler />);

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith("/notifications");
        });

        expect(mockToastInfo).toHaveBeenCalledTimes(1);
        expect(mockToastInfo).toHaveBeenCalledWith(
            expect.stringMatching(/review your notifications to accept/i)
        );
    });

    it("redirects when only __clerk_status is present", async () => {
        window.history.replaceState(
            {},
            "",
            "/?__clerk_status=complete"
        );

        render(<InvitationLinkHandler />);

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith("/notifications");
        });
    });

    it("does nothing when the URL has no invitation parameters", () => {
        window.history.replaceState({}, "", "/");

        render(<InvitationLinkHandler />);

        expect(mockReplace).not.toHaveBeenCalled();
        expect(mockToastInfo).not.toHaveBeenCalled();
        expect(mockGetInvitations).not.toHaveBeenCalled();
    });

    it("does nothing when the user is not signed in", () => {
        mockUseUser.mockReturnValue({
            isLoaded: true,
            isSignedIn: false,
            user: null,
        });

        render(<InvitationLinkHandler />);

        expect(mockReplace).not.toHaveBeenCalled();
        expect(mockToastInfo).not.toHaveBeenCalled();
    });

    it("waits until Clerk has loaded", () => {
        mockUseUser.mockReturnValue({
            isLoaded: false,
            isSignedIn: false,
            user: null,
        });

        render(<InvitationLinkHandler />);

        expect(mockReplace).not.toHaveBeenCalled();
        expect(mockToastInfo).not.toHaveBeenCalled();
    });

    it("redirects only once when the component rerenders", async () => {
        const { rerender } = render(<InvitationLinkHandler />);

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledTimes(1);
        });

        rerender(<InvitationLinkHandler />);
        rerender(<InvitationLinkHandler />);

        expect(mockReplace).toHaveBeenCalledTimes(1);
        expect(mockToastInfo).toHaveBeenCalledTimes(1);
    });
});
