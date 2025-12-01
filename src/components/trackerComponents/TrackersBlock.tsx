"use client";
import { useState } from "react";
import LoadTrackerBlock from "./LoadTrackerBlock";
import NewTrackerBlock from "./NewTrackerBlock";

const TrackersBlock = () => {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <section className="w-full grid gap-2 border-b-6 border-blue-400 pb-2 lg:pl-2 lg:border-l-3">
      <div className="grid-rows-2 flex flex-col justify-end items-end">
        <NewTrackerBlock />
        <LoadTrackerBlock setMessage={setMessage} />
      </div>
      {message && <div className="text-sm text-gray-700 mt-2">{message}</div>}
    </section>
  );
};

export default TrackersBlock;
