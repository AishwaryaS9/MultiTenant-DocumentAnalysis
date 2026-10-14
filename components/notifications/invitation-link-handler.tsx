"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function InvitationLinkHandler() {
    const { isLoaded, isSignedIn } = useUser();
    const router = useRouter();

    const handled = useRef(false);

    useEffect(() => {
        if (!isLoaded || !isSignedIn || handled.current) {
            return;
        }

        const params = new URLSearchParams(window.location.search);

        const arrivedViaInviteLink =
            params.has("__clerk_ticket") ||
            params.has("__clerk_status");

        if (!arrivedViaInviteLink) {
            return;
        }

        handled.current = true;

        toast.info(
            "You opened an organization invitation. Review your notifications to accept it."
        );

        router.replace("/notifications");
    }, [isLoaded, isSignedIn, router]);

    return null;
}