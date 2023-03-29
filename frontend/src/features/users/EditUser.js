import { useParams } from "react-router-dom";

import EditUserForm from "./EditUserForm";
import { useGetUsersQuery } from "./usersApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

const EditUser = () => {
  useTitle("techNotes: Edit User");

  // getting user id out of url
  const { id } = useParams();
  // console.log(id);

  // reminder that rtkq will check if theres a cache first, if no cache, make api call
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });

  // if no user, then we are loading
  if (!user) return <PulseLoader color={"#FFF"} />;

  const content = <EditUserForm user={user} />;

  return content;
};
export default EditUser;
