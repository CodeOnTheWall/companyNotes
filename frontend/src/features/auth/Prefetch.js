import { useEffect } from "react";
import { Outlet } from "react-router-dom";

// rtkq
import { store } from "../../app/store";
import { notesApiSlice } from "../notes/notesApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";

// prefetching (prefetch is built in) the data from getNotes and getUsers to be put into redux state
// wrapping all protected pages in this Prefetch component (for data to be pre-available)
// The values returned by the API requests for "getNotes" and "getUsers" endpoints will be stored in the store's state
// under the keys "notesList" and "usersList" respectively. These are also the subscription keys
const Prefetch = () => {
  useEffect(() => {
    store.dispatch(
      // endpoint: getNotes, arg to name these: notesList.
      // this data is subscribed to the application, when un mounted, data is unsubscribed
      // force query even if data already exists
      notesApiSlice.util.prefetch("getNotes", "notesList", { force: true })
    );
    store.dispatch(
      usersApiSlice.util.prefetch("getUsers", "usersList", { force: true })
    );
    // empty dependency[] only runs when component mounts
  }, []);

  return <Outlet />;
};
export default Prefetch;
