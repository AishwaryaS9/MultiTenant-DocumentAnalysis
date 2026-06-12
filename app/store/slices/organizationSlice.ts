import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrganizationState {
    currentOrgSlug: string | null | undefined;
}

const initialState: OrganizationState = {
    currentOrgSlug: null,
};

const organizationSlice = createSlice({
    name: "organization",
    initialState,
    reducers: {
        setCurrentOrg(state, action: PayloadAction<string>) {
            state.currentOrgSlug = action.payload;
        },
        clearCurrentOrg(state) {
            state.currentOrgSlug = null;
        },
    },
});

export const {
    setCurrentOrg,
    clearCurrentOrg,
} = organizationSlice.actions;

export default organizationSlice.reducer;