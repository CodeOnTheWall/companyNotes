// react router dom
import { Routes, Route } from "react-router-dom";

// public routes
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
// persists login state, require specific authorization to access routes, and prefetches data
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import Prefetch from "./features/auth/Prefetch";
// private routes
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import NotesList from "./features/notes/NotesList";
import EditNote from "./features/notes/EditNote";
import NewNote from "./features/notes/NewNote";

function App() {
  return (
    <Routes>
      {/* parent route of everything else */}
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        {/* index routes render at parent url */}
        <Route index element={<Public />} />

        <Route path="login" element={<Login />} />

        {/* protected routes */}
        {/* since aT is wiped on refresh, must get a new aT via rT which is inside the cookie, since cookie didnt get wiped on refesh (not until expiration of cookie) */}
        <Route element={<PersistLogin />}>
          {/* before Prefetch so if someone isnt authorized the data wont fetch */}
          {/* must have a role to access below routes, hence prior to login, these routes won't be available to anyone*/}
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            {/* every 15 seconds, notes is being re fetched, every 1 min, users, via pollingInterval options in UsersList and NotesList */}
            {/* Prefetched data for notes and users (only once, subsequent queries via above) */}
            {/* reference redux dev tools to visually see the queries that load prior to /dash */}
            {/* also reference the network tab to see the fetches that are ocurring if need refresher */}
            {/* this Prefetched data will be available for all wrapped routes/components */}
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                {/* index components render at parents url (/dash) */}
                <Route index element={<Welcome />} />

                <Route
                  element={
                    <RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />
                  }
                >
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    {/* /dash/users/:id */}
                    <Route path=":id" element={<EditUser />} />
                    {/* /dash/users/new */}
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

                <Route path="notes">
                  <Route index element={<NotesList />} />
                  {/* /dash/notes/:id */}
                  <Route path=":id" element={<EditNote />} />
                  {/* /dash/notes/new */}
                  <Route path="new" element={<NewNote />} />
                </Route>
              </Route>
              {/* end Dash */}
            </Route>
          </Route>
          {/* end protected routes */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
