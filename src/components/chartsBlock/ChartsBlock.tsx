"use client";
import ChartsHeader from "./ChartsHeader";
import OverviewBlock from "./OverviewBlock";
import { useMemo, useState } from "react";
import RecordsCharts from "./RecordsCharts";
import { useTracker } from "@/context/TrackerContext";
import { MonthRecord, TrackerYears } from "@/lib/types/dataTypes";

const ChartsBlock = () => {
  const { trackerYears } = useTracker();
  const [selectedTag, setSelectedTag] = useState<number>(-1);

  const rawRecords = useMemo(
    () => (trackerYears ? transformYearsToRecords(trackerYears) : []),
    [trackerYears]
  );

  return (
    <section className="w-full lg:w-1/2 2xl:w-2/3 pt-5 lg:pt-1 pb-3 lg:pb-7 lg:pr-6 lg:pl-4 lg:border-l-3 border-blue-400">
      <OverviewBlock rawRecords={rawRecords} />
      <div className="pt-4 border-b-6 border-blue-400"></div>
      <ChartsHeader setSelectedTag={setSelectedTag} />
      <RecordsCharts selectedTag={selectedTag} />
    </section>
  );
};

export default ChartsBlock;

function transformYearsToRecords(years: TrackerYears): MonthRecord[] {
  const records: MonthRecord[] = [];
  for (const year of Object.values(years)) {
    for (const month of Object.values(year.months)) {
      records.push(...month.records);
    }
  }
  return records;
}
