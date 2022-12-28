import { useGetNotesQuery } from "./notesApiSlice";
import Note from "./Note";

const NotesList = () => {
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery(undefined, {
    // find out
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
    const { ids } = notes;

    // if ids has a length, map over ids otherwise null
    const tableContent = ids?.length
      ? ids.map((noteId) => <Note key={noteId} noteId={noteId} />)
      : null;

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
