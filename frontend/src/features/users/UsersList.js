import { useGetUsersQuery } from "./usersApiSlice";

import User from "./User";

// NOTE ABOUT CACHE TAG
// if other parts of app change the cache of the tag "usersList", this component will see that as its subscribed to the store
// but it wont cause a api call, it will just update the cache with the new cache
// and render the ui accordingly (on component mount), and only the changes

const UsersList = () => {
  // all these states are automatically monitored by rtkq
  const {
    // naming data: users
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    // these options are available via adding setUpListeners in store.js
    // these options do cause api calls
    // this is for updating every so often, incase multiple employees were on same page
    // 60000 millisec, every min, will re query the data
    pollingInterval: 60000,
    // put focus on another window and come back, re fetch
    refetchOnFocus: true,
    // if component is mounted, re fetch data
    refetchOnMountOrArgChange: true,
  });

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
