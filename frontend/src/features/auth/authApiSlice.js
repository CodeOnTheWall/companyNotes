// injecting endpoints into our api to interact with backend api
import { apiSlice } from "../../app/api/apiSlice";

// non api slice (not communicating with back end) that handles frontend state via action handlers
import { logOut, setCredentials } from "./authSlice";

// onQueryStarted is a lifecycle hook

// requests to be sent to back end api which receive as responses
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      // credentials is username and password that is sent with query
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        // object expected to be received by the backend, spreading out the credentials into the object
        body: { ...credentials },
      }),
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      // onQueryStarted function is an RTK Query lifecycle hook that is called when
      // the mutation is started. In this hook, queryFulfilled is used to wait until
      // the mutation is completed before logging out the user and resetting the
      // API state. needs an arg - required
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          // const { data } = (could do this as queryFulfilled would return a data object)
          // this queryFulfilled is the query send to /auth/logout
          await queryFulfilled;
          // sets token to null in local state
          dispatch(logOut());
          // to get rid of subscriptions and 'clear' apiSlice as well, to clear out cache and query subscription
          // this will stop notes and users from being fetched
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
    }),
    // sending a get req with a cookie with rT, to get a new aT
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          // data should be the aT
          const { data } = await queryFulfilled;
          const { accessToken } = data;
          // setting redux state with aT
          dispatch(setCredentials({ accessToken }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } =
  authApiSlice;
