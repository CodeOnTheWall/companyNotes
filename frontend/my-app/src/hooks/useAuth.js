import { useSelector } from "react-redux";

// Slices
import { selectCurrentToken } from "../features/auth/authSlice";
// package to decode jwt on frontend
import jwtDecode from "jwt-decode";

const useAuth = () => {
  // selecting token from state
  const token = useSelector(selectCurrentToken);
  let isManager = false;
  let isAdmin = false;
  let status = "Employee";

  if (token) {
    // decode token and destructure username and roles
    const decoded = jwtDecode(token);
    // reminder when we 'signed' token in backend api, we put the info into UserInfo (refer to authController)
    const { username, roles } = decoded.UserInfo;

    // checking if includes, which would give a boolean response
    isManager = roles.includes("Manager");
    isAdmin = roles.includes("Admin");

    if (isManager) status = "Manager";
    if (isAdmin) status = "Admin";

    // return these values into useAuth hook, which can then be used for the RequireAuth hook to grant access to protected routes based on role
    return { username, roles, status, isManager, isAdmin };
  }

  // returned if dont have token
  return { username: "", roles: [], isManager, isAdmin, status };
};
export default useAuth;
