import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

// entity adapter comes with pre gen reducer functions like addOne, setOne, setMany, removeOne etc (for CRUD)
// also comes with pre set selectors (getSelector) to read contents of entity state object, like selectIds, selectAll etc etc
const usersAdapter = createEntityAdapter({});
// console.log(usersAdapter);

// if initialState exists in usersAdapter, we call getInitialState on the usersAdapter, getInitialState returns
// a new entity state object like {ids: [], entities: {}}. Hence at end of getUsers builder query, we
// set the userAdapter with initialState and loadedUsers (each user has an id, and the info on that user is the entity object)
const initialState = usersAdapter.getInitialState();

// injecting/adding endpoints into the apiSlice
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // methods (getUsers, addNewUser etc)
    getUsers: builder.query({
      // /users is an endpoint to make req on
      query: () => "/users",
      //   making sure there is not an error, and that i have 200 status (req succeeded)
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      //   get response from query (responseData)
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          // the normalized data via the usersAdapter looks for an id property, not _id (mongo id syntax), hence have to format it here
          // so giving each mapped user a user.id (which is the mongodb user._id)
          user.id = user._id;
          return user;
        });
        // putting loadedUsers, which has that new value at the id property
        // so now userAdapter has normalized value with ids and entities
        return usersAdapter.setAll(initialState, loadedUsers);
      },

      // providing tags here to be invalidated in the mutated methods for re-fetching of data
      // all the users from getUsers will have tag types: "Post", and id: "LIST" - if any of these gets invalidated
      // then the users will be re fetched
      // the mapping is mapping over the ids of each user, so each user will have tag type: "User", and an id

      // result is users in the redux store (from getUsers), arg is the arg passed when we call the query, we want dynamically set id tags,
      // so only the individual thing is re fetched, not everything, improves performance
      providesTags: (result, error, arg) => {
        // console.log(result);
        // could get a result that doesnt have an id, hence the else return
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            // to invalidate a single id for caching and re-fetching
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),

    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "POST",
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
      // only invalidating the id of the user to be re fetched (arg is the initialUserData)
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),

    deleteUser: builder.mutation({
      // only need the id here destructured from data sent in
      query: ({ id }) => ({
        url: `/users`,
        method: "DELETE",
        body: { id },
      }),
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

// returns the query result object - from getUsers (transformed data goes into the usersAdapter)
// to get this object, go into the slice, endpoints, getUsers method, then .select() to get entire result object (see console.log(result) in getUsers)
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
