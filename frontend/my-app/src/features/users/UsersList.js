import { useGetUsersQuery } from "./usersApiSlice";

import User from "./User";

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    // these options are available via adding setUpListeners in store.js
    // this is for updating every so often, incase multiple employees were on same page
    // 60 sec, every min, will re query the data
    pollingInterval: 60000,
    // put focus on another window and come back, re fetch
    refetchOnFocus: true,
    // if component is mounted, re fetch data
    refetchOnMountOrArgChange: true,
  });
  // console.log(users);
  // entity objects here are all the data associated with the id of the user, the ids array has the ids of those users in it
  // ID here is id of user, and the entity object is all data associated with that user
  // entity object here {active: true, id, roles, username, etc}

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    // users is an array of ids and entity objects
    const { ids } = users;

    // if ids is defined, and it has a length. using ? operator so that if ids is undefined it wont throw an error
    const tableContent =
      ids?.length &&
      // always add key when mapping
      ids.map((userId) => <User key={userId} userId={userId} />);

    content = (
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__username">
              Username
            </th>
            <th scope="col" className="table__th user__roles">
              Roles
            </th>
            <th scope="col" className="table__th user__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
};
export default UsersList;
