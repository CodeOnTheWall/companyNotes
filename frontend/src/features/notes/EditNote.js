import { useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";

import EditNoteForm from "./EditNoteForm";
import { useGetNotesQuery } from "./notesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";

import useTitle from "../../hooks/useTitle";
import useAuth from "../../hooks/useAuth";

const EditNote = () => {
  useTitle("techNotes: Edit Note");

  const { id } = useParams();

  // using useAuth, where an employee could possibly enter note id in url and get access even though role didnt permit them
  const { username, isManager, isAdmin } = useAuth();

  // getting the note from the id
  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[id],
    }),
  });

  // ids are iterable, entities are not
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  // while loading note and users
  if (!note || !users?.length) return <PulseLoader color={"#FFF"} />;

  // if not manager and not admin, and also the individual employee isnt assigned to the note
  // this is if an employee tries to put in the id in the search bar
  if (!isManager && !isAdmin) {
    if (note.username !== username) {
      return <p className="errmsg">No access</p>;
    }
  }

  const content = <EditNoteForm note={note} users={users} />;

  return content;
};
export default EditNote;
