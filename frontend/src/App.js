// react router dom
import { Routes, Route } from "react-router-dom";

// public routes
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
// persists login state, require specific authorization to access routes, and prefetches data
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import Prefetch from "./features/auth/Prefetch";
import { ROLES } from "./config/roles";
// private routes
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import NotesList from "./features/notes/NotesList";
import EditNote from "./features/notes/EditNote";
import NewNote from "./features/notes/NewNote";

// VIA REDUX DEV TOOLS
// req is made, pending, subscription added, query fulfilled (meaning tags are provided for invalidation)
// tags are usersList and notesList, and the mutations in the slices have their own tags for inidivial changes and slice changes
// when getUsers and getNotes is called, they both provide tags, which is how further mutations can invalidate those tags, and communicate with that cache

export default function App() {
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
            {/* notes and users are being re fetched every 15sec/1min via pollingInterval option in usersList and NotesList */}
            {/* Prefetched data to be pre made to all routes, only queries once, unless we refresh page (after login) - review dev tools if needed */}
            {/* subsequent req are from the pollingInterval options, now all routes have this data pre loaded */}
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
