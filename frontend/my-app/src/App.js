// react router dom
import { Routes, Route } from "react-router-dom";

// components
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";

function App() {
  return (
    <Routes>
      {/* parent route of everything else */}
      <Route path="/" element={<Layout />}>
        {/* index routes render at parent url */}
        <Route index element={<Public />} />

        <Route path="login" element={<Login />} />

        <Route path="dash" element={<DashLayout />}>
          {/* index components render at parents url (/dash) */}
          <Route index element={<Welcome />} />

          <Route path="notes">
            <Route index element={<NotesList />} />
          </Route>

          <Route path="users">
            <Route index element={<UsersList />} />
          </Route>
        </Route>
        {/* End Dash */}
      </Route>
    </Routes>
  );
}

export default App;
