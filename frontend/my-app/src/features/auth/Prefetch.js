import { store } from "../../app/store";
import { notesApiSlice } from "../notes/notesApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

// wrapping all protected pages in this Prefetch component
const Prefetch = () => {
  useEffect(() => {
    console.log("subscribing");
    // creating manual subscription (via initiate) to notes and users that will remain active
    // and not expire in standard 60 sec
    const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate());
    const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());

    // and then unsubscribe if I leave protected pages
    return () => {
      console.log("unsubscribing");
      notes.unsubscribe();
      users.unsubscribe();
    };
    // empty dependency[] only runs when component mounts
  }, []);

  return <Outlet />;
};
export default Prefetch;
