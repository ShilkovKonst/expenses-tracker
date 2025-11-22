"use client";
import YearBlock from "./YearBlock";
import { useTracker } from "@/context/TrackerContext";

const AccordionBlock = () => {
  const { trackerId, trackerYears } = useTracker();

  return (
    <div className="w-full">
      {trackerYears &&
        Object.values(trackerYears).map((year, index) => (
          <YearBlock dataId={trackerId} key={index} year={year} />
        ))}
    </div>
  );
};

export default AccordionBlock;
