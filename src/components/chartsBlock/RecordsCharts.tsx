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
import { decimalToInputString } from "@/lib/utils/amountHelper";
import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RecordsChartsProps = {
  selectedTag: number;
};

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

  const getChartsData = useCallback(() => {
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
      <div className="w-full h-7 flex justify-between items-center border-2 bg-blue-200 border-blue-300 px-1 mb-2">
        {selectedYearId !== -1 && (
          <>
            <div className="flex justify-start items-center gap-2">
              <p>{selectedYearId !== -1 ? selectedYearId : ""}</p>
              {selectedMonthId !== -1 && (
                <>
                  <p>&#8594;</p>
                  <p>{selectedMonthId !== -1 ? selectedMonthId : ""}</p>
                </>
              )}
            </div>
            <button onClick={handleUndo}>Вернуться</button>
          </>
        )}
      </div>

      <BarChart
        style={{
          width: "100%",
          maxHeight: "70vh",
          aspectRatio: 1.618,
        }}
        responsive
        data={Object.values(getChartsData()).map((d) => ({
          id: d.id,
          qnty: d.qnty,
          cost: d.cost,
          income: d.income,
        }))}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="id" />
        {/* <YAxis
          // allowDecimals={false}
          tickCount={10}
          yAxisId="qnty"
          orientation="left"
          stroke="oklch(54.6% 0.245 262.881)"
        />
        <YAxis
          width={90}
          tick={{ fontSize: 12 }}
          tickCount={10}
          tickFormatter={(value: string) =>
            decimalToInputString(locale, Number(value))
          }
          yAxisId="cost"
          orientation="right"
          stroke="oklch(57.7% 0.245 27.325)"
        /> */}
        <Tooltip
          formatter={(value, name) => {
            if (!value) return;
            if (name === "cost" || name === "income") {
              return [
                decimalToInputString(locale, Number(value)),
                name === "cost" ? "Расход" : "Доход",
              ];
            }

            return [value, "Количество"];
          }}
        />
        <Legend />
        {[
          {
            dataKey: "qnty",
            fill: "oklch(70.7% 0.165 254.624)",
            activeFill: "oklch(62.3% 0.214 259.815)",
          },
          {
            dataKey: "cost",
            fill: "oklch(70.4% 0.191 22.216)",
            activeFill: "oklch(63.7% 0.237 25.331)",
          },
          {
            dataKey: "income",
            fill: "oklch(79.2% 0.209 151.711)",
            activeFill: "oklch(72.3% 0.219 149.579)",
          },
        ].map((v, i) => (
          <Bar
            key={i}
            yAxisId={v.dataKey === "qnty" ? "qnty" : v.dataKey === "cost" ? "cost" : "income"}
            dataKey={v.dataKey}
            fill={v.fill}
            onClick={(data) => handleClick(Number(data.id))}
            style={{ cursor: "pointer" }}
            activeBar={{ fill: v.activeFill }}
            // label={{ position: "top", fontSize: 14 }}
            radius={[10, 10, 0, 0]}
          ></Bar>
        ))}
      </BarChart>
    </div>
  );
};

export default RecordsCharts;
