import { useGetNotesQuery } from "./notesApiSlice";

import Note from "./Note";

import useAuth from "../../hooks/useAuth";

const NotesList = () => {
  const { username, isManager, isAdmin } = useAuth();

  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
    // giving a label of notesList stops the fetching from happening after logging out
  } = useGetNotesQuery("notesList", {
    // options available via setupListeners(store.dispatch) in store.js
    // want it to update more often so only 15 seconds
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  // ID is id of each note
  // console.log(notes);
  // will get entity objects like this:
  // 63a3367a50fad9faff4feb4b :
  // completed: false;
  // createdAt: "2022-12-21T16:38:18.069Z";
  // id: "63a3367a50fad9faff4feb4b";
  // text: "Pollo Hermano";
  // ticket: 501;
  // title: "Fring";
  // updatedAt: "2022-12-21T16:38:18.069Z";
  // user: "63a3258e62cd1419d4e1164a";
  // username: "walter";
  // _id: "63a3367a50fad9faff4feb4b";
  // WITH the array of ids as well:
  // 0: "63a3358450fad9faff4feb41"

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
