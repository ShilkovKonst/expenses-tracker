import { useTracker } from "@/context/TrackerContext";
import { MonthId, TagId, YearId } from "@/lib/types/brand";
import {
  createMonthId,
  createYearId,
  MonthRecord,
} from "@/lib/types/dataTypes";
import { decimalToInputString } from "@/lib/utils/amountHelper";
import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  const { trackerId, trackerYears } = useTracker();
  const [selectedYearId, setSelectedYearId] = useState<YearId>(
    createYearId(-1)
  );
  const [selectedMonthId, setSelectedMonthId] = useState<MonthId>(
    createMonthId(-1)
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
    [selectedTag]
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
        (m) => m.records
      );
      groupByKey = "month";
    } else {
      rawRecords = Object.values(trackerYears).flatMap((y) =>
        Object.values(y.months).flatMap((m) => m.records)
      );
      groupByKey = "year";
    }

    return filteredRecords(selectedTag, rawRecords).reduce((acc, cur) => {
      const id = cur[groupByKey] as number;
      acc[id] ??= { id, qnty: 0, cost: 0, income: 0 };
      acc[id].qnty += 1;
      acc[id].cost += cur.type === "cost" ? cur.amount : 0;
      acc[id].income += cur.type === "income" ? cur.amount : 0;
      return acc;
    }, {} as Record<number, ChartDataType>);
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
      <div>
        <button onClick={handleUndo}>Вернуться</button>
        <p>{selectedYearId !== -1 ? selectedYearId : ""}  {selectedMonthId !== -1 ? selectedMonthId : ""}</p>
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
          cost: decimalToInputString(d.cost),
          income: decimalToInputString(d.income),
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
        <YAxis
          yAxisId="left"
          orientation="left"
          stroke="oklch(57.7% 0.245 27.325)"
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="oklch(54.6% 0.245 262.881)"
        />
        <Tooltip />
        <Legend />
        {[
          {
            dataKey: "qnty",
            fill: "oklch(54.6% 0.245 262.881)",
            activeFill: "oklch(48.8% 0.243 264.376)",
          },
          {
            dataKey: "cost",
            fill: "oklch(57.7% 0.245 27.325)",
            activeFill: "oklch(50.5% 0.213 27.518)",
          },
          {
            dataKey: "income",
            fill: "oklch(62.7% 0.194 149.214)",
            activeFill: "oklch(52.7% 0.154 150.069)",
          },
        ].map((v, i) => (
          <Bar
            key={i}
            yAxisId={v.dataKey === "qnty" ? "right" : "left"}
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
