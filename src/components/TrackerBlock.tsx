"use client";
import { useState } from "react";
import LoadTrackerBlock from "./dataManager/LoadTrackerBlock";
import NewTrackerBlock from "./dataManager/NewTrackerBlock";
import { useTracker } from "@/context/TrackerContext";
import { GlobalDataType } from "@/types/formTypes";
import { setParsedData } from "@/lib/utils/trackerDataSetter";
import RegisteredTrackersBlock from "./dataManager/RegisteredTrackersBlock";

const TrackerBlock = () => {
  const { setTrackerId, setTrackerMeta, setTrackerTags, setTrackerYears } =
    useTracker();
  const [message, setMessage] = useState<string | null>(null);

  // const onMerge = (imported: GlobalDataType) => {
  //   if (trackerMeta) {
  //     const tagsMap = new Map<string, string>();
  //     for (const tag of Object.entries(trackerMeta.tagsPool)) {
  //       tagsMap.set(tag[0], tag[1]);
  //     }
  //     for (const tag of Object.entries(imported.meta.tagsPool)) {
  //       if (tagsMap.get(tag[0])) tagsMap.set(`t${tagsMap.size}`, tag[1]);
  //       else tagsMap.set(tag[0], tag[1]);
  //     }
  //   }

  //   if (trackerData) {
  //     const yearsToUpdate = [...trackerData.years];

  //     for (const importedYear of imported.years) {
  //       const updYearIndex = yearsToUpdate.findIndex(
  //         (y) => y.id === importedYear.id
  //       );
  //       if (updYearIndex === -1) {
  //         yearsToUpdate.push({ ...importedYear });
  //         continue;
  //       }
  //       const yearToUpdate = yearsToUpdate[updYearIndex];
  //       const monthsToUpdate = [...yearToUpdate.months];

  //       for (const importedMonth of importedYear.months) {
  //         const updMonthIndex = monthsToUpdate.findIndex(
  //           (m) => m.id === importedMonth.id
  //         );

  //         if (updMonthIndex === -1) throw new Error("month must exist!");

  //         const existingMonth = monthsToUpdate[updMonthIndex];
  //         const recordsMap = new Map<string, MonthRecord>();
  //         for (const rec of existingMonth.records)
  //           recordsMap.set(`${rec.id}_${rec.amount}`, rec);
  //         for (const rec of importedMonth.records)
  //           recordsMap.set(`${rec.id}_${rec.amount}`, rec);

  //         const mergedRecords = Array.from(recordsMap.values());
  //         const totalMonthAmount = mergedRecords.reduce(
  //           (acc, r) => acc + (r.type === "cost" ? -r.amount : r.amount),
  //           0
  //         );
  //         monthsToUpdate[updMonthIndex] = {
  //           ...existingMonth,
  //           records: mergedRecords,
  //           totalAmount: totalMonthAmount,
  //         };
  //       }

  //       const totalYearAmount = monthsToUpdate.reduce(
  //         (acc, m) => acc + m.totalAmount,
  //         0
  //       );

  //       const updatedYear = {
  //         ...yearToUpdate,
  //         months: monthsToUpdate.sort((a, b) => a.id - b.id),
  //         totalAmount: totalYearAmount,
  //       };
  //       yearsToUpdate[updYearIndex] = updatedYear;
  //     }

  //     const totalDataAmount = yearsToUpdate.reduce(
  //       (acc, y) => acc + y.totalAmount,
  //       0
  //     );
  //   }

  //   // setData((prev) => ({
  //   //   ...prev,
  //   //   meta: {
  //   //     ...prev.meta,
  //   //     tagsPool: mergedTags,
  //   //     updatedAt: new Date().toISOString(),
  //   //   },
  //   //   years: [...yearsToUpdate].sort((a, b) => a.id - b.id),
  //   //   totalAmount: totalDataAmount,
  //   // }));

  //   // setDirty(true);
  // };

  const onImport = (newData: GlobalDataType) => {
    setParsedData(
      newData,
      setTrackerId,
      setTrackerMeta,
      setTrackerTags,
      setTrackerYears
    );
    // setDirty(false);
  };

  return (
    <div className="grid grid-cols-3 gap-2 border-b-6 border-blue-400 pb-2">
      <div className="col-span-2 grid-rows-2">
        <NewTrackerBlock />
        <LoadTrackerBlock onImport={onImport} setMessage={setMessage} />
      </div>
      <div className="grid-rows-2">
        {/* settings block  */}
        
        </div>
      <RegisteredTrackersBlock />
      {message && <div className="text-sm text-gray-700 mt-2">{message}</div>}
    </div>
  );
};

export default TrackerBlock;
