"use client";
import LoadTrackerBlock from "./LoadTrackerBlock";
import NewTrackerBlock from "./NewTrackerBlock";

const TrackersBlock = () => {
  return (
    <section className="w-full flex gap-2 lg:h-20">
      <div className="hidden lg:block mb-4 lg:border-l-3 border-blue-400"></div>
      <div className="w-full flex flex-col justify-between items-end gap-3 pb-3 border-b-6 border-blue-400">
        <NewTrackerBlock />
        <LoadTrackerBlock />
      </div>
    </section>
  );
};

export default TrackersBlock;
