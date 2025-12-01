import React from "react";
import TrackersBlock from "./trackerComponents/TrackersBlock";
import RegisteredTrackersBlock from "./trackerComponents/RegisteredTrackersBlock";

const NavBlock = () => {
  return (
    <nav className="border-t-2 border-blue-100 bg-blue-50/95 px-2 md:px-6 pt-2 pb-0 flex flex-col lg:flex-row-reverse">
      <TrackersBlock />
      <RegisteredTrackersBlock />
    </nav>
  );
};

export default NavBlock;
