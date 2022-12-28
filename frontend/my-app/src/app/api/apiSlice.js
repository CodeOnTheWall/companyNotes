import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  // baseQuery for all req to be sent to
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500" }),
  // essentially, after a mutation to the data, the query endpoint will consider its cached data invalid if it has a tag apart of rtkq tag system
  // this tag will tell the endpoint to re fetch the data to load the new content
  tagTypes: ["Note", "User"],
  // endpoints is required, and I will extend these slices in other slice files
  endpoints: (builder) => ({}),
});
