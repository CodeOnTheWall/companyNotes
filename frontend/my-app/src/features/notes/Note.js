import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectNoteById } from "./notesApiSlice";

// this Note.js is the mapped over from NotesList.js, each has a passed in noteId to be selected from state
const Note = ({ noteId }) => {
  // finding/selecting note by id
  const note = useSelector((state) => selectNoteById(state, noteId));

  const navigate = useNavigate();

  // createdAt is property on note
  if (note) {
    const created = new Date(note.createdAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    const updated = new Date(note.updatedAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    const handleEdit = () => navigate(`/dash/notes/${noteId}`);

    return (
      // table row tr, table cell, td
      <tr className="table__row">
        <td className="table__cell note__status">
          {/* gets different class based on completion */}
          {/* if note is completed then apply completed class and say completed */}
          {note.completed ? (
            <span className="note__status--completed">Completed</span>
          ) : (
            <span className="note__status--open">Open</span>
          )}
        </td>
        <td className="table__cell note__created">{created}</td>
        <td className="table__cell note__updated">{updated}</td>
        <td className="table__cell note__title">{note.title}</td>
        <td className="table__cell note__username">{note.username}</td>

        <td className="table__cell">
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else return null;
};
export default Note;
