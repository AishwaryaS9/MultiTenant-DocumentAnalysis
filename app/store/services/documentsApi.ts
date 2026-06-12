import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Document } from "@/types";

export const documentsApi = createApi({
    reducerPath: "documentsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api",
    }),
    tagTypes: ["Documents"],
    endpoints: (builder) => ({

        // GET documents
        getDocuments: builder.query<Document[], string>({
            query: (organizationId) =>
                `/documents?organizationId=${organizationId}`,

            transformResponse: (response: {
                documents: Document[];
            }) => response.documents,

            providesTags: ["Documents"],
        }),
        // ANALYZE document
        analyzeDocument: builder.mutation<
            any,
            {
                documentId: string;
                organizationId: string;
                analysisType: string;
            }
        >({
            query: (body) => ({
                url: "/analyze",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Documents"],
        }),

        // DELETE document
        deleteDocument: builder.mutation<
            any,
            { documentId: string }
        >({
            query: ({ documentId }) => ({
                url: `/documents/${documentId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Documents"],
        }),
    }),
});

export const {
    useGetDocumentsQuery,
    useAnalyzeDocumentMutation,
    useDeleteDocumentMutation,
} = documentsApi;