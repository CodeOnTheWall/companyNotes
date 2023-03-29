import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";
import { useGetNotesQuery } from "./notesApiSlice";
import { memo } from "react";

// this Note.js is the mapped over from NotesList.js, each has a passed in noteId to be selected from state
const Note = ({ noteId }) => {
  // querying the db, get back the {data}, then using selectFromResult, we can only select
  // a specific data piece, in this case, finding the note by inserting the noteId
  // into the entity

  // OTHER IMPORTANT NOTE - "notesList" tag
  // our component is auto subscribed to changes to the state and updates the cached result accordingly, so ui stays up to date (once component is mounted)
  // by adding a "tag", we put a label on this cache, so when a change happens anywhere with the tag "notesList"
  // the useGetNotesQuery will check the cache first (with the tag notesList), and load from the cache (if cache hasnt expired), if theres no cache or exp, sending another api call
  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      // data has ids array and entities, finding the note entity via passing in noteId
      note: data?.entities[noteId],
    }),
  });

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
      // table row tr, table cell td
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

// By using memo, you can ensure that the component will only re-render
// when its own props or state change, rather than whenever the parent
// component re-renders. This can help optimize the performance
const memoizedNote = memo(Note);
export default memoizedNote;
