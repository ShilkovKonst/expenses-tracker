"use client";
import { YearFormType } from "@/types/formTypes";
import AccordionMonthBlock from "./AccordionMonthBlock";
import AccordionHeaderBlock from "./AccordionHeaderBlock";

type AccordionYearBlockPropsType = {
  formDataId: string;
  year: YearFormType;
};

const AccordionYearBlock: React.FC<AccordionYearBlockPropsType> = ({
  formDataId,
  year,
}) => {
  return (
    <div
      data-year-id={`${year.id}`}
      data-year-body={formDataId}
      className="year grid grid-cols-6 gap-2 w-full *:col-span-6"
    >
      <AccordionHeaderBlock
        labelMain={`${year.id}`}
        budget={year?.budget ?? 0}
        costs={year?.costs}
        balance={year?.balance ?? 0}
        expandDataType={year.id.toString()}
        isMonth={false}
        expandDisabled={false}
      />
      <div
        id={year.id.toString()}
        style={{ height: 0 }}
        className="pl-4 transition-[height] duration-300 ease-in-out overflow-hidden w-full"
      >
        {year.months.map((month) => (
          <AccordionMonthBlock key={month.id} yearId={year.id} month={month} />
        ))}
        <div></div>
      </div>
    </div>
  );
};

export default AccordionYearBlock;
