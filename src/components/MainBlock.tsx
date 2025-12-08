"use client";
import AccordionBlock from "./accordionBlockComponents/AccordionBlock";
import StickyBlock from "./stickyComponents/StickyBlock";
import ActiveTrackerBlock from "./trackerComponents/ActiveTrackerBlock";
import ModalRoot from "./modals/ModalRoot";
import FlashBlock from "./flash/FlashBlock";
import { useTracker } from "@/context/TrackerContext";
import { useMemo } from "react";
import Image from "next/image";

const MainBlock = () => {
  const { trackerId, trackerTags, trackerMeta, trackerYears } = useTracker();

  const isAllDataValid = useMemo(
    () => trackerId && trackerTags && trackerMeta && trackerYears,
    [trackerId, trackerMeta, trackerTags, trackerYears]
  );

  return (
    <main className="relative font-sans min-h-[calc(100vh-372px)] md:min-h-[calc(100vh-362px)] lg:min-h-[calc(100vh-290px)] pt-2.5 bg-blue-50/95 flex flex-col lg:flex-row">
      <div className="hidden lg:block absolute -top-5 right-[calc(50%-1rem)] border-6 p-2.5 rounded-full border-blue-400"></div>
      <FlashBlock />
      <ModalRoot />
      <section className="w-full lg:w-1/2 2xl:w-1/3 pb-7 lg:border-r-3 border-b-6 lg:border-b-0 border-blue-400 px-2 md:px-6 py-2 flex flex-col justify-start items-center">
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
      <section className=" lg:border-l-3 border-blue-400"></section>
    </main>
  );
};

export default MainBlock;
