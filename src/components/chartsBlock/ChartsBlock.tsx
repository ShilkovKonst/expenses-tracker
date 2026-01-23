"use client";
import ChartsHeader from "./ChartsHeader";
import OverviewBlock from "./OverviewBlock";
import { useMemo, useState } from "react";
import RecordsCharts from "./RecordsCharts";
import { useTracker } from "@/context/TrackerContext";
import { MonthRecord, TrackerYears } from "@/lib/types/dataTypes";
import { createTagId, TagId } from "@/lib/types/brand";

const ChartsBlock = () => {
  const { trackerYears } = useTracker();
  const [selectedTag, setSelectedTag] = useState<TagId>(createTagId(-1));

  const rawRecords = useMemo(
    () => (trackerYears ? transformYearsToRecords(trackerYears) : []),
    [trackerYears],
  );

  return (
    <section className="w-full lg:w-1/2 2xl:w-2/3 lg:pt-1 pb-3 lg:pb-7 lg:pr-6 lg:pl-4 lg:border-l-3 border-blue-400">
      <ChartsHeader setSelectedTag={setSelectedTag} />
      <OverviewBlock selectedTag={selectedTag} rawRecords={rawRecords} />
      <div className="pt-4 border-b-6 border-blue-400"></div>
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
