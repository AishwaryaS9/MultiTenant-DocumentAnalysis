"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NOTIFICATIONS_POLL_INTERVAL_MS, useGetNotificationsQuery } from "@/app/store/services/notificationsApi";
import NotificationItem from "./notification-item";
import { useNotificationActions } from "../../app/hooks/use-notification-actions";

const PAGE_LIMIT = 50;

type Filter = "all" | "unread";

export default function NotificationsView() {
    const { isSignedIn } = useAuth();
    const [filter, setFilter] = useState<Filter>("all");

    const { data, isLoading, isError, refetch } = useGetNotificationsQuery(PAGE_LIMIT, {
        skip: !isSignedIn,
        pollingInterval: NOTIFICATIONS_POLL_INTERVAL_MS,
        skipPollingIfUnfocused: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    const notifications = data?.notifications ?? [];
    const unreadCount = data?.unreadCount ?? 0;

    const { acceptingId, canAccept, getInvitationStatus, accept, markOneRead, markAllRead } =
        useNotificationActions(notifications);
    const visible = filter === "unread" ? notifications.filter((n) => !n.readAt) : notifications;

    const filters: { value: Filter; label: string; count: number }[] = [
        { value: "all", label: "All", count: notifications.length },
        { value: "unread", label: "Unread", count: unreadCount },
    ];

    return (
        <section
            aria-labelledby="notifications-heading"
            className="mx-auto min-h-full max-w-7xl space-y-6 p-4 sm:p-6"
        >
            {/* Page header */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-orange-600 truncate">
                        Activity Center
                    </p>
                    <div className="flex items-baseline gap-3 flex-wrap">
                        <h1
                            id="notifications-heading"
                            className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight truncate"
                        >
                            Notifications
                        </h1>
                    </div>
                    <p className="text-sm text-slate-500">
                        Stay on top of workspace invitations and account activity.
                    </p>
                </div>

                <Button
                    onClick={() => markAllRead()}
                    disabled={unreadCount === 0}
                    className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 flex items-center gap-2 font-medium text-sm cursor-pointer min-h-10 shadow-sm focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-900"
                >
                    <CheckCheck className="mr-2 h-4 w-4" aria-hidden="true" />
                    Mark all as read
                </Button>
            </div>

            {/* Filters */}
            <div
                role="group"
                aria-label="Filter notifications"
                className="inline-flex rounded-full border border-border bg-card p-1"
            >
                {filters.map((f) => (
                    <button
                        key={f.value}
                        type="button"
                        aria-pressed={filter === f.value}
                        onClick={() => setFilter(f.value)}
                        className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${filter === f.value
                            ? "bg-feature-pill text-primary"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {f.label}
                        <span className="ml-1.5 text-xs opacity-70">{f.count}</span>
                    </button>
                ))}
            </div>

            {/* List */}
            <Card className="gap-0 overflow-hidden card-outline p-0 shadow-none">
                {isLoading ? (
                    <div role="status" aria-label="Loading notifications" className="divide-y divide-border">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="flex animate-pulse gap-4 px-6 py-5">
                                <div className="h-12 w-12 rounded-xl bg-feature-pill" />
                                <div className="flex-1 space-y-2.5">
                                    <div className="h-3.5 w-1/3 rounded bg-muted" />
                                    <div className="h-3 w-2/3 rounded bg-muted" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div role="alert" className="flex h-48 flex-col items-center justify-center gap-3 px-4 text-center">
                        <p className="text-sm text-destructive">Couldn&apos;t load your notifications.</p>
                        <Button
                            variant="outline"
                            onClick={() => refetch()}
                            className="h-10 cursor-pointer rounded-xl"
                        >
                            Try again
                        </Button>
                    </div>
                ) : visible.length === 0 ? (
                    <div role="status" className="flex h-56 flex-col items-center justify-center px-4 text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-feature-pill">
                            <Bell className="h-5 w-5 text-primary" aria-hidden="true" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                            {filter === "unread" ? "No unread notifications" : "No notifications yet"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {filter === "unread"
                                ? "You're all caught up."
                                : "Workspace invitations will show up here."}
                        </p>
                    </div>
                ) : (
                    <ul aria-label="Notifications list" className="divide-y divide-border">
                        {visible.map((n) => (
                            <NotificationItem
                                key={n.id}
                                variant="page"
                                notification={n}
                                canAccept={canAccept(n)}
                                invitationStatus={getInvitationStatus(n)}
                                isAccepting={acceptingId === n.id}
                                onAccept={accept}
                                onMarkRead={markOneRead}
                            />
                        ))}
                    </ul>
                )}
            </Card>
        </section>
    );
}