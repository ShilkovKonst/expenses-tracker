"use client";
import { useState } from "react";
import LoadTrackerBlock from "./trackerDataComponents/LoadTrackerBlock";
import NewTrackerBlock from "./trackerDataComponents/NewTrackerBlock";

const TrackerBlock = () => {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="grid gap-2 border-b-6 border-blue-400 pb-2">
      <div className="grid-rows-2 flex flex-col gap-1 justify-end items-end">
        <NewTrackerBlock />
        <LoadTrackerBlock setMessage={setMessage} />
      </div>
      {message && <div className="text-sm text-gray-700 mt-2">{message}</div>}
    </div>
  );
};

export default TrackerBlock;
