"use client";
import ChartsHeader from "./chartsBlock/ChartsHeader";
import OverviewBlock from "./chartsBlock/OverviewBlock";
import { useMemo, useState } from "react";
import RecordsCharts from "./chartsBlock/RecordsCharts";
import { useTracker } from "@/context/TrackerContext";
import { MonthRecord, TrackerYears } from "@/lib/types/dataTypes";
import { createTagId, TagId } from "@/lib/types/brand";
import { useGlobal } from "@/context/GlobalContext";
import LoadingSkeleton from "./LoadingSkeleton";
import Image from "next/image";

const ChartsBlock = () => {
  const { isLoading } = useGlobal();
  const { trackerId, trackerYears } = useTracker();
  const [selectedTag, setSelectedTag] = useState<TagId>(createTagId(-1));

  const rawRecords = useMemo(
    () => (trackerYears ? transformYearsToRecords(trackerYears) : []),
    [trackerYears],
  );

  return (
    <section className="w-full lg:w-1/2 2xl:w-2/3 lg:pt-1 pb-3 lg:pb-7 lg:pr-6 lg:pl-4 lg:border-l-3 border-blue-400">
      {isLoading ? (
        <LoadingSkeleton rowNo={1} />
      ) : !trackerId ? (
        <>
          {/* <NoDataPlaceholder
            text={t(locale, "body.form.tracker.idsTitleEmptyCharts")}
          /> */}
          <Image
            className="opacity-1 m-auto hidden lg:block"
            width={680}
            height={665}
            src={"/tracker-logo.svg"}
            alt="tracker-logo"
          />
        </>
      ) : (
        <>
          <ChartsHeader setSelectedTag={setSelectedTag} />
          <OverviewBlock selectedTag={selectedTag} rawRecords={rawRecords} />
          <div className="pt-4 border-b-6 border-blue-400"></div>
          {rawRecords.length > 0 && <RecordsCharts selectedTag={selectedTag} />}
        </>
      )}
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
