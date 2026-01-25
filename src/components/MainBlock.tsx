"use client";
import ModalRoot from "./modals/ModalRoot";
import FlashBlock from "./flash/FlashBlock";
import TrackerDataBlock from "./TrackerDataBlock";
import ChartsBlock from "./chartsBlock/ChartsBlock";

const MainBlock = () => {
  return (
    <main className="relative min-h-[calc(100vh-372px)] md:min-h-[calc(100vh-358px)] lg:min-h-[calc(100vh-280px)] pt-3 px-2 md:px-6 lg:px-0 bg-blue-50/95 flex flex-col lg:flex-row">
      <div className="hidden lg:block absolute -top-[calc(1.25rem-0.05rem)] right-[calc(50%-1rem)] border-6 p-2.5 rounded-full border-blue-400"></div>
      <div className="hidden 2xl:block absolute -top-[calc(1.25rem-0.05rem)] right-[calc(66.6%-0.9rem)] bg-blue-50 border-6 p-2.5 rounded-full border-blue-400"></div>
      <FlashBlock />
      <ModalRoot />
      <TrackerDataBlock />
      <ChartsBlock />
    </main>
  );
};

export default MainBlock;
