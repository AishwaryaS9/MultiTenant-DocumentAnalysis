"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    NOTIFICATIONS_POLL_INTERVAL_MS,
    useGetNotificationsQuery,
} from "@/app/store/services/notificationsApi";
import NotificationItem from "./notification-item";
import { useNotificationActions } from "./use-notification-actions";

export default function NotificationBell() {
    const { isSignedIn } = useAuth();
    const [open, setOpen] = useState(false);

    const { data } = useGetNotificationsQuery(undefined, {
        skip: !isSignedIn,
        pollingInterval: NOTIFICATIONS_POLL_INTERVAL_MS,
        skipPollingIfUnfocused: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    const { acceptingId, canAccept, accept, markOneRead, markAllRead } =
        useNotificationActions(() => setOpen(false));

    const notifications = data?.notifications ?? [];
    const unreadCount = data?.unreadCount ?? 0;

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label={
                        unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"
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
                            onClick={() => markAllRead()}
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
                        notifications.map((n) => (
                            <NotificationItem
                                key={n.id}
                                notification={n}
                                canAccept={canAccept(n)}
                                isAccepting={acceptingId === n.id}
                                onAccept={accept}
                                onMarkRead={markOneRead}
                            />
                        ))
                    )}
                </ul>

                <div className="border-t border-slate-100 px-4 py-2.5 text-center">
                    <Link
                        href="/notifications"
                        onClick={() => setOpen(false)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                        View all notifications
                    </Link>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
