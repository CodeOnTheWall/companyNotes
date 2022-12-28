import { Outlet } from "react-router-dom";

import DashHeader from "./DashHeader";
import DashFooter from "./DashFooter";

const DashLayout = () => {
  return (
    <>
      {/* DashHeader will be above every protected page */}
      <DashHeader />
      <div className="dash-container">
        {/* outlets render at parent url, hence Welcome component will render here */}
        <Outlet />
      </div>
      <DashFooter />
    </>
  );
};
export default DashLayout;
