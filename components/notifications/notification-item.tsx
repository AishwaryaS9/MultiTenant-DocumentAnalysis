"use client";

import type { ComponentType } from "react";
import { Bell, Loader2, Users } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import type { NotificationItemProps } from "@/types";
import { statusNote } from "@/app/data/data";

const TYPE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
    ORG_INVITATION: Users,
};

export default function NotificationItem({
    notification: n,
    canAccept,
    isAccepting,
    onAccept,
    onMarkRead,
    invitationStatus,
    variant = "compact",
}: NotificationItemProps) {
    const isUnread = !n.readAt;
    const note = statusNote(invitationStatus);
    const createdAt = new Date(n.createdAt);
    const Icon = TYPE_ICONS[n.type] ?? Bell;

    if (variant === "page") {
        return (
            <li className="flex flex-col gap-2 px-6 py-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="flex min-w-0 flex-1 gap-4">
                    {/* Icon tile with unread dot */}
                    <div
                        aria-hidden="true"
                        className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-feature-pill"
                    >
                        <Icon className="h-3 w-3 text-primary" />
                        {isUnread && (
                            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-primary ring-1 ring-card" />
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="wrap-break-word text-sm font-semibold tracking-tight text-foreground">
                            {n.title}
                            {isUnread && <span className="sr-only"> (unread)</span>}
                        </h3>

                        <p className="mt-0.5 wrap-break-word text-xs text-muted-foreground">{n.message}</p>

                        {note && <p className="mt-1 text-xs font-medium text-muted-foreground">{note}</p>}

                        {(canAccept || isUnread) && (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                {canAccept && (
                                    <Button
                                        onClick={() => onAccept(n)}
                                        disabled={isAccepting}
                                        className="h-9 cursor-pointer rounded-xl bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1"
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
                                        className="h-9 cursor-pointer rounded-xl px-3 text-xs font-medium text-primary hover:bg-feature-pill hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/40"
                                    >
                                        Mark as read
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <p
                    className="whitespace-nowrap pl-16 text-xs text-muted-foreground sm:pl-0"
                    title={format(createdAt, "PPpp")}
                >
                    {formatDistanceToNow(createdAt, { addSuffix: true })}
                </p>
            </li>
        );
    }

    return (
        <li className={`flex gap-3 px-4 py-3 ${isUnread ? "bg-feature-pill/50" : ""}`}>
            <div
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-feature-pill"
            >
                <Icon className="h-4 w-4 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="wrap-break-word text-sm font-semibold text-foreground">{n.title}</p>
                <p className="mt-0.5 wrap-break-word text-xs text-muted-foreground">{n.message}</p>
                {note && <p className="mt-1 text-[11px] font-medium text-muted-foreground">{note}</p>}
                <p className="mt-1 text-[11px] text-muted-foreground">
                    {formatDistanceToNow(createdAt, { addSuffix: true })}
                </p>

                <div className="mt-2 flex items-center gap-3">
                    {canAccept && (
                        <Button
                            size="sm"
                            onClick={() => onAccept(n)}
                            disabled={isAccepting}
                            className="h-8 cursor-pointer rounded-lg bg-primary text-xs text-primary-foreground hover:bg-primary/90"
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
                            className="cursor-pointer text-xs font-semibold text-muted-foreground hover:text-primary"
                        >
                            Mark as read
                        </button>
                    )}
                </div>
            </div>

            {isUnread && (
                <span aria-label="Unread" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
            )}
        </li>
    );
}