import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUsersQuery } from "./usersApiSlice";

const User = ({ userId }) => {
  // destructuring user from the returned result of selectFromResult. this func takes in the whole data object returned from useGetUsersQuery
  // which is all users (refer to usersController) and in this case, we are returning back the {user} entity that has the passed in userId
  const { user } = useGetUsersQuery("usersList", {
    // data has ids array and entities, finding the user entity by passing in userId
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });
  // console.log(userId);
  // console.log(user);

  const navigate = useNavigate();

  if (user) {
    const handleEdit = () => navigate(`/dash/users/${userId}`);

    // getting all roles, setting to string, and replacing commas with comma and a space
    const userRolesString = user.roles.toString().replaceAll(",", ", ");

    // to set an inactive class or not on active user
    const cellStatus = user.active ? "" : "table__cell--inactive";

    return (
      // table row, and table cell td
      <tr className="table__row user">
        <td className={`table__cell ${cellStatus}`}>{user.username}</td>
        <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
        <td className={`table__cell ${cellStatus}`}>
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else return null;
};

// now this component will only re render if there are changes to the data
const memoizedUser = memo(User);
export default memoizedUser;
