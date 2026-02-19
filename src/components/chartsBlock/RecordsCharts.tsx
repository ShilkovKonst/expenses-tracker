"use client";
import { useGlobal } from "@/context/GlobalContext";
import { useTracker } from "@/context/TrackerContext";
import Charts from "./Charts";
import { ChartsIcon, ExpandIcon, UndoIcon } from "@/lib/icons";
import { t } from "@/locales/locale";
import { transformElement } from "@/lib/utils/transformElement";
import { getMonthById } from "@/lib/utils/monthHelper";
import { useChartNavigation } from "@/hooks/useChartNavigation";
import { useChartData, DataKeyType } from "@/hooks/useChartData";

type RecordsChartsProps = {
  selectedTag: number;
};

const RecordsCharts = ({ selectedTag }: RecordsChartsProps) => {
  const { locale } = useGlobal();
  const { trackerId, trackerYears } = useTracker();
  const { selectedYearId, selectedMonthId, handleClick, handleUndo } =
    useChartNavigation(trackerId);
  const { chartsData, formattedChartsData } = useChartData(
    trackerYears,
    selectedYearId,
    selectedMonthId,
    selectedTag,
  );

  return (
    <>
      <div className="w-full h-10 lg:h-8.5 px-1 my-2 flex justify-between items-center border-2 bg-blue-200 border-blue-300">
        <div className="flex justify-start items-center gap-1 text-blue-800">
          <ChartsIcon />
          <p className="text-base font-semibold">
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
        <div className="flex items-center gap-2">
          {selectedYearId !== -1 && (
            <button
              className="bg-blue-400 hover:bg-blue-500 disabled:text-gray-600 disabled:bg-blue-300 disabled:hover:bg-blue-300 h-7.5 w-7.5 md:h-6 md:w-6 p-1 rounded flex justify-center items-center transition-colors duration-200 ease-in-out cursor-pointer"
              onClick={handleUndo}
            >
              <UndoIcon />
            </button>
          )}
          <button
            className="bg-blue-400 hover:bg-blue-500 h-7.5 w-7.5 md:h-6 md:w-6 p-1 rounded flex justify-center items-center transition-colors duration-200 ease-in-out cursor-pointer"
            data-type="records-charts"
            onClick={(e) => transformElement(e.currentTarget, "data-type")}
          >
            <ExpandIcon className="h-6 w-6 md:h-4 md:w-4" />
          </button>
        </div>
      </div>
      <div
        id="records-charts"
        style={{ height: 0 }}
        className="transition-[height] duration-300 ease-in-out overflow-hidden flex flex-col 2xl:flex-row gap-2"
      >
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
    </>
  );
};

export default RecordsCharts;
