"use client";
import { useState } from "react";
import LoadTrackerBlock from "./LoadTrackerBlock";
import NewTrackerBlock from "./NewTrackerBlock";

const TrackersBlock = () => {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <section className="w-full flex gap-2 ">
      <div className="hidden lg:block mb-4 lg:border-l-3 border-blue-400"></div>
      <div className="w-full flex flex-col justify-end items-end pb-2 border-b-6 border-blue-400">
        <NewTrackerBlock />
        <LoadTrackerBlock setMessage={setMessage} />
      </div>
      {message && <div className="text-sm text-gray-700 mt-2">{message}</div>}
    </section>
  );
};

export default TrackersBlock;
