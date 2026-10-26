import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { NotificationsResponse, NotificationsPageArgs } from "@/types";

export const NOTIFICATIONS_POLL_INTERVAL_MS = 15_000;

export const notificationsApi = createApi({
    reducerPath: "notificationsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    tagTypes: ["Notifications"],
    endpoints: (builder) => ({
        getNotifications: builder.query<NotificationsResponse, number | NotificationsPageArgs | void>({
            query: (arg) => {
                if (!arg) return "/notifications";
                if (typeof arg === "number") return `/notifications?limit=${arg}`;

                const params = new URLSearchParams();
                if (arg.limit) params.set("limit", String(arg.limit));
                if (arg.page) params.set("page", String(arg.page));
                if (arg.unreadOnly) params.set("unread", "true");
                const qs = params.toString();
                return qs ? `/notifications?${qs}` : "/notifications";
            },
            providesTags: ["Notifications"],
        }),

        markNotificationsRead: builder.mutation<{ success: boolean }, { ids?: string[] } | void>({
            query: (body) => ({
                url: "/notifications",
                method: "PATCH",
                body: body ?? {},
            }),
            invalidatesTags: ["Notifications"],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkNotificationsReadMutation,
} = notificationsApi;