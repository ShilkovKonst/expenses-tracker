import { Locale } from "@/locales/locale";
import { CostFormType, YearFormType } from "@/types/formTypes";
import { Dispatch, SetStateAction } from "react";
import AccordionMonthBlock from "./AccordionMonthBlock";

type AccordionYearBlockPropsType = {
  locale: Locale;
  year: [string, YearFormType];
  costs: CostFormType[];
  setCosts: Dispatch<SetStateAction<CostFormType[]>>;
};

const AccordionYearBlock: React.FC<AccordionYearBlockPropsType> = ({
  locale,
  year,
  costs,
  setCosts,
}) => {
  return (
    <div
      key={year[0]}
      className="flex flex-col justify-center items-start w-full"
    >
      <button
        data-type={`year`}
        data-year={year[0]}
        className="year p-1 cursor-pointer bg-blue-200 hover:bg-blue-400 border-2 border-blue-300 w-full"
      >
        year - {year[0]} costs - {year[1].yearCosts} budget -{" "}
        {year[1].yearBudget}
      </button>
      <div
        id={year[0]}
        style={{ height: 0 }}
        className="px-2 transition-[height] duration-300 ease-in-out overflow-hidden w-full"
      >
        {Object.entries(year[1].months).map((month) => (
          <AccordionMonthBlock
            key={month[0]}
            locale={locale}
            year={year}
            month={month}
            costs={costs}
            setCosts={setCosts}
          />
        ))}
      </div>
    </div>
  );
};

export default AccordionYearBlock;
