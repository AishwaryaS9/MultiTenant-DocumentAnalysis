"use client";

import { useAuth } from "@clerk/nextjs";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    NOTIFICATIONS_POLL_INTERVAL_MS,
    useGetNotificationsQuery,
} from "@/app/store/services/notificationsApi";
import NotificationItem from "@/components/notifications/notification-item";
import { useNotificationActions } from "@/components/notifications/use-notification-actions";

const PAGE_LIMIT = 50;

export default function NotificationsPage() {
    const { isSignedIn } = useAuth();

    const { data, isLoading, isError } = useGetNotificationsQuery(PAGE_LIMIT, {
        skip: !isSignedIn,
        pollingInterval: NOTIFICATIONS_POLL_INTERVAL_MS,
        skipPollingIfUnfocused: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    const { acceptingId, canAccept, accept, markOneRead, markAllRead } = useNotificationActions();

    const notifications = data?.notifications ?? [];
    const unreadCount = data?.unreadCount ?? 0;

    return (
        <section aria-label="Notifications" className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-6 sm:py-10 mt-14 md:mt-0">
            <header className="flex items-start justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                        Notifications
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
                    </p>
                </div>

                {unreadCount > 0 && (
                    <Button
                        variant="ghost"
                        onClick={() => markAllRead()}
                        className="rounded-xl text-slate-600 cursor-pointer min-h-11"
                    >
                        <CheckCheck className="mr-2 h-4 w-4" aria-hidden="true" />
                        Mark all as read
                    </Button>
                )}
            </header>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                {isLoading ? (
                    <div role="status" className="flex items-center justify-center gap-2 py-16 text-sm text-slate-400">
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Loading notifications...
                    </div>
                ) : isError ? (
                    <p role="alert" className="py-16 text-center text-sm text-red-500">
                        Couldn&apos;t load notifications. Please try again.
                    </p>
                ) : notifications.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                            <Bell className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700">No notifications yet</p>
                        <p className="text-xs text-slate-400 mt-1">
                            Invitations and updates will show up here.
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {notifications.map((n) => (
                            <NotificationItem
                                key={n.id}
                                notification={n}
                                canAccept={canAccept(n)}
                                isAccepting={acceptingId === n.id}
                                onAccept={accept}
                                onMarkRead={markOneRead}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
