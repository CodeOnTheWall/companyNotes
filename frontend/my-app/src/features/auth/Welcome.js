import { Link } from "react-router-dom";

const Welcome = () => {
  // creating new date object
  const date = new Date();
  // formatting date
  // first expected value is locale (en-US), second is object of options (dateStyle and timeStyle)
  const today = new Intl.DateTimeFormat("en-US", {
    // date formatting style
    dateStyle: "full",
    // time formatting style
    timeStyle: "long",
  }).format(date);

  const content = (
    <section className="welcome">
      <p>{today}</p>

      <h1>Welcome!</h1>

      <p>
        <Link to="/dash/notes">View techNotes</Link>
      </p>

      <p>
        <Link to="/dash/users">View User Settings</Link>
      </p>
    </section>
  );

  return content;
};
export default Welcome;
