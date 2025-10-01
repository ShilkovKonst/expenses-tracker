import React, { Dispatch, SetStateAction } from "react";
import AccordionCostBlock from "./AccordionCostBlock";
import CostButton from "./CostButton";
import { Locale, t } from "@/locales/locale";
import { CostFormType, MonthFormType, YearFormType } from "@/types/formTypes";

type AccordionMonthBlockPropsType = {
  locale: Locale;
  year: [string, YearFormType];
  month: [string, MonthFormType];
  costs: CostFormType[];
  setCosts: Dispatch<SetStateAction<CostFormType[]>>;
};

const AccordionMonthBlock: React.FC<AccordionMonthBlockPropsType> = ({
  locale,
  year,
  month,
  costs,
  setCosts,
}) => {
  return (
    <div
      key={month[0]}
      className="month flex flex-col my-1 justify-center items-start w-full"
    >
      <div
        data-type={`month`}
        data-month={`${year[0]}-${month[0]}`}
        className=" my-1 flex justify-between items-center gap-3 py-1 w-full bg-blue-100 hover:bg-blue-300 border-2 border-blue-200 px-1"
      >
        <p>
          <span className="font-bold capitalize">month</span> - {month[1].title}{" "}
          <span className="font-bold capitalize">monthCosts</span> -{" "}
          {month[1].monthCosts}{" "}
          <span className="font-bold capitalize">budget</span> -{" "}
          {month[1].budget}
        </p>

        <CostButton
          dataType=""
          dataUpdate=""
          title={t(locale, `body.form.accordionAddCost`)}
          style="bg-blue-400 hover:bg-blue-500"
          handleClick={() => {}}
        />
      </div>
      <div
        id={`${year[0]}-${month[0]}`}
        style={{ height: 0 }}
        className="pl-2 transition-[height] duration-300 ease-in-out overflow-hidden w-full"
      >
        {month[1].costs.map((cost, index) => (
          <AccordionCostBlock
            key={index}
            locale={locale}
            index={index}
            year={year}
            month={month}
            cost={cost}
            costs={costs}
            setCosts={setCosts}
          />
        ))}
      </div>
    </div>
  );
};

export default AccordionMonthBlock;
