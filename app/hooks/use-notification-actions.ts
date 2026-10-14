"use client";

import { useEffect, useRef, useState } from "react";
import { useOrganizationList } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMarkNotificationsReadMutation } from "@/app/store/services/notificationsApi";
import type { AppNotification } from "@/types";

export function useNotificationActions(
    notifications: AppNotification[],
    onAccepted?: () => void
) {
    const router = useRouter();
    const [acceptingId, setAcceptingId] = useState<string | null>(null);
    const [markRead] = useMarkNotificationsReadMutation();

    const { isLoaded, userInvitations, userMemberships } = useOrganizationList({
        userInvitations: { infinite: true, pageSize: 50 },
        userMemberships: { infinite: true },
    });

    const findInvitation = (n: AppNotification) =>
        n.invitationId
            ? userInvitations?.data?.find((inv) => inv.id === n.invitationId)
            : undefined;

    const unknownInvitationKey = notifications
        .filter((n) => n.type === "ORG_INVITATION" && n.invitationId && !findInvitation(n))
        .map((n) => n.invitationId)
        .join(",");
    const refreshedFor = useRef("");

    useEffect(() => {
        if (!isLoaded || !userInvitations || userInvitations.isLoading) return;
        if (!unknownInvitationKey || unknownInvitationKey === refreshedFor.current) return;

        refreshedFor.current = unknownInvitationKey;
        userInvitations.revalidate?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, userInvitations?.isLoading, unknownInvitationKey]);

    const getInvitationStatus = (n: AppNotification): string | undefined =>
        n.type === "ORG_INVITATION" ? findInvitation(n)?.status : undefined;

    const canAccept = (n: AppNotification) =>
        n.type === "ORG_INVITATION" && findInvitation(n)?.status === "pending";

    const accept = async (n: AppNotification) => {
        const invitation = findInvitation(n);

        if (!invitation || invitation.status !== "pending") {
            toast.error("This invitation is no longer available");
            return;
        }

        try {
            setAcceptingId(n.id);

            await invitation.accept();

            toast.success(
                `You joined ${invitation.publicOrganizationData.name}`
            );

            onAccepted?.();

            router.push("/select-org");

            await Promise.allSettled([
                markRead({ ids: [n.id] }).unwrap(),
                Promise.resolve(userInvitations?.revalidate?.()),
                Promise.resolve(userMemberships?.revalidate?.()),
            ]);

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
        getInvitationStatus,
        accept,
        markOneRead: (id: string) => markRead({ ids: [id] }),
        markAllRead: () => markRead(),
    };
}
