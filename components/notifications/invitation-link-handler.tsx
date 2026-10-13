"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function InvitationLinkHandler() {
    const { isLoaded, isSignedIn, user } = useUser();
    const arrivedViaInviteLink = useRef(false);
    const handled = useRef(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        arrivedViaInviteLink.current =
            params.has("__clerk_ticket") || params.has("__clerk_status");
    }, []);

    useEffect(() => {
        if (!isLoaded || !isSignedIn || !user) return;
        if (!arrivedViaInviteLink.current || handled.current) return;

        handled.current = true;

        (async () => {
            try {
                const { data } = await user.getOrganizationInvitations({ status: "pending" });

                if (data.length === 0) return;

                const [latest] = [...data].sort(
                    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
                );

                await latest.accept();
                toast.success(`You joined ${latest.publicOrganizationData.name}`);

                window.location.assign("/select-org");
            } catch (error: unknown) {
                const msg =
                    error instanceof Error ? error.message : "Failed to accept invitation";
                toast.error(msg);
            }
        })();
    }, [isLoaded, isSignedIn, user]);

    return null;
}
