// react router dom
import { Routes, Route } from "react-router-dom";

// components
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import PersistLogin from "./features/auth/PersistLogin";
import Prefetch from "./features/auth/Prefetch";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditNote from "./features/notes/EditNote";
import NewNote from "./features/notes/NewNote";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";

function App() {
  return (
    <Routes>
      {/* parent route of everything else */}
      <Route path="/" element={<Layout />}>
        {/* publuc routes */}
        {/* index routes render at parent url */}
        <Route index element={<Public />} />

        <Route path="login" element={<Login />} />

        {/* protected routes */}
        {/* Prefetched data for notes and users */}
        <Route element={<PersistLogin />}>
          {/* before Prefetch so if someone isnt authorized the data wont fetch */}
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
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
