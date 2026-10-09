"use client";

import { Clock, Loader2, MailPlus } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AppNotification } from "@/types";

interface NotificationItemProps {
    notification: AppNotification;
    canAccept: boolean;
    isAccepting: boolean;
    onAccept: (n: AppNotification) => void;
    onMarkRead: (id: string) => void;
    /** "compact" for the bell dropdown, "page" for the Notifications page */
    variant?: "compact" | "page";
}

const TYPE_LABELS: Record<string, string> = {
    ORG_INVITATION: "Invitation",
};

export default function NotificationItem({
    notification: n,
    canAccept,
    isAccepting,
    onAccept,
    onMarkRead,
    variant = "compact",
}: NotificationItemProps) {
    const isUnread = !n.readAt;
    const createdAt = new Date(n.createdAt);

    if (variant === "page") {
        return (
            <li
                className={`flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-start sm:px-6 transition-colors hover:bg-slate-50/60 ${isUnread ? "bg-orange-50/30" : ""
                    }`}
            >
                <div className="flex min-w-0 flex-1 gap-4">
                    <div
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-orange-50"
                    >
                        <MailPlus className="h-5 w-5 text-orange-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold tracking-tight text-slate-900 wrap-break-word">
                                {n.title}
                            </h3>

                            <Badge
                                variant="outline"
                                className="rounded-md border-orange-200/80 bg-orange-50/60 px-2.5 py-0.5 text-xs font-medium text-orange-700"
                            >
                                {TYPE_LABELS[n.type] ?? "Update"}
                            </Badge>

                            {isUnread && (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-orange-600">
                                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                    New
                                </span>
                            )}
                        </div>

                        <p className="mt-1 text-sm text-slate-500 wrap-break-word">{n.message}</p>

                        <p
                            className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-400"
                            title={format(createdAt, "PPpp")}
                        >
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            {formatDistanceToNow(createdAt, { addSuffix: true })}
                        </p>
                    </div>
                </div>

                {(canAccept || isUnread) && (
                    <div className="flex items-center gap-2 pl-14 sm:pl-0 sm:shrink-0">
                        {canAccept && (
                            <Button
                                onClick={() => onAccept(n)}
                                disabled={isAccepting}
                                className="h-10 rounded-xl bg-slate-900 px-5 text-sm font-semibold hover:bg-slate-800 cursor-pointer focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-900"
                            >
                                {isAccepting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                )}
                                Accept invitation
                            </Button>
                        )}
                        {isUnread && (
                            <Button
                                variant="ghost"
                                onClick={() => onMarkRead(n.id)}
                                className="h-10 rounded-xl text-sm font-semibold text-slate-600 cursor-pointer focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-600"
                            >
                                Mark as read
                            </Button>
                        )}
                    </div>
                )}
            </li>
        );
    }

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
                    {formatDistanceToNow(createdAt, { addSuffix: true })}
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
