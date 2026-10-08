import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { NotificationsResponse } from "@/types";

export const NOTIFICATIONS_POLL_INTERVAL_MS = 15_000;

export const notificationsApi = createApi({
    reducerPath: "notificationsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    tagTypes: ["Notifications"],
    endpoints: (builder) => ({
        // Optional limit (defaults to 20 on the server, max 100)
        getNotifications: builder.query<NotificationsResponse, number | void>({
            query: (limit) => (limit ? `/notifications?limit=${limit}` : "/notifications"),
            providesTags: ["Notifications"],
        }),

        // Mark specific notifications as read, or all when no ids are passed
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
