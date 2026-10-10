"use client";

import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function AcceptInvitationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { signIn } = useSignIn();
    const { signUp, fetchStatus: signUpFetchStatus } = useSignUp();

    const ticket = searchParams.get("__clerk_ticket");
    const accountStatus = searchParams.get("__clerk_status");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(false);

    // Prevent duplicate requests if React runs effects more than once.
    const started = useRef(false);

    useEffect(() => {
        if (!ticket) return;

        if (accountStatus === "complete") {
            router.replace("/select-org");
        }
    }, [ticket, accountStatus, router]);

    useEffect(() => {
        if (
            !ticket ||
            accountStatus !== "sign_in" ||
            started.current
        ) {
            return;
        }

        const invitationTicket = ticket;
        started.current = true;

        async function acceptInvitation() {
            setProcessing(true);
            setError("");

            try {
                const result = await signIn.ticket({ ticket: invitationTicket });

                if (result.error) {
                    setError(
                        result.error.message ||
                        "We couldn't accept this invitation. Please try again."
                    );
                    started.current = false;
                    return;
                }

                if (signIn.status === "complete") {
                    await signIn.finalize({
                        navigate: () => {
                            router.replace("/select-org");
                        },
                    });
                    return;
                }

                setError(
                    "The invitation sign-in flow is incomplete. Please follow the instructions or request a new invitation."
                );
                started.current = false;
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "We couldn't accept this invitation. Please try again."
                );
                started.current = false;
            } finally {
                setProcessing(false);
            }
        }

        void acceptInvitation();
    }, [ticket, accountStatus, signIn, router]);

    async function handleSignUp() {
        if (!ticket) {
            setError("No invitation ticket was found.");
            return;
        }

        setProcessing(true);
        setError("");

        try {
            const result = await signUp.create({
                ticket,
                firstName,
                lastName,
            });

            if (result.error) {
                setError(
                    result.error.message ||
                    "We couldn't complete your account setup."
                );
                return;
            }

            if (signUp.status === "complete") {
                await signUp.finalize({
                    navigate: () => {
                        router.replace("/select-org");
                    },
                });
                return;
            }

            setError(
                "Your account setup is incomplete. Check your required account details and try again."
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "We couldn't complete your account setup."
            );
        } finally {
            setProcessing(false);
        }
    }

    if (!ticket) {
        return (
            <main className="mx-auto max-w-lg p-8">
                <h1 className="text-2xl font-semibold">Invalid invitation</h1>
                <p className="mt-3">
                    No invitation ticket was found. Please open the original invitation
                    email or ask your organization administrator to send a new invitation.
                </p>
            </main>
        );
    }

    if (accountStatus === "complete") {
        return (
            <main className="mx-auto max-w-lg p-8">
                <h1 className="text-2xl font-semibold">Invitation processed</h1>
                <p className="mt-3">Taking you to your organizations…</p>
            </main>
        );
    }

    if (accountStatus === "sign_in") {
        return (
            <main className="mx-auto max-w-lg p-8">
                <h1 className="text-2xl font-semibold">Accept organization invitation</h1>

                {processing && (
                    <p className="mt-4" role="status">
                        Processing your invitation…
                    </p>
                )}

                {error && (
                    <p className="mt-4 text-red-600" role="alert">
                        {error}
                    </p>
                )}

                {signUpFetchStatus === "fetching" && (
                    <p className="mt-4">Loading authentication…</p>
                )}
            </main>
        );
    }

    if (accountStatus === "sign_up") {
        return (
            <main className="mx-auto max-w-lg p-8">
                <h1 className="text-2xl font-semibold">Complete your account</h1>
                <p className="mt-2">
                    Complete the required details to accept your organization invitation.
                </p>

                <form
                    className="mt-6 space-y-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        void handleSignUp();
                    }}
                >
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium">
                            First name
                        </label>
                        <input
                            id="firstName"
                            name="firstName"
                            autoComplete="given-name"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            required
                            className="mt-1 w-full rounded border px-3 py-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium">
                            Last name
                        </label>
                        <input
                            id="lastName"
                            name="lastName"
                            autoComplete="family-name"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                            required
                            className="mt-1 w-full rounded border px-3 py-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            className="mt-1 w-full rounded border px-3 py-2"
                        />
                    </div>

                    {error && (
                        <p className="text-red-600" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={signUpFetchStatus === "fetching" || processing} className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                    >
                        {processing ? "Accepting invitation…" : "Accept invitation"}
                    </button>
                </form>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-lg p-8">
            <h1 className="text-2xl font-semibold">Unable to process invitation</h1>
            <p className="mt-3" role="alert">
                The invitation status is missing or invalid. Please open the invitation
                email again or ask the organization administrator for a new invitation.
            </p>
        </main>
    );
}
