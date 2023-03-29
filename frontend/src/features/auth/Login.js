import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// rtkq
import { useDispatch } from "react-redux";
// non apiSlice
import { setCredentials } from "./authSlice";
// apiSlice to interact with rest api
import { useLoginMutation } from "./authApiSlice";

import usePersist from "../../hooks/usePersist";

const Login = () => {
  // refs to set focus
  const userRef = useRef();
  const errRef = useRef();

  // manage state of component
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  // redux
  const navigate = useNavigate();
  // router
  const dispatch = useDispatch();

  // rtkq will auto track loading state
  const [login, { isLoading }] = useLoginMutation();

  // focuses the input only when component loads (empty dependency [])
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // clear out error message when username or password changes
  // user may have read error, so when they go to continue typing, error should go away
  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // passing in username and password into login mutation func which sends these as credentials inside the authApiSlice to /auth
      // this gives us back the aT - can see in redux dev tools
      // unwrap is to be able to access raw error message if error
      const { accessToken } = await login({ username, password }).unwrap();
      // dispatching this aT into setCredentials which sets the frontend state object (the state of our app) to be the passed in aT
      dispatch(setCredentials({ accessToken }));
      // then clearing fields
      setUsername("");
      setPassword("");
      navigate("/dash");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
      // focus set on error message if err caught
      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);

  // if errMsg ? apply errmsg class, otherwise apply offscreen class
  const errClass = errMsg ? "errmsg" : "offscreen";

  // when I call login from useLoginMutation, it will come with an isLoading state
  if (isLoading) return <p>Loading...</p>;

  const content = (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>

      <main className="login">
        {/* aria-live monitors element for changes, and reads aloud as a screen reader,
        assertive will immediately announce updates */}
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>
        <form className="form" onSubmit={handleSubmit}>
          {/* htmlFor to align with id (if click, will focus) */}
          <label htmlFor="username">Username:</label>
          <input
            className="form__input"
            type="text"
            id="username"
            ref={userRef}
            // controlled input via adding the value
            value={username}
            onChange={handleUserInput}
            // dont want to show other usernames that could have been entered
            autoComplete="off"
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            className="form__input"
            type="password"
            id="password"
            onChange={handlePwdInput}
            value={password}
            required
          />
          <button className="form__submit-button">Sign In</button>

          <label htmlFor="persist" className="form__persist">
            <input
              type="checkbox"
              className="form__checkbox"
              id="persist"
              onChange={handleToggle}
              checked={persist}
            />
            Trust This Device
          </label>
        </form>
      </main>

      <footer>
        <Link to="/">Back to Home</Link>
      </footer>
    </section>
  );

  return content;
};
export default Login;
