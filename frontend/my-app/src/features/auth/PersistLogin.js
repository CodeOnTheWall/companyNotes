// help us remain logged in even when we refresh application

import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";

const PersistLogin = () => {
  // true or false
  const [persist] = usePersist();
  // selectCurrentToken is current access token from state
  const token = useSelector(selectCurrentToken);
  // for strict mode in react 18
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);

  // isUninitialized, the refresh func hasnt been called yet
  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    // this should run after second mount (react18, mounts>unmounts>mounts again)
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      // only want to send rT once, hence only send if effectRan.current === true (second mount via react18)
      const verifyRefreshToken = async () => {
        console.log("verifying refresh token");
        try {
          // const response =
          await refresh();
          // const { accessToken } = response.data
          // to give a bit more time to work for credentials to be set
          setTrueSuccess(true);
        } catch (err) {
          console.error(err);
        }
      };

      // calling above func which ultimately gets a new aT, if no token and persist is true
      // when we refresh page, state is wiped out, have no aT or any other state, hence !token
      if (!token && persist) verifyRefreshToken();
    }

    // if effectRan.current !== true, which it should be false on first mount, then set to true
    // and useRef will hold this value even after after component unmounts and re mounts
    return () => (effectRan.current = true);
    // to not get any warnings
    // eslint-disable-next-line
  }, []);

  let content;
  if (!persist) {
    // persist: no
    console.log("no persist");
    content = <Outlet />;
  } else if (isLoading) {
    //persist: yes, token: no
    console.log("loading");
    content = <p>Loading...</p>;
  } else if (isError) {
    //persist: yes, token: no
    console.log("error");
    content = (
      <p className="errmsg">
        {`${error?.data?.message} - `}
        <Link to="/login">Please login again</Link>.
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    //persist: yes, token: yes
    console.log("success");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    //persist: yes, token: yes
    console.log("token and uninit");
    console.log(isUninitialized);
    content = <Outlet />;
  }

  return content;
};
export default PersistLogin;
