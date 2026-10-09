"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Bell, BellRing, CheckCheck, SlidersHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    NOTIFICATIONS_POLL_INTERVAL_MS,
    useGetNotificationsQuery,
} from "@/app/store/services/notificationsApi";
import NotificationItem from "./notification-item";
import { useNotificationActions } from "./use-notification-actions";

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

    const { acceptingId, canAccept, accept, markOneRead, markAllRead } = useNotificationActions();

    const notifications = data?.notifications ?? [];
    const unreadCount = data?.unreadCount ?? 0;
    const visible = filter === "unread" ? notifications.filter((n) => !n.readAt) : notifications;

    const filters: { value: Filter; label: string; count: number }[] = [
        { value: "all", label: "All", count: notifications.length },
        { value: "unread", label: "Unread", count: unreadCount },
    ];

    return (
        <section
            aria-labelledby="notifications-heading"
            className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6"
        >
            {/* Page header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div
                        className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 px-3.5 py-1.5 text-xs font-semibold shadow-xs"
                        role="status"
                        aria-label="Notification center badge"
                    >
                        <Sparkles className="h-3.5 w-3.5 animate-pulse" aria-hidden="true" />
                        Notification Center
                    </div>
                    <h1
                        id="notifications-heading"
                        className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
                    >
                        Notifications
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Stay on top of workspace invitations and account activity.
                    </p>
                </div>

                <Card className="w-full rounded-xl border-slate-200/80 bg-white/80 px-5 py-4 shadow-xs sm:w-60">
                    <CardContent className="inline-flex w-full items-center gap-4 p-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-orange-50">
                            <BellRing className="h-5 w-5 text-orange-600" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex flex-col">
                            <span className="text-xs font-medium text-slate-500">Unread</span>
                            <span className="text-2xl font-bold tracking-tight text-slate-900">
                                {unreadCount}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 px-1 text-xs font-medium text-muted-foreground">
                        <SlidersHorizontal aria-hidden="true" className="h-3.5 w-3.5" />
                        <span>Filters</span>
                    </div>

                    <div
                        role="group"
                        aria-label="Filter notifications"
                        className="inline-flex rounded-lg border border-slate-200 bg-slate-50/50 p-1"
                    >
                        {filters.map((f) => (
                            <button
                                key={f.value}
                                type="button"
                                aria-pressed={filter === f.value}
                                onClick={() => setFilter(f.value)}
                                className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 ${filter === f.value
                                    ? "bg-white text-slate-900 shadow-xs"
                                    : "text-slate-500 hover:text-slate-900"
                                    }`}
                            >
                                {f.label}
                                <span className="ml-1.5 text-xs text-slate-400">{f.count}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <Button
                    variant="outline"
                    onClick={() => markAllRead()}
                    disabled={unreadCount === 0}
                    className="h-10 rounded-xl font-semibold text-slate-700 cursor-pointer focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-400"
                >
                    <CheckCheck className="mr-2 h-4 w-4" aria-hidden="true" />
                    Mark all as read
                </Button>
            </div>

            {/* List */}
            <Card className="overflow-hidden shadow-xs border border-slate-200/80 rounded-xl bg-white p-0 gap-0">
                {isLoading ? (
                    <div role="status" aria-label="Loading notifications" className="divide-y divide-slate-100">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="flex gap-4 px-4 py-4 sm:px-6 animate-pulse">
                                <div className="h-10 w-10 rounded-xl bg-slate-100" />
                                <div className="flex-1 space-y-2.5">
                                    <div className="h-3.5 w-1/3 rounded bg-slate-100" />
                                    <div className="h-3 w-2/3 rounded bg-slate-100" />
                                    <div className="h-3 w-1/5 rounded bg-slate-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div role="alert" className="flex h-48 flex-col items-center justify-center gap-3 text-center px-4">
                        <p className="text-sm text-red-500">Couldn&apos;t load your notifications.</p>
                        <Button
                            variant="outline"
                            onClick={() => refetch()}
                            className="h-10 rounded-xl cursor-pointer"
                        >
                            Try again
                        </Button>
                    </div>
                ) : visible.length === 0 ? (
                    <div role="status" className="flex h-56 flex-col items-center justify-center px-4 text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-orange-100 bg-orange-50">
                            <Bell className="h-5 w-5 text-orange-600" aria-hidden="true" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700">
                            {filter === "unread" ? "No unread notifications" : "No notifications yet"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {filter === "unread"
                                ? "You're all caught up."
                                : "Workspace invitations will show up here."}
                        </p>
                    </div>
                ) : (
                    <ul aria-label="Notifications list" className="divide-y divide-slate-100">
                        {visible.map((n) => (
                            <NotificationItem
                                key={n.id}
                                variant="page"
                                notification={n}
                                canAccept={canAccept(n)}
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
