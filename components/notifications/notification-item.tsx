"use client";

import { Loader2, MailPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import type { AppNotification } from "@/types";

interface NotificationItemProps {
    notification: AppNotification;
    canAccept: boolean;
    isAccepting: boolean;
    onAccept: (n: AppNotification) => void;
    onMarkRead: (id: string) => void;
}

export default function NotificationItem({
    notification: n,
    canAccept,
    isAccepting,
    onAccept,
    onMarkRead,
}: NotificationItemProps) {
    const isUnread = !n.readAt;

    return (
        <li className={`px-4 py-3 flex gap-3 ${isUnread ? "bg-orange-50/50" : ""}`}>
            <div
                aria-hidden="true"
                className="h-9 w-9 shrink-0 rounded-xl bg-slate-900 text-white flex items-center justify-center"
            >
                <MailPlus className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 wrap-break-word">{n.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 wrap-break-word">{n.message}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </p>

                <div className="flex items-center gap-3 mt-2">
                    {canAccept && (
                        <Button
                            size="sm"
                            onClick={() => onAccept(n)}
                            disabled={isAccepting}
                            className="h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs cursor-pointer"
                        >
                            {isAccepting && (
                                <Loader2 className="mr-1.5 h-3 w-3 animate-spin" aria-hidden="true" />
                            )}
                            Accept invitation
                        </Button>
                    )}
                    {isUnread && (
                        <button
                            type="button"
                            onClick={() => onMarkRead(n.id)}
                            className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                        >
                            Mark as read
                        </button>
                    )}
                </div>
            </div>

            {isUnread && (
                <span aria-label="Unread" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
            )}
        </li>
    );
}
