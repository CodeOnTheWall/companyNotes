import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

import { useNavigate, useLocation } from "react-router-dom";

const DashFooter = () => {
  const navigate = useNavigate();
  // useLocation hook returns the location object from the current URL (current Url)
  const { pathname } = useLocation();

  const onGoHomeClicked = () => navigate("/dash");

  let goHomeButton = null;
  if (pathname !== "/dash") {
    goHomeButton = (
      <button
        className="dash-footer__button icon-button"
        // when you mouse over button
        title="Home"
        onClick={onGoHomeClicked}
      >
        <FontAwesomeIcon icon={faHouse} />
      </button>
    );
  }

  const content = (
    <footer className="dash-footer">
      {/* this will only appear if not at /dash, as dont want to appear if already at home */}
      {goHomeButton}
      <p>Current User:</p>
      <p>Status:</p>
    </footer>
  );

  return content;
};
export default DashFooter;
