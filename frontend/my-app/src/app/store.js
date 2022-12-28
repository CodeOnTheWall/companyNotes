import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";

export const store = configureStore({
  reducer: {
    // rtkq required
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // adding (concat) apiSlice middleware to defaultMiddleware, this is required with rtkq
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  // to be able to use redux devTools
  devTools: true,
});
