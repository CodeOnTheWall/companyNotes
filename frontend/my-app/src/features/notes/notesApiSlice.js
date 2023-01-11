import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

// NORMALIZED STATE
// {
//   // The unique IDs of each item. Must be strings or numbers
//   ids: []
//   // A lookup table mapping entity IDs to the corresponding entity objects
//   entities: {
//   }
// }

// createEntityAdapter generates a set of prebuilt reducers and selectors for CRUD opps, on a normalized state structure
// reducers like addOne, deleteOne etc, and selectors like selectAll, selectIds to read content of entity state object
// entity refers to a data object in an app, i,e. here, Notes, and Users (each are entities)
const notesAdapter = createEntityAdapter({
  // when notes are completed, they sort to the bottom
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

// getInitialState returns a new entity state object like {ids: [], entities: {}}
const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      // query /notes
      query: () => "/notes",
      // if no error and status is 200, (recomended from docs)
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      // transforming the res since mongodb id looks like _id, and the entity object looks for just id
      transformResponse: (responseData) => {
        const loadedNotes = responseData.map((note) => {
          note.id = note._id;
          return note;
        });
        // setting the state with the intitialState (normalized state) and also adding loadedNotes
        return notesAdapter.setAll(initialState, loadedNotes);
      },
      // providingTags to be invalidated in mutations for re fetching of data
      // will tell rtkq if cache is old
      providesTags: (result, error, arg) => {
        // result is the entities objects and ids array (ids here is the id for each note, not id for each user)
        // the entities object is the entire data associated with that note (user who made, text, ticket etc )
        if (result?.ids) {
          return [
            // giving entire result these tags
            { type: "Note", id: "LIST" },
            // giving each note its own id for individual invalidation
            // essentially setting the tag on each note to be the same as its id
            ...result.ids.map((id) => ({ type: "Note", id })),
          ];
        } else return [{ type: "Note", id: "LIST" }];
      },
    }),

    addNewNote: builder.mutation({
      // param expected to be passed in is initialNote
      query: (initialNote) => ({
        url: "/notes",
        method: "POST",
        body: {
          ...initialNote,
        },
      }),
      invalidatesTags: [{ type: "Note", id: "LIST" }],
    }),

    updateNote: builder.mutation({
      query: (initialNote) => ({
        url: "/notes",
        // patch is for changing/updating, not replacing like put
        method: "PATCH",
        body: {
          ...initialNote,
        },
      }),
      // arg is the passed in initialNote, so invalidate the note that has arg.id and re fetch new data
      invalidatesTags: (result, error, arg) => [{ type: "Note", id: arg.id }],
    }),

    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: `/notes`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Note", id: arg.id }],
    }),
  }),
});

// add use[insertGetMethod]Query for get and use[insertMutation]Mutation
export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice;

// returns the query result object - all the notes
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// creates memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  // normalized state object with ids & entities
  (notesResult) => notesResult.data
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
  // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(
  (state) => selectNotesData(state) ?? initialState
);
