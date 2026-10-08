"use client";

import { useState } from "react";
import { useAuth, useOrganizationList } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Loader2, MailPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    NOTIFICATIONS_POLL_INTERVAL_MS,
    useGetNotificationsQuery,
    useMarkNotificationsReadMutation,
} from "@/app/store/services/notificationsApi";
import type { AppNotification } from "@/types";

export default function NotificationBell() {
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const [open, setOpen] = useState(false);
    const [acceptingId, setAcceptingId] = useState<string | null>(null);

    const { data } = useGetNotificationsQuery(undefined, {
        skip: !isSignedIn,
        pollingInterval: NOTIFICATIONS_POLL_INTERVAL_MS,
        skipPollingIfUnfocused: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    const [markRead] = useMarkNotificationsReadMutation();

    // Pending Clerk invitations let us accept straight from the notification
    const { userInvitations, userMemberships } = useOrganizationList({
        userInvitations: { status: "pending", infinite: true },
        userMemberships: { infinite: true },
    });

    const notifications = data?.notifications ?? [];
    const unreadCount = data?.unreadCount ?? 0;

    const handleAccept = async (notification: AppNotification) => {
        const invitation = userInvitations?.data?.find(
            (inv) => inv.id === notification.invitationId
        );

        if (!invitation) {
            toast.error("This invitation is no longer available");
            return;
        }

        try {
            setAcceptingId(notification.id);
            await invitation.accept();
            await Promise.all([
                markRead({ ids: [notification.id] }).unwrap(),
                userInvitations?.revalidate?.(),
                userMemberships?.revalidate?.(),
            ]);
            toast.success(`You joined ${invitation.publicOrganizationData.name}`);
            setOpen(false);
            router.push("/select-org");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Failed to accept invitation";
            toast.error(msg);
        } finally {
            setAcceptingId(null);
        }
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label={
                        unreadCount > 0
                            ? `Notifications, ${unreadCount} unread`
                            : "Notifications"
                    }
                    className="relative rounded-full cursor-pointer focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-400"
                >
                    <Bell className="h-5 w-5 text-slate-600" aria-hidden="true" />
                    {unreadCount > 0 && (
                        <span
                            aria-hidden="true"
                            className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center"
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-[92vw] sm:w-96 p-0 rounded-2xl border border-slate-200 bg-white shadow-xl"
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-900">Notifications</h2>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={() => markRead()}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                        >
                            <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
                            Mark all as read
                        </button>
                    )}
                </div>

                <ul className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                        <li className="px-4 py-10 text-center text-sm text-slate-400">
                            You&apos;re all caught up
                        </li>
                    ) : (
                        notifications.map((n) => {
                            const isUnread = !n.readAt;
                            const canAccept =
                                n.type === "ORG_INVITATION" &&
                                !!n.invitationId &&
                                !!userInvitations?.data?.some((inv) => inv.id === n.invitationId);

                            return (
                                <li
                                    key={n.id}
                                    className={`px-4 py-3 flex gap-3 ${isUnread ? "bg-orange-50/50" : ""}`}
                                >
                                    <div
                                        aria-hidden="true"
                                        className="h-9 w-9 shrink-0 rounded-xl bg-slate-900 text-white flex items-center justify-center"
                                    >
                                        <MailPlus className="h-4 w-4" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-slate-900 wrap-break-word">
                                            {n.title}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5 wrap-break-word">
                                            {n.message}
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-1">
                                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                        </p>

                                        <div className="flex items-center gap-2 mt-2">
                                            {canAccept && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAccept(n)}
                                                    disabled={acceptingId === n.id}
                                                    className="h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs cursor-pointer"
                                                >
                                                    {acceptingId === n.id && (
                                                        <Loader2 className="mr-1.5 h-3 w-3 animate-spin" aria-hidden="true" />
                                                    )}
                                                    Accept invitation
                                                </Button>
                                            )}
                                            {isUnread && (
                                                <button
                                                    type="button"
                                                    onClick={() => markRead({ ids: [n.id] })}
                                                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {isUnread && (
                                        <span
                                            aria-label="Unread"
                                            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-500"
                                        />
                                    )}
                                </li>
                            );
                        })
                    )}
                </ul>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
