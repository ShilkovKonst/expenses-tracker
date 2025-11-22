"use client";
import { Year } from "@/lib/types/dataTypes";
import MonthBlock from "./MonthBlock";
import HeaderBlock from "./HeaderBlock";

type YearBlockProps = {
  dataId: string;
  year: Year;
};

const YearBlock: React.FC<YearBlockProps> = ({ dataId, year }) => {
  return (
    <div
      data-year-id={`${year.id}`}
      data-year-body={dataId}
      className="year grid grid-cols-6 gap-2 w-full *:col-span-6"
    >
      <HeaderBlock
        labelMain={`${year.id}`}
        totalAmount={year.totalAmount}
        totalRecords={Object.values(year.months)
          .map((m) => m.records.length)
          .reduce((acc, m) => acc + m, 0)}
        expandDataType={year.id.toString()}
        isMonth={false}
        expandDisabled={false}
      />
      <div
        id={year.id.toString()}
        style={{ height: 0 }}
        className="pl-2 transition-[height] duration-300 ease-in-out overflow-hidden w-full"
      >
        {Object.values(year.months).map((month) => (
          <MonthBlock key={month.id} yearId={year.id} month={month} />
        ))}
        <div></div>
      </div>
    </div>
  );
};

export default YearBlock;
