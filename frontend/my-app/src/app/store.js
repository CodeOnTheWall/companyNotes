import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    // rtkq required
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  // adding (concat) apiSlice middleware to defaultMiddleware, this is required with rtkq
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  // to be able to use redux devTools
  devTools: true,
});

// this enables some options to use with the queries in Users and Notes
setupListeners(store.dispatch);
