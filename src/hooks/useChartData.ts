"use client";
import { useCallback, useMemo } from "react";
import { MonthId, TagId, YearId } from "@/lib/types/brand";
import { MonthRecord, TrackerYears } from "@/lib/types/dataTypes";

export type DataKeyType = "qnty" | "cost" | "income";

type ChartDataType = { id: number; qnty: number; cost: number; income: number };

export function useChartData(
  trackerYears: TrackerYears | null,
  selectedYearId: YearId,
  selectedMonthId: MonthId,
  selectedTag: number,
) {
  const filteredRecords = useCallback(
    (tag: number, records: MonthRecord[]) =>
      tag === -1
        ? records
        : records.filter((r) => r.tags.includes(selectedTag as TagId)),
    [selectedTag],
  );

  const chartsData = useMemo(() => {
    if (!trackerYears) return {};
    let rawRecords: MonthRecord[] = [];
    let groupByKey: keyof Pick<MonthRecord, "day" | "month" | "year"> = "year";

    if (selectedYearId !== -1 && selectedMonthId !== -1) {
      rawRecords = trackerYears[selectedYearId].months[selectedMonthId].records;
      groupByKey = "day";
    } else if (selectedYearId !== -1) {
      rawRecords = Object.values(trackerYears[selectedYearId].months).flatMap(
        (m) => m.records,
      );
      groupByKey = "month";
    } else {
      rawRecords = Object.values(trackerYears).flatMap((y) =>
        Object.values(y.months).flatMap((m) => m.records),
      );
      groupByKey = "year";
    }

    return filteredRecords(selectedTag, rawRecords).reduce(
      (acc, cur) => {
        const id = cur[groupByKey] as number;
        acc[id] ??= { id, qnty: 0, cost: 0, income: 0 };
        acc[id].qnty += 1;
        acc[id].cost += cur.type === "cost" ? cur.amount : 0;
        acc[id].income += cur.type === "income" ? cur.amount : 0;
        return acc;
      },
      {} as Record<number, ChartDataType>,
    );
  }, [filteredRecords, selectedMonthId, selectedTag, selectedYearId, trackerYears]);

  const formattedChartsData = useCallback(
    (name: DataKeyType) => {
      return Object.values(chartsData).map((d) => ({
        id: d.id,
        value:
          name === "qnty"
            ? d.qnty
            : name === "cost"
              ? d.cost
              : d.income,
      }));
    },
    [chartsData],
  );

  return { chartsData, formattedChartsData };
}
