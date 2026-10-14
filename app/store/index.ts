import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./slices/userSlice";
import organizationReducer from "./slices/organizationSlice";
import { documentsApi } from "./services/documentsApi";
import { notificationsApi } from "./services/notificationsApi";

const rootReducer = combineReducers({
    user: userReducer,
    organization: organizationReducer,
    [documentsApi.reducerPath]: documentsApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user", "organization"],
};

const persistedReducer = persistReducer(
    persistConfig,
    rootReducer
);

export const store = configureStore({
    reducer: persistedReducer,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }).concat(documentsApi.middleware, notificationsApi.middleware),
});

// Enables refetchOnFocus / refetchOnReconnect for RTK Query
setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;