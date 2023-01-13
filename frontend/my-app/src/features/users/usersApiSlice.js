import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

// entity adapter comes with pre gen reducer functions like addOne, setOne, setMany, removeOne etc (for CRUD)
// also comes with pre set selectors (getSelector) to read contents of entity state object, like selectIds, selectAll etc etc
const usersAdapter = createEntityAdapter({});

// getInitialState() is a method provided by the createEntityAdapter function that returns an initial state object for the normalized data. It creates an empty
// state object with properties ids and entities that are used to store the ids and the entities of the normalized data.
const initialState = usersAdapter.getInitialState();

// injecting/adding endpoints into the apiSlice
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // methods (getUsers, addNewUser etc)
    getUsers: builder.query({
      // /users is an endpoint to make req on
      query: () => ({
        url: "/users",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      //  transforming the response from query (calling it responseData)
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          // the normalized data via the usersAdapter looks for an id property, not _id (mongo id syntax), hence have to format it here
          // so giving each mapped user a user.id (which is the mongodb user._id)
          user.id = user._id;
          return user;
        });
        // setting the initialState to have the loadedUsers (now loadedUsers data is inside initialState with a format of ids and entities). now we can use
        // the usersAdapters reducer funcs and selectors mentioned above on the initialState data
        return usersAdapter.setAll(initialState, loadedUsers);
      },

      // providing tags here to be invalidated in the mutated methods for re-fetching of data
      // id: "LIST" indicates the data returned from endpoint is complete list of users, good for invalidating after deletion or adding, as whole list would change
      // also mapping over the ids of each user, so each user will have tag type: "User", and an id, good for updating

      // result is data returned from endpoint (getUsers), arg is the arg passed when we call the query, we want dynamically set id tags,
      // so only the individual thing is re fetched, not everything, improves performance
      providesTags: (result, error, arg) => {
        // console.log(result);
        // could get a result that doesnt have an id, hence the else return
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            // to invalidate a single id for caching and re-fetching (each user will have tag type User, and an id) - improves performance
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),

    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "POST",
        // body is what is sent to backend, backend access req.body
        body: {
          ...initialUserData,
        },
      }),
      // user list cache will be invalidated and be re fetched
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "PATCH",
        body: {
          ...initialUserData,
        },
      }),
      // only invalidating the id of the user to be re fetched (arg is the initialUserData passed in)
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),

    deleteUser: builder.mutation({
      // only need the id here destructured from data sent in
      query: ({ id }) => ({
        url: `/users`,
        method: "DELETE",
        body: { id },
      }),
      // arg is id passed in
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
  }),
});

// hooks auto created, just add use[insertMethod]Query/Mutation
export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;

// select() method returns the query result object chosen, in this case, the data from getUsers (transformed data goes into the usersAdapter)
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// Creates memoized selector. createSelector recieves input funcs(s) and then has an output func, so here input func being passed in is selectUsersResult query
// memoizing the query result object (selectUsersResult)
// memoization optimizes performance by only doing work if inputs have changed, and consistently returning the same result references if the inputs are the same.
// i.e, if getUsers result hasnt changed, wont re fetch
const selectUsersData = createSelector(
  selectUsersResult,
  // normalized state object with ids & entities
  (usersResult) => usersResult.data
);

export const {
  // maps over the state.ids array, and returns an array of entities in the same order.
  selectAll: selectAllUsers,
  selectById: selectUserById,
  // returns the state.ids array.
  selectIds: selectUserIds,
  // the entity adapter (which is usersAdapter) contains a getSelector func that returns a set of selectors to read contents of entity state object
  // this entity state object is the selectUsersData (since it returns usersResult.data)
  // selectors that know how to read the contents of an entity state object, which is the state from selectUsersData below
} = usersAdapter.getSelectors(
  // if null ?? load initialState
  (state) => selectUsersData(state) ?? initialState
);
