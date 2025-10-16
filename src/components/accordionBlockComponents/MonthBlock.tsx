"use client";
import { MouseEvent as RMouseEvent, useEffect, useState } from "react";
import { Operation, Month } from "@/types/formTypes";
import { useGlobal } from "@/app/context/GlobalContext";
import { t } from "@/locales/locale";
import HeaderBlock from "./HeaderBlock";
import OperationBlock from "./operationBlockComponents/OperationBlock";

type MonthBlockProps = {
  yearId: number;
  month: Month;
};

const MonthBlock: React.FC<MonthBlockProps> = ({ yearId, month }) => {
  const { locale } = useGlobal();
  const [currentMonth, setCurrentMonth] = useState<Month>(month);
  const [isExpandDisabled, setIsExpandDisabled] = useState<boolean>(true);

  useEffect(() => {
    setCurrentMonth(month);
  }, [month]);

  useEffect(() => {
    setIsExpandDisabled(currentMonth.operations?.length === 0);
  }, [currentMonth.operations]);

  const handleAddCost = (e: RMouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const newOperations: Operation = {
      id: currentMonth.operations.length,
      type: "cost",
      tags: [],
      description: "",
      amount: 0,
    };
    setCurrentMonth({
      ...currentMonth,
      operations: [...currentMonth.operations, newOperations],
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
      <HeaderBlock
        dataId={`${yearId}-${month.id}-header`}
        dataHeader={yearId.toString()}
        labelMain={`${t(locale, `body.form.valueMonth.${currentMonth.title}`)}`}
        totalAmount={currentMonth.totalAmount}
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
        {currentMonth.operations.map((operation, index) => (
          <OperationBlock
            key={index}
            yearId={yearId}
            monthId={month.id}
            operation={operation}
          />
        ))}
        <div></div>
      </div>
    </div>
  );
};

export default MonthBlock;
