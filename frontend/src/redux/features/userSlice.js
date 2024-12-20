import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    user: {}
};

const userSlice = createSlice({
    name: 'User',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = {}
        }
    }
});

export const { login, logout } = userSlice.actions;
export const userReducer = userSlice.reducer
export default userSlice.reducer;
