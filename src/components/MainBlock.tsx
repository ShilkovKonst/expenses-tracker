"use client";
import AccordionBlock from "./accordionBlockComponents/AccordionBlock";
import StickyBlock from "./stickyComponents/StickyBlock";
import ActiveTrackerBlock from "./trackerComponents/ActiveTrackerBlock";
import ModalRoot from "./modals/ModalRoot";

const MainBlock = () => {
  return (
    <main className="relative font-sans min-h-[calc(100vh-372px)] md:min-h-[calc(100vh-362px)] lg:min-h-[calc(100vh-290px)] pt-2.5 bg-blue-50/95 flex flex-col lg:flex-row">
      <div className="hidden lg:block absolute -top-[1.25rem] right-[calc(50%-1rem)] border-6 p-2.5 rounded-full border-blue-400"></div>
      <section className="relative w-full lg:w-1/2 2xl:w-1/3 pb-7 lg:border-r-3 border-blue-400 px-2 md:px-6 pt-0">
        <StickyBlock />
        <ModalRoot />
        <div className="flex flex-col justify-between items-center w-full py-2">
          <ActiveTrackerBlock />
          <AccordionBlock />
        </div>
      </section>
      <section className=" lg:border-l-3 border-blue-400"></section>
    </main>
  );
};

export default MainBlock;
