"use client";
import AccordionBlock from "./accordionBlockComponents/AccordionBlock";
import StickyBlock from "./stickyComponents/StickyBlock";
import ActiveTrackerBlock from "./trackerComponents/ActiveTrackerBlock";
import ModalRoot from "./modals/ModalRoot";

const MainBlock = () => {
  return (
    <main className="font-sans min-h-[calc(100vh-372px)] md:min-h-[calc(100vh-362px)] lg:min-h-[calc(100vh-290px)] w-full lg:w-1/2 2xl:w-1/3 pb-7 border-b-2 border-blue-100 bg-blue-50/95 px-2 md:px-6 pt-0">
      <StickyBlock />
      <ModalRoot />
      <div className="flex flex-col justify-between items-center w-full py-2">
        <ActiveTrackerBlock />
        <AccordionBlock />
      </div>
    </main>
  );
};

export default MainBlock;
