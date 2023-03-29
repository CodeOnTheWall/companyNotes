import { useGetNotesQuery } from "./notesApiSlice";

import Note from "./Note";

import useAuth from "../../hooks/useAuth";

// FOR REFERENCE UNDERSTANDING THE IDS AND ENTITIES
// {ids: Array(3), entities: {…}}
// entities:
// 63b87ac179e89e3468cbf67a:
// completed: false
// createdAt: "2023-01-06T19:47:13.071Z"
// id: "63b87ac179e89e3468cbf67a"
// text: "i am the danger\n"
// ticket: 500
// title: "test walter admin"
// updatedAt: "2023-01-11T18:07:27.608Z"
// user: "63a3258e62cd1419d4e1164a"
// username: "walter"
// __v: 0
// _id: "63b87ac179e89e3468cbf67a"
// 63befaab1ad8698af8663f5d: {_id: '63befaab1ad8698af8663f5d', user: '63a47c5418602e6e909d69bf', title: 'test jessie employee', text: 'science yo', completed: false, …}
// 63c0537cc45990c37c39ca5c: {_id: '63c0537cc45990c37c39ca5c', user: '63a47c5418602e6e909d69bf', title: 'Wheres Jessie?', text: 'Cant find Jessie', completed: false, …}
// ids: Array(3)
// 0: "63b87ac179e89e3468cbf67a"
// 1: "63befaab1ad8698af8663f5d"
// 2: "63c0537cc45990c37c39ca5c"

const NotesList = () => {
  const { username, isManager, isAdmin } = useAuth();

  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery("notesList", {
    // options available via setupListeners(store.dispatch) in store.js
    // want it to update more often so only 15 seconds
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = notes;

    let filteredIds;
    if (isManager || isAdmin) {
      // if manager or admin, show all notes
      filteredIds = [...ids];
    } else {
      // else only show the notes of that specific employee (as employee doesnt have authorization to see other notes)
      // filter method creates a new array
      filteredIds = ids.filter(
        (noteId) => entities[noteId].username === username
      );
    }

    // if ids has a length, map over ids otherwise null
    const tableContent =
      ids?.length &&
      filteredIds.map((noteId) => <Note key={noteId} noteId={noteId} />);

    content = (
      <table className="table table--notes">
        <thead className="table__thead">
          {/* tr table row, th table header */}
          <tr>
            <th scope="col" className="table__th note__status">
              Username
            </th>
            <th scope="col" className="table__th note__created">
              Created
            </th>
            <th scope="col" className="table__th note__updated">
              Updated
            </th>
            <th scope="col" className="table__th note__title">
              Title
            </th>
            <th scope="col" className="table__th note__username">
              Owner
            </th>
            <th scope="col" className="table__th note__edit">
              Edit
            </th>
          </tr>
        </thead>
        {/* mapped over notes here */}
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
};
export default NotesList;
