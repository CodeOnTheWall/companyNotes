import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3500",
  // always sends cookie - secure http only cookie that contains rT
  credentials: "include",
  // getState is api object, could be api.getState, but destructuring, this gets current state from application
  prepareHeaders: (headers, { getState }) => {
    // looking at current state, then auth state and getting current token and assigning that token
    const token = getState().auth.token;

    // if token, set headers
    if (token) {
      // specific format expected is 'Bearer token' - this sets authorization header
      headers.set("authorization", `Bearer ${token}`);
    }
    // now this is applied to every req sent
    return headers;
  },
});

// query wrapper
const baseQueryWithReauth = async (args, api, extraOptions) => {
  // request url, method, body
  // console.log(args)
  // signal, dispatch, getState() - baseQuery has its own api to use
  // console.log(api)
  // custom like {shout: true}
  // console.log(extraOptions)

  // await the result from first req, so we have used access token as defined in baseQuery above
  let result = await baseQuery(args, api, extraOptions);

  // trying original aT - if error, have to send a rT to get a new aT
  if (result?.error?.status === 403) {
    console.log("sending refresh token");

    // send rT to get new aT (arg is /auth/refresh )
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    // data should hold access token
    if (refreshResult?.data) {
      // store the new token by spreading in the access token and set that token in redux state
      api.dispatch(setCredentials({ ...refreshResult.data }));

      // essentially trying original aT, then send rT, and gives us new access token, with setCredentials
      // after setting credentials, retry original query (args) with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login has expired.";
      }
      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  // for invalidating cached data
  tagTypes: ["Note", "User"],
  endpoints: (builder) => ({}),
});
