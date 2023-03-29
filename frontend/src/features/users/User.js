import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUsersQuery } from "./usersApiSlice";

const User = ({ userId }) => {
  // const user = useSelector(state => selectUserById(state, userId))

  // querying the db, get back the {data}, then using selectFromResult, we can only select
  // a specific data piece, in this case, finding the user by inserting the userId
  // into the entity

  // OTHER IMPORTANT NOTE - "usersList" tag
  // our component is auto subscribed to changes to the state and updates the cached result accordingly, so ui stays up to date (once component is mounted)
  // by adding a "tag", we put a label on this cache, so when a change happens anywhere with the tag "usersList"
  // the useGetUsersQuery will check the cache first (with the tag usersList), and load from the cache (if cache hasnt expired), if theres no cache or exp, sending another api call
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

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

// By using memo, you can ensure that the component will only re-render
// when its own props or state change, rather than whenever the parent
// component re-renders. This can help optimize the performance
const memoizedUser = memo(User);
export default memoizedUser;
