"use client";
import { MouseEvent as RMouseEvent, useEffect, useState } from "react";
import { CostFormType, MonthFormType } from "@/types/formTypes";
import { useGlobal } from "@/app/context/GlobalContext";
import { t } from "@/locales/locale";
import AccordionHeaderBlock from "./AccordionHeaderBlock";
import AccordionCostBlock from "./accordionCost/AccordionCostBlock";

type AccordionMonthBlockPropsType = {
  yearId: number;
  month: MonthFormType;
};

const AccordionMonthBlock: React.FC<AccordionMonthBlockPropsType> = ({
  yearId,
  month,
}) => {
  const { locale } = useGlobal();
  const [currentMonth, setCurrentMonth] = useState<MonthFormType>(month);
  const [isExpandDisabled, setIsExpandDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (!month) return;
    setCurrentMonth(month);
  }, [month]);

  useEffect(() => {
    setIsExpandDisabled(currentMonth.costs.length === 0);
  }, [currentMonth.costs]);

  const handleAddCost = (e: RMouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const newCost: CostFormType = {
      id: currentMonth.costs.length,
      amount: 0,
      type: "",
      description: "",
    };
    setCurrentMonth({
      ...currentMonth,
      costs: [...currentMonth.costs, newCost],
    });
  };

  return (
    <div
      key={currentMonth.id}
      id={`${yearId}-${currentMonth.id}-body`}
      data-month-body={yearId}
      data-month-id={currentMonth.id}
      data-year-id={yearId}
      className="month grid grid-cols-6 gap-2 w-full"
    >
      <AccordionHeaderBlock
        dataId={`${yearId}-${month.id}-header`}
        dataHeader={yearId.toString()}
        labelMain={`${t(locale, `body.form.valueMonth.${currentMonth.title}`)}`}
        budget={currentMonth.budget ?? 0}
        costs={currentMonth.costsAmount}
        balance={currentMonth.balance ?? 0}
        expandDataType={`${yearId}-${month.id}`}
        isMonth={true}
        expandDisabled={isExpandDisabled}
        handleAddCost={handleAddCost}
      />
      <div
        id={`${yearId}-${currentMonth.id}`}
        style={{ height: 0 }}
        className="col-span-6 pl-4 transition-[height] duration-300 ease-in-out overflow-hidden w-full"
      >
        {currentMonth.costs.map((cost, index) => (
          <AccordionCostBlock
            key={index}
            yearMonthId={`${yearId}-${month.id}`}
            cost={cost}
          />
        ))}
        <div></div>
      </div>
    </div>
  );
};

export default AccordionMonthBlock;
