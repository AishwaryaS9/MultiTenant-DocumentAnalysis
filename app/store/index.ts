import { configureStore } from "@reduxjs/toolkit";

import userReducer from './slices/userSlice';
import organizationReducer from "./slices/organizationSlice";
import { documentsApi } from "./services/documentsApi";

export const store = configureStore({
    reducer: {
        user: userReducer,
        organization: organizationReducer,
        [documentsApi.reducerPath]: documentsApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(documentsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;