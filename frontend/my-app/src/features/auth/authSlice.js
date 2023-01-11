import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  //   expecting to receive token back from api
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

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
