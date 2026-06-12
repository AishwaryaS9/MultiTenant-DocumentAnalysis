import { User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: User = {
    id: '',
    name: null,
    firstName: null,
    email: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.firstName = action.payload.firstName;
            state.email = action.payload.email;
        },
        clearUser(state) {
            state.id = '';
            state.name = null;
            state.firstName = null;
            state.email = null;
        }
    }
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;