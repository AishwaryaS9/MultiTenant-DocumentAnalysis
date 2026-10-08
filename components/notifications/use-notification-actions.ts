"use client";

import { useState } from "react";
import { useOrganizationList } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMarkNotificationsReadMutation } from "@/app/store/services/notificationsApi";
import type { AppNotification } from "@/types";

/**
 * Shared behaviour for anything that renders notifications (bell + page):
 * mark as read and accept an invitation straight from a notification.
 */
export function useNotificationActions(onAccepted?: () => void) {
    const router = useRouter();
    const [acceptingId, setAcceptingId] = useState<string | null>(null);
    const [markRead] = useMarkNotificationsReadMutation();

    const { userInvitations, userMemberships } = useOrganizationList({
        userInvitations: { status: "pending", infinite: true },
        userMemberships: { infinite: true },
    });

    // Accept is only offered while the Clerk invitation is still pending
    const canAccept = (n: AppNotification) =>
        n.type === "ORG_INVITATION" &&
        !!n.invitationId &&
        !!userInvitations?.data?.some((inv) => inv.id === n.invitationId);

    const accept = async (n: AppNotification) => {
        const invitation = userInvitations?.data?.find((inv) => inv.id === n.invitationId);

        if (!invitation) {
            toast.error("This invitation is no longer available");
            return;
        }

        try {
            setAcceptingId(n.id);
            await invitation.accept();
            await Promise.all([
                markRead({ ids: [n.id] }).unwrap(),
                userInvitations?.revalidate?.(),
                userMemberships?.revalidate?.(),
            ]);
            toast.success(`You joined ${invitation.publicOrganizationData.name}`);
            onAccepted?.();
            router.push("/select-org");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Failed to accept invitation";
            toast.error(msg);
        } finally {
            setAcceptingId(null);
        }
    };

    return {
        acceptingId,
        canAccept,
        accept,
        markOneRead: (id: string) => markRead({ ids: [id] }),
        markAllRead: () => markRead(),
    };
}
