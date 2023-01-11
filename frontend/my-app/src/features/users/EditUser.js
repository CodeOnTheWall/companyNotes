import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserById } from "./usersApiSlice";
import EditUserForm from "./EditUserForm";

const EditUser = () => {
  // getting user id out of url
  const { id } = useParams();
  // console.log(id);

  // this isnt querying the data again and thats why we dont have subscription
  // and dont want to send another query when we already have data - hence reference Prefetch.js
  // pulling individual user data from the state by searching via id
  const user = useSelector((state) => selectUserById(state, id));

  // if user, populate the EditUserForm
  const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>;

  return content;
};
export default EditUser;
