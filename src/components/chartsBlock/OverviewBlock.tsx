"use client";
import { useTracker } from "@/context/TrackerContext";
import { createTagId, TagId } from "@/lib/types/brand";
import { MonthRecord, TrackerTags } from "@/lib/types/dataTypes";
import { decimalToInputString } from "@/lib/utils/amountHelper";
import { memo, useMemo } from "react";
import OverviewCard from "./OverviewCard";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import TotalCard from "./TotalCard";

type OverviewProps = {
  selectedTag: TagId;
  rawRecords: MonthRecord[];
};

const OverviewBlock = ({ selectedTag, rawRecords }: OverviewProps) => {
  const { locale } = useGlobal();
  const { trackerTags } = useTracker();

  const filteredeRecords = useMemo(
    () =>
      selectedTag === -1
        ? rawRecords
        : rawRecords.filter((r) => r.tags.includes(selectedTag)),
    [rawRecords, selectedTag],
  );

  const values = useMemo(() => {
    return rawRecords.reduce(
      (acc, cur) => {
        const matchesTag = selectedTag === -1 || cur.tags.includes(selectedTag);

        if (matchesTag) {
          if (cur.type === "cost") {
            acc[0] += cur.amount;
          } else {
            acc[1] += cur.amount;
          }
        }

        return acc;
      },
      [0, 0],
    );
  }, [rawRecords, selectedTag]);

  const mostUsedTags = useMemo(
    () => (trackerTags ? getMostUsedTags(trackerTags, rawRecords) : []),
    [rawRecords, trackerTags],
  );

  const mostExpensiveTags = useMemo(
    () => (trackerTags ? getMostExpensiveTags(trackerTags, rawRecords) : []),
    [rawRecords, trackerTags],
  );

  const totals = useMemo(
    () => ({
      title: [
        t(locale, "body.charts.records"),
        t(locale, "body.charts.tags"),
        t(locale, "body.charts.costs"),
        t(locale, "body.charts.income"),
      ],
      value: [
        filteredeRecords.length,
        selectedTag === -1 && trackerTags ? Object.keys(trackerTags).length : 0,
        decimalToInputString(locale, values[0]),
        decimalToInputString(locale, values[1]),
      ],
    }),
    [filteredeRecords.length, locale, selectedTag, trackerTags, values],
  );

  const tagCards = useMemo(
    () => [
      {
        title: t(locale, "body.charts.mostUsedTags"),
        value: mostUsedTags,
        valueStyle: "text-blue-800",
      },
      {
        title: t(locale, "body.charts.mostExpensiveTag"),
        value: mostExpensiveTags,
        valueStyle: "text-red-800",
        parseToDecimal: true,
      },
    ],
    [locale, mostExpensiveTags, mostUsedTags],
  );

  return (
    <div
      className={`grid pt-2 ${selectedTag === -1 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2" : "grid-cols-1"}`}
    >
      <TotalCard selectedTag={selectedTag} card={totals} />
      <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {selectedTag === -1 &&
          tagCards.map((card, i) => <OverviewCard key={i} card={card} />)}
      </div>
    </div>
  );
};

export default memo(OverviewBlock);

export type TagObj = {
  tagId: TagId;
  value: number;
};
function getMostUsedTags(tags: TrackerTags, records: MonthRecord[]): TagObj[] {
  const tCount: TagObj[] = [];
  for (const tag of Object.keys(tags)) {
    const tagId = createTagId(Number(tag));
    const count = records.filter((r) => r.tags.includes(tagId)).length;
    tCount.push({ tagId, value: count });
  }

  const mostUsedTags: TagObj[] = [];
  const maxCount = Math.max(...tCount.map((t) => t.value));
  for (const t of tCount) {
    if (t.value === maxCount) mostUsedTags.push(t);
  }
  // return mostUsedTags;
  return tCount.sort((a, b) => b.value - a.value).slice(0, 3);
}

function getMostExpensiveTags(
  tags: TrackerTags,
  records: MonthRecord[],
): TagObj[] {
  const tCount: TagObj[] = [];
  for (const tag of Object.keys(tags)) {
    const tagId = createTagId(Number(tag));
    const amount = records
      .filter((r) => r.tags.includes(tagId))
      .reduce(
        (acc, cur) => acc + cur.amount * (cur.type === "cost" ? 1 : 0),
        0,
      );
    tCount.push({ tagId, value: amount });
  }
  const mostExpensiveTags: TagObj[] = [];
  const maxAmount = Math.max(...tCount.map((t) => t.value));
  for (const t of tCount) {
    if (t.value === maxAmount) mostExpensiveTags.push(t);
  }
  // return mostExpensiveTags;
  return tCount.sort((a, b) => b.value - a.value).slice(0, 3);
}
