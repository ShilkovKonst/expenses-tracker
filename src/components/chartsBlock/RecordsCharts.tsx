"use client";
import { useGlobal } from "@/context/GlobalContext";
import { useTracker } from "@/context/TrackerContext";
import {
  createMonthId,
  createYearId,
  MonthId,
  TagId,
  YearId,
} from "@/lib/types/brand";
import { MonthRecord } from "@/lib/types/dataTypes";
import { useCallback, useEffect, useMemo, useState } from "react";
import Charts from "./Charts";
import { UndoIcon } from "@/lib/icons";
import { IconButton } from "../buttonComponents";
import { t } from "@/locales/locale";
import { getMonthById } from "@/lib/utils/monthHelper";

type RecordsChartsProps = {
  selectedTag: number;
};

export type DataKeyType = "qnty" | "cost" | "income";

type ChartDataType = { id: number; qnty: number; cost: number; income: number };

const RecordsCharts = ({ selectedTag }: RecordsChartsProps) => {
  const { locale } = useGlobal();
  const { trackerId, trackerYears } = useTracker();
  const [selectedYearId, setSelectedYearId] = useState<YearId>(
    createYearId(-1),
  );
  const [selectedMonthId, setSelectedMonthId] = useState<MonthId>(
    createMonthId(-1),
  );

  useEffect(() => {
    setSelectedYearId(createYearId(-1));
    setSelectedMonthId(createMonthId(-1));
  }, [trackerId]);

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
  }, [
    filteredRecords,
    selectedMonthId,
    selectedTag,
    selectedYearId,
    trackerYears,
  ]);

  const formattedChartsData = (name: DataKeyType) => {
    return Object.values(chartsData).map((d) => ({
      id: d.id,
      value:
        (name as DataKeyType) === "qnty"
          ? d.qnty
          : (name as DataKeyType) === "cost"
            ? d.cost
            : d.income,
    }));
  };

  const handleClick = (id: number) => {
    if (selectedYearId !== -1 && selectedMonthId === -1)
      setSelectedMonthId(createMonthId(id));
    if (selectedYearId === -1) setSelectedYearId(createYearId(id));
  };

  const handleUndo = () => {
    if (selectedMonthId !== -1) setSelectedMonthId(createMonthId(-1));
    else setSelectedYearId(createYearId(-1));
  };

  return (
    <div>
      <div className="w-full h-10 lg:h-8.5 px-1 mb-2 flex justify-between items-center border-2 border-t-0 bg-blue-200 border-blue-300">
        <div className="flex justify-start items-center">
          <p>
            {selectedYearId === -1
              ? t(locale, "body.charts.overview", {
                  from: Object.keys(chartsData)[0],
                  to: `- ${Object.keys(chartsData)[Object.keys(chartsData).length - 1]}`,
                })
              : `${t(locale, "body.charts.year")}: ${selectedYearId}`}
          </p>
          {selectedYearId !== -1 && selectedMonthId !== -1 && (
            <p>
              {`, ${t(
                locale,
                `body.form.valueMonth.${getMonthById(selectedMonthId)}`,
              )}`}
            </p>
          )}
        </div>
        {selectedYearId !== -1 && (
          <button
            className="bg-blue-400 hover:bg-blue-500 disabled:text-gray-600 disabled:bg-blue-300 disabled:hover:bg-blue-300 h-7.5 w-7.5 md:h-6 md:w-6 p-1 rounded flex justify-center items-center transition-colors duration-200 ease-in-out cursor-pointer"
            onClick={handleUndo}
          >
            <UndoIcon />
          </button>
        )}
      </div>
      <div className="flex flex-col 2xl:flex-row gap-2">
        {[
          {
            name: "qnty",
            fill: "oklch(70.7% 0.165 254.624)",
            activeFill: "oklch(62.3% 0.214 259.815)",
          },
          {
            name: "cost",
            fill: "oklch(70.4% 0.191 22.216)",
            activeFill: "oklch(63.7% 0.237 25.331)",
          },
          {
            name: "income",
            fill: "oklch(79.2% 0.209 151.711)",
            activeFill: "oklch(72.3% 0.219 149.579)",
          },
        ].map((v, i) => (
          <Charts
            key={i}
            name={v.name as DataKeyType}
            selectedYearId={selectedYearId}
            selectedMonthId={selectedMonthId}
            fill={v.fill}
            activeFill={v.activeFill}
            handleClick={handleClick}
            data={formattedChartsData(v.name as DataKeyType)}
          />
        ))}
      </div>
    </div>
  );
};

export default RecordsCharts;
