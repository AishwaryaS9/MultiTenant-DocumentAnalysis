"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import {
    NOTIFICATIONS_POLL_INTERVAL_MS,
    useGetNotificationsQuery,
} from "@/app/store/services/notificationsApi";

/**
 * Mounted once in the dashboard layout. Shows a toast the moment a new
 * notification shows up while the user is on the page. Notifications that
 * already existed on first load only light up the bell badge.
 */
export default function NotificationListener() {
    const { isSignedIn } = useAuth();
    const seenIds = useRef<Set<string> | null>(null);

    const { data } = useGetNotificationsQuery(undefined, {
        skip: !isSignedIn,
        pollingInterval: NOTIFICATIONS_POLL_INTERVAL_MS,
        skipPollingIfUnfocused: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    useEffect(() => {
        if (!data) return;

        // First payload: remember what's there, don't toast.
        if (seenIds.current === null) {
            seenIds.current = new Set(data.notifications.map((n) => n.id));
            return;
        }

        const seen = seenIds.current;
        for (const n of data.notifications) {
            if (!seen.has(n.id)) {
                seen.add(n.id);
                if (!n.readAt) {
                    toast(n.title, { description: n.message });
                }
            }
        }
    }, [data]);

    return null;
}
