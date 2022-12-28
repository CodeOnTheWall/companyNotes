import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

// entity adapter comes with pre gen reducer functions like addOne, setOne, setMany, removeOne etc (for CRUD)
// also comes with pre set selectors to read contents of entity state object, like selectIds, selectAll etc etc
// this is getting a 'normalized state' - data with ids [] and entities (ids can be iterated over, but not entities)
// so I will use the ids to get data from entities when i need to
const usersAdapter = createEntityAdapter({});

// now here I will initiate the 'shape' of the state with a normalized state shape
// getInitialState returns a new entity state object like {ids: [], entities: {}}, this is a 'normalized state'
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
      //   provides the tags that can be invalidated
      providesTags: (result, error, arg) => {
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
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    deleteUser: builder.mutation({
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

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector for optimistic caching
const selectUsersData = createSelector(
  selectUsersResult,
  // normalized state object with ids & entities
  (usersResult) => usersResult.data
);

//getSelectors creates these selectors and can rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
  // if null ?? load initialState
  (state) => selectUsersData(state) ?? initialState
);
