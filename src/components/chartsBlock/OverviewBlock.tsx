"use client";
import { useTracker } from "@/context/TrackerContext";
import { TagId } from "@/lib/types/brand";
import {
  createTagId,
  MonthRecord,
  TrackerTags,
  TrackerYears,
} from "@/lib/types/dataTypes";
import { decimalToInputString } from "@/lib/utils/amountHelper";
import { memo, useMemo } from "react";
import OverviewCard from "./OverviewCard";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";

const OverviewBlock = () => {
  const { locale } = useGlobal();
  const { trackerTags, trackerYears } = useTracker();

  const rawRecords = useMemo(
    () => (trackerYears ? transformYearsToRecords(trackerYears) : []),
    [trackerYears]
  );
  const rawRecordsCount = useMemo(() => rawRecords.length, [rawRecords.length]);

  const [cost, income] = useMemo(
    () =>
      rawRecords.reduce(
        (acc, cur) => {
          if (cur.type === "cost") acc[0] += cur.amount;
          else acc[1] += cur.amount;
          return acc;
        },
        [0, 0]
      ),
    [rawRecords]
  );

  const mostUsedTags = useMemo(
    () => (trackerTags ? getMostUsedTags(trackerTags, rawRecords) : []),
    [rawRecords, trackerTags]
  );

  const mostExpensiveTags = useMemo(
    () => (trackerTags ? getMostExpensiveTags(trackerTags, rawRecords) : []),
    [rawRecords, trackerTags]
  );

  const totalCards = useMemo(
    () => [
      {
        title: t(locale, "body.charts.totalRecords"),
        value: rawRecordsCount,
        valueStyle: "font-semibold text-blue-800",
        isRecords: true,
      },
      {
        title: t(locale, "body.charts.totalCosts"),
        value: decimalToInputString(cost),
        valueStyle: "font-semibold text-red-800",
      },
      {
        title: t(locale, "body.charts.totalIncome"),
        value: decimalToInputString(income),
        valueStyle: "font-semibold text-green-800",
      },
    ],
    [cost, income, locale, rawRecordsCount]
  );

  const tagCards = useMemo(
    () => [
      {
        title: t(locale, "body.charts.mostUsedTags"),
        value: mostUsedTags,
        valueStyle: "font-semibold text-blue-800",
      },
      {
        title: t(locale, "body.charts.mostExpensiveTag"),
        value: mostExpensiveTags,
        valueStyle: "font-semibold text-red-800",
        parseToDecimal: true,
      },
    ],
    [locale, mostExpensiveTags, mostUsedTags]
  );

  return (
    <div className="grid md:grid-cols-2 gap-2">
      <div className="grid gap-2 2xl:grid-cols-3">
        {totalCards.map((card, i) => (
          <OverviewCard key={i} card={card} />
        ))}
      </div>
      <div className="grid gap-2 2xl:grid-cols-2">
        {tagCards.map((card, i) => (
          <OverviewCard key={i} card={card} />
        ))}
      </div>
    </div>
  );
};

export default memo(OverviewBlock);

function transformYearsToRecords(years: TrackerYears): MonthRecord[] {
  const records: MonthRecord[] = [];
  for (const year of Object.values(years)) {
    for (const month of Object.values(year.months)) {
      records.push(...month.records);
    }
  }
  return records;
}

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
  return mostUsedTags;
}

function getMostExpensiveTags(
  tags: TrackerTags,
  records: MonthRecord[]
): TagObj[] {
  const tCount: TagObj[] = [];
  for (const tag of Object.keys(tags)) {
    const tagId = createTagId(Number(tag));
    const amount = records
      .filter((r) => r.tags.includes(tagId))
      .reduce(
        (acc, cur) => acc + cur.amount * (cur.type === "cost" ? 1 : 0),
        0
      );
    tCount.push({ tagId, value: amount });
  }
  const mostExpensiveTags: TagObj[] = [];
  const maxAmount = Math.max(...tCount.map((t) => t.value));
  for (const t of tCount) {
    if (t.value === maxAmount) mostExpensiveTags.push(t);
  }
  return mostExpensiveTags;
}
