"use client";
import React, { Dispatch, SetStateAction } from "react";
import AccordionCostBlock from "./AccordionCostBlock";
import { t } from "@/locales/locale";
import { CostFormType, MonthFormType } from "@/types/formTypes";
import { useGlobal } from "@/app/context/GlobalContext";
import AccordionHeaderBlock from "./AccordionHeaderBlock";

type AccordionMonthBlockPropsType = {
  yearId: number;
  month: MonthFormType;
  costs: CostFormType[];
  setCosts: Dispatch<SetStateAction<CostFormType[]>>;
};

const AccordionMonthBlock: React.FC<AccordionMonthBlockPropsType> = ({
  yearId,
  month,
  costs,
  setCosts,
}) => {
  const { locale } = useGlobal();

  return (
    <div
      key={month.id}
      id={`${yearId}-${month.id}-body`}
      data-month-body={yearId}
      data-month-id={month.id}
      data-year-id={yearId}
      className="month grid grid-cols-6 gap-2 w-full"
    >
      <AccordionHeaderBlock
        dataId={`${yearId}-${month.id}-header`}
        dataHeader={yearId.toString()}
        labelMain={`${t(locale, `body.form.valueMonth.${month?.title}`)}`}
        budget={month?.budget ?? 0}
        costs={month?.costsAmount}
        balance={month?.balance ?? 0}
        expandDataType={`${yearId}-${month.id}`}
        isMonth={true}
        expandDisabled={month?.costs.length === 0}
      />
      <div
        id={`${yearId}-${month.id}`}
        style={{ height: 0 }}
        className="col-span-6 pl-4 transition-[height] duration-300 ease-in-out overflow-hidden w-full"
      >
        {month.costs.map((cost, index) => (
          <AccordionCostBlock
            key={index}
            yearMonthId={`${yearId}-${month.id}`}
            cost={cost}
            costs={costs}
            setCosts={setCosts}
          />
        ))}
        <div></div>
      </div>
    </div>
  );
};

export default AccordionMonthBlock;
