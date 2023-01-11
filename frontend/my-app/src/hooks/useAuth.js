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
    // in backend rest api code, UserInfo is a property on the token
    const decoded = jwtDecode(token);
    // reminder when we 'signed' token, we put the info into UserInfo
    const { username, roles } = decoded.UserInfo;

    // checking if includes, which would give a boolean response
    isManager = roles.includes("Manager");
    isAdmin = roles.includes("Admin");

    if (isManager) status = "Manager";
    if (isAdmin) status = "Admin";

    return { username, roles, status, isManager, isAdmin };
  }

  //   returned if dont have token
  return { username: "", roles: [], isManager, isAdmin, status };
};
export default useAuth;
