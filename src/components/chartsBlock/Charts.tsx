import { useGlobal } from "@/context/GlobalContext";
import { decimalToInputString } from "@/lib/utils/amountHelper";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { DataKeyType } from "@/hooks/useChartData";
import { getMonthById } from "@/lib/utils/monthHelper";
import { t } from "@/locales/locale";
import { MonthId, YearId } from "@/lib/types/brand";

type Props = {
  name: DataKeyType;
  selectedYearId: YearId;
  selectedMonthId: MonthId;
  fill: string;
  activeFill: string;
  handleClick: (id: number) => void;
  data: { id: number; value: number }[];
};

const Charts = ({
  name,
  selectedYearId,
  selectedMonthId,
  fill,
  activeFill,
  data,
  handleClick,
}: Props) => {
  const { locale } = useGlobal();

  if (data.reduce((acc, curr) => acc + curr.value, 0) === 0) return null;
  return (
    <BarChart
      className="border-b border-l border-blue-300 max-h-[20vh] xl:max-h-[30vh]"
      style={{
        width: "100%",
        aspectRatio: 2,
      }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="id"
        tick={{ fontSize: 10 }}
        tickFormatter={(value: string) =>
          selectedYearId !== -1 && selectedMonthId === -1
            ? t(locale, `body.form.valueMonth.${getMonthById(Number(value))}`)
            : value
        }
      />
      <YAxis
        tickCount={2}
        tick={{ fontSize: 12 }}
        tickFormatter={(value: string) =>
          name === "qnty" ? value : decimalToInputString(locale, Number(value))
        }
        orientation="left"
        stroke={activeFill}
      />
      <Tooltip
        formatter={(value) => {
          if (!value) return;
          if (name === "cost" || name === "income") {
            return [
              decimalToInputString(locale, Number(value)),
              name === "cost"
                ? t(locale, "body.form.labels.cost")
                : t(locale, "body.form.labels.income"),
            ];
          }

          return [value, t(locale, "body.form.labels.operations")];
        }}
      />
      <Bar
        dataKey={"value"}
        fill={fill}
        onClick={(data) => handleClick(Number(data.id))}
        style={{ cursor: "pointer" }}
        activeBar={{ fill: activeFill }}
        radius={[10, 10, 0, 0]}
      />
    </BarChart>
  );
};

export default Charts;
