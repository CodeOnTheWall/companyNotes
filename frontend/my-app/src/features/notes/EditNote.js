import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectNoteById } from "./notesApiSlice";
import { selectAllUsers } from "../users/usersApiSlice";
import EditNoteForm from "./EditNoteForm";

const EditNote = () => {
  // getting id from url
  const { id } = useParams();

  const note = useSelector((state) => selectNoteById(state, id));
  const users = useSelector(selectAllUsers);

  const content =
    // if have note and users
    note && users ? (
      <EditNoteForm note={note} users={users} />
    ) : (
      <p>Loading...</p>
    );

  return content;
};
export default EditNote;
