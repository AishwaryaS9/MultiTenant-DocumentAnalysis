import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

const {
    mockUserSignIn,
    mockUseSignUp,
    mockUseOrganization,
    mockUseSearchParams,
    mockPush,
    mockReplace,
} = vi.hoisted(() => ({
    mockUserSignIn: vi.fn(),
    mockUseSignUp: vi.fn(),
    mockUseOrganization: vi.fn(),
    mockUseSearchParams: vi.fn(),
    mockPush: vi.fn(),
    mockReplace: vi.fn(),
}));

vi.mock("@clerk/nextjs", () => ({
    useSignIn: mockUserSignIn,
    useSignUp: mockUseSignUp,
    useOrganization: mockUseOrganization,
}));

vi.mock("next/navigation", () => ({
    useSearchParams: mockUseSearchParams,
    useRouter: () => ({
        push: mockPush,
        replace: mockReplace,
    }),
}));

import AcceptInvitationPage from "@/app/accept-invitation/page";

describe('Accept invitation page', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockUseSearchParams.mockReturnValue(
            new URLSearchParams(
                "__clerk_ticket=ticket_123&__clerk_status=sign_in"
            )
        );

        // mockUserSignIn.mockReturnValue({
        //     isLoaded: true,
        //     signIn: {
        //         create: vi.fn(),
        //         authenticateWithRedirect: vi.fn(),
        //         finalize: vi.fn(),
        //     },
        //     setActive: vi.fn(),
        // });
        mockUserSignIn.mockReturnValue({
            isLoaded: true,
            signIn: {
                ticket: vi.fn().mockResolvedValue({ error: null }),
                finalize: vi.fn(),
                status: "complete",
            },
            setActive: vi.fn(),
        });


        mockUseSignUp.mockReturnValue({
            isLoaded: true,
            signUp: {
                create: vi.fn(),
                prepareEmailAddressVerification: vi.fn(),
                finalize: vi.fn(),
            },
            setActive: vi.fn(),
        });

        mockUseOrganization.mockReturnValue({
            organization: null,
            isLoaded: true,
        });
    });

    it("does not redirect home before the invitation is accepted", async () => {
        render(<AcceptInvitationPage />);

        await waitFor(() => {
            expect(mockPush).not.toHaveBeenCalledWith("/");
            expect(mockReplace).not.toHaveBeenCalledWith("/");
        });
    });

    it("shows an error when the invitation ticket is missing", async () => {
        mockUseSearchParams.mockReturnValue(new URLSearchParams());

        render(<AcceptInvitationPage />);

        expect(
            await screen.findByText(/no invitation ticket was found/i)
        ).toBeInTheDocument();
    });

    it("shows a useful error when Clerk cannot accept the invitation", async () => {
        mockUserSignIn.mockReturnValue({
            isLoaded: true.valueOf,
            // signIn: {
            //     create: vi.fn().mockRejectedValue(
            //         new Error("Invitation ticket is invalid or expired")
            //     ),
            // },
            signIn: {
                ticket: vi.fn().mockResolvedValue({
                    error: new Error("Invitation ticket is invalid or expired"),
                }),
                finalize: vi.fn(),
            },
            setActive: vi.fn(),
        });

        render(<AcceptInvitationPage />);

        expect(
            await screen.findByText(/invitation|expired|try again/i)
        ).toBeInTheDocument();

        expect(mockPush).not.toHaveBeenCalledWith("/");
        expect(mockReplace).not.toHaveBeenCalledWith("/");
    });
});