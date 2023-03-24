import { createSlice } from "@reduxjs/toolkit";

// can see in redux dev tools that after we setCredentials, auth state has the aT
const authSlice = createSlice({
  name: "auth",
  //   expecting to receive token (aT) back from api
  initialState: { token: null },
  reducers: {
    // when getting data back from api, payload will contain accessToken
    // dont need state.auth.token as already inside of auth
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
    },
    // removing aT at logout
    logOut: (state, action) => {
      state.token = null;
    },
  },
});

// 'actions' of the authSlice
export const { setCredentials, logOut } = authSlice.actions;

// this is imported as authReducer in store, I can do this since this is default export
export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
