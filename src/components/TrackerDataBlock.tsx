"use client";
import { memo, useMemo } from "react";
import AccordionBlock from "./accordionBlockComponents/AccordionBlock";
import StickyBlock from "./stickyComponents/StickyBlock";
import ActiveTrackerBlock from "./trackerComponents/ActiveTrackerBlock";
import { useTracker } from "@/context/TrackerContext";
import Image from "next/image";

const TrackerDataBlock = () => {
  const { trackerId, trackerTags, trackerMeta, trackerYears } = useTracker();

  const isAllDataValid = useMemo(
    () => trackerId && trackerTags && trackerMeta && trackerYears,
    [trackerId, trackerMeta, trackerTags, trackerYears]
  );
  return (
    <section className="w-full lg:w-1/2 2xl:w-1/3 lg:border-r-3 border-b-6 lg:border-b-0 border-blue-400 lg:px-2 pb-3 lg:pb-7 lg:pl-6 lg:pr-4 pt-1 flex flex-col justify-start items-center">
      {isAllDataValid ? (
        <>
          <StickyBlock />
          <ActiveTrackerBlock />
          <AccordionBlock />
        </>
      ) : (
        <Image
          className="opacity-1"
          width={680}
          height={665}
          src={"/tracker-logo.svg"}
          alt="tracker-logo"
        />
      )}
    </section>
  );
};

export default memo(TrackerDataBlock);
