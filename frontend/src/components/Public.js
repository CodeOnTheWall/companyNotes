import { Link } from "react-router-dom";

export default function Public() {
  return (
    <section className="public">
      <header>
        <h1>Welcome to Walter White Repairs!</h1>
      </header>

      <main className="public__main">
        <p>
          Located in Beautiful Downtown Albuquerque, Walter White Repairs
          provides a trained staff ready to meet your tech repair needs.
        </p>
        <address className="public__addr">
          Walter White Repairs
          {/* line break, good for poems and addresses */}
          <br />
          308 Negra Arroyo Lane
          <br />
          Albuquerque, NM 12345
          <br />
          <a href="tel:+15555555555">(555) 555-5555</a>
        </address>
        <br />
        <p>Owner: Walter White</p>
      </main>

      <footer>
        <Link to="/login">Employee Login</Link>
      </footer>
    </section>
  );
}
